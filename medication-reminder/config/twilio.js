import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const ACCSID = process.env.TWILIO_ACC_SID;
const AUTHTOKEN = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(ACCSID, AUTHTOKEN);

export default client;
