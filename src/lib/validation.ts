export const MIN_PASSWORD_LENGTH = 8;

export function passwordError(password: string): string | null {
  return password.length < MIN_PASSWORD_LENGTH
    ? `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`
    : null;
}
