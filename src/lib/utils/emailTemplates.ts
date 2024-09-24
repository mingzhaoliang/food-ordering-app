const verificationEmailTemplate = (restaurantName: string, userFirstName: string, verificationCode: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 30rem;
        margin: 0 auto;
        overflow: hidden;
      }
      .header {
        padding: 0.5rem;
        text-align: center;
      }
      .header h2 {
        color: #737373;
      }
      .content {
        padding: 0.5rem;
        line-height: 1.6;
        text-align: center;
        text-wrap: balance;
        color: #737373;
        font-size: 1rem;
      }
      .code {
        display: inline-block;
        padding: 10px 15px;
        color: black;
        border-radius: 5px;
        font-size: 30px;
        margin: 1rem 0;
        font-weight: bold;
        letter-spacing: 0.05rem;
      }
      .footer {
        text-align: center;
        padding: 10px;
        font-size: 12px;
        color: #777;
        border-top: 1px solid #e0e0e0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>${restaurantName}</h2>
        <h1>Verify your email</h1>
      </div>
      <div class="content">
        <p>Hi ${userFirstName}</p>
        <p>
          Thank you for signing up! Enter the code below in the application to finish verifying your email
          address.
        </p>
        <div class="code">${verificationCode}</div>
        <p>If you didn't create an account, please ignore this email.</p>
      </div>
      <div class="footer">
        <p>
          © ${new Date().getFullYear()} ${restaurantName}. All rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>`;

const trackingOrderEmailTemplate = (restaurantName: string, customerName: string, trackingUrl: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 100%;
        max-width: 30rem;
        margin: 0 auto;
        overflow: hidden;
      }
      .header {
        padding: 0.5rem;
        text-align: center;
      }
      .header h2 {
        color: #737373;
      }
      .content {
        padding: 0.5rem;
        line-height: 1.6;
        text-align: center;
        text-wrap: balance;
        color: #737373;
        font-size: 1rem;
      }
      .link {
        display: inline-block;
        padding: 10px 15px;
        background-color: black;
        border-radius: 5px;
        font-size: 16px;
        margin: 1rem 0;
        font-weight: 600;
        letter-spacing: 0.05rem;
        text-decoration: inherit;
        color: white;
        cursor: auto;
      }
      .footer {
        text-align: center;
        padding: 10px;
        font-size: 12px;
        color: #777;
        border-top: 1px solid #e0e0e0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>${restaurantName}</h2>
        <h1>Verify your email</h1>
      </div>
      <div class="content">
        <p>Hi ${customerName}</p>
        <p>
          Thank you for placing an order with us! You can track your order by clicking the link below.
        </p>
        <a href=${trackingUrl} class="link">Track order</a>
      </div>
      <div class="footer">
        <p>
          © ${new Date().getFullYear()} ${restaurantName}. All rights reserved.
        </p>
      </div>
    </div>
  </body>
</html>`;

export { verificationEmailTemplate, trackingOrderEmailTemplate };
