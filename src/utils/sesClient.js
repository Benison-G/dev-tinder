const { SESClient } = require("@aws-sdk/client-ses");

const REGION = process.env.AWS_REGION || "us-east-1";

const sesClient = new SESClient({
  region: REGION,
  ...(process.env.AWS_SES_ACCESS_KEY && process.env.AWS_SES_SECRET_KEY
    ? {
        credentials: {
          accessKeyId: process.env.AWS_SES_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SES_SECRET_KEY,
        },
      }
    : {}),
});

module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]