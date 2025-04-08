import { Trophy, Menu, X, User, Users, BookOpen, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLocalization } from "../lib/LocalizationContext";
import LanguageSelector from "./LanguageSelector";

export function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLocalization();

  const activeTab =
    location.pathname === "/team"
      ? "team"
      : location.pathname === "/individual"
      ? "individual"
      : location.pathname === "/rules"
      ? "rules"
      : location.pathname === "/management"
      ? "management"
      : "home";

  return (
    <header className="bg-gray-900/90 backdrop-blur-sm text-white shadow-lg relative z-[100]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center space-x-4 hover:text-orange-300 transition-colors"
            aria-label={t("app.title")}
          >
            <Trophy className="h-8 w-8 text-orange-500" />
          </Link>
          <div className="flex-1 flex items-center justify-center">
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/individual"
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  activeTab === "individual"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <User className="h-4 w-4" />
                {t("nav.individual")}
              </Link>
              <Link
                to="/team"
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  activeTab === "team"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Users className="h-4 w-4" />
                {t("nav.team")}
              </Link>
              <Link
                to="/management"
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  activeTab === "management"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Settings className="h-4 w-4" />
                {t("nav.management")}
              </Link>
              <Link
                to="/rules"
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  activeTab === "rules"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                {t("nav.rules")}
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {/* Language Selector */}
            <div className="hidden md:block">
              <LanguageSelector />
            </div>

            <motion.button
              className="md:hidden ml-4"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -180, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-gray-800 overflow-hidden fixed top-16 left-0 right-0 z-[200]"
          >
            <motion.div
              className="px-4 py-3 space-y-3"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Link
                to="/"
                onClick={() => {
                  setIsMenuOpen(false);
                }}
                className={`w-full px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  activeTab === "home"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Trophy className="h-4 w-4" />
                {t("nav.home")}
              </Link>
              <Link
                to="/individual"
                onClick={() => {
                  setIsMenuOpen(false);
                }}
                className={`w-full px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  activeTab === "individual"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <User className="h-4 w-4" />
                {t("nav.individual")}
              </Link>
              <Link
                to="/team"
                onClick={() => {
                  setIsMenuOpen(false);
                }}
                className={`w-full px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  activeTab === "team"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Users className="h-4 w-4" />
                {t("nav.team")}
              </Link>
              <Link
                to="/management"
                onClick={() => {
                  setIsMenuOpen(false);
                }}
                className={`w-full px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  activeTab === "management"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Settings className="h-4 w-4" />
                {t("nav.management")}
              </Link>
              <Link
                to="/rules"
                onClick={() => {
                  setIsMenuOpen(false);
                }}
                className={`w-full px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  activeTab === "rules"
                    ? "bg-orange-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                {t("nav.rules")}
              </Link>

              {/* Language Selector in mobile menu */}
              <div className="pt-2">
                <LanguageSelector />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
