
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FaxStatusUpdate } from '@/lib/types';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FaxStatusWidgetProps {
  faxId: string;
}

const FaxStatusWidget = ({ faxId }: FaxStatusWidgetProps) => {
  const [status, setStatus] = useState<FaxStatusUpdate | null>(null);
  
  useEffect(() => {
    // In a real app, this would subscribe to a webhook or use websockets
    // to get real-time updates from the fax service API
    const simulateStatusUpdates = () => {
      // Mock status progression for demo purposes
      const statuses: Array<Omit<FaxStatusUpdate, 'id' | 'faxId'>> = [
        { status: 'queued', timestamp: new Date().toISOString(), pagesSent: 0, totalPages: 3 },
        { status: 'processing', timestamp: new Date().toISOString(), pagesSent: 0, totalPages: 3 },
        { status: 'sending', timestamp: new Date().toISOString(), pagesSent: 1, totalPages: 3 },
        { status: 'sending', timestamp: new Date().toISOString(), pagesSent: 2, totalPages: 3 },
        { status: 'sending', timestamp: new Date().toISOString(), pagesSent: 3, totalPages: 3 },
        { status: 'delivered', timestamp: new Date().toISOString(), pagesSent: 3, totalPages: 3 }
      ];
      
      // Pick a random status (more likely to be delivered for demo)
      const randomIndex = Math.random() > 0.2 ? 
        statuses.length - 1 : // Delivered (80% chance)
        Math.floor(Math.random() * (statuses.length - 1)); // Other status (20% chance)
        
      // If we're showing an error, add an error message
      const statusUpdate = statuses[randomIndex];
      if (Math.random() > 0.9) { // 10% chance of error
        setStatus({
          id: `status-${Date.now()}`,
          faxId,
          status: 'error',
          timestamp: new Date().toISOString(),
          errorMessage: 'Line busy or no answer',
          pagesSent: Math.floor(Math.random() * statusUpdate.totalPages!),
          totalPages: statusUpdate.totalPages
        });
      } else {
        setStatus({
          id: `status-${Date.now()}`,
          faxId,
          ...statusUpdate
        });
      }
    };
    
    simulateStatusUpdates();
    
    // In a real app, set up a subscription/listener here
    return () => {
      // Clean up subscription in a real app
    };
  }, [faxId]);
  
  if (!status) {
    return null;
  }
  
  // Calculate progress percentage
  const progress = status.totalPages ? 
    Math.round((status.pagesSent || 0) / status.totalPages * 100) : 0;
    
  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // Status indicator
  const getStatusIndicator = () => {
    switch (status.status) {
      case 'queued':
      case 'processing':
      case 'sending':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'delivered':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Fax Status</CardTitle>
          <Badge 
            variant={
              status.status === 'delivered' ? 'success' :
              status.status === 'error' ? 'destructive' :
              'default'
            }
            className="flex items-center space-x-1"
          >
            {getStatusIndicator()}
            <span className="ml-1">
              {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
            </span>
          </Badge>
        </div>
        <CardDescription>
          Last updated: {formatTime(status.timestamp)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status.status === 'error' ? (
          <div className="bg-red-50 border border-red-100 rounded-md p-3 mb-3">
            <p className="text-sm text-red-800 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
              Error: {status.errorMessage}
            </p>
          </div>
        ) : null}
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Progress</span>
            <span>
              {status.pagesSent || 0} of {status.totalPages || 0} pages
            </span>
          </div>
          <Progress value={progress} />
        </div>
      </CardContent>
    </Card>
  );
};

export default FaxStatusWidget;
