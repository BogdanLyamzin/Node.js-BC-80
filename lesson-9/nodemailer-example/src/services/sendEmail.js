import nodemailer from "nodemailer";
import "dotenv/config";

const {UKR_NET_EMAIL, UKR_NET_PASSSWORD} = process.env;

const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465, // 25, 2525
    secure: true,
    auth: {
        user: UKR_NET_EMAIL,
        pass: UKR_NET_PASSSWORD
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);

// const payload = {
//     to: "balojed467@luhupo.com",
//     subject: "Verify email",
//     html: "verify email"
// };

const sendEmail = payload => {
    const email = {...payload, from: UKR_NET_EMAIL};
    return transport.sendMail(email);
}

export default sendEmail;