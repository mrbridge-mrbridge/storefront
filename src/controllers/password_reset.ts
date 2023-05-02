import { Request, Response, NextFunction } from "express";
import { PasswordResetService } from "../services/password_reset.services";
import { userSchema } from "../utils/validator";

export const requestPasswordReset = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
    const { email } = req.body;

    const emailSchema = userSchema.pick({ email: true });
    const validUser = await emailSchema.safeParseAsync({ email });
    if (validUser.success === false) {
        return res.status(404).send(validUser.error);
    }
    try {
        const { data } = validUser;
        const passwordResetService = new PasswordResetService();
        await passwordResetService.sendResetEmail(data.email);

        res.status(201).send({
            message: `Password reset link successfully sent to ${data.email}`,
        });
    } catch (error) {
        res.status(500).send({ message: "Password reset unsuccessful" });
    }
};

export const setNewPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { password, confirm_password, id, token } = req.body;

    const passwordSchema = userSchema.pick({
        password: true,
        confirm_password: true,
    });

    const validUser = await passwordSchema.safeParseAsync({
        password,
        confirm_password,
    });

    if (validUser.success === false) {
        return res.status(404).send(validUser.error);
    }
    try {
        const isValidPassword = password === confirm_password;
        if (!isValidPassword) {
            return res.status(401).send({
                message: `Password and confirm password do not match`,
            });
        }
        const passwordResetService = new PasswordResetService();
        await passwordResetService.resetPassword(token, password, Number(id));

        res.status(201).send({
            message: `Password reset successful`,
        });
    } catch (error) {
        res.status(500).send({ message: "Password reset unsuccessful" });
    }
};
