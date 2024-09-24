"use client";

import { cancelOrderAction } from "@/actions/store/order.action";
import { Button } from "@/components/ui/shadcn/button";
import { useToast } from "@/components/ui/shadcn/use-toast";
import { WarningTrigger } from "@/components/ui/warning-trigger";

interface CancelOrderButtonProps {
  orderId: string;
}

const CancelOrderButton = ({ orderId }: CancelOrderButtonProps) => {
  const { toast } = useToast();

  const handleClick = () => {
    cancelOrderAction(orderId).catch((error) => {
      toast({
        variant: "destructive",
        title: "Failed to cancel order",
      });
    });
  };

  return (
    <WarningTrigger
      title="Cancel order"
      description="Are you sure you want to cancel this order?"
      continueConfig={{
        onClick: handleClick,
      }}
    >
      <Button variant="outline" className="!h-fit">
        Cancel
      </Button>
    </WarningTrigger>
  );
};

export default CancelOrderButton;
