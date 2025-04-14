import { useState, useEffect } from "react";
import { useLocalization } from "@/lib/LocalizationContext";
import { API } from "@/lib/api-client";
import { Player, ExtendedTeam } from "@/lib/types";
import { PlayerDialog } from "@/components/PlayerDialog";
import { PlayerManagement as PlayerManagementComponent } from "@/components/PlayerManagement";
import { TeamManagement } from "@/components/TeamManagement";
import { TeamDialog } from "@/components/TeamDialog";
import { useDialogContext } from "@/lib/DialogContext";

// Use local extended types to include the extended properties needed in this component
type ExtendedPlayer = Player & {
  matches_played?: number;
};

export function PlayerManagementPage() {
  const { t } = useLocalization();
  const { isPlayerDialogOpen, setIsPlayerDialogOpen } = useDialogContext();
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [players, setPlayers] = useState<ExtendedPlayer[]>([]);
  const [teams, setTeams] = useState<ExtendedTeam[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Player state
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerNickname, setNewPlayerNickname] = useState("");
  const [newPlayerEmoji, setNewPlayerEmoji] = useState("👤");
  const [editingPlayer, setEditingPlayer] = useState<ExtendedPlayer | null>(
    null
  );

  // Team state
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamEmoji, setNewTeamEmoji] = useState("👥");
  const [selectedPlayer1, setSelectedPlayer1] = useState("");
  const [selectedPlayer2, setSelectedPlayer2] = useState("");
  const [editingTeam, setEditingTeam] = useState<ExtendedTeam | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      if (!isMounted) return;

      setIsLoading(true);
      try {
        // First get players
        const playersResponse = await API.players.getAll();

        // Then get teams
        const teamsResponse = await API.teams.getAll();

        if (isMounted) {
          // Set players
          setPlayers(playersResponse || []);

          // Map teams with player data
          const teamsWithPlayers = teamsResponse.map((team) => {
            return {
              ...team,
              player1_id: team.player1_id || "",
              player2_id: team.player2_id || "",
            };
          });

          setTeams(teamsWithPlayers);
        }
      } catch (err) {
        console.error("Error in initialization:", err);
        if (isMounted) {
          setError(t("common.error") + ": " + t("common.loading"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, [t]);

  async function fetchPlayers() {
    try {
      const data = await API.players.getAll();
      setPlayers(data);
    } catch (error) {
      console.error("Error fetching players:", error);
      setError(t("common.error") + ": " + t("common.loading"));
    }
  }

  async function fetchTeams() {
    try {
      setIsLoading(true);

      // Get players
      const playersData = await API.players.getAll();
      setPlayers(playersData || []);

      // Get teams
      const teamsData = await API.teams.getAll();

      // Map teams with proper player IDs
      const teamsWithPlayers = teamsData.map((team) => {
        return {
          ...team,
          player1_id: team.player1_id || "",
          player2_id: team.player2_id || "",
        };
      }) as ExtendedTeam[];

      setTeams(teamsWithPlayers);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function addPlayer(e: React.FormEvent) {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    try {
      await API.players.create({
        name: newPlayerName.trim(),
        nickname: newPlayerNickname.trim() || undefined,
        emoji: newPlayerEmoji || "👤",
      });

      setNewPlayerName("");
      setNewPlayerNickname("");
      setNewPlayerEmoji("👤");
      setIsPlayerDialogOpen(false);
      await fetchPlayers();
    } catch (error) {
      console.error("Error adding player:", error);
      setError(t("common.error") + ": " + t("individual.add_player"));
    }
  }

  async function updatePlayer(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPlayer || !newPlayerName.trim()) return;

    try {
      await API.players.update(editingPlayer.id, {
        name: newPlayerName.trim(),
        nickname: newPlayerNickname.trim() || undefined,
        emoji: newPlayerEmoji || "👤",
      });

      setNewPlayerName("");
      setNewPlayerNickname("");
      setNewPlayerEmoji("👤");
      setEditingPlayer(null);
      setIsPlayerDialogOpen(false);
      await Promise.all([fetchPlayers(), fetchTeams()]);
    } catch (error) {
      console.error("Error updating player:", error);
      setError(t("common.error") + ": " + t("individual.edit_player"));
    }
  }

  async function deletePlayer(playerId: string) {
    try {
      await API.players.delete(playerId);
      await Promise.all([fetchPlayers(), fetchTeams()]);
    } catch (err) {
      setError(
        t("common.error") + ": " + t("management.confirm_delete_player")
      );
    }
  }

  async function addTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!newTeamName.trim() || !selectedPlayer1 || !selectedPlayer2) return;

    try {
      await API.teams.create({
        name: newTeamName.trim(),
        emoji: newTeamEmoji || "👥",
        players: [selectedPlayer1, selectedPlayer2],
      });

      setNewTeamName("");
      setNewTeamEmoji("👥");
      setSelectedPlayer1("");
      setSelectedPlayer2("");
      setIsTeamDialogOpen(false);
      await fetchTeams();
    } catch (err) {
      setError(t("common.error") + ": " + t("management.add_team"));
    }
  }

  async function updateTeam(e: React.FormEvent) {
    e.preventDefault();
    if (
      !editingTeam ||
      !newTeamName.trim() ||
      !selectedPlayer1 ||
      !selectedPlayer2
    )
      return;

    try {
      await API.teams.update(editingTeam.id, {
        name: newTeamName.trim(),
        emoji: newTeamEmoji || "👥",
        players: [selectedPlayer1, selectedPlayer2],
      });

      setNewTeamName("");
      setNewTeamEmoji("👥");
      setSelectedPlayer1("");
      setSelectedPlayer2("");
      setEditingTeam(null);
      setIsTeamDialogOpen(false);
      await fetchTeams();
    } catch (err) {
      setError(t("common.error") + ": " + t("management.edit_team"));
    }
  }

  async function deleteTeam(teamId: string) {
    try {
      await API.teams.delete(teamId);
      await fetchTeams();
    } catch (err) {
      setError(t("common.error") + ": " + t("management.confirm_delete_team"));
    }
  }

  function handleEditPlayer(player: ExtendedPlayer) {
    setEditingPlayer(player);
    setNewPlayerName(player.name);
    setNewPlayerNickname(player.nickname || "");
    setNewPlayerEmoji(player.emoji);
    setIsPlayerDialogOpen(true);
  }

  async function handleEditTeam(team: ExtendedTeam) {
    try {
      // Set basic team info immediately
      setEditingTeam(team);
      setNewTeamName(team.name);
      setNewTeamEmoji(team.emoji);

      // Ensure we have the latest player IDs
      const response = await API.teams.getById(team.id);

      // Set the player IDs from response
      if (response) {
        setSelectedPlayer1(response.player1_id || "");
        setSelectedPlayer2(response.player2_id || "");
      } else {
        // Fallback to original team data
        setSelectedPlayer1(team.player1_id || "");
        setSelectedPlayer2(team.player2_id || "");
      }

      // Finally open the dialog
      setIsTeamDialogOpen(true);
    } catch (error) {
      console.error("Error loading team data for editing:", error);
      setError(t("common.error") + ": " + t("management.edit_team_load"));
    }
  }

  if (error) {
    return (
      <div className="bg-management-football w-full flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border-t-4 border-red-500">
          <h2 className="text-red-600 text-xl font-bold mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {t("common.error")}
          </h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-management-football w-full flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-lg shadow-md flex items-center space-x-4 border-l-4 border-orange-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="text-lg">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ minHeight: "calc(100vh - 128px)" }}>
      <main>
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
          <div className="flex items-center mb-6">
            <div className="bg-orange-600 rounded-lg p-3 text-white mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-100">
              {t("management.title")}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <PlayerManagementComponent
                players={players}
                onEditPlayer={handleEditPlayer}
                onDeletePlayer={deletePlayer}
                onAddPlayer={() => {
                  setEditingPlayer(null);
                  setNewPlayerName("");
                  setNewPlayerNickname("");
                  setNewPlayerEmoji("👤");
                  setIsPlayerDialogOpen(true);
                }}
              />
            </div>

            <div>
              <TeamManagement
                teams={teams}
                onEditTeam={handleEditTeam}
                onDeleteTeam={deleteTeam}
                onAddTeam={() => {
                  setEditingTeam(null);
                  setNewTeamName("");
                  setNewTeamEmoji("👥");
                  setSelectedPlayer1("");
                  setSelectedPlayer2("");
                  setIsTeamDialogOpen(true);
                }}
              />
            </div>
          </div>

          <PlayerDialog
            isOpen={isPlayerDialogOpen}
            onOpenChange={setIsPlayerDialogOpen}
            playerName={newPlayerName}
            setPlayerName={setNewPlayerName}
            playerNickname={newPlayerNickname}
            setPlayerNickname={setNewPlayerNickname}
            playerEmoji={newPlayerEmoji}
            setPlayerEmoji={setNewPlayerEmoji}
            onSubmit={editingPlayer ? updatePlayer : addPlayer}
            isEditing={!!editingPlayer}
          />

          <TeamDialog
            isOpen={isTeamDialogOpen}
            onOpenChange={setIsTeamDialogOpen}
            teamName={newTeamName}
            setTeamName={setNewTeamName}
            teamEmoji={newTeamEmoji}
            setTeamEmoji={setNewTeamEmoji}
            players={players}
            selectedPlayer1={selectedPlayer1}
            selectedPlayer2={selectedPlayer2}
            setSelectedPlayer1={setSelectedPlayer1}
            setSelectedPlayer2={setSelectedPlayer2}
            onSubmit={editingTeam ? updateTeam : addTeam}
            isEditing={!!editingTeam}
          />
        </div>
      </main>
    </div>
  );
}
