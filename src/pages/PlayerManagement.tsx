import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLocalization } from "@/lib/LocalizationContext";
import { PlayerDialog } from "@/components/PlayerDialog";
import { PlayerManagement as PlayerManagementComponent } from "@/components/PlayerManagement";
import { TeamManagement } from "@/components/TeamManagement";
import { TeamDialog } from "@/components/TeamDialog";
import { useDialogContext } from "@/lib/DialogContext";

type Player = {
  id: string;
  name: string;
  nickname?: string;
  emoji: string;
  matches_played?: number;
};

type Team = {
  id: string;
  name: string;
  emoji: string;
  player1_id: string;
  player2_id: string;
  player1?: Player;
  player2?: Player;
  matches_played?: number;
};

export function PlayerManagementPage() {
  const { t } = useLocalization();
  const { isPlayerDialogOpen, setIsPlayerDialogOpen } = useDialogContext();
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Player state
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerNickname, setNewPlayerNickname] = useState("");
  const [newPlayerEmoji, setNewPlayerEmoji] = useState("👤");
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  // Team state
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamEmoji, setNewTeamEmoji] = useState("👥");
  const [selectedPlayer1, setSelectedPlayer1] = useState("");
  const [selectedPlayer2, setSelectedPlayer2] = useState("");
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      if (!isMounted) return;

      setIsLoading(true);
      try {
        // Fetch players first
        const playersResponse = await supabase.from("players").select("*");
        if (playersResponse.error) throw playersResponse.error;
        if (playersResponse.data && isMounted) {
          setPlayers(playersResponse.data);
        }

        // Then fetch teams with separate joins
        const teamsResponse = await supabase.from("teams").select("*");

        if (teamsResponse.error) throw teamsResponse.error;

        if (teamsResponse.data && isMounted) {
          // For each team, get the player data
          const teamsWithPlayers = await Promise.all(
            teamsResponse.data.map(async (team) => {
              // Find the player objects from our players array
              const player1 = playersResponse.data.find(
                (p) => p.id === team.player1_id
              );
              const player2 = playersResponse.data.find(
                (p) => p.id === team.player2_id
              );

              // Return the team with player data included
              return {
                ...team,
                player1,
                player2,
              };
            })
          );

          setTeams(teamsWithPlayers);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            'Please connect to Supabase using the "Connect to Supabase" button in the top right corner.'
          );
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
  }, []);

  async function fetchPlayers() {
    const { data, error } = await supabase.from("players").select("*");
    if (error) throw error;
    if (data) setPlayers(data);
  }

  async function fetchTeams() {
    try {
      // First get all teams
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("*");

      if (teamError) throw teamError;

      if (teamData) {
        // Get current players
        const { data: playerData } = await supabase.from("players").select("*");

        // Match players to teams
        const teamsWithPlayers = teamData.map((team) => {
          const player1 = playerData?.find((p) => p.id === team.player1_id);
          const player2 = playerData?.find((p) => p.id === team.player2_id);

          return {
            ...team,
            player1,
            player2,
          };
        });

        setTeams(teamsWithPlayers);
      }
    } catch (err) {
      console.error("Error fetching teams:", err);
    }
  }

  async function addPlayer(e: React.FormEvent) {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    try {
      const { error } = await supabase.from("players").insert([
        {
          name: newPlayerName.trim(),
          nickname: newPlayerNickname.trim() || null,
          emoji: newPlayerEmoji || "👤",
        },
      ]);

      if (error) throw error;
      setNewPlayerName("");
      setNewPlayerNickname("");
      setNewPlayerEmoji("👤");
      setIsPlayerDialogOpen(false);
      await fetchPlayers();
    } catch (err) {
      setError(t("common.error") + ": " + t("individual.add_player"));
    }
  }

  async function updatePlayer(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPlayer || !newPlayerName.trim()) return;

    try {
      const { error } = await supabase
        .from("players")
        .update({
          name: newPlayerName.trim(),
          nickname: newPlayerNickname.trim() || null,
          emoji: newPlayerEmoji || "👤",
        })
        .eq("id", editingPlayer.id);

      if (error) throw error;
      setNewPlayerName("");
      setNewPlayerNickname("");
      setNewPlayerEmoji("👤");
      setEditingPlayer(null);
      setIsPlayerDialogOpen(false);
      await Promise.all([fetchPlayers(), fetchTeams()]);
    } catch (err) {
      setError(t("common.error") + ": " + t("individual.edit_player"));
    }
  }

  async function deletePlayer(playerId: string) {
    try {
      const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", playerId);

      if (error) throw error;
      await Promise.all([fetchPlayers(), fetchTeams()]);
    } catch (err) {
      setError(
        t("common.error") + ": " + t("individual.confirm_delete_player")
      );
    }
  }

  async function addTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!newTeamName.trim() || !selectedPlayer1 || !selectedPlayer2) return;

    try {
      const { error } = await supabase.from("teams").insert([
        {
          name: newTeamName.trim(),
          emoji: newTeamEmoji || "👥",
          player1_id: selectedPlayer1,
          player2_id: selectedPlayer2,
        },
      ]);

      if (error) throw error;
      setNewTeamName("");
      setNewTeamEmoji("👥");
      setSelectedPlayer1("");
      setSelectedPlayer2("");
      setIsTeamDialogOpen(false);
      await fetchTeams();
    } catch (err) {
      setError(t("common.error") + ": " + t("team.add_team"));
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
      const { error } = await supabase
        .from("teams")
        .update({
          name: newTeamName.trim(),
          emoji: newTeamEmoji || "👥",
          player1_id: selectedPlayer1,
          player2_id: selectedPlayer2,
        })
        .eq("id", editingTeam.id);

      if (error) throw error;
      setNewTeamName("");
      setNewTeamEmoji("👥");
      setSelectedPlayer1("");
      setSelectedPlayer2("");
      setEditingTeam(null);
      setIsTeamDialogOpen(false);
      await fetchTeams();
    } catch (err) {
      setError(t("common.error") + ": " + t("team.edit_team"));
    }
  }

  async function deleteTeam(teamId: string) {
    try {
      const { error } = await supabase.from("teams").delete().eq("id", teamId);

      if (error) throw error;
      await fetchTeams();
    } catch (err) {
      setError(t("common.error") + ": " + t("team.confirm_delete_team"));
    }
  }

  function handleEditPlayer(player: Player) {
    setEditingPlayer(player);
    setNewPlayerName(player.name);
    setNewPlayerNickname(player.nickname || "");
    setNewPlayerEmoji(player.emoji);
    setIsPlayerDialogOpen(true);
  }

  function handleEditTeam(team: Team) {
    setEditingTeam(team);
    setNewTeamName(team.name);
    setNewTeamEmoji(team.emoji);
    setSelectedPlayer1(team.player1_id);
    setSelectedPlayer2(team.player2_id);
    setIsTeamDialogOpen(true);
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
