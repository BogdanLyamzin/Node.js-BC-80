import { isAxiosError } from "axios";

const translatedMessages: Record<string, string> = {
  "Email already in use": "Ця адреса e-mail уже використовується",
  "Invalid email or password": "Неправильна адреса e-mail або пароль",
  "Missing access token": "Потрібно ввійти до облікового запису",
  "Session not found": "Сесію не знайдено. Увійдіть ще раз",
  "Access token expired": "Термін дії сесії завершився. Увійдіть ще раз",
  "User not found": "Користувача не знайдено",
};

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError(error)) return fallback;

  const message = (error.response?.data as { message?: string })?.message;
  return (message && translatedMessages[message]) || fallback;
}
