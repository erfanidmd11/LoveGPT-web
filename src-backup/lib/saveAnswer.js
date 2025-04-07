export const saveAnswer = (key, value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    }
  };
  