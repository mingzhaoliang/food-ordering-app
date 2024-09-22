import { Eye, EyeOff } from "lucide-react";

export default function VisibilityIcon({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  return visible ? (
    <EyeOff size={20} className="text-fade" onClick={onClick} />
  ) : (
    <Eye size={20} className="text-fade" onClick={onClick} />
  );
}
