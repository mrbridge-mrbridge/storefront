import express from "express";
import { verifyAccount } from "../controllers/verify_account";
import { businessRegistration } from "../controllers/auth/merchant.controller";
import { userLogin } from "../controllers/login.controller";
import {
	requestPasswordReset,
	setNewPassword,
} from "../controllers/password_reset";

export const businessRouter = express.Router();

businessRouter.post("/login", userLogin);
businessRouter.post("/signup", businessRegistration);
businessRouter.post("/verify", verifyAccount);
businessRouter.post("/reset", requestPasswordReset);
businessRouter.post("/new_password", setNewPassword);
