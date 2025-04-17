import { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card';
import {
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import StatusBadge from './StatusBadge';
import { 
  formatPhoneNumber, 
  getReceivedFaxes, 
  markFaxAsRead, 
  deleteFax,
  simulateIncomingFax
} from '@/lib/faxService';
import { getCurrentUserSync } from '@/lib/authService';
import { Fax } from '@/lib/types';
import { toast } from 'sonner';
import { Search, FileText, AlertCircle, Download, Trash2, RefreshCw } from 'lucide-react';

const ReceivedFaxes = () => {
  const [faxes, setFaxes] = useState<Fax[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  
  const loadFaxes = async () => {
    try {
      setIsLoading(true);
      const data = await getReceivedFaxes();
      setFaxes(data);
    } catch (error) {
      console.error('Error loading received faxes:', error);
      toast.error('Failed to load received faxes.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadFaxes();
  }, []);
  
  const handleView = async (id: string) => {
    setActionInProgress(id);
    
    try {
      await markFaxAsRead(id);
      await loadFaxes();
      toast.success('Fax marked as read');
    } catch (error) {
      console.error('Error marking fax as read:', error);
      toast.error('Failed to mark fax as read');
    } finally {
      setActionInProgress(null);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fax?')) {
      return;
    }
    
    setActionInProgress(id);
    
    try {
      const success = await deleteFax(id);
      if (success) {
        toast.success('Fax deleted successfully.');
        await loadFaxes();
      } else {
        toast.error('Failed to delete fax.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete fax.');
    } finally {
      setActionInProgress(null);
    }
  };
  
  const handleSimulateIncomingFax = async () => {
    const currentUser = getCurrentUserSync();
    if (!currentUser) {
      toast.error('You must be logged in to receive faxes');
      return;
    }
    
    try {
      await simulateIncomingFax(currentUser.id);
      await loadFaxes();
    } catch (error) {
      console.error('Error simulating incoming fax:', error);
      toast.error('Failed to simulate incoming fax: ' + (error as Error).message);
    }
  };
  
  const filteredFaxes = faxes.filter(fax => {
    return (
      (fax.senderNumber && fax.senderNumber.includes(searchTerm)) || 
      (fax.fileName && fax.fileName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-xl">Received Faxes</CardTitle>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleSimulateIncomingFax}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Simulate New Fax
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by sender number or filename..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-pulse-subtle">Loading...</div>
          </div>
        ) : filteredFaxes.length === 0 ? (
          <div className="py-8 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              No received faxes found. {searchTerm ? 'Try a different search term.' : 'Your received faxes will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Pages</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFaxes.map((fax) => (
                  <TableRow 
                    key={fax.id}
                    className={!fax.read ? 'bg-muted/30' : ''}
                  >
                    <TableCell className="whitespace-nowrap">
                      {formatDate(fax.date)}
                      {!fax.read && (
                        <Badge variant="secondary" className="ml-2">New</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {fax.senderNumber && formatPhoneNumber(fax.senderNumber, fax.senderCountry || 'US')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="truncate max-w-[150px]">{fax.fileName || 'Document'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{fax.pages}</TableCell>
                    <TableCell>
                      <StatusBadge status="sent" />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {!fax.read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(fax.id)}
                            disabled={actionInProgress === fax.id}
                            className="h-8 px-2"
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(fax.id)}
                          disabled={actionInProgress === fax.id}
                          className="h-8 px-2 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReceivedFaxes;
