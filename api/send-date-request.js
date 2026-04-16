const { Resend } = require("resend");

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL;
const recipientEmail = "wailbouymaj@gmail.com";

const parseBody = (body) => {
  if (!body) {
    return {};
  }

  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch (error) {
      return {};
    }
  }

  return body;
};

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res
      .status(405)
      .json({ error: "Method not allowed. Use POST instead." });
  }

  if (!resendApiKey || !fromEmail) {
    return res.status(500).json({
      error:
        "Server email settings are missing. Add RESEND_API_KEY and RESEND_FROM_EMAIL.",
    });
  }

  const body = parseBody(req.body);
  const name = body.name?.trim();
  const planType = body.planType?.trim();
  const planLabel = body.planLabel?.trim();
  const customPlan = body.customPlan?.trim();
  const freeDate = body.freeDate?.trim();
  const needsCustomPlan = planType === "activity" || planType === "other";

  if (!name || !planType || !planLabel || !freeDate) {
    return res.status(400).json({
      error: "Name, selected plan, and free date are required.",
    });
  }

  if (needsCustomPlan && !customPlan) {
    return res.status(400).json({
      error: "Please include the activity or custom plan details.",
    });
  }

  const resend = new Resend(resendApiKey);
  const planDetails = needsCustomPlan ? `${planLabel}: ${customPlan}` : planLabel;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      subject: `New date invite from ${name}`,
      text: [
        "A new date invite was submitted.",
        "",
        `Name: ${name}`,
        `Selection: ${planDetails}`,
        `Free date: ${freeDate}`,
      ].join("\n"),
      replyTo: fromEmail,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      error: "Email send failed.",
      details: error.message,
    });
  }
};
