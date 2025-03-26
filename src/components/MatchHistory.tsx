import { Edit2, Trash2 } from "lucide-react";

type Player = {
  id: string;
  name: string;
  nickname?: string;
  emoji: string;
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

type MatchHistoryProps = {
  matches: Match[];
  players: Player[];
  filterPlayer1: string;
  filterPlayer2: string;
  setFilterPlayer1: (value: string) => void;
  setFilterPlayer2: (value: string) => void;
  onEditMatch: (match: Match) => void;
  onDeleteMatch: (matchId: string) => void;
};

export function MatchHistory({
  matches,
  players,
  filterPlayer1,
  filterPlayer2,
  setFilterPlayer1,
  setFilterPlayer2,
  onEditMatch,
  onDeleteMatch,
}: MatchHistoryProps) {
  return (
    <div className="bg-white/90 backdrop-blur p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Match History</h2>
        <div className="flex gap-4 mt-4 md:mt-0 w-full md:w-auto">
          <select
            className="p-2 border rounded-md w-full md:w-auto relative z-50"
            value={filterPlayer1}
            onChange={(e) => setFilterPlayer1(e.target.value)}
          >
            <option value="">Filter Player 1</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.emoji} {player.name}
              </option>
            ))}
          </select>
          <select
            className="p-2 border rounded-md w-full md:w-auto relative z-50"
            value={filterPlayer2}
            onChange={(e) => setFilterPlayer2(e.target.value)}
          >
            <option value="">Filter Player 2</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.emoji} {player.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 md:px-4">Date</th>
              <th className="text-left py-2 px-2 md:px-4">Player 1</th>
              <th className="text-left py-2 px-2 md:px-4">Score</th>
              <th className="text-left py-2 px-2 md:px-4">Player 2</th>
              <th className="text-left py-2 px-2 md:px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.id} className="border-b">
                <td className="py-2 px-2 md:px-4">
                  {new Date(match.played_at).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </td>
                <td className="py-2 px-2 md:px-4">
                  <span className="mr-2">{match.player1?.emoji}</span>
                  {match.player1?.name}
                  {match.player1?.nickname && (
                    <span className="text-gray-500 ml-2 hidden md:inline">
                      ({match.player1.nickname})
                    </span>
                  )}
                </td>
                <td className="py-2 px-2 md:px-4">
                  {match.player1_score} - {match.player2_score}
                </td>
                <td className="py-2 px-2 md:px-4">
                  <span className="mr-2">{match.player2?.emoji}</span>
                  {match.player2?.name}
                  {match.player2?.nickname && (
                    <span className="text-gray-500 ml-2 hidden md:inline">
                      ({match.player2.nickname})
                    </span>
                  )}
                </td>
                <td className="py-2 px-2 md:px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditMatch(match)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteMatch(match.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
