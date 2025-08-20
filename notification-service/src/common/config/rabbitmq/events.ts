export enum Events {
  STUDENT_CREATED = "student.created",
  TEACHER_CREATED = "teacher.created",
  PARENT_CREATED = "parent.created",
  PASSWORD_RESET = "auth.user.password_reset",
  EMAIL_VERIFICATION = "auth.user.email_verification",
  STUDENT_ABSENT = "attendance.student.absent",

  INVOICE_CREATED = "invoice.created",
  INVOICE_PAID = "invoice.paid",
}

// Define payloads for each event
export interface EventPayloads {
  [Events.STUDENT_CREATED]: {
    studentId: string;
    email: string;
    firstName: string;
    lastName: string;
  };

  [Events.PARENT_CREATED]: {
    parentId: string;
    email: string;
    firstName: string;
    lastName: string;
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

  [Events.STUDENT_ABSENT]: {
    studentId: string;
    name: string;
    email: string;
    parentEmail: string;
    date: string;
    classNumber: number;
  };

  [Events.INVOICE_CREATED]: {
    id: string;
    studentId: string;
    feeStructure: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      classNumber: number;
      tutionFee: number;
      transportFee: number | null;
      developmentFee: number;
      misc: number | null;
    };
    total: number;
    dueDate: string;
    email: string;
  };

  [Events.INVOICE_PAID]: {
    id: string;
    studentId: string;
    feeStructure: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      classNumber: number;
      tutionFee: number;
      transportFee: number | null;
      developmentFee: number;
      misc: number | null;
    };
    total: number;
    email: string;
  };
}
