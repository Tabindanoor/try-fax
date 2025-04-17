
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  getUserFaxNumber, 
  requestFaxNumber, 
  formatPhoneNumber, 
  countries
} from '@/lib/faxService';
import { 
  getCurrentUserSync, 
  updateNotificationPreferences,
  updateUserProfile
} from '@/lib/authService';
import { FaxNumberAssignment, NotificationPreferences, User } from '@/lib/types';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Phone, 
  User as UserIcon, 
  Mail, 
  Bell, 
  MessageSquare, 
  Globe
} from 'lucide-react';

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [faxNumber, setFaxNumber] = useState<FaxNumberAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRequestingNumber, setIsRequestingNumber] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    smsNotifications: false,
    instantNotifications: true
  });
  
  // Load user data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const currentUser = getCurrentUserSync();
      
      if (currentUser) {
        setUser(currentUser);
        setName(currentUser.name);
        setEmail(currentUser.email);
        
        if (currentUser.notificationPreferences) {
          setNotificationPreferences(currentUser.notificationPreferences);
        }
        
        try {
          const userFaxNumber = await getUserFaxNumber(currentUser.id);
          if (userFaxNumber) {
            setFaxNumber(userFaxNumber);
            setSelectedCountry(userFaxNumber.countryCode);
          }
        } catch (error) {
          console.error('Error loading fax number:', error);
        }
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);
  
  // Handle saving profile changes
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const updatedUser = await updateUserProfile(user.id, { name, email });
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile: ' + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle saving notification preferences
  const handleSaveNotifications = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const updatedUser = await updateNotificationPreferences(user.id, notificationPreferences);
      setUser(updatedUser);
      toast.success('Notification preferences updated');
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast.error('Failed to update notification preferences');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle requesting a new fax number
  const handleRequestFaxNumber = async () => {
    if (!user) return;
    
    setIsRequestingNumber(true);
    
    try {
      const newFaxNumber = await requestFaxNumber(user.id, selectedCountry);
      setFaxNumber(newFaxNumber);
      toast.success(`New fax number assigned: ${formatPhoneNumber(newFaxNumber.faxNumber, newFaxNumber.countryCode)}`);
    } catch (error) {
      console.error('Error requesting fax number:', error);
      toast.error('Failed to request fax number');
    } finally {
      setIsRequestingNumber(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-pulse-subtle">Loading user profile...</div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <UserIcon className="mr-2 h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSaveProfile} 
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Phone className="mr-2 h-5 w-5" />
            Fax Number
          </CardTitle>
          <CardDescription>Manage your fax number for receiving faxes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {faxNumber ? (
            <div className="space-y-2">
              <Label>Your Current Fax Number</Label>
              <div className="border rounded-md p-4 bg-muted/30">
                <p className="text-lg font-medium">
                  {formatPhoneNumber(faxNumber.faxNumber, faxNumber.countryCode)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Assigned on {new Date(faxNumber.assignmentDate).toLocaleDateString()}
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Need a number in another country? You can request a new one below:
              </p>
            </div>
          ) : (
            <div className="border rounded-md p-4 bg-yellow-50 border-yellow-100">
              <p className="text-sm text-yellow-800">
                You don't have a fax number assigned yet. Request one to start receiving faxes.
              </p>
            </div>
          )}
          
          <div className="space-y-2 pt-4">
            <Label>Request a New Fax Number</Label>
            <div className="flex space-x-2">
              <Select 
                value={selectedCountry} 
                onValueChange={setSelectedCountry}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleRequestFaxNumber} 
                disabled={isRequestingNumber}
                className="flex-1"
              >
                {isRequestingNumber ? 'Requesting...' : 'Request Number'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Control how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch 
              id="email-notifications" 
              checked={notificationPreferences.emailNotifications}
              onCheckedChange={(checked) => setNotificationPreferences({
                ...notificationPreferences,
                emailNotifications: checked
              })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via text message
              </p>
            </div>
            <Switch 
              id="sms-notifications" 
              checked={notificationPreferences.smsNotifications}
              onCheckedChange={(checked) => setNotificationPreferences({
                ...notificationPreferences,
                smsNotifications: checked
              })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="instant-notifications">In-App Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive instant notifications in the app
              </p>
            </div>
            <Switch 
              id="instant-notifications" 
              checked={notificationPreferences.instantNotifications}
              onCheckedChange={(checked) => setNotificationPreferences({
                ...notificationPreferences,
                instantNotifications: checked
              })}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSaveNotifications} 
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserProfile;
