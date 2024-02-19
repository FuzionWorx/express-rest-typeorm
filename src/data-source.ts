import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entities/User"

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: "fwlap008.meadow.fuzionworx.com",
    port: 3306,
    username: "uaadmin",
    password: "FWuaadm@2017",
    database: "userauth",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
