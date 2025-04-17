
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getUserNotifications } from '@/lib/faxService';
import { getCurrentUserSync } from '@/lib/authService';
import { EmailNotification } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck, AlertCircle, Send } from 'lucide-react';

const NotificationsList = () => {
  const [notifications, setNotifications] = useState<EmailNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      const currentUser = getCurrentUserSync();
      if (!currentUser) return;
      
      try {
        setIsLoading(true);
        const data = await getUserNotifications(currentUser.id);
        setNotifications(data);
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNotifications();
  }, []);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  // Get icon based on notification type
  const getNotificationIcon = (type: 'sent' | 'received' | 'failed') => {
    switch (type) {
      case 'sent':
        return <CheckCheck className="h-4 w-4 text-green-500" />;
      case 'received':
        return <Bell className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Send className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get notification message based on type
  const getNotificationMessage = (notification: EmailNotification) => {
    switch (notification.type) {
      case 'sent':
        return 'Your fax was successfully delivered';
      case 'received':
        return 'You received a new fax';
      case 'failed':
        return 'Your fax failed to send';
      default:
        return 'Fax status update';
    }
  };
  
  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-pulse-subtle">Loading notifications...</div>
      </div>
    );
  }
  
  if (notifications.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No notifications yet.</p>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className="flex items-start p-3 border rounded-md bg-background"
            >
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-3">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-grow">
                <p className="font-medium">{getNotificationMessage(notification)}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(notification.sentDate)}
                </p>
              </div>
              <Badge 
                variant={
                  notification.type === 'sent' ? 'success' : 
                  notification.type === 'received' ? 'default' : 
                  'destructive'
                }
              >
                {notification.type}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsList;
