
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-30 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(66, 153, 225, 0.1) 0%, rgba(66, 153, 225, 0) 25%)',
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-block animate-fade-in">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              Fast, Secure, International Fax Service
            </span>
          </div>
          
          <h1 className="font-bold leading-tight mb-6 animate-slide-up">
            Send Faxes Globally <br/>
            <span className="text-primary">Without the Machine</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl animate-slide-up" style={{ animationDelay: '100ms' }}>
            Send faxes to any country, including the UK, directly from your browser. 
            No hardware required, just upload and send with real-time tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Button asChild size="lg" className="px-8">
              <Link to="/send-fax">
                Start Sending <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/dashboard">
                View Dashboard
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Preview image */}
        <div 
          className="mt-20 max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden animate-fade-in"
          style={{ animationDelay: '400ms' }}
        >
          <div className="relative pt-6 pb-3 px-6 border-b border-slate-100">
            <div className="absolute left-6 top-6 flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="text-center text-sm text-muted-foreground">
              faxo.app
            </div>
          </div>
          <div className="aspect-[16/9] bg-slate-50 p-6 flex items-center justify-center">
            <div className="text-muted-foreground/50 font-medium">
              Application Preview
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom wave separator */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-white" />
    </section>
  );
};

export default Hero;
