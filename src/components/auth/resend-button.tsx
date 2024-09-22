import { verifyEmail } from "@/actions/auth/verifyEmail";
import { useCountDown } from "@/lib/hooks/useCountDown";
import { Button } from "../ui/shadcn/button";
import { useToast } from "../ui/shadcn/use-toast";

export default function ResendButton() {
	const { countDown, resetCountDown } = useCountDown(60);
	const { toast } = useToast();

	const resendHandler = async () => {
		const response = await verifyEmail(true);

		if (response.message === "success") {
			toast({
				title: "Verification code sent.",
				description: "Please check your email.",
			});
			resetCountDown();
		} else {
			toast({
				variant: "destructive",
				title: "Something went wrong.",
				description: response.message,
			});
		}
	};

	return (
		<Button disabled={!!countDown} type="button" variant="outline" onClick={resendHandler}>
			Resend{countDown ? ` (${countDown}s)` : ""}
		</Button>
	);
}
