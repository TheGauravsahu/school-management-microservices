import { sendEmail } from "../../services/emailService";
import { EventPayloads, Events } from "../../common/config/rabbitmq/events";
import { teacherCreatedTemplate } from "../../templates/teacherCreated";

export async function handleTeacherCreated(
  data: EventPayloads[Events.TEACHER_CREATED]
) {
  const { email, firstName, lastName } = data;
  const html = teacherCreatedTemplate(firstName, lastName);
  await sendEmail(email, "Teacher Account Created", html);
}
