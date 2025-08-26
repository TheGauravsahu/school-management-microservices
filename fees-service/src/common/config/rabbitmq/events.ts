export enum Events {
  STUDENT_CREATED = "student.created",
  TEACHER_CREATED = "teacher.created",
  PARENT_CREATED = "parent.created",
  PASSWORD_RESET = "auth.user.password_reset",
  EMAIL_VERIFICATION = "auth.user.email_verification",
  STUDENT_ABSENT = "attendance.student.absent",

  INVOICE_CREATED = "invoice.created",
  INVOICE_PAID = "invoice.paid",
  INVOICE_OVERDUE = "invoice.overdue",
}

// Define payloads for each event
export interface EventPayloads {
  [Events.STUDENT_CREATED]: {
    _id: string;
    name: string;
    email: string;
    mobileNumber: string;
    rollNumber: number;
    class: number;
    section: string;
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

  // invoices
  [Events.INVOICE_CREATED]: {
    invoiceId: string;
    student: {
      id: string;
      name: string;
      email: string;
      mobileNumber: string;
      rollNo: number;
      class: number;
    };
    session: {
      id: string;
      name: string;
    };
    total: number;
    dueDate: string;
    items: {
      feeName: string;
      amount: number;
      month?: number;
      year?: number;
    }[];
  };

  [Events.INVOICE_PAID]: {
    invoiceId: string;
    student: {
      id: string;
      name: string;
      email: string;
      mobileNumber: string;
      rollNumber: number;
      class: number;
      section: string;
    };
    session: {
      id: string;
      name: string;
    };
    amountPaid: number;
    method: string;
    date: string;
  };

  [Events.INVOICE_OVERDUE]: {
    invoiceId: string;
    student: {
      id: string;
      name: string;
      email: string;
      mobileNumber: string;
      rollNumber: number;
      class: number;
      section: string;
    };
    session: {
      id: string;
      name: string;
    };
    dueDate: string;
    pendingAmount: number;
  };
}
