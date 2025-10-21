import nodemailer from "nodemailer"
import { NextResponse } from "next/server"
import { Document, Packer } from "docx"
import { parseReportToDocxParagraphs } from "@/utils/parseReportToDocx";

export async function POST(request: Request) {
  try {
    const { to, subject, htmlContent, reportText } = await request.json()

    // 🔧 1. Crea file DOCX dinamicamente
    const doc = new Document({
      sections: [
        {
          children: parseReportToDocxParagraphs(reportText),
        },
      ],
    })

    const buffer = await Packer.toBuffer(doc)
    const base64 = buffer.toString("base64")

    // 🔧 2. Crea transporter Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    // 🔧 3. Invia l'email
    await transporter.sendMail({
      from: `"HermIA - VAR Group" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: "report.docx",
          content: base64,
          encoding: "base64",
        },
      ],
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Errore invio email:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}