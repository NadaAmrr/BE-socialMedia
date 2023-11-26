import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import express from "express";
import bootstrap from "./src/index.router.js";
import { warningEmails } from "./src/utils/cronJobs.js";

//set directory dirname 
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, './config/.env') })

const app = express();
const port = process.env.PORT || 3000;

// schedule Job to remin users not confirmd their email
warningEmails()

bootstrap(app, express);
app.listen(port, () => console.log(`App listening on port ${port}`));
