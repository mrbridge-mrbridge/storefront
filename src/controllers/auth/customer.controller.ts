import { NextFunction, Response, Request } from "express";
import { RegistrationService } from "../../services/reg.services";
import { userSchema } from "../../utils/validator";
import { User } from "../../models/user.model";
import { UserRequestBody } from "../../types/user.types";

export const customerRegistration = async (
    req: Request<{}, {}, Partial<UserRequestBody>>,
    res: Response,
    next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
    let { first_name, last_name, email, password, confirm_password } = req.body;

    const customerUserSchema = userSchema.omit({ business_name: true });

    const validUser = await customerUserSchema.safeParseAsync({
        first_name,
        last_name,
        email,
        password,
        confirm_password,
    });

    if (validUser.success == false) {
        return res.status(400).send(validUser.error);
    }
    try {
        const { data } = validUser;

        const user: User | null = await User.findOne({
            where: { email: data.email },
        });

        if (user) {
            return res
                .status(401)
                .send({ message: "Email already exist, Log in" });
        }

        const isValidPassword = password === confirm_password;

        if (!isValidPassword) {
            return res.status(401).send({
                message: "Password and confirm password do not match",
            });
        }

        const customerRegistration = new RegistrationService();
        const customer = await customerRegistration.createCustomer({
            first_name,
            last_name,
            email: data.email,
            password,
            confirm_password,
        });
        customerRegistration.createToken(customer);

        return res.status(201).send({
            message: `Activate your account with the link sent to ${customer.email}`,
        });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};
