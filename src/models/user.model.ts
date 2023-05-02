import { Entity, Column } from "typeorm";
import { Person } from "./utils/person.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export enum UserType {
	customer = "customer",
	business = "business",
}
@Entity("user")
export class User extends Person {
	@Column({ nullable: true })
	first_name?: string;

	@Column({ nullable: true })
	last_name?: string;

	@Column({ nullable: true })
	business_name?: string;

	@Column({ default: false })
	activated!: boolean;

	@Column({ type: "enum", enum: UserType })
	role!: string;

	public async generateAuthToken(): Promise<string> {
		const token = jwt.sign(
            { id: this.id },
            process.env.ACCESS_TOKEN_SECRET!,
            {
                expiresIn: process.env.TOKEN_EXPIRES_IN!,
            }
        );
		return token;
	}
	public async hashPassword(password: string): Promise<string> {
		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hash = await bcrypt.hash(password, salt);
		return hash;
	}

	public async comparePassword(password?: string): Promise<boolean> {
		return bcrypt.compare(password, this.password);
	}
}

// TODO
/**
 * 	 @OneToOne(() => Order, (order) => order.user, { nullable: true })
 *    order: Order;

	// @OneToMany(() => Business, (business) => business.user, {
	// 	nullable: true,
	// })
	// business: Business[];
 *
 */
