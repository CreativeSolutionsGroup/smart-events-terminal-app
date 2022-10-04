import { DataSource } from "typeorm";
import { Checkin } from "../models/Checkin";

export const initialize_database = () => new DataSource({
  type: "sqlite",
  database: "cache.db",
  synchronize: true,
  entities: [Checkin]
}).initialize();