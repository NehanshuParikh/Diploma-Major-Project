import { MailtrapClient } from "mailtrap";
import dotenv from 'dotenv'

dotenv.config()

const TOKEN = process.env.MAIL_TRAP_TOKEN;
const ENDPOINT = process.env.MAIL_TRAP_ENDPOINT;

export const mailtrapClient = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

export const sender = {
    email: "mailtrap@demomailtrap.com",
    name: "Code Red (Developers)",
};