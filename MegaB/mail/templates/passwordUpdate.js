exports.passwordUpdated = (name, email) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Update Confirmation</title>
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
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Password Update Confirmation</div>
        <div class="content">
            <p>Dear ${name}, </p>
            <p>Your password has been successfully updated for ${email}</p>
            <p>If you did not request this change, please contact us immediately.</p>
        </div>
        <div class="footer">
            If you need assistance, reach out to us at <br>
            <a href="mailto:support@example.com">support@example.com</a>
        </div>
    </div>
</body>
</html>`;
}
