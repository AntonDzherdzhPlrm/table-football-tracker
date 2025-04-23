import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalization } from "../lib/LocalizationContext";

type Player = {
  id: string;
  name: string;
  emoji: string;
  nickname?: string;
};

type MatchDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  players: Player[];
  selectedPlayer1: string;
  selectedPlayer2: string;
  player1Score: string;
  player2Score: string;
  matchDate: string;
  setSelectedPlayer1: (value: string) => void;
  setSelectedPlayer2: (value: string) => void;
  setPlayer1Score: (value: string) => void;
  setPlayer2Score: (value: string) => void;
  setMatchDate: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
};

export function MatchDialog({
  isOpen,
  onOpenChange,
  players,
  selectedPlayer1,
  selectedPlayer2,
  player1Score,
  player2Score,
  matchDate,
  setSelectedPlayer1,
  setSelectedPlayer2,
  setPlayer1Score,
  setPlayer2Score,
  setMatchDate,
  onSubmit,
  isEditing,
}: MatchDialogProps) {
  const { t } = useLocalization();
  // Reference to the first select trigger button in the form for focus management
  const player1TriggerRef = useRef<HTMLButtonElement>(null);

  // Focus the first select when the dialog opens
  useEffect(() => {
    if (isOpen && player1TriggerRef.current) {
      // Short timeout to ensure the dialog is fully rendered
      const timeoutId = setTimeout(() => {
        player1TriggerRef.current?.focus();
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-h-[90vh] overflow-y-auto z-[1000]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("individual.edit_match") : t("individual.add_match")}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t("individual.dialog.edit_description")
              : t("individual.dialog.add_description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("individual.match_date")}
            </label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border rounded-md text-sm sm:text-base"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("individual.player1")}
              </label>
              <Select
                value={selectedPlayer1}
                onValueChange={setSelectedPlayer1}
              >
                <SelectTrigger ref={player1TriggerRef} className="w-full">
                  <SelectValue placeholder={`${t("individual.player1")}`} />
                </SelectTrigger>
                <SelectContent>
                  {players.map((player) => (
                    <SelectItem
                      key={player.id}
                      value={player.id}
                      disabled={player.id === selectedPlayer2}
                    >
                      {player.emoji} {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="number"
                placeholder={t("individual.score")}
                className="w-full mt-2 px-3 py-2 border rounded-md text-sm sm:text-base"
                value={player1Score}
                onChange={(e) => setPlayer1Score(e.target.value)}
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("individual.player2")}
              </label>
              <Select
                value={selectedPlayer2}
                onValueChange={setSelectedPlayer2}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`${t("individual.player2")}`} />
                </SelectTrigger>
                <SelectContent>
                  {players.map((player) => (
                    <SelectItem
                      key={player.id}
                      value={player.id}
                      disabled={player.id === selectedPlayer1}
                    >
                      {player.emoji} {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="number"
                placeholder={t("individual.score")}
                className="w-full mt-2 px-3 py-2 border rounded-md text-sm sm:text-base"
                value={player2Score}
                onChange={(e) => setPlayer2Score(e.target.value)}
                required
                min="0"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 text-sm sm:text-base"
          >
            {isEditing ? t("common.update") : t("common.add")}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
