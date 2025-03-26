import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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
    const { data, error } = await supabase.from("players").select("*");
    if (error) throw error;
    if (data) setPlayers(data);
  }

  async function fetchTeams() {
    const { data, error } = await supabase.from("teams").select("*");
    if (error) throw error;
    if (data) setTeams(data);
  }

  async function fetchTeamStats() {
    const { data, error } = await supabase.from("team_stats").select("*");
    if (error) throw error;
    if (data) setTeamStats(data);
  }

  async function fetchTeamMatches() {
    let query = supabase
      .from("team_matches")
      .select(
        `
        *,
        team1:team1_id(id, name, emoji),
        team2:team2_id(id, name, emoji)
      `
      )
      .order("played_at", { ascending: false });

    if (filterTeam1 && filterTeam1 !== "all") {
      query = query.eq("team1_id", filterTeam1);
    }
    if (filterTeam2 && filterTeam2 !== "all") {
      query = query.eq("team2_id", filterTeam2);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (data) setTeamMatches(data);
  }

  async function addTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!teamName.trim() || !selectedPlayer1 || !selectedPlayer2) return;

    try {
      // Insert team
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .insert([
          {
            name: teamName.trim(),
            emoji: teamEmoji,
          },
        ])
        .select()
        .single();

      if (teamError) throw teamError;

      // Insert team players
      const { error: playersError } = await supabase
        .from("team_players")
        .insert([
          { team_id: teamData.id, player_id: selectedPlayer1 },
          { team_id: teamData.id, player_id: selectedPlayer2 },
        ]);

      if (playersError) throw playersError;

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
      const { error: teamError } = await supabase
        .from("teams")
        .update({
          name: teamName.trim(),
          emoji: teamEmoji,
        })
        .eq("id", editingTeam.id);

      if (teamError) throw teamError;

      // Delete existing team players
      const { error: deleteError } = await supabase
        .from("team_players")
        .delete()
        .eq("team_id", editingTeam.id);

      if (deleteError) throw deleteError;

      // Insert new team players
      const { error: playersError } = await supabase
        .from("team_players")
        .insert([
          { team_id: editingTeam.id, player_id: selectedPlayer1 },
          { team_id: editingTeam.id, player_id: selectedPlayer2 },
        ]);

      if (playersError) throw playersError;

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
        const { error } = await supabase
          .from("team_matches")
          .update(matchData)
          .eq("id", editingMatch.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("team_matches")
          .insert([matchData]);
        if (error) throw error;
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
      const { error } = await supabase
        .from("team_matches")
        .delete()
        .eq("id", matchId);

      if (error) throw error;
      await Promise.all([fetchTeamMatches(), fetchTeamStats()]);
    } catch (err) {
      setError(t("common.error") + ": " + t("team.confirm_delete_match"));
    }
  }

  async function deleteTeam(teamId: string) {
    try {
      // First delete team players
      const { error: playersError } = await supabase
        .from("team_players")
        .delete()
        .eq("team_id", teamId);

      if (playersError) throw playersError;

      // Then delete the team
      const { error: teamError } = await supabase
        .from("teams")
        .delete()
        .eq("id", teamId);

      if (teamError) throw teamError;

      await Promise.all([fetchTeams(), fetchTeamStats()]);
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
    setTeamEmoji(team.emoji);
    // Fetch team players
    supabase
      .from("team_players")
      .select("player_id")
      .eq("team_id", team.id)
      .then(({ data, error }) => {
        if (!error && data) {
          setSelectedPlayer1(data[0]?.player_id || "");
          setSelectedPlayer2(data[1]?.player_id || "");
        }
      });
    setIsTeamDialogOpen(true);
  }

  useEffect(() => {
    fetchTeamMatches();
  }, [filterTeam1, filterTeam2]);

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
