import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let transporterPromise: Promise<nodemailer.Transporter> | null = null;

async function getTransporter() {
    if (transporterPromise) return transporterPromise;
    transporterPromise = (async () => {
        if (process.env.ETHEREAL_USER && process.env.ETHEREAL_PASS) {
            return nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                auth: {
                    user: process.env.ETHEREAL_USER,
                    pass: process.env.ETHEREAL_PASS,
                },
            });
        } else {
            const testAccount = await nodemailer.createTestAccount();
            return nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        }
    })();
    return transporterPromise;
}

export async function sendResetEmail(to: string, subject: string, html: string) {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
        from: '"Todo Demo" <no-reply@tododemo.local>',
        to,
        subject,
        html,
    });

    return {
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info),
    };
}
