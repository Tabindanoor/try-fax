
import { Check, Globe, Clock, Shield } from 'lucide-react';

const Features = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="mb-4">Send Faxes With Confidence</h2>
          <p className="text-muted-foreground text-lg">
            Our platform provides a seamless, reliable way to send faxes internationally
            with real-time status tracking and secure document handling.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Globe className="h-10 w-10 text-primary" />}
            title="Global Coverage"
            description="Send faxes to over 100 countries worldwide, including the UK, US, Europe, and Asia with local number support."
          />
          
          <FeatureCard 
            icon={<Clock className="h-10 w-10 text-primary" />}
            title="Real-time Tracking"
            description="Monitor the status of your faxes in real-time. Know exactly when your documents are delivered or if there's an issue."
          />
          
          <FeatureCard 
            icon={<Shield className="h-10 w-10 text-primary" />}
            title="Secure Transmission"
            description="Your documents are encrypted during transmission and we never store the content of your faxes after delivery."
          />
        </div>
        
        <div className="mt-20">
          <div className="bg-secondary/50 rounded-xl p-8 md:p-10 relative overflow-hidden">
            <div className="max-w-3xl">
              <h3 className="text-2xl font-semibold mb-6">
                Why Choose FaxO for International Faxing?
              </h3>
              
              <div className="space-y-4">
                <Feature text="No hardware or phone lines required - just your browser" />
                <Feature text="Send to international numbers including UK with local rate pricing" />
                <Feature text="Track delivery status with detailed notifications" />
                <Feature text="Advanced document scanning and processing" />
                <Feature text="Secure, encrypted transmission for confidential materials" />
                <Feature text="PDF, Word, JPG, PNG, and other formats supported" />
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -right-10 -bottom-20 w-72 h-72 bg-primary/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

// Feature with checkmark
const Feature = ({ text }: { text: string }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 mt-1">
      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
        <Check className="w-3 h-3 text-primary" />
      </div>
    </div>
    <p className="ml-3 text-foreground">{text}</p>
  </div>
);

// Feature card component
const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => (
  <div className="bg-white border border-border/50 rounded-xl p-8 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 hover-lift">
    <div className="mb-5">{icon}</div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Features;
