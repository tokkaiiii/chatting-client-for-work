export const TOKEN_KEY = "chat_token";
export const USERNAME_KEY = "chat_username";
export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
}; 

export const setUsername = (username: string) => {
  localStorage.setItem(USERNAME_KEY, username);
};

export const getUsername = () => {
  return localStorage.getItem(USERNAME_KEY);
};

export const removeUsername = () => {
  localStorage.removeItem(USERNAME_KEY);
};