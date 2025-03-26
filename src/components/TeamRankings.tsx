import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "./ConfirmDialog";

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
  onEditTeam: (team: { id: string; name: string; emoji: string }) => void;
  onDeleteTeam: (teamId: string) => void;
};

export function TeamRankings({
  teamStats,
  onEditTeam,
  onDeleteTeam,
}: TeamRankingsProps) {
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
    <div className="bg-white/90 backdrop-blur p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Team Rankings</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 md:px-4">Pos</th>
              <th className="text-left py-2 px-2 md:px-4">Team</th>
              <th className="text-left py-2 px-2 md:px-4">M</th>
              <th className="text-left py-2 px-2 md:px-4">W</th>
              <th className="text-left py-2 px-2 md:px-4">D</th>
              <th className="text-left py-2 px-2 md:px-4">L</th>
              <th className="text-left py-2 px-2 md:px-4">Pts</th>
              <th className="text-left py-2 px-2 md:px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamStats.map((stats, index) => (
              <tr key={stats.id} className="border-b">
                <td className="py-2 px-2 md:px-4">{index + 1}</td>
                <td className="py-2 px-2 md:px-4">
                  <span className="mr-2">{stats.emoji}</span>
                  {stats.name}
                </td>
                <td className="py-2 px-2 md:px-4">{stats.matches_played}</td>
                <td className="py-2 px-2 md:px-4">{stats.wins}</td>
                <td className="py-2 px-2 md:px-4">{stats.draws}</td>
                <td className="py-2 px-2 md:px-4">{stats.losses}</td>
                <td className="py-2 px-2 md:px-4">{stats.points}</td>
                <td className="py-2 px-2 md:px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        onEditTeam({
                          id: stats.id,
                          name: stats.name,
                          emoji: stats.emoji,
                        })
                      }
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    {stats.matches_played === 0 && (
                      <button
                        onClick={() => handleDeleteClick(stats)}
                        className="p-1 text-red-600 hover:text-red-800"
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
        title="Delete Team"
        description={`Are you sure you want to delete the team "${teamToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
