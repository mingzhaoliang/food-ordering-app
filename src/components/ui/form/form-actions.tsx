import { Loader2 } from "lucide-react";
import { Button } from "../shadcn/button";
import { WarningTrigger } from "../warning-trigger";

interface FormActionsProps {
  pending: boolean;
  submitText?: string;
  onCancelConfirm: () => void;
}

const FormActions = ({ pending, submitText = "Submit", onCancelConfirm }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-3">
      <WarningTrigger
        title="Are you absolutely sure?"
        description="You have unsaved changes. This will discard all the changes you have made."
        continueConfig={{ onClick: onCancelConfirm }}
      >
        <Button type="button" disabled={pending} variant="outline">
          Cancel
        </Button>
      </WarningTrigger>
      <Button disabled={pending} variant="default-active">
        {pending && <Loader2 className="size-icon-1 animate-spin mr-1" />}
        {submitText}
      </Button>
    </div>
  );
};

export default FormActions;
