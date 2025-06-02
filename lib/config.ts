export const config = {
  wsUrl: process.env.WS_URL || 'ws://localhost:8080/ws/chat',
  apiUrl: process.env.API_URL || 'http://localhost:8080',
} as const; 