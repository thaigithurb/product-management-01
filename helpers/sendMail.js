const nodemailer = require('nodemailer');

module.exports.sendMail = (email, subject, html) => {

    // 1️⃣ Tạo transporter (kết nối đến mail server)
    const transporter = nodemailer.createTransport({
        service: 'gmail', // hoặc host, port nếu dùng SMTP riêng
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD, // KHÔNG dùng mật khẩu thật
        },
    });

    // 2️⃣ Cấu hình nội dung mail
    const mailOptions = {
        from: 'thaivietluong2005@gmail.com',
        to: email,
        subject: subject,
        html: html,
    };

    // 3️⃣ Gửi mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Lỗi khi gửi mail:', error);
        } else {
            console.log('Gửi thành công:', info.response);
        }
    });

}