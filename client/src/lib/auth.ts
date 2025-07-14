interface User {
  access_token: string;
  token_type: string;
  expires_in: number;
  user?: {
    id: string;
    email: string;
    name: string;
    [key: string]: any;
  };
}

export const getUserFromStorage = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user from storage:', error);
    return null;
  }
};

export const saveUserToStorage = (user: User): void => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to storage:', error);
  }
};

export const removeUserFromStorage = (): void => {
  try {
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error removing user from storage:', error);
  }
};

export const isAuthenticated = (): boolean => {
  const user = getUserFromStorage();
  return !!user?.access_token;
};