import nodemailer from "nodemailer";

let transporter = null;

export const getTransporter = () => {
  const user = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL on 465
      auth: {
        user,
        pass,
      },
    });
  }
  return transporter;
};

export const sendAppointmentEmail = async ({
  doctorEmail,
  doctorName,
  patientName,
  patientEmail,
  date,
  time,
  speciality,
  symptoms,
}) => {
  const senderEmail = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const mailTransporter = getTransporter();

  if (!senderEmail || !mailTransporter) {
    console.warn(
      "[Gmail SMTP] Notice: GMAIL_USER or GMAIL_APP_PASSWORD is not set in server/.env. Email notification was not sent. Add credentials to enable live dispatch."
    );
    return {
      sent: false,
      reason: "Gmail SMTP credentials not configured in server/.env",
    };
  }

  if (!doctorEmail || !doctorEmail.trim()) {
    console.warn(
      `[Gmail SMTP] No email registered for ${doctorName || "Doctor"}. Notification skipped.`
    );
    return { sent: false, reason: "No doctor email provided" };
  }

  const cleanDoctorEmail = doctorEmail.trim();
  const subject = `New Appointment Scheduled: ${patientName || "Patient"} - ${date} at ${time}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px; }
          .card { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 28px 24px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
          .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
          .body { padding: 28px 24px; }
          .greeting { font-size: 15px; font-weight: 600; color: #1e293b; margin-bottom: 12px; }
          .table-container { margin: 20px 0; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          tr:nth-child(even) { background-color: #f8fafc; }
          td { padding: 12px 16px; }
          td.label { font-weight: 700; color: #475569; width: 38%; }
          td.value { color: #0f172a; font-weight: 600; }
          .clinical-reason { background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px; margin: 18px 0; font-size: 13px; color: #1e3a8a; }
          .footer { background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; text-align: center; font-size: 11px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>UniCare Health Platform</h1>
            <p>Automated Clinical Consultation Notification</p>
          </div>
          <div class="body">
            <div class="greeting">Dear ${doctorName || "Doctor"},</div>
            <p style="font-size: 13px; color: #475569; line-height: 1.6; margin-top: 0;">
              A patient has booked an appointment with you through the UniCare Health Operating Platform. Please review the details below:
            </p>

            <div class="table-container">
              <table>
                <tr>
                  <td class="label">Patient Name:</td>
                  <td class="value" style="color: #2563eb;">${patientName || "Confidential Patient"}</td>
                </tr>
                ${
                  patientEmail
                    ? `<tr>
                  <td class="label">Patient Email:</td>
                  <td class="value"><a href="mailto:${patientEmail}" style="color: #2563eb; text-decoration: none;">${patientEmail}</a></td>
                </tr>`
                    : ""
                }
                <tr>
                  <td class="label">Date:</td>
                  <td class="value">${date}</td>
                </tr>
                <tr>
                  <td class="label">Time Slot:</td>
                  <td class="value">${time}</td>
                </tr>
                <tr>
                  <td class="label">Speciality:</td>
                  <td class="value">${speciality || "General Consultation"}</td>
                </tr>
              </table>
            </div>

            <div class="clinical-reason">
              <strong style="display: block; margin-bottom: 4px; color: #1e40af;">Reason for Consultation / Symptoms:</strong>
              <span>${symptoms && symptoms.trim() ? symptoms : "General wellness examination & medical follow-up."}</span>
            </div>

            <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
              <strong>Note:</strong> You can reply directly to this email to communicate with the patient if they provided a registered contact address.
            </p>
          </div>
          <div class="footer">
            Sent automatically by UniCare Clinical Dispatch. 256-Bit Encrypted Health System.
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const info = await mailTransporter.sendMail({
      from: `"UniCare Health" <${senderEmail}>`,
      to: cleanDoctorEmail,
      replyTo: patientEmail || senderEmail,
      subject,
      html: htmlContent,
      text: `UniCare Appointment Notification\n\nDear ${doctorName || "Doctor"},\n\nA new appointment has been scheduled:\nPatient: ${patientName}\nEmail: ${patientEmail || "N/A"}\nDate: ${date}\nTime: ${time}\nSpeciality: ${speciality || "General"}\nReason: ${symptoms || "General Consultation"}\n\nSent via UniCare Health Operating Platform.`,
    });

    console.log(
      `[Gmail SMTP] Successfully sent appointment email to ${cleanDoctorEmail} (MessageId: ${info.messageId})`
    );
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error(
      `[Gmail SMTP] Failed to send email to ${cleanDoctorEmail}:`,
      error.message
    );
    return { sent: false, error: error.message };
  }
};
