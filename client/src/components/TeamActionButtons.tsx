import { Trophy, Users } from "lucide-react";
import { useLocalization } from "../lib/LocalizationContext";

type TeamActionButtonsProps = {
  onNewMatch: () => void;
  onNewTeam: () => void;
};

export function TeamActionButtons({
  onNewMatch,
  onNewTeam,
}: TeamActionButtonsProps) {
  const { t } = useLocalization();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <button
        onClick={onNewMatch}
        className="bg-white/95 backdrop-blur p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-white/100 border-t-4 border-orange-500 w-full text-center text-xl font-semibold flex items-center justify-center gap-3"
      >
        <Trophy className="h-6 w-6 text-orange-500" />
        {t("team.record_match")}
      </button>

      <button
        onClick={onNewTeam}
        className="bg-white/95 backdrop-blur p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-white/100 border-t-4 border-orange-500 w-full text-center text-xl font-semibold flex items-center justify-center gap-3"
      >
        <Users className="h-6 w-6 text-orange-500" />
        {t("team.add_team")}
      </button>
    </div>
  );
}
