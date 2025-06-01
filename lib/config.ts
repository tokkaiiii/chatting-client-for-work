export const config = {
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws/chat',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
} as const; 