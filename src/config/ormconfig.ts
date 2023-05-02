import { DataSourceOptions } from "typeorm";
import { User } from "../models/user.model";
import { Token } from "../models/token.model";

const config: DataSourceOptions = {
	type: "postgres",
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	entities: [User, Token],
	migrations: [__dirname + "/migrations/*{.ts,.js}"],
	synchronize: true,
	migrationsRun: false,
	logging: true,
};

export default config;
