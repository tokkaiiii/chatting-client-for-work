import { useEffect, useRef, useCallback, useState } from 'react';
import { getToken } from './auth';
import type { Client, IMessage, IFrame } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface WebSocketMessage {
  type: 'CHAT' | 'JOIN' | 'LEAVE';
  sender: string;
  content: string;
  timestamp: string;
}

export interface WebSocketHook {
  sendMessage: (message: WebSocketMessage) => void;
  lastMessage: WebSocketMessage | null;
  isConnected: boolean;
}

export const useWebSocket = (url: string, chatRoomId: string): WebSocketHook => {
  const client = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const initStomp = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.error('No authentication token found');
          return;
        }

        const { Client } = await import('@stomp/stompjs');
        
        if (!mounted) return;

        client.current = new Client({
          webSocketFactory: () => {
            return new SockJS('http://localhost:8080/ws/chat');
          },
          connectHeaders: {
            Authorization: `Bearer ${token}`
          },
          debug: function (str) {
            console.log('STOMP: ' + str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          onConnect: () => {
            if (!mounted) return;
            setIsConnected(true);
            console.log('STOMP Connected');
            
            if (subscriptionRef.current) {
              subscriptionRef.current.unsubscribe();
            }
            
            subscriptionRef.current = client.current?.subscribe(`/topic/room/${chatRoomId}`, (message: IMessage) => {
              if (!mounted) return;
              try {
                const data: WebSocketMessage = JSON.parse(message.body);
                console.log('Received message:', data);
                setLastMessage(data);
              } catch (error) {
                console.error('Failed to parse STOMP message:', error);
              }
            });
          },
          onDisconnect: () => {
            if (!mounted) return;
            setIsConnected(false);
            console.log('STOMP Disconnected');
          },
          onStompError: (frame: IFrame) => {
            if (!mounted) return;
            console.error('STOMP Error:', frame);
          },
          onWebSocketError: (event) => {
            if (!mounted) return;
            console.error('WebSocket Error:', event);
          }
        });

        client.current.activate();
      } catch (error) {
        console.error('Failed to initialize STOMP client:', error);
      }
    };

    initStomp();

    return () => {
      mounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      if (client.current) {
        client.current.deactivate();
      }
    };
  }, [url, chatRoomId]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (client.current?.connected) {
      client.current.publish({
        destination: '/app/send',
        body: JSON.stringify({
          chatRoomId,
          message: message.content
        })
      });
    } else {
      console.error('STOMP is not connected');
    }
  }, [chatRoomId]);

  return {
    sendMessage,
    lastMessage,
    isConnected,
  };
}; 