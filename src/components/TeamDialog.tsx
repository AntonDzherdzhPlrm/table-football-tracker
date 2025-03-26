import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Player = {
  id: string;
  name: string;
  emoji: string;
  nickname?: string;
};

type TeamDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  players: Player[];
  teamName: string;
  teamEmoji: string;
  selectedPlayer1: string;
  selectedPlayer2: string;
  setTeamName: (value: string) => void;
  setTeamEmoji: (value: string) => void;
  setSelectedPlayer1: (value: string) => void;
  setSelectedPlayer2: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
};

const commonEmojis = [
  "👥",
  "👤",
  "😊",
  "😎",
  "🤓",
  "🎮",
  "⚽️",
  "🎯",
  "🎲",
  "🏆",
  "🌟",
  "🔥",
  "💪",
  "🦁",
  "🐯",
  "🦊",
  "🐼",
  "🎸",
  "🎤",
  "🎧",
  "🚀",
  "🎭",
  "🎨",
  "🎬",
  "🎼",
  "💡",
  "💥",
  "🚴",
  "🏋️",
  "🏄",
  "🏇",
  "🧗",
  "🏹",
  "🛹",
  "🥋",
  "🏀",
  "⚾",
  "🏈",
  "🥅",
  "🥊",
  "🎳",
  "🎻",
  "📚",
  "📝",
  "✏️",
  "🖋️",
  "💻",
  "📱",
  "🕹️",
  "🎱",
  "🏓",
];

export function TeamDialog({
  isOpen,
  onOpenChange,
  players,
  teamName,
  teamEmoji,
  selectedPlayer1,
  selectedPlayer2,
  setTeamName,
  setTeamEmoji,
  setSelectedPlayer1,
  setSelectedPlayer2,
  onSubmit,
  isEditing,
}: TeamDialogProps) {
  // Reference to the first input in the form for focus management
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Focus the first input when the dialog opens
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      // Short timeout to ensure the dialog is fully rendered
      const timeoutId = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Team" : "Create New Team"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edit team information below."
              : "Create a new team by selecting two players and a team name."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="team-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Team Name
            </label>
            <input
              id="team-name"
              ref={nameInputRef}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emoji
            </label>
            <div className="grid grid-cols-8 gap-2">
              {commonEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={`p-2 text-xl rounded-md ${
                    teamEmoji === emoji
                      ? "bg-orange-100 border-2 border-orange-500"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setTeamEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Players (2 required)
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedPlayer1}
              onChange={(e) => setSelectedPlayer1(e.target.value)}
              required
            >
              <option value="">Select Player 1</option>
              {players.map((player) => (
                <option
                  key={player.id}
                  value={player.id}
                  disabled={player.id === selectedPlayer2}
                >
                  {player.emoji} {player.name}
                </option>
              ))}
            </select>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedPlayer2}
              onChange={(e) => setSelectedPlayer2(e.target.value)}
              required
            >
              <option value="">Select Player 2</option>
              {players.map((player) => (
                <option
                  key={player.id}
                  value={player.id}
                  disabled={player.id === selectedPlayer1}
                >
                  {player.emoji} {player.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-500"
          >
            {isEditing ? "Update Team" : "Create Team"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
