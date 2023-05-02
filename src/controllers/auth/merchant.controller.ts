import { NextFunction, Response, Request } from "express";
import { User } from "../../models/user.model";
import { userSchema } from "../../utils/validator";
import { RegistrationService } from "../../services/reg.services";
import { UserRequestBody } from "../../types/user.types";

export const businessRegistration = async (
	req: Request<{}, {}, Partial<UserRequestBody>>,
	res: Response<{ message: string }>,
	next: NextFunction
): Promise<Response<any, Record<string, any>>> => {
	const { business_name, email, password, confirm_password } = req.body;

	const businessSchema = userSchema.omit({
        first_name: true,
        last_name: true,
    });

    const validUser = await businessSchema.safeParseAsync({
        business_name,
        email,
        password,
        confirm_password,
    });

    if (validUser.success === false) {
        return res.status(404).send(validUser.error);
    }

    try {
        const { data } = validUser;
        let user: User | null = await User.findOne({
            where: { email: data.email },
        });

        if (user) {
            return res
                .status(401)
                .send({ message: "Email already exist, Log in" });
        }

        const isValidPassword = password == confirm_password;

        if (!isValidPassword) {
            return res.status(401).send({
                message: "Password and confirm password do not match",
            });
        }
        const businessRegistration = new RegistrationService();
        const business = await businessRegistration.createbusiness({
            business_name,
            email: data.email,
            password,
        });

        businessRegistration.createToken(business);

        return res.status(201).send({
            message: `Activate your account with the link sent to ${business.email}`,
        });
    } catch (error) {
        res.status(500).send({ message: "Merchant registration unsuccessful" });
    }
};
