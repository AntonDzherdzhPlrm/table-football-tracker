import { Link } from "react-router-dom";
import { Trophy, User, Users } from "lucide-react";

export function Home() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <Trophy className="h-16 w-16 text-orange-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Table Football Tracker
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Track matches, players, and rankings for your table football games.
          Choose which type of matches you want to view:
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            to="/individual"
            className="flex flex-col items-center p-6 bg-gray-50 hover:bg-orange-50 border hover:border-orange-200 rounded-lg transition-colors group"
          >
            <User className="h-12 w-12 text-gray-700 group-hover:text-orange-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Individual Matches
            </h2>
            <p className="text-gray-600">
              Track 1v1 matches between players, view individual rankings and
              stats
            </p>
          </Link>

          <Link
            to="/team"
            className="flex flex-col items-center p-6 bg-gray-50 hover:bg-orange-50 border hover:border-orange-200 rounded-lg transition-colors group"
          >
            <Users className="h-12 w-12 text-gray-700 group-hover:text-orange-600 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Team Matches
            </h2>
            <p className="text-gray-600">
              Track matches between teams of players, view team rankings and
              stats
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
