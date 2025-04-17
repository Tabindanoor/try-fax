
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIAnalysis } from '@/lib/types';
import { Lightbulb, AlertCircle, UserCheck } from 'lucide-react';
import { analyzeDocument } from '@/lib/aiService';
import { toast } from 'sonner';

interface AIFaxAnalyzerProps {
  file: File | null;
  onAnalysisComplete?: (analysis: AIAnalysis) => void;
}

const AIFaxAnalyzer = ({ file, onAnalysisComplete }: AIFaxAnalyzerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please upload a document to analyze');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const result = await analyzeDocument(file);
      setAnalysis(result);
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
      toast.success('Document analysis complete');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze document');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              AI Document Analysis
            </CardTitle>
            <CardDescription>
              Let our AI analyze your document before sending
            </CardDescription>
          </div>
          <Button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !file}
            size="sm"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Document'}
          </Button>
        </div>
      </CardHeader>
      
      {analysis && (
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">Document Summary</h4>
            <p className="text-sm text-muted-foreground">{analysis.summaryText}</p>
          </div>
          
          {analysis.suggestedRecipients && analysis.suggestedRecipients.length > 0 && (
            <div>
              <div className="flex items-center mb-2">
                <UserCheck className="h-4 w-4 mr-1 text-primary" />
                <h4 className="font-medium">Suggested Recipients</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.suggestedRecipients.map((recipient, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {recipient}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {analysis.contentWarnings && analysis.contentWarnings.length > 0 && (
            <div>
              <div className="flex items-center mb-2">
                <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
                <h4 className="font-medium">Content Warnings</h4>
              </div>
              <ul className="text-sm text-muted-foreground list-disc pl-5">
                {analysis.contentWarnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      )}

      {!analysis && !isAnalyzing && (
        <CardFooter className="text-sm text-muted-foreground">
          AI analysis will scan your document for important information, suggest recipients, and identify potential issues.
        </CardFooter>
      )}
    </Card>
  );
};

export default AIFaxAnalyzer;
