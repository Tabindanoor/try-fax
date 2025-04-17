
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatusBadge from './StatusBadge';
import { formatPhoneNumber, getFaxes, deleteFax, retryFax } from '@/lib/faxService';
import { Fax } from '@/lib/types';
import { Search, FileText, AlertCircle, RefreshCw, Trash2, Filter } from 'lucide-react';
import { toast } from 'sonner';

const FaxTracker = () => {
  const location = useLocation();
  const [faxes, setFaxes] = useState<Fax[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedFaxId, setHighlightedFaxId] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Load faxes
  const loadFaxes = async () => {
    try {
      setIsLoading(true);
      const data = await getFaxes();
      setFaxes(data);
    } catch (error) {
      console.error('Error loading faxes:', error);
      toast.error('Failed to load faxes.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadFaxes();
  }, []);
  
  // Highlight newly sent fax
  useEffect(() => {
    if (location.state?.newFaxId) {
      setHighlightedFaxId(location.state.newFaxId);
      
      // Clear the highlight after 5 seconds
      const timer = setTimeout(() => {
        setHighlightedFaxId(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);
  
  // Handle retry fax
  const handleRetry = async (id: string) => {
    setActionInProgress(id);
    
    try {
      await retryFax(id);
      toast.success('Fax queued for retry.');
      await loadFaxes();
    } catch (error) {
      console.error('Retry error:', error);
      toast.error('Failed to retry fax.');
    } finally {
      setActionInProgress(null);
    }
  };
  
  // Handle delete fax
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
  
  // Filter faxes based on search term and status filter
  const filteredFaxes = faxes.filter(fax => {
    // Status filter
    if (statusFilter !== 'all' && fax.status !== statusFilter) {
      return false;
    }
    
    // Search term
    return (
      fax.recipientNumber.includes(searchTerm) || 
      (fax.fileName && fax.fileName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  // Count faxes by status
  const statusCounts = {
    sent: faxes.filter(fax => fax.status === 'sent').length,
    pending: faxes.filter(fax => fax.status === 'pending').length,
    failed: faxes.filter(fax => fax.status === 'failed').length,
  };
  
  // Format date for display
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
    <div className="space-y-6">
      {/* Fax status summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard 
          title="Sent"
          count={statusCounts.sent}
          status="sent"
          onClick={() => setStatusFilter(statusFilter === 'sent' ? 'all' : 'sent')}
          isActive={statusFilter === 'sent'}
        />
        <StatusCard 
          title="Pending"
          count={statusCounts.pending}
          status="pending"
          onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
          isActive={statusFilter === 'pending'}
        />
        <StatusCard 
          title="Failed"
          count={statusCounts.failed}
          status="failed"
          onClick={() => setStatusFilter(statusFilter === 'failed' ? 'all' : 'failed')}
          isActive={statusFilter === 'failed'}
        />
      </div>
      
      {/* Search and fax list */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-xl">Fax History</CardTitle>
          {statusFilter !== 'all' && (
            <Badge 
              variant="secondary" 
              className="flex items-center cursor-pointer" 
              onClick={() => setStatusFilter('all')}
            >
              <Filter className="h-3 w-3 mr-1" /> 
              Filtered: {statusFilter}
              <span className="ml-1">×</span>
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by number or filename..."
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
                No faxes found. {searchTerm ? 'Try a different search term.' : 'Start by sending a new fax!'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Recipient</TableHead>
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
                      className={fax.id === highlightedFaxId ? 'bg-primary/5 transition-colors' : ''}
                    >
                      <TableCell className="whitespace-nowrap">
                        {formatDate(fax.date)}
                      </TableCell>
                      <TableCell>
                        {formatPhoneNumber(fax.recipientNumber, fax.recipientCountry)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="truncate max-w-[150px]">{fax.fileName || 'Document'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{fax.pages}</TableCell>
                      <TableCell>
                        <StatusBadge status={fax.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {fax.status === 'failed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRetry(fax.id)}
                              disabled={actionInProgress === fax.id}
                              className="h-8 px-2"
                            >
                              <RefreshCw className={`h-4 w-4 ${actionInProgress === fax.id ? 'animate-spin' : ''}`} />
                              <span className="sr-only">Retry</span>
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
    </div>
  );
};

// Status card component
const StatusCard = ({ 
  title, 
  count, 
  status,
  onClick,
  isActive
}: { 
  title: string; 
  count: number; 
  status: 'sent' | 'pending' | 'failed';
  onClick: () => void;
  isActive: boolean;
}) => {
  const statusStyles = {
    sent: "bg-green-50 text-green-800 border-green-200",
    pending: "bg-yellow-50 text-yellow-800 border-yellow-200",
    failed: "bg-red-50 text-red-800 border-red-200",
  };
  
  const icons = {
    sent: <div className="w-3 h-3 rounded-full bg-green-400" />,
    pending: <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse-subtle" />,
    failed: <div className="w-3 h-3 rounded-full bg-red-400" />,
  };
  
  return (
    <Card 
      className={`border ${statusStyles[status]} ${isActive ? 'ring-2 ring-primary ring-offset-2' : ''} cursor-pointer transition-all`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          {icons[status]}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{count}</div>
        <p className="text-sm mt-1">
          {status === 'sent' ? 'Successfully delivered' : 
           status === 'pending' ? 'Awaiting completion' : 
           'Delivery failed'}
        </p>
      </CardContent>
    </Card>
  );
};

export default FaxTracker;
