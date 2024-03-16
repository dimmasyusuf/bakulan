"use server";

import { Resend } from "resend";
import { z } from "zod";
import { sendEmailFormSchema } from "../validator";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  values: z.infer<typeof sendEmailFormSchema>,
) => {
  try {
    await resend.emails.send({
      from: "Bakulan <onboarding@resend.dev>",
      to: values.email,
      subject: "Reset Password",
      html: `<p>Click <a href="http://localhost:3000/reset-password">here</a> to reset your password</p>`,
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
