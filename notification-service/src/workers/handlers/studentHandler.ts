import { sendEmail } from "../../services/emailService";
import { EventPayloads, Events } from "../../common/config/rabbitmq/events";
import { studentCreatedTemplate } from "../../templates/studentCreated";

export async function handleStudentCreated(
  data: EventPayloads[Events.STUDENT_CREATED]
) {
  const { email, name } = data;
  const html = studentCreatedTemplate(name);
  await sendEmail(email, "Student Account Created", html);
}
