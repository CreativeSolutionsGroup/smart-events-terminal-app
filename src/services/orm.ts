import { DataSource } from "typeorm";
import { Checkin } from "../models/Checkin";

const datasource = new DataSource({
  type: "sqlite",
  database: "cache",
  entities: [Checkin]
})

export default datasource.initialize()