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
      <DialogContent className="bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Team Match" : "Add New Team Match"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edit team match information below."
              : "Record a new team match by selecting teams and entering scores."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Match Date
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
                Team 1
              </label>
              <Select value={selectedTeam1} onValueChange={setSelectedTeam1}>
                <SelectTrigger ref={team1TriggerRef} className="w-full">
                  <SelectValue placeholder="Select Team 1" />
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
                placeholder="Score"
                className="w-full mt-2 px-3 py-2 border rounded-md text-sm sm:text-base"
                value={team1Score}
                onChange={(e) => setTeam1Score(e.target.value)}
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Team 2
              </label>
              <Select value={selectedTeam2} onValueChange={setSelectedTeam2}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Team 2" />
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
                placeholder="Score"
                className="w-full mt-2 px-3 py-2 border rounded-md text-sm sm:text-base"
                value={team2Score}
                onChange={(e) => setTeam2Score(e.target.value)}
                required
                min="0"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-500 text-sm sm:text-base"
          >
            {isEditing ? "Update Match" : "Record Match"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
