import nodemailer from "nodemailer"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { to, subject, htmlContent, docxContentBase64 } = await request.json()

    // Crea il transporter usando App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    // Configura il messaggio
    const mailOptions = {
      from: `"Boom WebApp" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: "report.docx",
          content: Buffer.from(docxContentBase64, "base64"),
          encoding: "base64",
        },
      ],
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true, message: "Email inviata con successo!" })
  } catch (error: any) {
    console.error("Errore invio email:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}