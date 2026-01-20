const { Resend } = require('resend');

const sendEmail = async (options) => {
    console.log('--- SendEmail via Resend ---');
    console.log('To:', options.email);
    console.log('Subject:', options.subject);
    console.log('----------------------------');

    // Initialize Resend with API key
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
            from: `${process.env.FROM_NAME || 'Cipher 43 Lab'} <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html || options.message.replace(/\n/g, '<br>')
        });

        if (error) {
            console.error('Resend Error:', error);
            throw new Error(error.message);
        }

        console.log('Email sent successfully! ID:', data.id);
        return data;
    } catch (error) {
        console.error('SendEmail Error:', error);
        throw error;
    }
};

module.exports = sendEmail;

