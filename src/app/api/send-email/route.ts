import { google } from "googleapis";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { recipient, subject, html, reportContent } = await req.json();

  const GMAIL_CLIENT_ID = ""; //process.env.GMAIL_CLIENT_ID
  const GMAIL_CLIENT_SECRET = ""; //process.env.GMAIL_CLIENT_SECRET
  const GMAIL_REDIRECT_URI = "";

  const options = {
    clientId: GMAIL_CLIENT_ID,
    clientSecret: GMAIL_CLIENT_SECRET,
    redirectUri:  GMAIL_REDIRECT_URI,
  };

  try {
    const oAuth2Client = new google.auth.OAuth2(options);

    oAuth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    });
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token ?? undefined,
      },
    });

    // Crea un file docx in base64
    const buffer = Buffer.from(reportContent, "utf-8");

    await transporter.sendMail({
      from: `"Boom WebApp" <${process.env.GMAIL_USER}>`,
      to: recipient,
      subject,
      html,
      attachments: [
        {
          filename: "report.docx",
          content: buffer,
          encoding: "base64",
          contentType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
      ],
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}