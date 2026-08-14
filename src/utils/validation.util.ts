export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value: string) => EMAIL_REGEX.test(value.trim());

export const isValidCpf = (value: string) => {
  const cpf = value.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calculateDigit = (length: number) => {
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum += Number(cpf[i]) * (length + 1 - i);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstDigit = calculateDigit(9);
  const secondDigit = calculateDigit(10);

  return firstDigit === Number(cpf[9]) && secondDigit === Number(cpf[10]);
};

export const isValidBirthDate = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 8) return false;

  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));

  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!isRealDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date > today) return false;

  const minYear = today.getFullYear() - 120;
  if (year < minYear) return false;

  return true;
};

export const isValidPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
};
