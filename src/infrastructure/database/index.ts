require("dotenv").config();
import { DataSource } from "typeorm";
import fs from "fs";

//import { MongoDriver } from 'typeorm/driver/mongodb/MongoDriver';

let db: DataSource;
export async function connectToDatabase(): Promise<DataSource> {
	if (db) {
		return db; // Reuse existing connection
	}

	const dbType = process.env.DB_TYPE;
	switch (dbType) {
		case "mysql":
			db = new DataSource({
				type: "mysql",
				host: process.env.DB_HOST,
				port: process.env.DB_PORT
					? parseInt(process.env.DB_PORT)
					: 3306,
				username: process.env.DB_USER,
				password: process.env.DB_PASSWORD,
				database: process.env.DB_NAME,
				entities: [__dirname + "./../../domain/entities/*.{ts,js}"],
				migrations: [__dirname + "/migrations/*.{ts,js}"],
				migrationsRun: true,
						// ssl: {
						// 	ca: fs.readFileSync("ca.pem"),
						// },
				connectTimeout: 30000*2
				//synchronize:true,
			});
			try {
				await db.initialize();
				console.log("Connected to MySQL database!");
			} catch (error) {
				console.error("Error connecting to MySQL database:", error);
				throw error;
			}
			break;

		case "mongo":
			/* const driver = new MongoDriver(); 
              db = new DataSource({
                type: 'mongodb',
                url: process.env.DB_URL,
                driver,
                entities: [], 
                synchronize: true,
              });
              try {
                await db.initialize();
                console.log('Connected to MongoDB database!');
              } catch (error) {
                console.error('Error connecting to MongoDB database:', error);
                throw error;
              }*/
			break;

		default:
			throw new Error(`Unsupported database type: ${dbType}`);
	}

	return db;
}
