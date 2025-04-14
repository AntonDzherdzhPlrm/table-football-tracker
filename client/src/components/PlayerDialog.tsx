import { useEffect, useRef, useState } from "react";
import { useLocalization } from "../lib/LocalizationContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { emojiCategories, allEmojis } from "../lib/utils";
import { CategoryButtons } from "@/components/ui/category-buttons";

type PlayerDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  playerName: string;
  playerNickname: string;
  playerEmoji: string;
  setPlayerName: (value: string) => void;
  setPlayerNickname: (value: string) => void;
  setPlayerEmoji: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
};

export function PlayerDialog({
  isOpen,
  onOpenChange,
  playerName = "",
  playerNickname = "",
  playerEmoji = "👤",
  setPlayerName,
  setPlayerNickname,
  setPlayerEmoji,
  onSubmit,
  isEditing = false,
}: PlayerDialogProps) {
  const { t } = useLocalization();
  const [selectedCategory, setSelectedCategory] = useState("sports");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const initialFocusRef = useRef(false);

  const displayedEmojis =
    selectedCategory === "all"
      ? allEmojis
      : emojiCategories[selectedCategory as keyof typeof emojiCategories] || [];

  useEffect(() => {
    if (isOpen && nameInputRef.current && !initialFocusRef.current) {
      const timeoutId = setTimeout(() => {
        nameInputRef.current?.focus();
        initialFocusRef.current = true;
      }, 50);

      return () => {
        clearTimeout(timeoutId);
        if (!isOpen) {
          initialFocusRef.current = false;
        }
      };
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-h-[90vh] overflow-y-auto border-t-4 border-orange-500 z-[1000]">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-800">
            {isEditing
              ? t("individual.edit_player")
              : t("individual.add_player")}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isEditing
              ? t("individual.player_dialog.edit_description")
              : t("individual.player_dialog.add_description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("individual.player_name")}
            </label>
            <input
              type="text"
              id="name"
              ref={nameInputRef}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("individual.player_nickname")}
            </label>
            <input
              type="text"
              id="nickname"
              value={playerNickname}
              onChange={(e) => setPlayerNickname(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("common.emoji")}</label>

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
                    playerEmoji === emoji
                      ? "bg-orange-100 border-2 border-orange-500"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setPlayerEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-500"
          >
            {isEditing ? t("common.update") : t("common.add")}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
