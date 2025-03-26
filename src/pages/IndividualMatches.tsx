import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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
  const { isPlayerDialogOpen, setIsPlayerDialogOpen } = useDialogContext();
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
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
  const [filterPlayer1, setFilterPlayer1] = useState("all");
  const [filterPlayer2, setFilterPlayer2] = useState("all");
  const [isMatchDialogOpen, setIsMatchDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      if (!isMounted) return;

      setIsLoading(true);
      try {
        const [playersResponse, statsResponse, matchesResponse] =
          await Promise.all([
            supabase.from("players").select("*"),
            supabase.from("player_stats").select("*"),
            supabase
              .from("matches")
              .select(
                `
              *,
              player1:player1_id(id, name, nickname, emoji),
              player2:player2_id(id, name, nickname, emoji)
            `
              )
              .order("played_at", { ascending: false }),
          ]);

        if (!isMounted) return;

        if (playersResponse.data) setPlayers(playersResponse.data);
        if (statsResponse.data) setPlayerStats(statsResponse.data);
        if (matchesResponse.data) setMatches(matchesResponse.data);

        if (
          playersResponse.error ||
          statsResponse.error ||
          matchesResponse.error
        ) {
          throw new Error("Failed to fetch data");
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

  // Add a useEffect to handle filters
  useEffect(() => {
    // Skip initial fetch since we already load matches in the first useEffect
    if (isLoading) return;

    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterPlayer1, filterPlayer2, isLoading]);

  async function fetchPlayers() {
    const { data, error } = await supabase.from("players").select("*");
    if (error) throw error;
    if (data) setPlayers(data);
  }

  async function fetchPlayerStats() {
    const { data, error } = await supabase.from("player_stats").select("*");
    if (error) throw error;
    if (data) setPlayerStats(data);
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

      if (filterPlayer1 && filterPlayer1 !== "all") {
        query = query.eq("player1_id", filterPlayer1);
      }
      if (filterPlayer2 && filterPlayer2 !== "all") {
        query = query.eq("player2_id", filterPlayer2);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) setMatches(data);
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
      setError("Failed to add player. Please try again.");
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
      setError("Failed to update player. Please try again.");
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
      setError("Failed to record match. Please try again.");
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
      setError("Failed to delete match. Please try again.");
    }
  }

  async function deletePlayer(playerId: string) {
    try {
      const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", playerId);

      if (error) throw error;
      await Promise.all([fetchPlayers(), fetchPlayerStats(), fetchMatches()]);
    } catch (err) {
      setError("Failed to delete player. Please try again.");
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

  function handleEditPlayer(player: Player) {
    setEditingPlayer(player);
    setNewPlayerName(player.name);
    setNewPlayerNickname(player.nickname || "");
    setNewPlayerEmoji(player.emoji);
    setIsPlayerDialogOpen(true);
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-red-600 text-xl font-bold mb-4">
            Connection Error
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
            onEditPlayer={handleEditPlayer}
            onDeletePlayer={deletePlayer}
          />

          <MatchHistory
            matches={matches}
            players={players}
            filterPlayer1={filterPlayer1}
            filterPlayer2={filterPlayer2}
            setFilterPlayer1={setFilterPlayer1}
            setFilterPlayer2={setFilterPlayer2}
            onEditMatch={handleEditMatch}
            onDeleteMatch={deleteMatch}
          />
        </div>
      </main>
    </>
  );
}
