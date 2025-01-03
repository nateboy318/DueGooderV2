const sendMail = async (to: string, subject: string, html: string) => {
  console.log("Sending email to", to, "with subject", subject, "and html", html);
  // I can send email from SES, Resend, or Mailgun here.
};

export default sendMail;
