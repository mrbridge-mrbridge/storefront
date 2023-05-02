import { NextFunction, Response, Request } from "express";
import { User } from "../models/user.model";
import { UserRequestBody } from "../types/user.types";
import { userSchema } from "../utils/validator";

export const userLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
    const { email, password }: UserRequestBody = req.body;

    const loginSchema = userSchema.pick({ email: true, password: true });

    const validUser = await loginSchema.safeParseAsync({ email, password });

    if (validUser.success === false) {
        return res.status(404).send(validUser.error);
    }

    try {
        const { data } = validUser;
        const user: User | null = await User.findOne({
            where: { email: data.email },
        });

        if (!user) {
            return res
                .status(401)
                .send({ message: "Invalid email or password" });
        }
        if (!user.activated) {
            return res
                .status(401)
                .send({ message: "Please, activate your account" });
        }
        const isValidPassword: boolean = await user.comparePassword(password);

        if (!isValidPassword) {
            return res
                .status(401)
                .send({ message: "Invalid email or password" });
        }

        return res.status(201).send({ message: "Logged in successfully" });
    } catch (error) {
        res.status(500).send({ message: "Log in failed" });
    }
};
