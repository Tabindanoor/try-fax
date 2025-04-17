
import { useState, useEffect } from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import { getUserNotifications } from '@/lib/faxService';
import { getCurrentUserSync } from '@/lib/authService';
import { EmailNotification } from '@/lib/types';
import { toast } from 'sonner';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<EmailNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const loadNotifications = async () => {
    const currentUser = getCurrentUserSync();
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const userNotifications = await getUserNotifications(currentUser.id);
      setNotifications(userNotifications);
      
      // For this mock implementation, we'll just count recent notifications (last 24 hours) as unread
      const oneDayAgo = new Date(Date.now() - 86400000).toISOString();
      const count = userNotifications.filter(n => n.sentDate > oneDayAgo).length;
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadNotifications();
    
    // Set up a refresh timer every minute
    const intervalId = setInterval(loadNotifications, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Handle notification open
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setUnreadCount(0); // Mark all as read when opened
    }
  };
  
  // Format the notification timestamp
  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    // Less than a minute
    if (diffMs < 60000) {
      return 'Just now';
    }
    
    // Less than an hour
    if (diffMs < 3600000) {
      const minutes = Math.floor(diffMs / 60000);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    if (diffMs < 86400000) {
      const hours = Math.floor(diffMs / 3600000);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Less than a week
    if (diffMs < 604800000) {
      const days = Math.floor(diffMs / 86400000);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    
    // Default to date format
    return date.toLocaleDateString();
  };
  
  // Get notification icon and details based on type
  const getNotificationDetails = (notification: EmailNotification) => {
    switch (notification.type) {
      case 'sent':
        return {
          icon: '📤',
          title: 'Fax Sent',
          description: 'Your fax was successfully delivered.'
        };
      case 'received':
        return {
          icon: '📥',
          title: 'Fax Received',
          description: 'You received a new fax.'
        };
      case 'failed':
        return {
          icon: '⚠️',
          title: 'Fax Failed',
          description: 'There was a problem sending your fax.'
        };
      default:
        return {
          icon: '📄',
          title: 'Notification',
          description: 'You have a new notification.'
        };
    }
  };
  
  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Notifications</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7" 
            onClick={loadNotifications}
          >
            Refresh
          </Button>
        </div>
        <Separator className="my-2" />
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-pulse-subtle">Loading...</div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-1">
              {notifications.slice().reverse().map((notification) => {
                const details = getNotificationDetails(notification);
                const isRecent = new Date(notification.sentDate) > new Date(Date.now() - 86400000);
                
                return (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-md ${isRecent ? 'bg-muted/30' : ''} hover:bg-muted cursor-pointer`}
                    onClick={() => toast.info(`Viewing details for notification ${notification.id}`)}
                  >
                    <div className="flex gap-3">
                      <div className="text-xl">{details.icon}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">{details.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatNotificationTime(notification.sentDate)}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {details.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
