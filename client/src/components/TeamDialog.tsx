import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLocalization } from "../lib/LocalizationContext";
import { emojiCategories, allEmojis } from "../lib/utils";
import { CategoryButtons } from "@/components/ui/category-buttons";

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
  // State for emoji category filter
  const [selectedCategory, setSelectedCategory] = useState("sports");

  // Calculate which emojis to display based on the selected category
  const displayedEmojis =
    selectedCategory === "all"
      ? allEmojis
      : emojiCategories[selectedCategory as keyof typeof emojiCategories] || [];

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
      <DialogContent className="bg-white max-h-[90vh] overflow-y-auto border-t-4 border-orange-500 z-[1000]">
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

            {/* Category buttons */}
            <CategoryButtons
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            {/* Emoji grid */}
            <div className="grid grid-cols-8 gap-2">
              {displayedEmojis.map((emoji) => (
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

            <div className="relative">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                value={selectedPlayer1}
                onChange={(e) => {
                  setSelectedPlayer1(e.target.value);
                }}
                required
              >
                <option value="" disabled>
                  {t("team.player1")}
                </option>
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
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="h-2"></div>

            <div className="relative">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                value={selectedPlayer2}
                onChange={(e) => {
                  setSelectedPlayer2(e.target.value);
                }}
                required
              >
                <option value="" disabled>
                  {t("team.player2")}
                </option>
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
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
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
