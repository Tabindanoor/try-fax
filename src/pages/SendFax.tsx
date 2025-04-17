
import Navbar from '@/components/Navbar';
import SendFaxForm from '@/components/SendFaxForm';

const SendFax = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <div className="container py-32">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h1 className="text-3xl font-bold mb-3">Send a Fax</h1>
            <p className="text-muted-foreground">
              Send your document to any fax machine worldwide. Just upload your file, 
              enter the recipient's number, and hit send.
            </p>
          </div>
          
          <SendFaxForm />
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

export default SendFax;
