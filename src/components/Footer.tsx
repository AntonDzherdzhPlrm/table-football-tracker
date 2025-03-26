import { Link } from "react-router-dom";
import { useLocalization } from "../lib/LocalizationContext";

export function Footer() {
  const { t } = useLocalization();

  return (
    <footer className="bg-gray-900/90 backdrop-blur-sm text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400">{t("footer.rights")}</p>
          </div>
          <div className="flex space-x-6">
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
      </div>
    </footer>
  );
}
