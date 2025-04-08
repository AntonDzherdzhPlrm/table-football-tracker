import { useState } from "react";
import { useLocalization } from "@/lib/LocalizationContext";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { ExtendedTeam } from "@/lib/types";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type TeamManagementProps = {
  teams: ExtendedTeam[];
  onEditTeam: (team: ExtendedTeam) => void;
  onDeleteTeam: (teamId: string) => void;
  onAddTeam: () => void;
};

export function TeamManagement({
  teams,
  onEditTeam,
  onDeleteTeam,
  onAddTeam,
}: TeamManagementProps) {
  const { t } = useLocalization();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<ExtendedTeam | null>(null);

  const handleDeleteClick = (team: ExtendedTeam) => {
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
      <div className="overflow-x-auto">
        <table className="w-full">
          <caption className="caption-top mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-700 text-left flex items-center">
                <span className="w-1.5 h-5 bg-orange-500 rounded-sm mr-2"></span>
                {t("management.teams")}
              </h2>
              <button
                onClick={onAddTeam}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-500 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {t("team.add_team")}
              </button>
            </div>
          </caption>
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600">
                #
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600">
                {t("team.team_name")}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600 hidden md:table-cell">
                {t("team.player1")}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600 hidden md:table-cell">
                {t("team.player2")}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr
                key={team.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-3 md:px-4">{index + 1}</td>
                <td className="py-3 px-3 md:px-4">
                  <span className="mr-2">{team.emoji}</span>
                  {team.name}
                </td>
                <td className="py-3 px-3 md:px-4 hidden md:table-cell">
                  {team.player1?.name}
                </td>
                <td className="py-3 px-3 md:px-4 hidden md:table-cell">
                  {team.player2?.name}
                </td>
                <td className="py-3 px-3 md:px-4">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onEditTeam(team)}
                      className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
                      aria-label={t("common.edit")}
                      title={t("common.edit")}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    {(!team.matches_played || team.matches_played === 0) && (
                      <button
                        onClick={() => handleDeleteClick(team)}
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
