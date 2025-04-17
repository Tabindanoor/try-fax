
import { cn } from '@/lib/utils';

type StatusBadgeProps = {
  status: 'pending' | 'sent' | 'failed';
  className?: string;
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    sent: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };
  
  const statusText = {
    pending: "Pending",
    sent: "Sent",
    failed: "Failed",
  };
  
  const statusAnimation = status === 'pending' ? 'animate-pulse-subtle' : '';
  
  return (
    <span className={cn(baseStyles, statusStyles[status], statusAnimation, className)}>
      {statusText[status]}
    </span>
  );
};

export default StatusBadge;
