import bcrypt from "bcrypt";
import { User, UserType } from "../models/user.model";
import { sendMail } from "../utils/mailer";
import { Token } from "../models/token.model";
import { UserRequestBody } from "../types/user.types";

export class RegistrationService {
	private async hashPassword(password: string): Promise<string> {
		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		return await bcrypt.hash(password, salt);
	}
	private async sendActivationEmail(
		user: User,
		token: string
	): Promise<void> {
		try {const heading = `<p style="font-size: 18px; text-align: left">Hi ${
			user.first_name || user.business_name
		},</p> <p style="font-size: 18px; text-align: center">Activate your Storefront Account with the link below...</p>.`;
		const subject = `Activate Your Storefront Account`;
		const message = `${process.env.BASE_URL}/${process.env.ACTIVATION_PATH}/${user.id}/${token}`;
		await sendMail(user.email, subject, message, heading);}
		catch(error){
			throw error('Error sending mail');
			
		}
	}

	public async createbusiness(
		merchant: Partial<UserRequestBody>
	): Promise<User> {
		try {
			const hashedPassword = await this.hashPassword(merchant.password);

			const user = User.create({
				business_name: merchant.business_name,
				email: merchant.email,
				password: hashedPassword,
				role: UserType.business,
			});

			await user.save();

			return user;
		} catch (error) {
			throw new Error("Merchant registration failed");
		}
	}

	public async createCustomer(
		customer: Partial<UserRequestBody>
	): Promise<User> {
		try {
			const hashedPassword = await this.hashPassword(customer.password);

			const user = User.create({
				first_name: customer.first_name,
				last_name: customer.last_name,
				email: customer.email,
				password: hashedPassword,
				role: UserType.customer,
			});

			await user.save();

			return user;
		} catch (error) {
			throw new Error("Customer registation failed");
		}
	}

	public async createToken(user: User): Promise<void> {
		const token = await user.generateAuthToken();

		try {
			const userToken = Token.create({
				user_id: user.id,
				token,
			});
			await userToken.save();

			await this.sendActivationEmail(user, token);
		} catch (error) {
			throw Error('Error creating token');
		}
	}
}
