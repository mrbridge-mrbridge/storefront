import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";
import { initializeDataBase } from "./config/db";
import passport from "passport";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { Pool } from "pg";
import { router } from "./routes";
import "./config/passport.config";

async function main() {
    const app: Application = express();
    const port: number = Number(process.env.PORT);

    // const pool = new Pool({
    //     user: process.env.DB_USER,
    //     host: process.env.DB_HOST,
    //     database: process.env.DB_NAME,
    //     password: `${process.env.DB_PASSWORD}`,
    //     port: Number(process.env.DB_PORT),
    // });

    // const pgSessionStore = pgSession(session);

    // app.use(
    //     session({
    //         // store: new pgSessionStore({
    //         //     pool: pool,
    //         //     tableName: process.env.SESSION_TABLE_NAME,
    //         //     createTableIfMissing: true,
    //         // }),
    //         secret: process.env.SESSION_SECRET,
    //         resave: false,
    //         saveUninitialized: true,
    //         cookie: {
    //             secure: false, // Set secure to true for HTTPS-only cookies
    //             httpOnly: true, // Set httpOnly to true to prevent XSS attacks
    //             maxAge: 3600000, // Set cookie expiration to 1 hour
    //         },
    //     })
    // );

    app.use(cors({}));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    // app.use(passport.initialize());
    // app.use(passport.session());

    app.use(router);

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        res.status(500).send({
            message: "Internal Server Error",
            error: err.message,
        });
    });

    app.listen(3000, function (): void {
        initializeDataBase();
        console.log(`App started on port ${port}...`);
    });
}

main();
