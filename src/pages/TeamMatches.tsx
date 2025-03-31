import { useState, useEffect } from "react";
import { useLocalization } from "@/lib/LocalizationContext";
import { TeamDialog } from "@/components/TeamDialog";
import { TeamMatchDialog } from "@/components/TeamMatchDialog";
import { TeamRankings } from "@/components/TeamRankings";
import { TeamMatchHistory } from "@/components/TeamMatchHistory";
import { TeamActionButtons } from "@/components/TeamActionButtons";
import { useDialogContext } from "@/lib/DialogContext";

type Player = {
  id: string;
  name: string;
  nickname?: string;
  emoji: string;
};

type Team = {
  id: string;
  name: string;
  emoji: string;
};

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

export function TeamMatches() {
  const { t } = useLocalization();
  const { isTeamDialogOpen, setIsTeamDialogOpen } = useDialogContext();
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [teamMatches, setTeamMatches] = useState<TeamMatch[]>([]);

  const [teamName, setTeamName] = useState("");
  const [teamEmoji, setTeamEmoji] = useState("👥");
  const [selectedPlayer1, setSelectedPlayer1] = useState("");
  const [selectedPlayer2, setSelectedPlayer2] = useState("");

  const [selectedTeam1, setSelectedTeam1] = useState("");
  const [selectedTeam2, setSelectedTeam2] = useState("");
  const [team1Score, setTeam1Score] = useState("");
  const [team2Score, setTeam2Score] = useState("");
  const [matchDate, setMatchDate] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<TeamMatch | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [filterTeam1, setFilterTeam1] = useState("all");
  const [filterTeam2, setFilterTeam2] = useState("all");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function definitions
  async function fetchPlayers() {
    try {
      const response = await fetch("/api/players");
      if (!response.ok) throw new Error("Failed to fetch players");
      const data = await response.json();
      setPlayers(data);
      return data;
    } catch (err) {
      console.error("Error fetching players:", err);
      throw err;
    }
  }

  async function fetchTeams() {
    try {
      const response = await fetch("/api/teams");
      if (!response.ok) throw new Error("Failed to fetch teams");
      const data = await response.json();
      setTeams(data);
      return data;
    } catch (err) {
      console.error("Error fetching teams:", err);
      throw err;
    }
  }

  async function fetchTeamStats() {
    try {
      const response = await fetch("/api/team-stats");
      if (!response.ok) throw new Error("Failed to fetch team stats");
      const data = await response.json();
      setTeamStats(data);
      return data;
    } catch (err) {
      console.error("Error fetching team stats:", err);
      throw err;
    }
  }

  async function fetchTeamMatches() {
    try {
      let url = "/api/team-matches";
      const params = new URLSearchParams();

      if (filterTeam1 && filterTeam1 !== "all") {
        params.append("team1", filterTeam1);
      }
      if (filterTeam2 && filterTeam2 !== "all") {
        params.append("team2", filterTeam2);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch team matches");
      const data = await response.json();
      setTeamMatches(data);
      return data;
    } catch (err) {
      console.error("Error fetching team matches:", err);
      throw err;
    }
  }

  // Initial data loading
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchPlayers(),
          fetchTeams(),
          fetchTeamMatches(),
          fetchTeamStats(),
        ]);
      } catch (err) {
        setError("Failed to fetch data. Please ensure the server is running.");
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Handle filters
  useEffect(() => {
    // Skip initial fetch since we already load matches in the first useEffect
    if (isLoading) return;

    fetchTeamMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTeam1, filterTeam2, isLoading]);

  async function addTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!teamName.trim() || !selectedPlayer1 || !selectedPlayer2) return;

    try {
      // Insert team
      const teamResponse = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName.trim(),
          emoji: teamEmoji,
        }),
      });

      if (!teamResponse.ok) throw new Error("Failed to add team");
      const teamData = await teamResponse.json();

      // Insert team players
      const player1Response = await fetch("/api/team-players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_id: teamData[0].id,
          player_id: selectedPlayer1,
        }),
      });

      const player2Response = await fetch("/api/team-players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_id: teamData[0].id,
          player_id: selectedPlayer2,
        }),
      });

      if (!player1Response.ok || !player2Response.ok) {
        throw new Error("Failed to add team players");
      }

      setTeamName("");
      setTeamEmoji("👥");
      setSelectedPlayer1("");
      setSelectedPlayer2("");
      setIsTeamDialogOpen(false);
      await Promise.all([fetchTeams(), fetchTeamStats()]);
    } catch (err) {
      setError(t("common.error") + ": " + t("team.add_team"));
    }
  }

  async function updateTeam(e: React.FormEvent) {
    e.preventDefault();
    if (
      !editingTeam ||
      !teamName.trim() ||
      !selectedPlayer1 ||
      !selectedPlayer2
    )
      return;

    try {
      // Update team
      const teamResponse = await fetch(`/api/teams/${editingTeam.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName.trim(),
          emoji: teamEmoji,
        }),
      });

      if (!teamResponse.ok) throw new Error("Failed to update team");

      // First get existing team players to delete them
      const teamPlayersResponse = await fetch(
        `/api/team-players?team_id=${editingTeam.id}`
      );
      if (!teamPlayersResponse.ok)
        throw new Error("Failed to fetch team players");
      const teamPlayers = await teamPlayersResponse.json();

      // Delete existing team players
      for (const player of teamPlayers) {
        const deleteResponse = await fetch(`/api/team-players/${player.id}`, {
          method: "DELETE",
        });
        if (!deleteResponse.ok) throw new Error("Failed to delete team player");
      }

      // Add new team players
      const player1Response = await fetch("/api/team-players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_id: editingTeam.id,
          player_id: selectedPlayer1,
        }),
      });

      const player2Response = await fetch("/api/team-players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_id: editingTeam.id,
          player_id: selectedPlayer2,
        }),
      });

      if (!player1Response.ok || !player2Response.ok) {
        throw new Error("Failed to add team players");
      }

      setTeamName("");
      setTeamEmoji("👥");
      setSelectedPlayer1("");
      setSelectedPlayer2("");
      setEditingTeam(null);
      setIsTeamDialogOpen(false);
      await Promise.all([fetchTeams(), fetchTeamStats(), fetchTeamMatches()]);
    } catch (err) {
      setError(t("common.error") + ": " + t("team.edit_team"));
    }
  }

  async function addTeamMatch(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTeam1 || !selectedTeam2 || !team1Score || !team2Score) return;

    try {
      const matchData = {
        team1_id: selectedTeam1,
        team2_id: selectedTeam2,
        team1_score: parseInt(team1Score),
        team2_score: parseInt(team2Score),
        played_at: new Date(matchDate).toISOString(),
      };

      if (editingMatch) {
        const response = await fetch(`/api/team-matches/${editingMatch.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(matchData),
        });

        if (!response.ok) throw new Error("Failed to update team match");
      } else {
        const response = await fetch("/api/team-matches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(matchData),
        });

        if (!response.ok) throw new Error("Failed to add team match");
      }

      setSelectedTeam1("");
      setSelectedTeam2("");
      setTeam1Score("");
      setTeam2Score("");
      setEditingMatch(null);
      setIsMatchDialogOpen(false);

      // Refresh the necessary data after adding a match
      await Promise.all([fetchTeamMatches(), fetchTeamStats()]);
    } catch (err) {
      setError(
        t("common.error") +
          ": " +
          (editingMatch ? t("team.edit_match") : t("team.add_match"))
      );
    }
  }

  async function deleteTeamMatch(matchId: string) {
    try {
      const response = await fetch(`/api/team-matches/${matchId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete team match");

      await Promise.all([fetchTeamMatches(), fetchTeamStats()]);
    } catch (err) {
      setError(t("common.error") + ": " + t("team.confirm_delete_match"));
    }
  }

  async function deleteTeam(teamId: string) {
    try {
      // First get team players to delete them
      const teamPlayersResponse = await fetch(
        `/api/team-players?team_id=${teamId}`
      );
      if (!teamPlayersResponse.ok)
        throw new Error("Failed to fetch team players");
      const teamPlayers = await teamPlayersResponse.json();

      // Delete team players
      for (const player of teamPlayers) {
        const deleteResponse = await fetch(`/api/team-players/${player.id}`, {
          method: "DELETE",
        });
        if (!deleteResponse.ok) throw new Error("Failed to delete team player");
      }

      // Delete team
      const response = await fetch(`/api/teams/${teamId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete team");

      await Promise.all([fetchTeams(), fetchTeamStats(), fetchTeamMatches()]);
    } catch (err) {
      setError(t("common.error") + ": " + t("team.confirm_delete_team"));
    }
  }

  function handleEditTeamMatch(match: TeamMatch) {
    setEditingMatch(match);
    setSelectedTeam1(match.team1_id);
    setSelectedTeam2(match.team2_id);
    setTeam1Score(match.team1_score.toString());
    setTeam2Score(match.team2_score.toString());
    const date = new Date(match.played_at);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    setMatchDate(date.toISOString().slice(0, 16));
    setIsMatchDialogOpen(true);
  }

  function handleEditTeam(team: Team) {
    setEditingTeam(team);
    setTeamName(team.name);
    setTeamEmoji(team.emoji || "👥");
    setIsTeamDialogOpen(true);

    // Fetch the players for this team
    fetch(`/api/team-players?team_id=${team.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length >= 2) {
          setSelectedPlayer1(data[0].player_id);
          setSelectedPlayer2(data[1].player_id);
        }
      })
      .catch((err) => {
        console.error("Error fetching team players:", err);
      });
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-red-600 text-xl font-bold mb-4">
            {t("common.error")}
          </h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
          <TeamActionButtons
            onNewMatch={() => {
              setEditingMatch(null);
              setSelectedTeam1("");
              setSelectedTeam2("");
              setTeam1Score("");
              setTeam2Score("");
              const now = new Date();
              now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
              setMatchDate(now.toISOString().slice(0, 16));
              setIsMatchDialogOpen(true);
            }}
            onNewTeam={() => {
              setEditingTeam(null);
              setTeamName("");
              setTeamEmoji("👥");
              setSelectedPlayer1("");
              setSelectedPlayer2("");
              setIsTeamDialogOpen(true);
            }}
          />

          <TeamMatchDialog
            isOpen={isMatchDialogOpen}
            onOpenChange={setIsMatchDialogOpen}
            teams={teams}
            selectedTeam1={selectedTeam1}
            selectedTeam2={selectedTeam2}
            team1Score={team1Score}
            team2Score={team2Score}
            matchDate={matchDate}
            setSelectedTeam1={setSelectedTeam1}
            setSelectedTeam2={setSelectedTeam2}
            setTeam1Score={setTeam1Score}
            setTeam2Score={setTeam2Score}
            setMatchDate={setMatchDate}
            onSubmit={addTeamMatch}
            isEditing={!!editingMatch}
          />

          <TeamDialog
            isOpen={isTeamDialogOpen}
            onOpenChange={setIsTeamDialogOpen}
            teamName={teamName}
            teamEmoji={teamEmoji}
            players={players}
            selectedPlayer1={selectedPlayer1}
            selectedPlayer2={selectedPlayer2}
            setTeamName={setTeamName}
            setTeamEmoji={setTeamEmoji}
            setSelectedPlayer1={setSelectedPlayer1}
            setSelectedPlayer2={setSelectedPlayer2}
            onSubmit={editingTeam ? updateTeam : addTeam}
            isEditing={!!editingTeam}
          />

          <TeamRankings
            teamStats={teamStats}
            onEditTeam={handleEditTeam}
            onDeleteTeam={deleteTeam}
          />

          <TeamMatchHistory
            matches={teamMatches}
            teams={teams}
            filterTeam1={filterTeam1}
            filterTeam2={filterTeam2}
            setFilterTeam1={setFilterTeam1}
            setFilterTeam2={setFilterTeam2}
            onEditMatch={handleEditTeamMatch}
            onDeleteMatch={deleteTeamMatch}
          />
        </div>
      </main>
    </>
  );
}
