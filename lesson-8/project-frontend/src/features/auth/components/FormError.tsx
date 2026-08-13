export function FormError({ message }: { message?: string }) {
  return message ? <span role="alert">{message}</span> : null;
}
