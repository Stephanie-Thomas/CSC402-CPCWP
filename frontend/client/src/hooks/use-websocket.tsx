import { useState, useEffect, useRef, useCallback } from 'react';

// Define types for WebSocket messages
export type WebSocketMessage = {
  type: string;
  data?: any;
};

type WebSocketHookReturn = {
  isConnected: boolean;
  data: any | null;
  error: Error | null;
  sendMessage: (message: WebSocketMessage) => void;
  connectionInfo: {
    url: string;
    state: string;
    attempts: number;
  };
};

export function useWebSocket(path: string = '/ws'): WebSocketHookReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [connectionInfo, setConnectionInfo] = useState({
    url: '',
    state: 'initializing',
    attempts: 0
  });
  const socketRef = useRef<WebSocket | null>(null);
  const attemptsRef = useRef(0);

  // Initialize WebSocket connection
  useEffect(() => {
    // Function to create WebSocket connection
    const connectWebSocket = () => {
      try {
        // Close existing connection if any
        if (socketRef.current) {
          socketRef.current.close();
        }
        
        // Increment connection attempts
        attemptsRef.current += 1;
        
        // Build WebSocket URL
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const host = window.location.host;
        const wsUrl = `${protocol}//${host}${path}`;
        
        console.log(`[WebSocket] Attempting connection #${attemptsRef.current} to ${wsUrl}`);
        setConnectionInfo({
          url: wsUrl,
          state: 'connecting',
          attempts: attemptsRef.current
        });
        
        // Create new WebSocket connection
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          console.log('[WebSocket] Connection established successfully');
          setIsConnected(true);
          setError(null);
          setConnectionInfo(prev => ({
            ...prev,
            state: 'connected'
          }));
        };

        socket.onmessage = (event) => {
          try {
            const parsedData = JSON.parse(event.data);
            console.log('[WebSocket] Received data:', parsedData);
            setData(parsedData);
          } catch (err) {
            console.error('[WebSocket] Error parsing message:', err);
            setError(new Error('Failed to parse WebSocket message'));
          }
        };

        socket.onerror = (event) => {
          console.error('[WebSocket] Connection error:', event);
          setError(new Error('WebSocket connection error'));
          setConnectionInfo(prev => ({
            ...prev,
            state: 'error'
          }));
        };

        socket.onclose = (event) => {
          console.log(`[WebSocket] Connection closed (code: ${event.code})`);
          setIsConnected(false);
          setConnectionInfo(prev => ({
            ...prev,
            state: 'closed'
          }));
        };
      } catch (err) {
        console.error('[WebSocket] Failed to create connection:', err);
        setError(new Error(`Failed to create WebSocket connection: ${err}`));
        setConnectionInfo(prev => ({
          ...prev,
          state: 'failed'
        }));
      }
    };

    // Initial connection
    connectWebSocket();

    // Clean up the WebSocket connection on component unmount
    return () => {
      if (socketRef.current) {
        console.log('[WebSocket] Closing connection (component unmount)');
        socketRef.current.close();
      }
    };
  }, [path]);

  // Function to send messages to the server
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log('[WebSocket] Sending message:', message);
      socketRef.current.send(JSON.stringify(message));
    } else {
      const state = socketRef.current ? 
        ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][socketRef.current.readyState] : 
        'null';
      
      console.error(`[WebSocket] Cannot send message - socket state: ${state}`);
      setError(new Error(`WebSocket is not connected (state: ${state})`));
    }
  }, []);

  return { 
    isConnected, 
    data, 
    error, 
    sendMessage,
    connectionInfo
  };
}