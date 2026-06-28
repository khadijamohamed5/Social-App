type OTPTemplateProps = {
    otp: string;
    title: string;
    message: string;
};

export const otpTemplate = ({
    otp,
    title,
    message,
}: OTPTemplateProps) => {
    return `
    <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 20px;
        border: 1px solid #e5e5e5;
        border-radius: 10px;
    ">
        <h2 style="color: #333;">${title}</h2>

        <p style="font-size: 16px; color: #555;">
            Hello,
        </p>

        <p style="font-size: 16px; color: #555;">
            ${message}
        </p>

        <div style="
            background-color: #f4f4f4;
            padding: 15px;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 5px;
            border-radius: 8px;
            margin: 20px 0;
        ">
            ${otp}
        </div>

        <p style="font-size: 14px; color: #777;">
            This OTP will expire in 3 minutes.
        </p>

        <hr style="margin: 20px 0;" />

        <p style="font-size: 14px; color: #999;">
            Social Media App Team
        </p>
    </div>
    `;
};