import express, { Request, Response, NextFunction } from "express";
import { customerRouter } from "./routes/customer.route";
import { businessRouter } from "./routes/merchant.route";
import { googleRouter } from "./routes/strategies/google";
import { facebookRouter } from "./routes/strategies/facebook";


export const router = express.Router();

router.use("/api/customer", customerRouter);
router.use("/api/business", businessRouter);
router.use('/api/auth/google', googleRouter)
router.use('/api/auth/facebook', facebookRouter)



router.all('*', (req:Request, res: Response):void=>{
    res.status(404).send('Not Found')
})
