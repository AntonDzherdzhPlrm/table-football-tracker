import { Trophy, Users } from 'lucide-react';

type TeamActionButtonsProps = {
  onNewMatch: () => void;
  onNewTeam: () => void;
};

export function TeamActionButtons({ onNewMatch, onNewTeam }: TeamActionButtonsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <button
        onClick={onNewMatch}
        className="bg-white/90 backdrop-blur p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow w-full text-center text-xl font-semibold flex items-center justify-center gap-2"
      >
        <Trophy className="h-5 w-5 text-orange-500" />
        Record Team Match
      </button>

      <button
        onClick={onNewTeam}
        className="bg-white/90 backdrop-blur p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow w-full text-center text-xl font-semibold flex items-center justify-center gap-2"
      >
        <Users className="h-5 w-5 text-orange-500" />
        Create New Team
      </button>
    </div>
  );
}