exports.otpTemplate = (otp) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .header {
            background: #0073e6;
            color: white;
            padding: 15px;
            font-size: 20px;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
            font-size: 16px;
            color: #333;
        }
        .otp-code {
            font-size: 24px;
            font-weight: bold;
            color: #0073e6;
            margin: 10px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">OTP Verification</div>
        <div class="content">
            <p>Your One-Time Password (OTP) for verification is:</p>
            <p class="otp-code">${otp}</p>
            <p>Please use this OTP to complete your verification process. Do not share it with anyone.</p>
        </div>
        <div class="footer">
            If you did not request this OTP, please ignore this message.
        </div>
    </div>
</body>
</html>`;
}
