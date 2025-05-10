const nodemailer = require("nodemailer");
require("dotenv").config();

// Ensure credentials are loaded
if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.error("Missing MAIL_USER or MAIL_PASS in environment variables");
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: `"Equalify Support" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("OTP sent: ", info.response);
        return true;
    } catch (error) {
        console.error("Error sending OTP:", error);
        return false;
    }
};

module.exports = sendOTP;
