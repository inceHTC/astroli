import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  const to = process.env.CONTACT_EMAIL;
  if (!to) {
    return NextResponse.json(
      { error: "İletişim e-posta adresi yapılandırılmamış (CONTACT_EMAIL)." },
      { status: 500 }
    );
  }

  if (!resend) {
    return NextResponse.json(
      { error: "E-posta servisi yapılandırılmamış (RESEND_API_KEY)." },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      message?: string;
    };
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Ad, e-posta ve mesaj alanları zorunludur." },
        { status: 400 }
      );
    }

    const subject = `[Astroli İletişim] ${name}`;
    const text = `Gönderen: ${name} <${email}>\n\n${message}`;

    const { error } = await resend.emails.send({
      from: "Astroli İletişim <onboarding@resend.dev>",
      to: [to],
      replyTo: email,
      subject,
      text,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Contact API error:", e);
    return NextResponse.json(
      { error: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin." },
      { status: 500 }
    );
  }
}
