import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-screen h-screen flex-col-center gap-2 bg-stone-50">
      <Loader2 className="w-10 h-10 animate-spin" />
      <p className="body-1">Loading...</p>
    </div>
  );
}
