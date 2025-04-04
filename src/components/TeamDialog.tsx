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
  const { t } = useLocalization();
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
      <DialogContent className="bg-white max-h-[90vh] overflow-y-auto border-t-4 border-orange-500">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-800">
            {isEditing ? t("team.edit_team") : t("team.add_team")}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isEditing
              ? t("team.team_dialog.edit_description")
              : t("team.team_dialog.add_description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="team-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("team.team_name")}
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
              {t("team.team_emoji")}
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
              {t("team.select_players")}
            </label>
            <Select value={selectedPlayer1} onValueChange={setSelectedPlayer1}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("team.player1")} />
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
            <div className="h-2"></div>
            <Select value={selectedPlayer2} onValueChange={setSelectedPlayer2}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("team.player2")} />
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
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-500 transition-colors"
          >
            {isEditing ? t("common.update") : t("common.add")}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
