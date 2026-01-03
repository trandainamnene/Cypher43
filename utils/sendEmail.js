const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) Create a transporter
    console.log('--- SendEmail Config Debug ---');
    console.log('Host:', process.env.SMTP_HOST);
    console.log('Port:', process.env.SMTP_PORT, 'Type:', typeof process.env.SMTP_PORT);
    console.log('User:', process.env.SMTP_EMAIL);
    console.log('Secure:', process.env.SMTP_SECURE);
    console.log('------------------------------');

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false // Fix for some self-signed certs issues, though not recommended for prod
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: 
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
