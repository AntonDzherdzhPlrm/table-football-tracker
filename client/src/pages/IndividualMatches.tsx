import { useState, useEffect } from "react";
import { useLocalization } from "@/lib/LocalizationContext";
import { useLocation, useNavigate } from "react-router-dom";
import { API } from "@/lib/api-client";
import { Player, PlayerStats, Match, MonthOption } from "@/lib/types";

import { MatchDialog } from "@/components/MatchDialog";
import { PlayerDialog } from "@/components/PlayerDialog";
import { PlayerRankings } from "@/components/PlayerRankings";
import { MatchHistory } from "@/components/MatchHistory";
import { ActionButtons } from "@/components/ActionButtons";
import { useDialogContext } from "@/lib/DialogContext";

type ConfigData = {
  players: Player[];
  playerStats: PlayerStats[];
  matches: Match[];
  months: MonthOption[];
};

export function IndividualMatches() {
  const { t } = useLocalization();
  const { isPlayerDialogOpen, setIsPlayerDialogOpen } = useDialogContext();
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [availableMonths, setAvailableMonths] = useState<MonthOption[]>([
    { value: "all", label: t("common.all") },
  ]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerNickname, setNewPlayerNickname] = useState("");
  const [newPlayerEmoji, setNewPlayerEmoji] = useState("👤");
  const [selectedPlayer1, setSelectedPlayer1] = useState("");
  const [selectedPlayer2, setSelectedPlayer2] = useState("");
  const [player1Score, setPlayer1Score] = useState("");
  const [player2Score, setPlayer2Score] = useState("");
  const [matchDate, setMatchDate] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [error, setError] = useState<string | null>(null);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [config, setConfig] = useState<ConfigData | null>(null);

  // Initialize filter states from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const [filterPlayer1, setFilterPlayer1] = useState(
    queryParams.get("player1") || "all"
  );
  const [filterPlayer2, setFilterPlayer2] = useState(
    queryParams.get("player2") || "all"
  );
  const [selectedMonth, setSelectedMonth] = useState(
    queryParams.get("month") || "all"
  );
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to update URL when filters change
  const updateUrlParams = (player1: string, player2: string, month: string) => {
    const params = new URLSearchParams();

    if (player1 !== "all") params.set("player1", player1);
    if (player2 !== "all") params.set("player2", player2);
    if (month !== "all") params.set("month", month);

    const newSearch = params.toString();
    const newPath = `${location.pathname}${newSearch ? `?${newSearch}` : ""}`;

    navigate(newPath, { replace: true });
  };

  // Custom setters that update both state and URL
  const handleSetFilterPlayer1 = (value: string) => {
    setFilterPlayer1(value);
    updateUrlParams(value, filterPlayer2, selectedMonth);
  };

  const handleSetFilterPlayer2 = (value: string) => {
    setFilterPlayer2(value);
    updateUrlParams(filterPlayer1, value, selectedMonth);
  };

  const handleSetSelectedMonth = (value: string) => {
    setSelectedMonth(value);
    updateUrlParams(filterPlayer1, filterPlayer2, value);
  };

  // Initial fetch of data
  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);

      try {
        // Use the config endpoint to get all data in one call
        const configData = (await API.matches.getConfig()) as ConfigData;

        setConfig(configData);
        setPlayers(configData.players);
        setPlayerStats(configData.playerStats);
        setAllMatches(configData.matches);
        setAvailableMonths(configData.months);

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setError(t("common.error") + ": " + t("common.loading"));
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [t]);

  // Apply filters when filter criteria or data changes
  useEffect(() => {
    if (isLoading || !config) return;

    // Filter matches based on selected players
    let matches = [...allMatches];

    // Apply player filters
    if (filterPlayer1 !== "all" && filterPlayer2 === "all") {
      matches = matches.filter(
        (match) =>
          match.player1_id === filterPlayer1 ||
          match.player2_id === filterPlayer1
      );
    } else if (filterPlayer2 !== "all" && filterPlayer1 === "all") {
      matches = matches.filter(
        (match) =>
          match.player1_id === filterPlayer2 ||
          match.player2_id === filterPlayer2
      );
    } else if (filterPlayer1 !== "all" && filterPlayer2 !== "all") {
      matches = matches.filter(
        (match) =>
          (match.player1_id === filterPlayer1 &&
            match.player2_id === filterPlayer2) ||
          (match.player1_id === filterPlayer2 &&
            match.player2_id === filterPlayer1)
      );
    }

    // Apply month filter
    if (selectedMonth !== "all") {
      matches = matches.filter((match) => {
        const date = new Date(match.played_at);
        const matchMonth = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
        return matchMonth === selectedMonth;
      });
    }

    setFilteredMatches(matches);

    // Calculate player stats if month is selected
    if (selectedMonth !== "all") {
      // For specific month, calculate stats based on filtered matches
      const monthMatches = allMatches.filter((match) => {
        const date = new Date(match.played_at);
        const matchMonth = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
        return matchMonth === selectedMonth;
      });

      if (monthMatches && monthMatches.length > 0) {
        const statsForMonth = calculatePlayerStats(monthMatches);
        setPlayerStats(statsForMonth);
      } else {
        setPlayerStats([]);
      }
    } else {
      // Use the overall stats from config
      setPlayerStats(config.playerStats);
    }
  }, [
    filterPlayer1,
    filterPlayer2,
    selectedMonth,
    config,
    isLoading,
    allMatches,
  ]);

  // Listen for URL changes and update filters accordingly
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const player1Param = params.get("player1") || "all";
    const player2Param = params.get("player2") || "all";
    const monthParam = params.get("month") || "all";

    // Only update state if values are different to avoid infinite loops
    if (player1Param !== filterPlayer1) {
      setFilterPlayer1(player1Param);
    }

    if (player2Param !== filterPlayer2) {
      setFilterPlayer2(player2Param);
    }

    if (monthParam !== selectedMonth) {
      setSelectedMonth(monthParam);
    }
  }, [location.search]);

  // Helper function to calculate player stats from matches
  const calculatePlayerStats = (matches: Match[]) => {
    const playerStatsMap = new Map();

    // Process each match
    matches.forEach((match) => {
      const player1Id = match.player1?.id || match.player1_id;
      const player2Id = match.player2?.id || match.player2_id;
      if (!player1Id || !player2Id) return;

      const player1 = match.player1 || players.find((p) => p.id === player1Id);
      const player2 = match.player2 || players.find((p) => p.id === player2Id);
      if (!player1 || !player2) return;

      const player1Won = match.player1_score > match.player2_score;
      const isDraw = match.player1_score === match.player2_score;

      // Initialize or update player1 stats
      const player1Stats = playerStatsMap.get(player1Id) || {
        id: player1Id,
        name: player1.name,
        nickname: player1.nickname,
        emoji: player1.emoji,
        matches_played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
      };

      player1Stats.matches_played += 1;

      if (player1Won) {
        player1Stats.wins += 1;
        player1Stats.points += 3;
      } else if (isDraw) {
        player1Stats.draws += 1;
        player1Stats.points += 1;
      } else {
        player1Stats.losses += 1;
      }

      playerStatsMap.set(player1Id, player1Stats);

      // Initialize or update player2 stats
      const player2Stats = playerStatsMap.get(player2Id) || {
        id: player2Id,
        name: player2.name,
        nickname: player2.nickname,
        emoji: player2.emoji,
        matches_played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
      };

      player2Stats.matches_played += 1;

      if (!player1Won && !isDraw) {
        player2Stats.wins += 1;
        player2Stats.points += 3;
      } else if (isDraw) {
        player2Stats.draws += 1;
        player2Stats.points += 1;
      } else {
        player2Stats.losses += 1;
      }

      playerStatsMap.set(player2Id, player2Stats);
    });

    // Convert map to array and sort by points, then wins
    return Array.from(playerStatsMap.values()).sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return b.wins - a.wins;
    });
  };

  // Single function to refresh all data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const configData = (await API.matches.getConfig()) as ConfigData;

      setConfig(configData);
      setPlayers(configData.players);
      setPlayerStats(configData.playerStats);
      setAllMatches(configData.matches);
      setAvailableMonths(configData.months);
    } catch (error) {
      console.error("Error refreshing data:", error);
      setError(t("common.error") + ": " + t("common.loading"));
    }
    setIsLoading(false);
  };

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

      // Refresh all data
      await refreshData();
    } catch (err) {
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

      // Refresh all data
      await refreshData();
    } catch (err) {
      setError(t("common.error") + ": " + t("individual.edit_player"));
    }
  }

  async function addMatch(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPlayer1 || !selectedPlayer2 || !player1Score || !player2Score)
      return;

    try {
      const matchData = {
        player1_id: selectedPlayer1,
        player2_id: selectedPlayer2,
        player1_score: parseInt(player1Score),
        player2_score: parseInt(player2Score),
        played_at: new Date(matchDate).toISOString(),
      };

      if (editingMatch) {
        await API.individualMatches.update(editingMatch.id, matchData);
      } else {
        await API.individualMatches.create(matchData);
      }

      setSelectedPlayer1("");
      setSelectedPlayer2("");
      setPlayer1Score("");
      setPlayer2Score("");
      setEditingMatch(null);
      setIsMatchDialogOpen(false);

      // Refresh all data
      await refreshData();
    } catch (err) {
      setError(
        t("common.error") +
          ": " +
          (editingMatch
            ? t("individual.edit_match")
            : t("individual.add_match"))
      );
    }
  }

  async function deleteMatch(matchId: string) {
    try {
      await API.individualMatches.delete(matchId);

      // Refresh all data
      await refreshData();
    } catch (err) {
      setError(t("common.error") + ": " + t("individual.confirm_delete_match"));
    }
  }

  function handleEditMatch(match: Match) {
    setEditingMatch(match);
    setSelectedPlayer1(match.player1_id);
    setSelectedPlayer2(match.player2_id);
    setPlayer1Score(match.player1_score.toString());
    setPlayer2Score(match.player2_score.toString());
    const date = new Date(match.played_at);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    setMatchDate(date.toISOString().slice(0, 16));
    setIsMatchDialogOpen(true);
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
          <ActionButtons
            onNewMatch={() => {
              setEditingMatch(null);
              setSelectedPlayer1("");
              setSelectedPlayer2("");
              setPlayer1Score("");
              setPlayer2Score("");
              const now = new Date();
              now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
              setMatchDate(now.toISOString().slice(0, 16));
              setIsMatchDialogOpen(true);
            }}
            onNewPlayer={() => {
              setEditingPlayer(null);
              setNewPlayerName("");
              setNewPlayerNickname("");
              setNewPlayerEmoji("👤");
              setIsPlayerDialogOpen(true);
            }}
          />

          <MatchDialog
            isOpen={isMatchDialogOpen}
            onOpenChange={setIsMatchDialogOpen}
            players={players}
            selectedPlayer1={selectedPlayer1}
            selectedPlayer2={selectedPlayer2}
            player1Score={player1Score}
            player2Score={player2Score}
            matchDate={matchDate}
            setSelectedPlayer1={setSelectedPlayer1}
            setSelectedPlayer2={setSelectedPlayer2}
            setPlayer1Score={setPlayer1Score}
            setPlayer2Score={setPlayer2Score}
            setMatchDate={setMatchDate}
            onSubmit={addMatch}
            isEditing={!!editingMatch}
          />

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

          <PlayerRankings
            playerStats={playerStats}
            selectedMonth={selectedMonth}
            setSelectedMonth={handleSetSelectedMonth}
            availableMonths={availableMonths}
          />

          <MatchHistory
            matches={filteredMatches}
            players={players}
            filterPlayer1={filterPlayer1}
            filterPlayer2={filterPlayer2}
            setFilterPlayer1={handleSetFilterPlayer1}
            setFilterPlayer2={handleSetFilterPlayer2}
            onEditMatch={handleEditMatch}
            onDeleteMatch={deleteMatch}
            selectedMonth={selectedMonth}
            setSelectedMonth={handleSetSelectedMonth}
            availableMonths={availableMonths}
          />
        </div>
      </main>
    </>
  );
}
