export enum Events {
  STUDENT_CREATED = "student.created",
  TEACHER_CREATED = "teacher.created",
  PARENT_CREATED = "parent.created",
  PASSWORD_RESET = "auth.user.password_reset",
  EMAIL_VERIFICATION = "auth.user.email_verification",
}

// Define payloads for each event
export interface EventPayloads {
  [Events.STUDENT_CREATED]: {
    studentId: string;
    email: string;
    parentId: string;
  };

  [Events.PARENT_CREATED]: {
    parentId: string;
    email: string;
  };

  [Events.TEACHER_CREATED]: {
    teacherId: string;
    email: string;
    firstName: string;
    lastName: string;
  };

  [Events.PASSWORD_RESET]: {
    email: string;
    resetToken: string;
  };

  [Events.EMAIL_VERIFICATION]: {
    name: string;
    email: string;
    role: string;
    verificationToken: string;
  };
}
