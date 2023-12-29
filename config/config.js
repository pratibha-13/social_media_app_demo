
module.exports = {
  supportEmail: process.env.SUPPORT_EMAIL || "info@forkfreight.com",
  mailHost: process.env.MAIL_HOST || "smtp.sendgrid.net", //"smtpout.secureserver.net",
  mailPort: process.env.SENDGRID_PORT || 587,
  SMTPDebug: process.env.SMTP_DEBUG || 1,
  mailSecure: process.env.SENDGRID_SECURE || false,
  mailUser: process.env.MAIL_USER || "apikey",//"freightdepot@786net.com",
  mailPass: process.env.SENDGRID_API || "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",
  portalUrl: process.env.PORTAL_URL || 'https://test.forkfreight.com',
  // AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID || "AKIA3KNCPM6URTASRJ3M",
  // AWSSecretKey: process.env.AWS_SECRET_KEY || "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",
  // AWSBucketName: 'forkfreight',
  AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID || "AKIAXRYHOJIE4GH2RBTS",
  AWSSecretKey: process.env.AWS_SECRET_KEY || "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",
  AWSBucketName: process.env.AWS_BUCKET_NAME || 'forkfreightapp',
  freshworkApiKey: process.env.FRESHWORK_API_KEY || 'Token token=P9CPLTfu17-5pne57LLGaw',
  googleKey: process.env.GOOGLE_KEY || 'AIzaSyC6WZGzkjs5t3wi64t-1fIkDdmRjm0wdjs',
  paradeToken: process.env.PARADE_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoiZm9ya2ZyZWlnaHQiLCJwYXJ0bmVySWQiOiIxNiIsInJvbGUiOiJhZG1pbiJ9LCJpYXQiOjE2NTE4NTQ0NjksImV4cCI6MzMyMDk0NTQ0Njl9.-g9VFwU66kJRZ5WxwFlTrs5KLQKiRyalClBxNZubJj8',
  paradeBookToken: process.env.PARADE_BOOK_TOKEN || '79bbde0532d60655dab38fc5c64dd578e94e786d',
  paradeUrl: process.env.PARADE_URL || 'https://api.capacity.syndication.parade.ai/ls/syndication/quote',
  paradeBaseUrl: process.env.PARADE_BASE_URL || 'https://api.capacity.syndication.parade.ai',
  stripe_key: process.env.STRIPE_KEY || "sk_test_YdjEqiYVjXzPrbEmyeGAHS0s00qjUZoOid",
  //stripe_key: process.env.STRIPE_KEY || "sk_live_J4IaRGR33Z2wFhmYsCptItIc00V687GQ67",
  stripe_product_price: process.env.STRIPE_PRODUCT_PRICE || "price_1KfiXDAL8cKOmLez0wIodSU1",
  stripe_coupon: process.env.STRIPE_COUPON || "w2Z8Eh0v",
  mapQuestToken: process.env.MAP_QUEST_TOKEN || "BnKzKFWNtHQhH1dt9ztQLBVunbTlfLCU",
  loadDetailUrl: process.env.LOAD_DETAIL_URL || "https://test.forkfreight.com/view-load/",
  VicidialUrl: process.env.VICIDIAL_URL || "https://forkfreight.vicihost.com/vicidial/non_agent_api.php",
  VicidialAdminUserName: process.env.VICIDIAL_ADMIN_USERNAME || "6666",
  VicidialAdminPassword: process.env.VICIDIAL_ADMIN_PASSWORD || "1234",
  VicidialCarrier: process.env.VICIDIAL_CARRIER || "117",
  VicidialBroker: process.env.VICIDIAL_BROKER || "118",
  VicidialShipper: process.env.VICIDIAL_SHIPPER || "116",
  VicidialDispatcher: process.env.VICIDIAL_DISPATCHER || "115",
  VicidialCDLdriver: process.env.VICIDIAL_CDLDRIVER || "119",
  VicidialPaidSubscribersCarrier: process.env.PAID_SUBSCRIBERS_CARRIER || "121",

  // Twilio Account SID - found on your dashboard  
  accountSid: process.env.TWILIO_ACCOUNT_SID || 'AC8a10088cb7f59e630dd3a5249ba69b4b',

  
  // Twilio Auth Token - found on your dashboard
  authToken: process.env.TWILIO_AUTH_TOKEN || '01d786f2086e57ffcffb0fe6b63f2266',

  // A Twilio number that you have purchased through the twilio.com web
  // interface or API
  twilioNumber: process.env.TWILIO_NUMBER || +15735312922,
  
  // Secret Key
  secretKey: 'eypZAZy0CY^g9%KreypZAZy0CY^g9%Kr',
  loadJobs: {
    enabled: process.env.JOBS_NOTIFICATION_ENABLED !== undefined ? (process.env.JOBS_NOTIFICATION_ENABLED == 'true') : true,
    redisUri: process.env.REDIS_URL || "rediss://:pc1fb525baff0c82a2b1cb7b8d92ff2bef5c9522e8888c052c2ad8278a7cb7f1f@ec2-3-222-143-186.compute-1.amazonaws.com:8379",
    monitorIntervalMinutes: process.env.JOBS_NOTIFICATION_MONITOR_INTERVAL_MINUTES || 30,
    newloadQueue: {
      name: 'New Loads', // Queue for managing subscriptions to send emails
      concurrency: process.env.JOBS_CONCURRENCY || 1
    },
    deleteloadQueue: {
      name: 'Deleted Loads', // Queue for managing subscriptions to send emails
      concurrency: process.env.JOBS_CONCURRENCY || 1
    },
    newCsvLoadsQueue: {
      name: 'New CSV Loads',
      concurrency: process.env.JOBS_CONCURRENCY || 1
    },
    queueOptions: {
      prefix: 'bull', // Unique redis prefix for bull to work with redis
      removeOnComplete: true
    },
    broadcastNewloads: {
      name: 'Socket Broadcast New Loads', // Queue for managing subscriptions to send emails
      concurrency: process.env.JOBS_CONCURRENCY || 1
    },
    batchSize: process.env.CLEANUP_BATCH_SIZE || 100, // Batch size of subscriptions to monitor on queue,
    cleanupInterval: process.env.CLEANUP_INTERVAL || 1800000
  }
};
