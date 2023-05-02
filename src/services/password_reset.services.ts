
import { User } from "../models/user.model";
import { Token } from "../models/token.model";
import { sendMail } from "../utils/mailer";

export class PasswordResetService {
  async sendResetEmail(email: string) {
    try {
      const user: User = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error("User not found");
      }
      const token = await user.generateAuthToken();

      const resetToken = Token.create({
        user_id: user.id,
        token,
      });
      await resetToken.save();

       const heading = `<p style="font-size: 18px; text-align: left">Hi ${
			user.first_name || user.business_name
		},</p><p style="font-size: 18px; text-align: center">You recently requested to reset your password. Please click the link below to reset your password.</p>`;
		const subject = `Reset Your Storefront Account Password`;
      const message = `${process.env.BASE_URL}/${process.env.RESET_PATH}/${user.id}/${token}`;
      sendMail(user.email, subject, message, heading);
    } catch (error) {
      throw error('Eror sending mail');
    }

    // TODO: Send the password reset email to the user with a link that includes the reset token
  }

  async resetPassword(token: string, newPassword: string, id: number) {
    const user = await User.findOne({
      where: {
        id,
      },
    });
    
    const resetToken = await Token.findOne({
      where: {
        user_id: user.id,
        token,
      },
    });

    if (!resetToken) {
      throw new Error("Invalid or expired reset token");
    }

    // Update the user's password
    user.password = await user.hashPassword(newPassword);
    await user.save();

    // Delete the reset token
    await Token.remove(resetToken);
  }
}
