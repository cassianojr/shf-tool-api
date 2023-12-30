import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();
if(process.env.NODE_ENV === 'development') dotenv.config({ path: `.env.local`, override: true });

const API_KEY = process.env.SENDGRID_API_KEY || '';
const SENDER = process.env.SENDGRID_SENDER_EMAIL || '';

sgMail.setApiKey(API_KEY);


export type EmailTemplate = {
    email: string;
    message: string;
}

const sendEmail = async ({ email, message }: EmailTemplate) => {
    const res = await sgMail.send({
        from: SENDER,
        to: email,
        subject: 'SHF-Tool',
        text: message,
        html: `<p>${message}</p>`,
    }).then((res) => res[0]);

    return res;
};

export const EmailService = {
    sendEmail
}