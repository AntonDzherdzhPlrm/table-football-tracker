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

type Team = {
  id: string;
  name: string;
  emoji: string;
};

type TeamMatchDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teams: Team[];
  selectedTeam1: string;
  selectedTeam2: string;
  team1Score: string;
  team2Score: string;
  matchDate: string;
  setSelectedTeam1: (value: string) => void;
  setSelectedTeam2: (value: string) => void;
  setTeam1Score: (value: string) => void;
  setTeam2Score: (value: string) => void;
  setMatchDate: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
};

export function TeamMatchDialog({
  isOpen,
  onOpenChange,
  teams,
  selectedTeam1,
  selectedTeam2,
  team1Score,
  team2Score,
  matchDate,
  setSelectedTeam1,
  setSelectedTeam2,
  setTeam1Score,
  setTeam2Score,
  setMatchDate,
  onSubmit,
  isEditing,
}: TeamMatchDialogProps) {
  const { t } = useLocalization();
  // Reference to the first select trigger button in the form for focus management
  const team1TriggerRef = useRef<HTMLButtonElement>(null);

  // Focus the first select when the dialog opens
  useEffect(() => {
    if (isOpen && team1TriggerRef.current) {
      // Short timeout to ensure the dialog is fully rendered
      const timeoutId = setTimeout(() => {
        team1TriggerRef.current?.focus();
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-h-[90vh] overflow-y-auto border-t-4 border-orange-500">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-800">
            {isEditing ? t("team.edit_match") : t("team.add_match")}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isEditing
              ? t("team.dialog.edit_description")
              : t("team.dialog.add_description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("team.match_date")}
            </label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("team.team1")}
              </label>
              <Select value={selectedTeam1} onValueChange={setSelectedTeam1}>
                <SelectTrigger ref={team1TriggerRef} className="w-full">
                  <SelectValue placeholder={t("team.team1")} />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem
                      key={team.id}
                      value={team.id}
                      disabled={team.id === selectedTeam2}
                    >
                      {team.emoji} {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="number"
                placeholder={t("team.score")}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                value={team1Score}
                onChange={(e) => setTeam1Score(e.target.value)}
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("team.team2")}
              </label>
              <Select value={selectedTeam2} onValueChange={setSelectedTeam2}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("team.team2")} />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem
                      key={team.id}
                      value={team.id}
                      disabled={team.id === selectedTeam1}
                    >
                      {team.emoji} {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="number"
                placeholder={t("team.score")}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                value={team2Score}
                onChange={(e) => setTeam2Score(e.target.value)}
                required
                min="0"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-500 transition-colors text-sm sm:text-base"
          >
            {isEditing ? t("common.update") : t("common.add")}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
