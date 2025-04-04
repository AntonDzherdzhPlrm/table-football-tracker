import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLocalization } from "@/lib/LocalizationContext";
import { useLocation, useNavigate } from "react-router-dom";

import { MatchDialog } from "@/components/MatchDialog";
import { PlayerDialog } from "@/components/PlayerDialog";
import { PlayerRankings } from "@/components/PlayerRankings";
import { MatchHistory } from "@/components/MatchHistory";
import { ActionButtons } from "@/components/ActionButtons";
import { useDialogContext } from "@/lib/DialogContext";

type Player = {
  id: string;
  name: string;
  nickname?: string;
  emoji: string;
};

type PlayerStats = {
  id: string;
  name: string;
  nickname?: string;
  emoji: string;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
};

type Match = {
  id: string;
  player1_id: string;
  player2_id: string;
  player1_score: number;
  player2_score: number;
  played_at: string;
  player1?: Player;
  player2?: Player;
};

export function IndividualMatches() {
  const { t } = useLocalization();
  const { isPlayerDialogOpen, setIsPlayerDialogOpen } = useDialogContext();
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [availableMonths, setAvailableMonths] = useState<
    Array<{ value: string; label: string }>
  >([{ value: "all", label: t("common.all") }]);
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

  // Initial fetch of players
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await fetchPlayers();
      setIsLoading(false);
    };

    initializeData();
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (isLoading) return;

    fetchMatches();

    // Initial fetch of player stats happens after matches are loaded
    // because we need available months from matches first
  }, [isLoading]);

  // Fetch player stats when selected month changes
  useEffect(() => {
    if (isLoading) return;
    fetchPlayerStats();
    // No need to call fetchMatches here, as we filter matches client-side
  }, [selectedMonth, isLoading]);

  // Fetch matches when player filters change
  useEffect(() => {
    if (isLoading) return;
    fetchMatches();
  }, [filterPlayer1, filterPlayer2, isLoading]);

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

  async function fetchPlayers() {
    const { data, error } = await supabase.from("players").select("*");
    if (error) throw error;
    if (data) setPlayers(data);
  }

  async function fetchPlayerStats() {
    try {
      if (selectedMonth === "all") {
        // When "all" is selected, fetch from the player_stats view that has all-time stats
        const { data, error } = await supabase
          .from("player_stats")
          .select("*")
          .order("points", { ascending: false })
          .order("wins", { ascending: false });

        if (error) throw error;

        // Map database fields to match the PlayerStats type used by the PlayerRankings component
        const mappedData = (data || []).map((player) => ({
          id: player.id,
          name: player.name,
          nickname: player.nickname,
          emoji: player.emoji,
          matches_played: player.matches_played,
          wins: player.wins,
          draws: player.draws,
          losses: player.losses,
          points: player.points,
        }));

        setPlayerStats(mappedData);
      } else {
        // For specific month, calculate stats based on filtered matches
        // Get start and end date for the selected month
        const [year, month] = selectedMonth.split("-").map(Number);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // Last day of the month
        endDate.setHours(23, 59, 59, 999);

        // Get matches for the selected month
        const { data: monthMatches, error } = await supabase
          .from("matches")
          .select(
            `
            *,
            player1:player1_id(id, name, nickname, emoji),
            player2:player2_id(id, name, nickname, emoji)
          `
          )
          .gte("played_at", startDate.toISOString())
          .lte("played_at", endDate.toISOString())
          .order("played_at", { ascending: false });

        if (error) throw error;

        if (monthMatches) {
          // Calculate stats from these matches
          const playerStatsMap = new Map();

          // Process each match
          monthMatches.forEach((match) => {
            const player1Id = match.player1.id;
            const player2Id = match.player2.id;
            const player1Won = match.player1_score > match.player2_score;
            const isDraw = match.player1_score === match.player2_score;

            // Initialize or update player1 stats
            const player1Stats = playerStatsMap.get(player1Id) || {
              id: player1Id,
              name: match.player1.name,
              nickname: match.player1.nickname,
              emoji: match.player1.emoji,
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
              name: match.player2.name,
              nickname: match.player2.nickname,
              emoji: match.player2.emoji,
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
          const statsArray = Array.from(playerStatsMap.values()).sort(
            (a, b) => {
              if (b.points !== a.points) {
                return b.points - a.points;
              }
              return b.wins - a.wins;
            }
          );

          setPlayerStats(statsArray);
        } else {
          setPlayerStats([]);
        }
      }
    } catch (err) {
      console.error("Error fetching player stats:", err);
      setPlayerStats([]);
    }
  }

  async function fetchMatches() {
    try {
      let query = supabase
        .from("matches")
        .select(
          `
          *,
          player1:player1_id(id, name, nickname, emoji),
          player2:player2_id(id, name, nickname, emoji)
        `
        )
        .order("played_at", { ascending: false });

      // If only player1 filter is set (and not player2)
      if (filterPlayer1 !== "all" && filterPlayer2 === "all") {
        // Find matches where this player is either player1 or player2
        query = query.or(
          `player1_id.eq.${filterPlayer1},player2_id.eq.${filterPlayer1}`
        );
      }
      // If only player2 filter is set (and not player1)
      else if (filterPlayer2 !== "all" && filterPlayer1 === "all") {
        // Find matches where this player is either player1 or player2
        query = query.or(
          `player1_id.eq.${filterPlayer2},player2_id.eq.${filterPlayer2}`
        );
      }
      // If both filters are set
      else if (filterPlayer1 !== "all" && filterPlayer2 !== "all") {
        // Find matches where both players participated (in any position)
        query = query.or(
          `and(player1_id.eq.${filterPlayer1},player2_id.eq.${filterPlayer2}),and(player1_id.eq.${filterPlayer2},player2_id.eq.${filterPlayer1})`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) {
        setMatches(data);

        // Extract and set available months from match data
        const monthsMap = new Map<string, string>();
        monthsMap.set("all", t("common.all"));

        data.forEach((match) => {
          const date = new Date(match.played_at);
          const monthValue = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;
          const monthLabel = date.toLocaleString("default", {
            month: "long",
            year: "numeric",
          });
          monthsMap.set(monthValue, monthLabel);
        });

        // Convert map to array and sort by date (most recent first)
        const monthsArray = Array.from(monthsMap.entries())
          .map(([value, label]) => ({ value, label }))
          .sort((a, b) => {
            if (a.value === "all") return -1;
            if (b.value === "all") return 1;
            return b.value.localeCompare(a.value);
          });

        setAvailableMonths(monthsArray);
      }
    } catch (err) {
      console.error("Error fetching matches:", err);
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
      await Promise.all([fetchPlayers(), fetchPlayerStats()]);
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
      await Promise.all([fetchPlayers(), fetchPlayerStats(), fetchMatches()]);
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
        const { error } = await supabase
          .from("matches")
          .update(matchData)
          .eq("id", editingMatch.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("matches").insert([matchData]);
        if (error) throw error;
      }

      setSelectedPlayer1("");
      setSelectedPlayer2("");
      setPlayer1Score("");
      setPlayer2Score("");
      setEditingMatch(null);
      setIsMatchDialogOpen(false);

      // Refresh the necessary data after adding a match
      await Promise.all([fetchMatches(), fetchPlayerStats()]);
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
      const { error } = await supabase
        .from("matches")
        .delete()
        .eq("id", matchId);

      if (error) throw error;
      await Promise.all([fetchMatches(), fetchPlayerStats()]);
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
            matches={
              selectedMonth === "all"
                ? matches
                : matches.filter((match) => {
                    const date = new Date(match.played_at);
                    const matchMonth = `${date.getFullYear()}-${(
                      date.getMonth() + 1
                    )
                      .toString()
                      .padStart(2, "0")}`;
                    return matchMonth === selectedMonth;
                  })
            }
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
