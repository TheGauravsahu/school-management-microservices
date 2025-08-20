import { EventPayloads, Events } from "../../common/config/rabbitmq/events";
import { sendEmail } from "../../services/emailService";
import { studentAbsentTemplate } from "../../templates/studentAbsent";

export async function handleStudentAbsent(
  data: EventPayloads[Events.STUDENT_ABSENT]
) {
  const { email, name, date, classNumber } = data;
  const html = studentAbsentTemplate(name, date, classNumber);
  await sendEmail(email, "Attendance Notification - Absent", html);
}
