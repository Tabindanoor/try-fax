
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getCurrentUserSync, logoutUser } from '@/lib/authService';
import { getUnreadFaxCount } from '@/lib/faxService';
import { toast } from 'sonner';
import { User } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User as UserIcon, LogOut, Settings, Send, Inbox } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    // Use the synchronous version initially
    const currentUser = getCurrentUserSync();
    setUser(currentUser);
    
    // Then asynchronously refresh the data
    const refreshUser = async () => {
      try {
        const updatedUser = await getCurrentUserSync();
        if (updatedUser) {
          // Check for unread faxes
          const count = await getUnreadFaxCount(updatedUser.id);
          setUnreadCount(count);
        }
      } catch (error) {
        console.error('Error checking unread faxes:', error);
      }
    };
    
    refreshUser();
    
    // Set interval to check periodically
    const intervalId = setInterval(refreshUser, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [location.pathname]); // Re-check when route changes
  
  const handleLogout = () => {
    logoutUser();
    setUser(null);
    toast.info('You have been logged out');
    navigate('/home');
  };
  
  return (
    <header className="fixed w-full bg-white border-b border-gray-100 z-10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/home" className="flex items-center">
            <span className="text-xl font-bold text-primary">FaxO</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/home" className="text-sm font-medium">
              Home
            </Link>
            <Link to="/send-fax" className="text-sm font-medium">
              Send Fax
            </Link>
            <Link to="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            {user && (
              <Link to="/inbox" className="text-sm font-medium relative">
                Inbox
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-6 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Link>
            )}
            {user && (
              <Link to="/profile" className="text-sm font-medium">
                Profile
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-4">
                <NotificationCenter />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <span className="hidden md:inline-block mr-2">{user.name}</span>
                      <UserIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/send-fax')}>
                      <Send className="mr-2 h-4 w-4" />
                      <span>Send Fax</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/inbox')}>
                      <Inbox className="mr-2 h-4 w-4" />
                      <span>Inbox</span>
                      {unreadCount > 0 && (
                        <Badge variant="secondary" className="ml-auto">
                          {unreadCount}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="md:hidden flex items-center gap-2">
                <NotificationCenter />
                
                <button
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isMobileMenuOpen ? "hidden" : "block"}
                  >
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isMobileMenuOpen ? "block" : "hidden"}
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth">Log in</Link>
              </Button>
              <Button size="sm" className="hidden md:inline-flex" asChild>
                <Link to="/auth?tab=register">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
        <div className="border-t border-gray-100 py-4 px-6 space-y-4">
          <Link 
            to="/home" 
            className="block text-sm font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/send-fax" 
            className="block text-sm font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Send Fax
          </Link>
          <Link 
            to="/dashboard" 
            className="block text-sm font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          {user && (
            <>
              <Link 
                to="/inbox" 
                className="block text-sm font-medium flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Inbox
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </Link>
              <Link 
                to="/profile" 
                className="block text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
            </>
          )}
          {user && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-sm text-muted-foreground mb-2">
                Signed in as {user.email}
              </p>
              <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
                Log out
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
