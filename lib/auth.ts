export const TOKEN_KEY = "chat_token";
export const USERNAME_KEY = "chat_username";
export const USER_ID_KEY = "chat_user_id";
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

export const setUserId = (userId: string) => {
  localStorage.setItem(USER_ID_KEY, userId);
};

export const getUserId = () => {
  return localStorage.getItem(USER_ID_KEY);
};

export const removeUserId = () => {
  localStorage.removeItem(USER_ID_KEY);
};