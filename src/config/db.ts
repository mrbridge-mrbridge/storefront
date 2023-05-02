import { DataSource } from "typeorm";
import config from "./ormconfig";

const AppDataSource = new DataSource(config);

export function initializeDataBase() {
	AppDataSource.initialize()
		.then(() => {
			console.log("Data Source has been initialized!");
		})
		.catch((err) => {
			console.error("Error during Data Source initialization", err);
		});
}
