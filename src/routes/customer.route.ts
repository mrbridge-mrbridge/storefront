import express from "express";
import { customerRegistration } from "../controllers/auth/customer.controller";
import { userLogin } from "../controllers/login.controller";
import { verifyAccount } from "../controllers/verify_account";
import { requestPasswordReset, setNewPassword } from "../controllers/password_reset";

export const customerRouter = express.Router();

customerRouter.post("/login", userLogin);
customerRouter.post("/signup", customerRegistration);


