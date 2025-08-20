export function teacherCreatedTemplate(firstName: string, lastName: string) {
  return `
    <h2>Welcome, ${firstName} ${lastName}!</h2>
    <p>Hello ${firstName} ${lastName},</p><p>You have been registered as a teacher.</p>
  `;
}
