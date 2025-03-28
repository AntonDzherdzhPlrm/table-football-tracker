import { useState, useEffect } from "react";
import { playersApi, matchesApi, statsApi } from "../lib/api";
import { useLocalization } from "@/lib/LocalizationContext";

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
        const [players, playerStats, matches] = await Promise.all([
          playersApi.getAll(),
          statsApi.getPlayerStats(),
          matchesApi.getAll(),
        ]);

        if (!isMounted) return;

        setPlayers(players);
        setPlayerStats(playerStats);
        setMatches(matches);
      } catch (err) {
        if (isMounted) {
          setError("Failed to fetch data. Please check your connection.");
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
    try {
      const data = await playersApi.getAll();
      setPlayers(data);
    } catch (err) {
      console.error("Error fetching players:", err);
    }
  }

  async function fetchPlayerStats() {
    try {
      const data = await statsApi.getPlayerStats();
      setPlayerStats(data);
    } catch (err) {
      console.error("Error fetching player stats:", err);
    }
  }

  async function fetchMatches() {
    try {
      const data = await matchesApi.getAll({
        player1_id: filterPlayer1,
        player2_id: filterPlayer2,
      });
      setMatches(data);
    } catch (err) {
      console.error("Error fetching matches:", err);
    }
  }

  async function addPlayer(e: React.FormEvent) {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    try {
      await playersApi.create({
        name: newPlayerName.trim(),
        nickname: newPlayerNickname.trim() || undefined,
        emoji: newPlayerEmoji || "👤",
      });

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
      const updatedPlayer = {
        name: newPlayerName.trim(),
        nickname: newPlayerNickname.trim() || undefined,
        emoji: newPlayerEmoji || "👤",
      };

      await playersApi.update(editingPlayer.id, updatedPlayer);

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
        await matchesApi.update(editingMatch.id, matchData);
      } else {
        await matchesApi.create(matchData);
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
      await matchesApi.delete(matchId);
      await Promise.all([fetchMatches(), fetchPlayerStats()]);
    } catch (err) {
      setError(t("common.error") + ": " + t("individual.confirm_delete_match"));
    }
  }

  async function deletePlayer(playerId: string) {
    try {
      await playersApi.delete(playerId);
      await Promise.all([fetchPlayers(), fetchPlayerStats(), fetchMatches()]);
    } catch (err) {
      setError(
        t("common.error") + ": " + t("individual.confirm_delete_player")
      );
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
