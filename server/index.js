require("dotenv").config();

const express = require("express");
const { Resend } = require("resend");

const PORT = process.env.PORT || 3001;
const recipientEmail = "wailbouymaj@gmail.com";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL;

const app = express();
app.use(express.json());

app.post("/api/send-date-request", async (req, res) => {
  if (!resendApiKey || !fromEmail) {
    return res.status(500).json({
      error:
        "Server email settings are missing. Add RESEND_API_KEY and RESEND_FROM_EMAIL.",
    });
  }

  const name = req.body?.name?.trim();
  const planType = req.body?.planType?.trim();
  const planLabel = req.body?.planLabel?.trim();
  const customPlan = req.body?.customPlan?.trim();
  const freeDate = req.body?.freeDate?.trim();
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
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${PORT}`);
});

