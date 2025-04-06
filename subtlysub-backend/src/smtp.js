const API_KEY = process.env.SMTP_API_KEY;
const SECRET_KEY = process.env.SMTP_SECRET_KEY;

const htmlTemplate = `
<div style="background-color: #1f2937; padding: 48px 0; min-height: 100vh; text-align: center; font-family: Arial, sans-serif;">
  <h1 style="color: #ffffff; font-size: 28px; font-weight: bold; margin-bottom: 32px; letter-spacing: 1px;">
    SubtlySub
  </h1>

  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 400px; margin: 0 auto; background-color: #e5e7eb; border-radius: 16px; box-shadow: 0px 10px 20px rgba(0,0,0,0.3); overflow: hidden;">
    <tr>
      <td style="padding: 32px;">
        <p style="color: #374151; font-size: 18px; font-weight: 600; margin-bottom: 24px;">
          Your verification code
        </p>

        <div style="background-color: #7c3aed; color: white; font-size: 30px; font-family: monospace; text-align: center; padding: 16px 0; border-radius: 12px; letter-spacing: 6px; margin-bottom: 24px;">
          {{CODE}}
        </div>

        <p style="color: #4b5563; font-size: 14px; margin-bottom: 24px; line-height: 1.5;">
          Please enter this code in the app to verify your email address.<br/>
          This code will expire in 60 minutes.
        </p>

        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #6b7280; font-size: 12px;">
            If you didn't request this, you can ignore this email.
          </p>
        </div>
      </td>
    </tr>
  </table>
</div>
`;

const sendEmail = async (code, email, username) => {
  const url = 'https://api.mailjet.com/v3/send';
  const data = {
    FromEmail: "danylo.kozakov.cv@gmail.com",
    FromName: "Subtlysub",
    Recipients: [
      {
        Email: email,
        Name: username
      }
    ],
    Subject: "Welcome at SubtlySub!",
    "Text-part": `Your verification code is ${code}`,
    "Html-part": htmlTemplate.replace("{{CODE}}", code)
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${API_KEY}:${SECRET_KEY}`)
    },
    body: JSON.stringify(data)
  });

  if (response.ok) {
    const responseData = await response.json();
    console.log('Email sent successfully:', responseData);
  } else {
    console.error('Error sending email:', await response.text());
  }
};

export default sendEmail;