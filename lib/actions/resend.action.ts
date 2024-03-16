"use server";

import { Resend } from "resend";
import { z } from "zod";
import { sendEmailFormSchema } from "../validator";
import Email from "@/components/Email";
import { getUserByEmail } from "./user.action";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  values: z.infer<typeof sendEmailFormSchema>,
) => {
  const user = await getUserByEmail(values.email);
  const name = user?.name || "there";

  try {
    await resend.emails.send({
      from: "Bakulan <onboarding@resend.dev>",
      to: values.email,
      subject: "Reset Password",
      react: Email({ name }),
    });

    return {
      status: 200,
      message: "Email sent successfully",
    };
  } catch (error) {
    return {
      status: 500,
      message: "Failed to send email",
    };
  }
};
