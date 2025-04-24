
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { render } from "@react-email/components";
import  { type ReactElement } from "react";

const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION,
});


export async function sendEmail({
  react,
  ...options
}: {
  to: string | string[]
  subject: string
} & (
    | { html: string; text?: never; react?: never }
    | { html?: never; text: string; react?: never }
    | { react: ReactElement; html?: never; text?: never }
  )) {


  const email = {
    ...options,
    ...(react ? await renderReactEmail(react) : null)
  }


  await sesClient.send(new SendEmailCommand({
    Destination: {
      ToAddresses: typeof email.to === 'string' ? [email.to] : [...email.to],
    },
    Message: {
      Body: {
        ...(email.html && {
          Html: {
            Charset: "UTF-8",
            Data: email.html,
          },
        }),
        ...(email.text && {
          Text: {
            Charset: "UTF-8",
            Data: email.text,
          },
        }),
      },
      Subject: {
        Charset: "UTF-8",
        Data: email.subject,
      },
    },
    Source: process.env.AWS_SES_FROM_EMAIL,
  }));


}

export async function renderReactEmail(react: ReactElement) {
  const [html, text] = await Promise.all([
    render(react),
    render(react, { plainText: true }),
  ])
  return { html, text }
}



