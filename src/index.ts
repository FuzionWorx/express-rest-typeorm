import "reflect-metadata";
import { AppDataSource } from "./data-source";
import * as express from "express";
import * as dotenv from "dotenv";
import * as bodyParser from "body-parser";
import helmet from "helmet";
import * as cors from "cors";
import routes from "./routes";

// Load environment variables from .env file
dotenv.config();

AppDataSource.initialize().then(() => {
    console.log("Data Source has been initialized!")
    // Create a new express application instance
    const app = express();

    // Call midlewares
    app.use(cors());

    // app.use(
    //   cors({
    //     credentials: true,
    //     origin: ["http://localhost:8081"],
    //   })
    // );

    app.use(helmet());
    app.use(bodyParser.json());

    //Set all routes from routes folder
    app.use("/", routes);

    // set port, listen for requests
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
}).catch((err) => {
    console.error("Server error: ", err)
})
