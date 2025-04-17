
import Navbar from '@/components/Navbar';
import UserProfile from '@/components/UserProfile';
import { User } from 'lucide-react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <div className="container py-32">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3 flex items-center justify-center">
              <User className="mr-3 h-8 w-8" />
              Your Profile
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Manage your personal information, fax number, and notification preferences.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <UserProfile />
          </div>
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

export default Profile;
