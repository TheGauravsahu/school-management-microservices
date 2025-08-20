import { env } from "../../common/config/env";
import { EventPayloads, Events } from "../../common/config/rabbitmq/events";
import { sendEmail } from "../../services/emailService";
import { emailVerificationTemplate } from "../../templates/emailVerification";

export async function handleEmailVerificationEvent(
  data: EventPayloads[Events.EMAIL_VERIFICATION]
) {
  const { name, email, role, verificationToken } = data;
  const accountType =
    role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  const link = `${env.AUTH_SERVICE_URL}/api/v1/auth/verify/confirm?token=${verificationToken}`;
  const html = emailVerificationTemplate(name, accountType, link);

  await sendEmail(email, `Activate Your ${accountType} Account`, html);
}
