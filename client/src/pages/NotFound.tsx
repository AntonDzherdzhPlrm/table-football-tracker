import { Link } from "react-router-dom";
import { useLocalization } from "../lib/LocalizationContext";

export function NotFound() {
  const { t } = useLocalization();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="bg-gray-800/50 backdrop-blur-sm text-white p-8 rounded-lg max-w-md">
        <h1 className="text-4xl font-bold text-orange-500 mb-4">
          {t("notfound.title")}
        </h1>
        <p className="text-gray-300 mb-6">{t("notfound.message")}</p>
        <Link
          to="/"
          className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-500 transition-colors"
        >
          {t("notfound.back")}
        </Link>
      </div>
    </div>
  );
}
