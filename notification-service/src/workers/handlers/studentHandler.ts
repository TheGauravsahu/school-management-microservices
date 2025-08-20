import { sendEmail } from "../../services/emailService";
import { EventPayloads, Events } from "../../common/config/rabbitmq/events";
import { studentCreatedTemplate } from "../../templates/studentCreated";

export async function handleStudentCreated(
  data: EventPayloads[Events.STUDENT_CREATED]
) {
  const { email, firstName, lastName } = data;
  const html = studentCreatedTemplate(firstName, lastName);
  await sendEmail(email, "Student Account Created", html);
}
