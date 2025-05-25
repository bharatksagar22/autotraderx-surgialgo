import { useEffect, useRef, useState, useCallback } from 'react';
import io from 'socket.io-client';

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8000';

const useWebSocket = (path, onMessageCallback) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const onMessageCallbackRef = useRef(onMessageCallback);

  useEffect(() => {
    onMessageCallbackRef.current = onMessageCallback;
  }, [onMessageCallback]);

  useEffect(() => {
    const token = localStorage.getItem('smartTraderToken');

    // Ensure path starts with a slash if it's not empty
    const fullPath = path && path.startsWith('/') ? path : `/${path || ''}`;
    
    const socketUrl = `${WEBSOCKET_URL}${fullPath.endsWith('/') && fullPath.length > 1 ? fullPath.slice(0,-1) : fullPath}`;
    
    socketRef.current = io(socketUrl, {
      transports: ['websocket'],
      auth: token ? { token } : undefined, // Only send auth if token exists
      reconnectionAttempts: 5, // Number of reconnection attempts
      reconnectionDelay: 3000, // Delay between reconnection attempts (ms)
    });

    const currentSocket = socketRef.current;

    currentSocket.on('connect', () => {
      console.log(`WebSocket connected to ${socketUrl}`);
      setIsConnected(true);
    });

    currentSocket.on('disconnect', (reason) => {
      console.log(`WebSocket disconnected from ${socketUrl}: ${reason}`);
      setIsConnected(false);
      // if (reason === 'io server disconnect') {
      //   // the disconnection was initiated by the server, you need to reconnect manually
      //   currentSocket.connect();
      // }
      // else the socket will automatically try to reconnect
    });

    currentSocket.on('connect_error', (error) => {
      console.error(`WebSocket connection error on ${socketUrl}:`, error.message);
      setIsConnected(false);
    });
    
    // Using a generic 'message' event as per previous setup.
    // If your backend emits specific events (e.g., 'new_signal', 'strategy_update'),
    // you should listen to those specific events instead or in addition.
    const messageListener = (data) => {
      if (onMessageCallbackRef.current) {
        onMessageCallbackRef.current(data);
      }
    };
    currentSocket.on('message', messageListener); 
    // Example for a specific event:
    // currentSocket.on('new_signal', messageListener);


    return () => {
      if (currentSocket) {
        currentSocket.off('connect');
        currentSocket.off('disconnect');
        currentSocket.off('connect_error');
        currentSocket.off('message', messageListener);
        // currentSocket.off('new_signal', messageListener); // if specific event was used
        currentSocket.disconnect();
      }
    };
  }, [path]); // Removed onMessageCallbackRef from dependencies as it's stable via useRef

  const sendMessage = useCallback((event, data) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('WebSocket not connected. Message not sent:', { event, data });
    }
  }, []);

  return { isConnected, sendMessage };
};

export default useWebSocket;