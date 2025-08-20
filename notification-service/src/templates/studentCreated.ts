export function studentCreatedTemplate(firstName: string, lastName: string) {
  return `
    <h2>Welcome, ${firstName} ${lastName}!</h2>
    <p>You have been successfully registered as a student.</p>
  `;
}
