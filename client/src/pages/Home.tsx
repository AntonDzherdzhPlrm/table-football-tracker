import { Link } from "react-router-dom";
import { Trophy, User, Users, BookOpen } from "lucide-react";
import { useLocalization } from "../lib/LocalizationContext";

export function Home() {
  const { t } = useLocalization();

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-16">
        <div className="flex justify-center mb-4">
          <Trophy className="h-16 w-16 text-orange-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-glow">
          {t("app.title")}
        </h1>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto">
          {t("home.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Link
          to="/individual"
          className="bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 transition-colors p-6 rounded-xl border border-gray-700/50 shadow-xl group"
        >
          <div className="flex flex-col items-center text-center">
            <User className="h-12 w-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold text-white mb-2">
              {t("nav.individual")}
            </h2>
            <p className="text-gray-400">{t("home.individual.description")}</p>
          </div>
        </Link>

        <Link
          to="/team"
          className="bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 transition-colors p-6 rounded-xl border border-gray-700/50 shadow-xl group"
        >
          <div className="flex flex-col items-center text-center">
            <Users className="h-12 w-12 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold text-white mb-2">
              {t("nav.team")}
            </h2>
            <p className="text-gray-400">{t("home.team.description")}</p>
          </div>
        </Link>

        <Link
          to="/rules"
          className="bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 transition-colors p-6 rounded-xl border border-gray-700/50 shadow-xl group"
        >
          <div className="flex flex-col items-center text-center">
            <BookOpen className="h-12 w-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-bold text-white mb-2">
              {t("nav.rules")}
            </h2>
            <p className="text-gray-400">{t("home.rules.description")}</p>
          </div>
        </Link>
      </div>

      <div className="text-center">
        <p className="text-white opacity-70 mb-4">{t("home.footer")}</p>
      </div>
    </div>
  );
}
