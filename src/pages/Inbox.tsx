
import Navbar from '@/components/Navbar';
import ReceivedFaxes from '@/components/ReceivedFaxes';
import NotificationsList from '@/components/NotificationsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Inbox as InboxIcon, Bell } from 'lucide-react';

const Inbox = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <div className="container py-32">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">Your Inbox</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Manage your received faxes and notifications in one place.
            </p>
          </div>
          
          <Tabs defaultValue="faxes">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
              <TabsTrigger value="faxes" className="flex items-center">
                <InboxIcon className="w-4 h-4 mr-2" />
                Received Faxes
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="faxes">
              <ReceivedFaxes />
            </TabsContent>
            
            <TabsContent value="notifications">
              <NotificationsList />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FaxO. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Inbox;
