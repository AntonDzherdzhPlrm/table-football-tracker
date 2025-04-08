import { Link } from "react-router-dom";
import { useLocalization } from "../lib/LocalizationContext";

export function Footer() {
  const { t } = useLocalization();

  return (
    <footer className="bg-gray-900/90 backdrop-blur-sm text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="md:block hidden">
            <p className="text-sm text-gray-400">{t("footer.rights")}</p>
          </div>
          <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-6">
            <div className="flex space-x-6 mb-3 md:mb-0">
              <Link
                to="/privacy-policy"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {t("footer.privacy")}
              </Link>
              <Link
                to="/terms-of-use"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {t("footer.terms")}
              </Link>
            </div>
          </div>
          <div className="block md:hidden mt-3">
            <p className="text-xs text-gray-500">
              © 2025 Football Table Tracker. Created by Anton Dzherdzh. All
              rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
