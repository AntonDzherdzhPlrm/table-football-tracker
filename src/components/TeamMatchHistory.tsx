import { Edit2, Trash2 } from "lucide-react";
import { useLocalization } from "../lib/LocalizationContext";
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

type TeamMatch = {
  id: string;
  team1_id: string;
  team2_id: string;
  team1_score: number;
  team2_score: number;
  played_at: string;
  team1?: Team;
  team2?: Team;
};

type TeamMatchHistoryProps = {
  matches: TeamMatch[];
  teams: Team[];
  filterTeam1: string;
  filterTeam2: string;
  setFilterTeam1: (value: string) => void;
  setFilterTeam2: (value: string) => void;
  onEditMatch: (match: TeamMatch) => void;
  onDeleteMatch: (matchId: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  availableMonths: Array<{ value: string; label: string }>;
};

export function TeamMatchHistory({
  matches,
  teams,
  filterTeam1,
  filterTeam2,
  setFilterTeam1,
  setFilterTeam2,
  onEditMatch,
  onDeleteMatch,
  selectedMonth,
  setSelectedMonth,
  availableMonths,
}: TeamMatchHistoryProps) {
  const { t, language } = useLocalization();

  return (
    <div className="bg-white/95 backdrop-blur p-6 rounded-lg shadow-md border-t-4 border-orange-500">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t("team.matches")}</h2>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0 w-full md:w-auto">
          <div className="flex flex-col">
            <label
              htmlFor="team-match-month-filter"
              className="mb-1 text-sm text-gray-600"
            >
              {t("common.month_filter_label")}
            </label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger
                id="team-match-month-filter"
                className="w-full text-sm"
              >
                <SelectValue placeholder={t("common.filter_by_month")} />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <label
              htmlFor="team1-filter"
              className="mb-1 text-sm text-gray-600"
            >
              {t("team.team1_filter_label")}
            </label>
            <Select value={filterTeam1} onValueChange={setFilterTeam1}>
              <SelectTrigger id="team1-filter" className="w-full text-sm">
                <SelectValue placeholder={t("team.filter_team1")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.emoji} {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <label
              htmlFor="team2-filter"
              className="mb-1 text-sm text-gray-600"
            >
              {t("team.team2_filter_label")}
            </label>
            <Select value={filterTeam2} onValueChange={setFilterTeam2}>
              <SelectTrigger id="team2-filter" className="w-full text-sm">
                <SelectValue placeholder={t("team.filter_team2")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.emoji} {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600">
                {t("team.match_date")}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600">
                {t("team.team1")}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600">
                {t("team.score")}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600">
                {t("team.team2")}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr
                key={match.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-3 md:px-4">
                  {new Date(match.played_at).toLocaleString(
                    language === "en"
                      ? "en-GB"
                      : language === "uk"
                      ? "uk-UA"
                      : "pl-PL",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }
                  )}
                </td>
                <td className="py-3 px-3 md:px-4">
                  <span className="mr-2">{match.team1?.emoji}</span>
                  {match.team1?.name}
                </td>
                <td className="py-3 px-3 md:px-4 font-semibold">
                  {match.team1_score} - {match.team2_score}
                </td>
                <td className="py-3 px-3 md:px-4">
                  <span className="mr-2">{match.team2?.emoji}</span>
                  {match.team2?.name}
                </td>
                <td className="py-3 px-3 md:px-4">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onEditMatch(match)}
                      className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
                      aria-label={t("common.edit")}
                      title={t("common.edit")}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteMatch(match.id)}
                      className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100"
                      aria-label={t("common.delete")}
                      title={t("common.delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
