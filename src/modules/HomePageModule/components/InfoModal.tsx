import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchResultProps } from "../interface";
  
interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selected: SearchResultProps | null
}

export const InfoModal = ({ isOpen, onClose, selected }: InfoModalProps) => {
  if (!selected) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-slate-800 rounded-2xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {selected.label}
          </DialogTitle>
        </DialogHeader>

        <p className="text-slate-600 mb-4">{selected.description}</p>

        <div className="text-sm text-slate-500 space-y-1">
          <p>
            <span className="font-medium text-slate-700">Type:</span>{" "}
            {selected.type}
          </p>
          <p>
            <span className="font-medium text-slate-700">Born in:</span>{" "}
            {selected.born}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
