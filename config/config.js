
module.exports = {
  supportEmail: process.env.SUPPORT_EMAIL || "info@forkfreight.com",
  mailHost: process.env.MAIL_HOST || "smtp.sendgrid.net", //"smtpout.secureserver.net",
  mailPort: process.env.SENDGRID_PORT || 587,
  SMTPDebug: process.env.SMTP_DEBUG || 1,
  mailSecure: process.env.SENDGRID_SECURE || false,
  mailUser: process.env.MAIL_USER || "apikey",//"freightdepot@786net.com",
  mailPass: process.env.SENDGRID_API || "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",
  portalUrl: process.env.PORTAL_URL || 'https://test.forkfreight.com',
  // Secret Key
  secretKey: 'eypZAZy0CY^g9%KreypZAZy0CY^g9%Kr',
};
