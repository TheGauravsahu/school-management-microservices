export function studentAbsentTemplate(
  name: string,
  date: string,
  classNumber: number
) {
  return `
    <p>Hello ${name},</p>
    <p>This is to inform you that you were marked <b>Absent</b> on <b>${date}</b> in class <b>${classNumber}</b>.</p>
    <p>If this is a mistake, please contact your teacher.</p>
  `;
}
