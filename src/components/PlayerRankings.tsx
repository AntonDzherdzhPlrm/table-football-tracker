import { useLocalization } from "../lib/LocalizationContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PlayerStats = {
  id: string;
  name: string;
  nickname?: string;
  emoji: string;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
};

type PlayerRankingsProps = {
  playerStats: PlayerStats[];
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  availableMonths: Array<{ value: string; label: string }>;
};

export function PlayerRankings({
  playerStats,
  selectedMonth,
  setSelectedMonth,
  availableMonths,
}: PlayerRankingsProps) {
  const { t } = useLocalization();

  return (
    <div className="bg-white/95 backdrop-blur p-6 rounded-lg shadow-md border-t-4 border-orange-500">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t("individual.rankings")}</h2>
        {availableMonths.length > 1 && (
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="flex flex-col">
              <label
                htmlFor="month-filter"
                className="mb-1 text-sm text-gray-600"
              >
                {t("common.month_filter_label")}
              </label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger
                  id="month-filter"
                  className="w-full md:w-48 text-sm"
                >
                  <SelectValue placeholder={t("common.filter_by_month")} />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={4}
                  className="z-50"
                  align="start"
                  avoidCollisions={true}
                >
                  {availableMonths.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600">
                Pos
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600">
                {t("individual.player_name")}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600 hidden md:table-cell">
                {t("individual.player_nickname")}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600">
                {t("individual.stats.matches").charAt(0)}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600">
                {t("individual.stats.wins").charAt(0)}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600">
                {t("individual.stats.draws").charAt(0)}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600">
                {t("individual.stats.losses").charAt(0)}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600">
                {t("individual.stats.points").charAt(0)}
              </th>
            </tr>
          </thead>
          <tbody>
            {playerStats.map((stats, index) => (
              <tr
                key={stats.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-3 md:px-4">{index + 1}</td>
                <td className="py-3 px-3 md:px-4">
                  <span className="mr-2">{stats.emoji}</span>
                  {stats.name}
                </td>
                <td className="py-3 px-3 md:px-4 hidden md:table-cell">
                  {stats.nickname}
                </td>
                <td className="py-3 px-3 md:px-4">{stats.matches_played}</td>
                <td className="py-3 px-3 md:px-4">{stats.wins}</td>
                <td className="py-3 px-3 md:px-4">{stats.draws}</td>
                <td className="py-3 px-3 md:px-4">{stats.losses}</td>
                <td className="py-3 px-3 md:px-4">{stats.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
