import { Edit2, Trash2 } from "lucide-react";

type Team = {
  id: string;
  name: string;
  emoji: string;
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

type TeamMatchHistoryProps = {
  matches: TeamMatch[];
  teams: Team[];
  filterTeam1: string;
  filterTeam2: string;
  setFilterTeam1: (value: string) => void;
  setFilterTeam2: (value: string) => void;
  onEditMatch: (match: TeamMatch) => void;
  onDeleteMatch: (matchId: string) => void;
};

export function TeamMatchHistory({
  matches,
  teams,
  filterTeam1,
  filterTeam2,
  setFilterTeam1,
  setFilterTeam2,
  onEditMatch,
  onDeleteMatch,
}: TeamMatchHistoryProps) {
  return (
    <div className="bg-white/90 backdrop-blur p-6 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Team Match History</h2>
        <div className="flex gap-4 mt-4 md:mt-0 w-full md:w-auto">
          <select
            className="p-2 border rounded-md w-full md:w-auto relative z-50"
            value={filterTeam1}
            onChange={(e) => setFilterTeam1(e.target.value)}
          >
            <option value="">Filter Team 1</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.emoji} {team.name}
              </option>
            ))}
          </select>
          <select
            className="p-2 border rounded-md w-full md:w-auto relative z-50"
            value={filterTeam2}
            onChange={(e) => setFilterTeam2(e.target.value)}
          >
            <option value="">Filter Team 2</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.emoji} {team.name}
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
              <th className="text-left py-2 px-2 md:px-4">Team 1</th>
              <th className="text-left py-2 px-2 md:px-4">Score</th>
              <th className="text-left py-2 px-2 md:px-4">Team 2</th>
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
                  <span className="mr-2">{match.team1?.emoji}</span>
                  {match.team1?.name}
                </td>
                <td className="py-2 px-2 md:px-4">
                  {match.team1_score} - {match.team2_score}
                </td>
                <td className="py-2 px-2 md:px-4">
                  <span className="mr-2">{match.team2?.emoji}</span>
                  {match.team2?.name}
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
