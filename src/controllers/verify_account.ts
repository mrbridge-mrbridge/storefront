import { Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { Token } from "../models/token.model";

export const verifyAccount = async (
    req: Request,
    res: Response
): Promise<Response<any, Record<string, any>>> => {
    const { id, token } = req.body;
    try {
        const user = await User.findOne({ where: { id: Number(id) } });
        if (!user) {
            return res.status(400).send("Invalid link");
        }
        const userToken = await Token.findOne({
            where: { user_id: user.id, token },
        });
        if (!userToken) {
            return res.status(400).send("Invalid link");
        }

        await User.update({ id: user.id }, { activated: true });
        await Token.remove(userToken);

        return res.send({
            message: "Your account has been successfully activated",
        });
    } catch (error) {
        return res
            .status(400)
            .send({ message: "Account activation Unsuccessful" });
    }
};
