import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bootstrap from "./src/index.router.js";
import { warningEmails } from "./src/utils/cronJobs.js";

const app = express();
const port = process.env.PORT || 3000;

// schedule Job to remin users not confirmd their email
warningEmails()

bootstrap(app, express);
app.listen(port, () => console.log(`App listening on port ${port}`));
