import { Trophy, User } from "lucide-react";
import { useLocalization } from "../lib/LocalizationContext";

type ActionButtonsProps = {
  onNewMatch: () => void;
  onNewPlayer: () => void;
};

export function ActionButtons({ onNewMatch, onNewPlayer }: ActionButtonsProps) {
  const { t } = useLocalization();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <button
        onClick={onNewMatch}
        className="bg-white/95 backdrop-blur p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-white/100 border-t-4 border-orange-500 w-full text-center text-xl font-semibold flex items-center justify-center gap-3"
      >
        <Trophy className="h-6 w-6 text-orange-500" />
        {t("individual.record_match")}
      </button>

      <button
        onClick={onNewPlayer}
        className="bg-white/95 backdrop-blur p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-white/100 border-t-4 border-orange-500 w-full text-center text-xl font-semibold flex items-center justify-center gap-3"
      >
        <User className="h-6 w-6 text-orange-500" />
        {t("individual.add_player")}
      </button>
    </div>
  );
}
