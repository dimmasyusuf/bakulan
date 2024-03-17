import React from "react";
import {
  Html,
  Head,
  Preview,
  Tailwind,
  Body,
  Button,
  Container,
  Img,
  Section,
  Text,
} from "@react-email/components";

export default function Email({ name }: { name: string }) {
  const previewText = "Reset your password for Bakulan account";

  return (
    <Html lang="en">
      <Head>
        <title>Reset Password</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="flex items-center justify-center bg-neutral-50 py-2 font-sans">
          <Container className="flex items-center justify-center space-y-4 overflow-auto bg-white p-0 px-6 py-12">
            <Section>
              <Img
                src="http://localhost:3000/logo.png"
                alt="Bakulan Logo"
                width="48"
                height="48"
              />
            </Section>
            <Section>
              <Text>Hi, {name}!</Text>
              <Text>
                Someone recently requested a password change for your Bakulan
                account. If this was you, you can set a new password here:
              </Text>
              <Button
                href="https://bakulan.vercel.app/reset-password?token=123"
                className="w-fit rounded-md bg-orange-400 px-3 py-2 text-xs font-medium text-white"
              >
                Reset Password
              </Button>
              <Text>
                If you don&apos;t want to change your password or didn&apos;t
                request this, just ignore and delete this message.
              </Text>
              <Text>
                To keep your account secure, please don&apos;t forward this
                email to anyone.
              </Text>
              <Text>Thanks,</Text>
              <Text>The Bakulan Team</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
