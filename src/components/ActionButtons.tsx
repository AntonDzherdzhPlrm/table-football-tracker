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
        className="bg-white/90 backdrop-blur p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow w-full text-center text-xl font-semibold flex items-center justify-center gap-2"
      >
        <Trophy className="h-5 w-5 text-orange-500" />
        {t("individual.record_match")}
      </button>

      <button
        onClick={onNewPlayer}
        className="bg-white/90 backdrop-blur p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow w-full text-center text-xl font-semibold flex items-center justify-center gap-2"
      >
        <User className="h-5 w-5 text-orange-500" />
        {t("individual.add_player")}
      </button>
    </div>
  );
}
