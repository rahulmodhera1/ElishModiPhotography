import { NextResponse } from "next/server";

/**
 * Inquiry endpoint.
 *
 * Right now this validates the submission and logs it, which is enough for the
 * form to have honest loading, error and success states end to end.
 *
 * TO GO LIVE: pick a transport and send the mail from the marked spot below.
 * Nothing else needs to change, including the client.
 *
 *   npm install resend
 *   const resend = new Resend(process.env.RESEND_API_KEY);
 *   await resend.emails.send({
 *     from: "site@elishmodi.com",
 *     to: process.env.INQUIRY_TO ?? "hello@elishmodi.com",
 *     replyTo: data.email,
 *     subject: `New inquiry: ${data.shootType}`,
 *     text: `...`,
 *   });
 */

type Payload = {
  name?: unknown;
  email?: unknown;
  shootType?: unknown;
  date?: unknown;
  message?: unknown;
  /* Honeypot. Real people leave it empty; most bots do not. */
  website?: unknown;
};

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 400 });
  }

  if (str(body.website)) {
    /* Silently accept so the bot does not learn anything. */
    return NextResponse.json({ ok: true });
  }

  const data = {
    name: str(body.name),
    email: str(body.email),
    shootType: str(body.shootType),
    date: str(body.date),
    message: str(body.message),
  };

  const errors: Record<string, string> = {};
  if (!data.name) errors.name = "Please enter your name.";
  if (!data.email) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!data.shootType) errors.shootType = "Please select a session type.";
  if (data.message.length < 10) {
    errors.message =
      "Please include a few details about your session so I can prepare an accurate response.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  /* SEND THE MAIL HERE. See the header comment for a worked example. */
  console.info("[inquiry]", data);

  return NextResponse.json({ ok: true });
}
