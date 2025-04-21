export const saveAnswer = (key: string, value: string | object): void => {
  if (typeof window !== 'undefined') {
    const storedValue = typeof value === 'object' ? JSON.stringify(value) : value;
    localStorage.setItem(key, storedValue);
  }
};
