import { Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { useLocalization } from "../lib/LocalizationContext";
import { ConfirmDialog } from "./ConfirmDialog";

type Player = {
  id: string;
  name: string;
  nickname?: string;
  emoji: string;
  matches_played?: number;
};

type PlayerManagementProps = {
  players: Player[];
  onEditPlayer: (player: {
    id: string;
    name: string;
    nickname?: string;
    emoji: string;
  }) => void;
  onDeletePlayer: (playerId: string) => void;
  onAddPlayer: () => void;
};

export function PlayerManagement({
  players,
  onEditPlayer,
  onDeletePlayer,
  onAddPlayer,
}: PlayerManagementProps) {
  const { t } = useLocalization();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);

  const handleDeleteClick = (player: Player) => {
    setPlayerToDelete(player);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (playerToDelete) {
      onDeletePlayer(playerToDelete.id);
    }
  };

  const handleRowClick = (player: Player) => {
    onEditPlayer({
      id: player.id,
      name: player.name,
      nickname: player.nickname,
      emoji: player.emoji,
    });
  };

  return (
    <div className="bg-white/95 backdrop-blur p-6 rounded-lg shadow-md border-t-4 border-orange-500">
      <div className="overflow-x-auto">
        <table className="w-full">
          <caption className="caption-top mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-700 text-left flex items-center">
                <span className="w-1.5 h-5 bg-orange-500 rounded-sm mr-2"></span>
                {t("management.players")}
              </h2>
              <button
                onClick={onAddPlayer}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-500 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {t("individual.add_player")}
              </button>
            </div>
          </caption>
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600">
                #
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600">
                {t("individual.player_name")}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600 hidden md:table-cell">
                {t("individual.player_nickname")}
              </th>
              <th className="text-left py-3 px-3 md:px-4 font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr
                key={player.id}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(player)}
              >
                <td className="py-3 px-3 md:px-4">{index + 1}</td>
                <td className="py-3 px-3 md:px-4">
                  <span className="mr-2">{player.emoji}</span>
                  {player.name}
                </td>
                <td className="py-3 px-3 md:px-4 hidden md:table-cell">
                  {player.nickname}
                </td>
                <td
                  className="py-3 px-3 md:px-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-2 justify-end">
                    {(!player.matches_played ||
                      player.matches_played === 0) && (
                      <button
                        onClick={() => handleDeleteClick(player)}
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
        description={t("individual.confirm_delete_player")}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
