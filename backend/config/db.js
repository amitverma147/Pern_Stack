import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const {PGUSER,PGHOST,PGPASSWORD,PGDATABASE}=process.env;

export const sql=neon(`postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`);

// this sql function we export is a function that will connect to our database and return a promise that resolves to a client object that we can use to query our database. We can use this function in our controllers to query our database.

