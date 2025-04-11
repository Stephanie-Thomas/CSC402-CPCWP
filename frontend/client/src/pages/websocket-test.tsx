import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wifi, WifiOff, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function WebSocketTest() {
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  
  const { isConnected, data, error, sendMessage } = useWebSocket();
  
  const addLog = (text: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${text}`]);
  };
  
  // Add log when connection status changes
  useEffect(() => {
    addLog(`WebSocket ${isConnected ? 'connected' : 'disconnected'}`);
  }, [isConnected]);
  
  // Add log when data is received
  useEffect(() => {
    if (data) {
      addLog(`Received data: ${JSON.stringify(data)}`);
    }
  }, [data]);
  
  // Add log when error occurs
  useEffect(() => {
    if (error) {
      addLog(`Error: ${error.message}`);
    }
  }, [error]);
  
  const handleSendMessage = () => {
    if (message.trim()) {
      try {
        const jsonMsg = JSON.parse(message);
        sendMessage(jsonMsg);
        addLog(`Sent: ${message}`);
        setMessage('');
      } catch (err) {
        addLog(`Invalid JSON: ${err}`);
      }
    }
  };
  
  const handleRequestLeaderboards = () => {
    sendMessage({ type: 'get_leaderboards' });
    addLog('Sent request for leaderboards');
  };
  
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">WebSocket Test Page</h1>
      
      <div className="mb-4 flex items-center gap-2">
        <Badge 
          variant={isConnected ? "default" : "destructive"}
          className="py-1 px-2 flex items-center gap-1"
        >
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4" /> Connected
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" /> Disconnected
            </>
          )}
        </Badge>
        
        <span className="text-sm">
          Status: {isConnected ? 'WebSocket connected' : 'Not connected'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Send Message</CardTitle>
            <CardDescription>Send a JSON message to the WebSocket server</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='{"type": "custom_message", "data": {"hello": "world"}}'
              />
              <Button
                onClick={handleSendMessage}
                disabled={!isConnected}
                className="shrink-0"
              >
                <Send className="h-4 w-4 mr-1" /> Send
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleRequestLeaderboards}
                disabled={!isConnected}
                variant="outline"
                className="w-full"
              >
                Request Leaderboards
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Received Data</CardTitle>
            <CardDescription>Last data received from server</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-50 p-2 rounded border overflow-x-auto max-h-[150px] overflow-y-auto">
              {data ? JSON.stringify(data, null, 2) : 'No data received yet'}
            </pre>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>WebSocket connection activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-2 rounded border h-[300px] overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-400 text-center p-4">No activity yet</div>
            ) : (
              <ul className="text-xs space-y-1">
                {logs.map((log, index) => (
                  <li key={index} className="font-mono">
                    {log}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}