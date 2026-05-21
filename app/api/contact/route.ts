import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY!;
const TO_EMAIL = "orders@cnalighting.com";
const FROM_EMAIL = "CNA Lighting Website <noreply@webinquiry.cnalighting.com>";

async function verifyRecaptcha(token: string): Promise<boolean> {
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${RECAPTCHA_SECRET}&response=${token}`,
  });
  const data = await res.json();
  return data.success === true && (data.score ?? 0) >= 0.5;
}

export async function POST(req: NextRequest) {
  let body: { name?: string; company?: string; email?: string; subject?: string; message?: string; token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, company, email, subject, message, token } = body;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim() || !token?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const isHuman = await verifyRecaptcha(token);
  if (!isHuman) {
    return NextResponse.json({ error: "reCAPTCHA verification failed" }, { status: 403 });
  }

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: email,
    subject: `Website Contact: ${subject}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : "",
      `Subject: ${subject}`,
      "",
      message,
    ].filter(Boolean).join("\n"),
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
