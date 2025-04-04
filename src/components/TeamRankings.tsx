import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useLocalization } from "../lib/LocalizationContext";
import { ConfirmDialog } from "./ConfirmDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TeamStats = {
  id: string;
  name: string;
  emoji: string;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
};

type TeamRankingsProps = {
  teamStats: TeamStats[];
  onDeleteTeam: (teamId: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  availableMonths: Array<{ value: string; label: string }>;
};

export function TeamRankings({
  teamStats,
  onDeleteTeam,
  selectedMonth,
  setSelectedMonth,
  availableMonths,
}: TeamRankingsProps) {
  const { t } = useLocalization();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<TeamStats | null>(null);

  const handleDeleteClick = (team: TeamStats) => {
    setTeamToDelete(team);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (teamToDelete) {
      onDeleteTeam(teamToDelete.id);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur p-6 rounded-lg shadow-md border-t-4 border-orange-500">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t("team.rankings")}</h2>
        {availableMonths.length > 1 && (
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="flex flex-col">
              <label
                htmlFor="team-month-filter"
                className="mb-1 text-sm text-gray-600"
              >
                {t("common.month_filter_label")}
              </label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger
                  id="team-month-filter"
                  className="w-full md:w-48 text-sm"
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
                {t("team.team_name")}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600">
                {t("team.stats.matches").charAt(0)}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600">
                {t("team.stats.wins").charAt(0)}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600">
                {t("team.stats.draws").charAt(0)}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600">
                {t("team.stats.losses").charAt(0)}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600">
                {t("team.stats.points").charAt(0)}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {teamStats.map((stats, index) => (
              <tr
                key={stats.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-3 md:px-4">{index + 1}</td>
                <td className="py-3 px-3 md:px-4">
                  <span className="mr-2">{stats.emoji}</span>
                  {stats.name}
                </td>
                <td className="py-3 px-3 md:px-4">{stats.matches_played}</td>
                <td className="py-3 px-3 md:px-4">{stats.wins}</td>
                <td className="py-3 px-3 md:px-4">{stats.draws}</td>
                <td className="py-3 px-3 md:px-4">{stats.losses}</td>
                <td className="py-3 px-3 md:px-4">{stats.points}</td>
                <td className="py-3 px-3 md:px-4">
                  <div className="flex gap-2 justify-end">
                    {stats.matches_played === 0 && (
                      <button
                        onClick={() => handleDeleteClick(stats)}
                        className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100"
                        aria-label={t("common.delete")}
                        title={t("common.delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={t("common.confirmation")}
        description={t("team.confirm_delete_team")}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
