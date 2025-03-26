import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type PlayerDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  playerName: string;
  setPlayerName: (value: string) => void;
  playerNickname: string;
  setPlayerNickname: (value: string) => void;
  playerEmoji: string;
  setPlayerEmoji: (value: string) => void;
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

export function PlayerDialog({
  isOpen,
  onOpenChange,
  playerName,
  setPlayerName,
  playerNickname,
  setPlayerNickname,
  playerEmoji,
  setPlayerEmoji,
  onSubmit,
  isEditing,
}: PlayerDialogProps) {
  // Reference to the first input in the form for focus management
  const nameInputRef = useRef<HTMLInputElement>(null);
  const initialFocusRef = useRef(false);

  // Focus the first input when the dialog opens
  useEffect(() => {
    if (isOpen && nameInputRef.current && !initialFocusRef.current) {
      // Short timeout to ensure the dialog is fully rendered
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Player" : "Add New Player"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edit player information below."
              : "Fill out the form to add a new player."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="player-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Player Name
            </label>
            <input
              id="player-name"
              ref={nameInputRef}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nickname (optional)
            </label>
            <input
              type="text"
              placeholder="Nickname"
              className="w-full px-3 py-2 border rounded-md"
              value={playerNickname}
              onChange={(e) => setPlayerNickname(e.target.value)}
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
            {isEditing ? "Update Player" : "Add Player"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
