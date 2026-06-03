const nodemailer = require('nodemailer');

// Cấu hình gửi email qua Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Email của bạn
        pass: process.env.EMAIL_PASS  // Mật khẩu ứng dụng Gmail
    }
});

// Hàm gửi email thông báo có liên hệ mới
const sendContactNotification = async (contactData) => {
    const { name, email, phone, company, message, interestedIn } = contactData;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Gửi về chính email của bạn
        subject: `🔔 [Website] Liên hệ mới từ ${name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #1a3a5c; border-bottom: 2px solid #1a3a5c; padding-bottom: 10px;">📬 Thông tin liên hệ mới</h2>
                
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; width: 120px;">Họ tên:</td>
                        <td style="padding: 8px 0;">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                        <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
                    </tr>
                    ${phone ? `<tr><td style="padding: 8px 0; font-weight: bold;">Điện thoại:</td><td style="padding: 8px 0;">${phone}</td></tr>` : ''}
                    ${company ? `<tr><td style="padding: 8px 0; font-weight: bold;">Công ty:</td><td style="padding: 8px 0;">${company}</td></tr>` : ''}
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Quan tâm:</td>
                        <td style="padding: 8px 0;">${interestedIn || 'Không xác định'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Nội dung:</td>
                        <td style="padding: 8px 0; background: #f5f7fa; padding: 12px; border-radius: 6px;">${message}</td>
                    </tr>
                </table>
                
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666;">
                    <p>📅 Thời gian: ${new Date().toLocaleString('vi-VN')}</p>
                    <p>🔗 <a href="${process.env.FRONTEND_URL}/admin/messages" style="color: #1a3a5c;">Xem trong Admin Panel →</a></p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email notification sent for contact from ${name}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return false;
    }
};

// Hàm gửi email xác nhận cho khách hàng (tùy chọn)
const sendAutoReplyToCustomer = async (contactData) => {
    const { name, email, message } = contactData;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Xác nhận: Cảm ơn bạn đã liên hệ với ${process.env.COMPANY_NAME || 'chúng tôi'}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #1a3a5c;">Xin chào ${name},</h2>
                <p>Cảm ơn bạn đã liên hệ với chúng tôi!</p>
                <p>Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất (thường trong vòng 24 giờ làm việc).</p>
                <div style="background: #f5f7fa; padding: 12px; border-radius: 6px; margin: 16px 0;">
                    <p><strong>Nội dung bạn đã gửi:</strong></p>
                    <p style="font-style: italic;">"${message.substring(0, 200)}${message.length > 200 ? '...' : ''}"</p>
                </div>
                <p>Trân trọng,</p>
                <p><strong>${process.env.COMPANY_NAME || 'Nguyễn Văn A'}</strong><br>
                Kỹ sư Cơ khí & Điện</p>
                <hr style="margin: 20px 0;">
                <p style="font-size: 12px; color: #666;">📞 Hotline: ${process.env.PHONE_NUMBER || '0123 456 789'} | 📧 Email: ${process.env.EMAIL_USER}</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Auto-reply sent to ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending auto-reply:', error);
        return false;
    }
};

module.exports = { sendContactNotification, sendAutoReplyToCustomer };