import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("token")
export class Token extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;
	@Column({ name: "user_id" })
	user_id!: number;
	@Column()
	token!: string;
}
