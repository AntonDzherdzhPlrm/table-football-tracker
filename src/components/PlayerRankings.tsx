import { useLocalization } from "../lib/LocalizationContext";

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

type PlayerRankingsProps = {
  playerStats: PlayerStats[];
};

export function PlayerRankings({ playerStats }: PlayerRankingsProps) {
  const { t } = useLocalization();

  return (
    <div className="bg-white/90 backdrop-blur p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t("individual.rankings")}</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 md:px-4">Pos</th>
              <th className="text-left py-2 px-2 md:px-4">
                {t("individual.player_name")}
              </th>
              <th className="text-left py-2 px-2 md:px-4 hidden md:table-cell">
                {t("individual.player_nickname")}
              </th>
              <th className="text-left py-2 px-2 md:px-4">
                {t("individual.stats.matches").charAt(0)}
              </th>
              <th className="text-left py-2 px-2 md:px-4">
                {t("individual.stats.wins").charAt(0)}
              </th>
              <th className="text-left py-2 px-2 md:px-4">
                {t("individual.stats.draws").charAt(0)}
              </th>
              <th className="text-left py-2 px-2 md:px-4">
                {t("individual.stats.losses").charAt(0)}
              </th>
              <th className="text-left py-2 px-2 md:px-4">
                {t("individual.stats.points").charAt(0)}
              </th>
            </tr>
          </thead>
          <tbody>
            {playerStats.map((stats, index) => (
              <tr key={stats.id} className="border-b">
                <td className="py-2 px-2 md:px-4">{index + 1}</td>
                <td className="py-2 px-2 md:px-4">
                  <span className="mr-2">{stats.emoji}</span>
                  {stats.name}
                </td>
                <td className="py-2 px-2 md:px-4 hidden md:table-cell">
                  {stats.nickname}
                </td>
                <td className="py-2 px-2 md:px-4">{stats.matches_played}</td>
                <td className="py-2 px-2 md:px-4">{stats.wins}</td>
                <td className="py-2 px-2 md:px-4">{stats.draws}</td>
                <td className="py-2 px-2 md:px-4">{stats.losses}</td>
                <td className="py-2 px-2 md:px-4">{stats.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
