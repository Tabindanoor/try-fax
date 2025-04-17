
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AIAnalysis } from '@/lib/types';
import { 
  BrainCircuit, 
  AlertTriangle, 
  Lightbulb, 
  Users, 
  Lock, 
  MessageSquareText 
} from 'lucide-react';

interface FaxAIInsightsProps {
  analysis: AIAnalysis | null;
  isLoading: boolean;
}

const FaxAIInsights = ({ analysis, isLoading }: FaxAIInsightsProps) => {
  const [showAll, setShowAll] = useState(false);
  
  if (isLoading) {
    return (
      <Card className="bg-blue-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg">
            <BrainCircuit className="mr-2 h-5 w-5 text-blue-500" />
            AI Document Analysis
          </CardTitle>
          <CardDescription>
            Analyzing your document...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="animate-pulse text-blue-500">
              <BrainCircuit className="h-10 w-10 animate-pulse" />
              <p className="mt-2 text-sm">Processing document</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!analysis) {
    return null;
  }
  
  return (
    <Card className="bg-blue-50/50 border-blue-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <BrainCircuit className="mr-2 h-5 w-5 text-blue-500" />
          AI Document Analysis
        </CardTitle>
        <CardDescription>
          Insights from your document
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white p-4 rounded-md border">
          <h3 className="font-medium flex items-center mb-2">
            <MessageSquareText className="h-4 w-4 mr-2 text-blue-500" />
            Document Summary
          </h3>
          <p className="text-sm">{analysis.summaryText}</p>
        </div>
        
        {showAll && (
          <>
            {analysis.contentWarnings && analysis.contentWarnings.length > 0 && (
              <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
                <h3 className="font-medium flex items-center text-amber-800 mb-2">
                  <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                  Content Warnings
                </h3>
                <ul className="text-sm space-y-1 text-amber-700">
                  {analysis.contentWarnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {analysis.suggestedRecipients && analysis.suggestedRecipients.length > 0 && (
              <div className="bg-white p-4 rounded-md border">
                <h3 className="font-medium flex items-center mb-2">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  Suggested Recipients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.suggestedRecipients.map((recipient, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50">
                      {recipient}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {analysis.topicClassification && analysis.topicClassification.length > 0 && (
              <div className="bg-white p-4 rounded-md border">
                <h3 className="font-medium flex items-center mb-2">
                  <Lightbulb className="h-4 w-4 mr-2 text-blue-500" />
                  Document Classification
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.topicClassification.map((topic, index) => (
                    <Badge key={index} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {analysis.confidentialityLevel && (
              <div className="bg-white p-4 rounded-md border">
                <h3 className="font-medium flex items-center mb-2">
                  <Lock className="h-4 w-4 mr-2 text-blue-500" />
                  Confidentiality Level
                </h3>
                <Badge 
                  className={
                    analysis.confidentialityLevel === 'public' ? 'bg-green-100 text-green-800' :
                    analysis.confidentialityLevel === 'private' ? 'bg-blue-100 text-blue-800' :
                    analysis.confidentialityLevel === 'confidential' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }
                >
                  {analysis.confidentialityLevel.toUpperCase()}
                </Badge>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowAll(!showAll)}
          className="w-full"
        >
          {showAll ? 'Show Less' : 'Show More AI Insights'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FaxAIInsights;
