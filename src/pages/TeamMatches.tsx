import { useState, useEffect } from "react";
import { playersApi, teamsApi, teamMatchesApi, statsApi } from "../lib/api";
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
  player1_id?: string;
  player2_id?: string;
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

  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([
          fetchPlayers(),
          fetchTeams(),
          fetchTeamMatches(),
          fetchTeamStats(),
        ]);
      } catch (err) {
        setError(t("common.error") + ": " + t("common.loading"));
      }
    };

    initializeData();
  }, [t]);

  async function fetchPlayers() {
    try {
      const data = await playersApi.getAll();
      setPlayers(data);
    } catch (err) {
      console.error("Error fetching players:", err);
      throw err;
    }
  }

  async function fetchTeams() {
    try {
      const data = await teamsApi.getAll();
      setTeams(data);
    } catch (err) {
      console.error("Error fetching teams:", err);
      throw err;
    }
  }

  async function fetchTeamStats() {
    try {
      const data = await statsApi.getTeamStats();
      setTeamStats(data);
    } catch (err) {
      console.error("Error fetching team stats:", err);
      throw err;
    }
  }

  async function fetchTeamMatches() {
    try {
      const data = await teamMatchesApi.getAll({
        team1_id: filterTeam1,
        team2_id: filterTeam2,
      });
      setTeamMatches(data);
    } catch (err) {
      console.error("Error fetching team matches:", err);
      throw err;
    }
  }

  async function addTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!teamName.trim()) return;

    try {
      const teamData = {
        name: teamName.trim(),
        emoji: teamEmoji || "👥",
        player1_id: selectedPlayer1 || undefined,
        player2_id: selectedPlayer2 || undefined,
      };

      if (editingTeam) {
        await teamsApi.update(editingTeam.id, teamData);
      } else {
        await teamsApi.create(teamData);
      }

      setTeamName("");
      setTeamEmoji("👥");
      setSelectedPlayer1("");
      setSelectedPlayer2("");
      setEditingTeam(null);
      setIsTeamDialogOpen(false);
      await Promise.all([fetchTeams(), fetchTeamStats()]);
    } catch (err) {
      setError(
        t("common.error") +
          ": " +
          (editingTeam ? t("team.edit_team") : t("team.add_team"))
      );
    }
  }

  async function deleteTeam(teamId: string) {
    try {
      await teamsApi.delete(teamId);
      await Promise.all([fetchTeams(), fetchTeamStats()]);
    } catch (err) {
      setError(t("common.error") + ": " + t("team.confirm_delete_team"));
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
        await teamMatchesApi.update(editingMatch.id, matchData);
      } else {
        await teamMatchesApi.create(matchData);
      }

      setSelectedTeam1("");
      setSelectedTeam2("");
      setTeam1Score("");
      setTeam2Score("");
      setEditingMatch(null);
      setIsMatchDialogOpen(false);
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
      await teamMatchesApi.delete(matchId);
      await Promise.all([fetchTeamMatches(), fetchTeamStats()]);
    } catch (err) {
      setError(t("common.error") + ": " + t("team.confirm_delete_match"));
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

    // Set player IDs directly from the team object
    setSelectedPlayer1(team.player1_id || "");
    setSelectedPlayer2(team.player2_id || "");

    setIsTeamDialogOpen(true);
  }

  useEffect(() => {
    fetchTeamMatches();
  }, [filterTeam1, filterTeam2]);

  function openTeamDialog() {
    setEditingTeam(null);
    setTeamName("");
    setTeamEmoji("👥");
    setSelectedPlayer1("");
    setSelectedPlayer2("");
    setIsTeamDialogOpen(true);
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
            onNewTeam={openTeamDialog}
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
            selectedPlayer1={selectedPlayer1}
            selectedPlayer2={selectedPlayer2}
            setTeamName={setTeamName}
            setTeamEmoji={setTeamEmoji}
            players={players}
            setSelectedPlayer1={setSelectedPlayer1}
            setSelectedPlayer2={setSelectedPlayer2}
            onSubmit={addTeam}
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
