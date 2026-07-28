const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is the text format email",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async (subject, body, toEmailId = "sachinlg60@gmail.com") => {
  const sendEmailCommand = createSendEmailCommand(
    "sachinlg60@gmail.com",
    process.env.AWS_SES_FROM_EMAIL || "benison@thedevtinder.com",
    subject,
    body
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error) {
      return {
        success: false,
        message: caught.message,
      };
    }

    return {
      success: false,
      message: "Email service unavailable",
    };
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };