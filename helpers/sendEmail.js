import nodemailer from "nodemailer";

import "dotenv/config";

const {UKRNET_EMAIL, UKRNET_PASSWORD} = process.env;

const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465,
    secure: true,
    auth: {
        user: UKRNET_EMAIL,
        pass: UKRNET_PASSWORD,
    },
    tls: {
	    rejectUnauthorized: false
    },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = data => {
    const email = {...data, from: UKR_NET_EMAIL};
    return transport.sendMail(email);
}

export default sendEmail;