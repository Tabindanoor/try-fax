
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { countries, sendFax } from '@/lib/faxService';
import { getCurrentUser } from '@/lib/authService';
import { analyzeDocument } from '@/lib/aiService';
import { toast } from 'sonner';
import { Fax, AIAnalysis } from '@/lib/types';
import FaxAIInsights from './FaxAIInsights';
import { Upload, Send, X, FileText } from 'lucide-react';

const SendFaxForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [recipientNumber, setRecipientNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    // Get current user when component mounts
    const getUserData = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error getting user:", error);
        toast.error("Error getting user information");
      }
    };
    
    getUserData();
  }, []);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Reset AI analysis
      setAiAnalysis(null);
      
      // Analyze document with AI
      try {
        setIsAnalyzing(true);
        const analysis = await analyzeDocument(selectedFile);
        setAiAnalysis(analysis);
      } catch (error) {
        console.error('Error analyzing document:', error);
        toast.error('Failed to analyze document with AI');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };
  
  const handleClearFile = () => {
    setFile(null);
    setAiAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please upload a file to send');
      return;
    }
    
    if (!recipientNumber) {
      toast.error('Please enter a recipient number');
      return;
    }
    
    if (!currentUser) {
      toast.error('You must be logged in to send faxes');
      navigate('/auth');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const fax: Fax = await sendFax(recipientNumber, selectedCountry, file, currentUser.id);
      
      // Store AI analysis with the fax if available
      if (aiAnalysis) {
        // In a real implementation, we would update the fax with AI analysis in the database
        console.log('Fax sent with AI analysis:', { faxId: fax.id, analysis: aiAnalysis });
      }
      
      toast.success('Fax sent successfully!', {
        description: 'Your fax has been queued for sending.'
      });
      
      // Reset form
      setRecipientNumber('');
      setSelectedCountry('US');
      setFile(null);
      setAiAnalysis(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Navigate to dashboard with new fax ID
      navigate('/dashboard', { state: { newFaxId: fax.id } });
    } catch (error) {
      console.error('Error sending fax:', error);
      toast.error('Failed to send fax');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fileSize = file ? (file.size / 1024 / 1024).toFixed(2) : '0';
  
  return (
    <div className="grid md:grid-cols-5 gap-6">
      <Card className="md:col-span-3">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Send a Fax</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="country">Recipient Country</Label>
              <Select 
                value={selectedCountry} 
                onValueChange={setSelectedCountry}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name} ({country.dialCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recipientNumber">Fax Number</Label>
              <Input
                id="recipientNumber"
                placeholder="Enter fax number"
                value={recipientNumber}
                onChange={(e) => setRecipientNumber(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file">Upload Document</Label>
              <div className="border-2 border-dashed rounded-md p-6 bg-muted/30 text-center">
                {file ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <FileText className="h-6 w-6 text-primary" />
                      <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {fileSize} MB • {file.type || 'document'}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearFile}
                      className="mt-2"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Drop your file here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports PDF, DOCX, JPG, PNG (max 10MB)
                    </p>
                  </div>
                )}
                <input
                  id="file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.jpg,.jpeg,.png"
                  ref={fileInputRef}
                  disabled={isLoading}
                />
                {!file && (
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Browse Files
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !file || !recipientNumber}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                  Sending...
                </span>
              ) : (
                <span className="flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Send Fax
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <div className="md:col-span-2">
        <FaxAIInsights 
          analysis={aiAnalysis}
          isLoading={isAnalyzing}
        />
      </div>
    </div>
  );
};

export default SendFaxForm;
