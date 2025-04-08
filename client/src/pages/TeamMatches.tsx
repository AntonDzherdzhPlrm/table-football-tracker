import { useState, useEffect } from "react";
import { useLocalization } from "@/lib/LocalizationContext";
import { API } from "@/lib/api-client";
import { TeamDialog } from "@/components/TeamDialog";
import { TeamMatchDialog } from "@/components/TeamMatchDialog";
import { TeamRankings } from "@/components/TeamRankings";
import { TeamMatchHistory } from "@/components/TeamMatchHistory";
import { TeamActionButtons } from "@/components/TeamActionButtons";
import { useDialogContext } from "@/lib/DialogContext";
import { useLocation, useNavigate } from "react-router-dom";

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
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize filter states from URL query parameters
  const queryParams = new URLSearchParams(location.search);

  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [teamMatches, setTeamMatches] = useState<TeamMatch[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(
    queryParams.get("month") || "all"
  );
  const [availableMonths, setAvailableMonths] = useState<
    Array<{ value: string; label: string }>
  >([{ value: "all", label: t("common.all") }]);

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

  const [error, setError] = useState<string | null>(null);

  // Function to update URL when filters change
  const updateUrlParams = (params: {
    team1?: string;
    team2?: string;
    month?: string;
  }) => {
    const searchParams = new URLSearchParams(location.search);

    if (params.team1) {
      if (params.team1 !== "all") {
        searchParams.set("team1", params.team1);
      } else {
        searchParams.delete("team1");
      }
    }

    if (params.team2) {
      if (params.team2 !== "all") {
        searchParams.set("team2", params.team2);
      } else {
        searchParams.delete("team2");
      }
    }

    if (params.month) {
      if (params.month !== "all") {
        searchParams.set("month", params.month);
      } else {
        searchParams.delete("month");
      }
    }

    const newSearch = searchParams.toString();
    const newPath = `${location.pathname}${newSearch ? `?${newSearch}` : ""}`;

    navigate(newPath, { replace: true });
  };

  // Fetch data and apply filters
  useEffect(() => {
    const fetchData = async () => {
      try {
        const consolidated = await API.teamMatches.getConsolidated();

        // Set state with players, teams and their stats
        setPlayers(consolidated.players || []);
        setTeams(consolidated.teams || []);
        setTeamStats((consolidated.teamStats as any) || []);
        setAvailableMonths(
          consolidated.activeMonths || [
            { value: "all", label: t("common.all") },
          ]
        );

        // Filter matches based on selected teams and month
        let filteredMatches = [...(consolidated.teamMatches || [])];

        if (selectedTeam1 !== "all") {
          filteredMatches = filteredMatches.filter(
            (match) =>
              match.team1_id === selectedTeam1 ||
              match.team2_id === selectedTeam1
          );
        }

        if (selectedTeam2 !== "all") {
          filteredMatches = filteredMatches.filter(
            (match) =>
              match.team1_id === selectedTeam2 ||
              match.team2_id === selectedTeam2
          );
        }

        if (selectedMonth !== "all") {
          filteredMatches = filteredMatches.filter((match) => {
            const date = new Date(match.played_at);
            const matchMonth = `${date.getFullYear()}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}`;
            return matchMonth === selectedMonth;
          });
        }

        setTeamMatches(filteredMatches);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
      }
    };

    fetchData();
  }, [selectedTeam1, selectedTeam2, selectedMonth, t]);

  // Listen for URL changes and update filters accordingly
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const team1Param = params.get("team1") || "all";
    const team2Param = params.get("team2") || "all";
    const monthParam = params.get("month") || "all";

    // Only update state if values are different to avoid infinite loops
    if (team1Param !== selectedTeam1) {
      setSelectedTeam1(team1Param);
    }

    if (team2Param !== selectedTeam2) {
      setSelectedTeam2(team2Param);
    }

    if (monthParam !== selectedMonth) {
      setSelectedMonth(monthParam);
    }
  }, [location.search]);

  // Update URL when filters change
  useEffect(() => {
    updateUrlParams({
      team1: selectedTeam1,
      team2: selectedTeam2,
      month: selectedMonth,
    });
  }, [selectedTeam1, selectedTeam2, selectedMonth]);

  // Single function to refresh all data
  const refreshData = async () => {
    try {
      const consolidated = await API.teamMatches.getConsolidated();

      // Update state with fresh data
      setPlayers(consolidated.players || []);
      setTeams(consolidated.teams || []);
      setTeamStats((consolidated.teamStats as any) || []);
      setAvailableMonths(
        consolidated.activeMonths || [{ value: "all", label: t("common.all") }]
      );

      // Apply filters to matches
      let filteredMatches = [...(consolidated.teamMatches || [])];

      if (selectedTeam1 !== "all") {
        filteredMatches = filteredMatches.filter(
          (match) =>
            match.team1_id === selectedTeam1 || match.team2_id === selectedTeam1
        );
      }

      if (selectedTeam2 !== "all") {
        filteredMatches = filteredMatches.filter(
          (match) =>
            match.team1_id === selectedTeam2 || match.team2_id === selectedTeam2
        );
      }

      if (selectedMonth !== "all") {
        filteredMatches = filteredMatches.filter((match) => {
          const date = new Date(match.played_at);
          const matchMonth = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;
          return matchMonth === selectedMonth;
        });
      }

      setTeamMatches(filteredMatches);
    } catch (error: any) {
      console.error("Error refreshing data:", error);
      setError(t("common.error") + ": " + error.message);
    }
  };

  async function addTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!teamName.trim() || !selectedPlayer1 || !selectedPlayer2) return;

    try {
      // Insert team
      await API.teams.create({
        name: teamName.trim(),
        emoji: teamEmoji,
        players: [selectedPlayer1, selectedPlayer2],
      });

      // Reset form
      setTeamName("");
      setTeamEmoji("👥");
      setSelectedPlayer1("");
      setSelectedPlayer2("");
      setIsTeamDialogOpen(false);

      // Refresh data
      refreshData();
    } catch (error: any) {
      console.error("Error adding team:", error);
      setError(t("common.error") + ": " + error.message);
    }
  }

  async function updateTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!editingTeam) return;
    if (!teamName.trim() || !selectedPlayer1 || !selectedPlayer2) return;

    try {
      // Update team
      await API.teams.update(editingTeam.id, {
        name: teamName.trim(),
        emoji: teamEmoji,
        players: [selectedPlayer1, selectedPlayer2],
      });

      // Reset form
      setTeamName("");
      setTeamEmoji("👥");
      setSelectedPlayer1("");
      setSelectedPlayer2("");
      setEditingTeam(null);
      setIsTeamDialogOpen(false);

      // Refresh data
      refreshData();
    } catch (error: any) {
      console.error("Error updating team:", error);
      setError(t("common.error") + ": " + error.message);
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
        await API.teamMatches.update(editingMatch.id, matchData);
      } else {
        await API.teamMatches.create(matchData);
      }

      // Reset form
      setSelectedTeam1("");
      setSelectedTeam2("");
      setTeam1Score("");
      setTeam2Score("");
      setIsMatchDialogOpen(false);
      setEditingMatch(null);

      // Refresh all data
      refreshData();
    } catch (error: any) {
      console.error("Error adding/updating match:", error);
      setError(t("common.error") + ": " + error.message);
    }
  }

  async function deleteTeamMatch(matchId: string) {
    try {
      await API.teamMatches.delete(matchId);
      refreshData();
    } catch (error: any) {
      console.error("Error deleting match:", error);
      setError(t("common.error") + ": " + error.message);
    }
  }

  async function deleteTeam(teamId: string) {
    try {
      await API.teams.delete(teamId);
      refreshData();
    } catch (error: any) {
      console.error("Error deleting team:", error);
      setError(t("common.error") + ": " + error.message);
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

  if (error) {
    return (
      <div className="min-h-screen bg-team-football p-8 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur p-8 rounded-lg shadow-md w-full max-w-md border-t-4 border-red-500">
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
            players={players}
            teamName={teamName}
            teamEmoji={teamEmoji}
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
            onDeleteTeam={deleteTeam}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            availableMonths={availableMonths}
          />

          <TeamMatchHistory
            matches={teamMatches}
            teams={teams}
            filterTeam1={selectedTeam1}
            filterTeam2={selectedTeam2}
            setFilterTeam1={setSelectedTeam1}
            setFilterTeam2={setSelectedTeam2}
            onEditMatch={handleEditTeamMatch}
            onDeleteMatch={deleteTeamMatch}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            availableMonths={availableMonths}
          />
        </div>
      </main>
    </>
  );
}
