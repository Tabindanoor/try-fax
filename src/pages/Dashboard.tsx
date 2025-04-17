
import Navbar from '@/components/Navbar';
import FaxTracker from '@/components/FaxTracker';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <div className="container py-32">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">Fax Dashboard</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Track and manage all your faxes in one place. Monitor delivery status
              and view your complete fax history.
            </p>
          </div>
          
          <FaxTracker />
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

export default Dashboard;
