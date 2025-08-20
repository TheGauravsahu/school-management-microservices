export function emailVerificationTemplate(
  name: string,
  accountType: string,
  link: string
) {
  return `<p>Hello ${name},</p>
                <p>Your ${accountType} account has been created.</p>
                <p><a href="${link}">Click here</a> to set your password and activate your account.</p>`;
}
