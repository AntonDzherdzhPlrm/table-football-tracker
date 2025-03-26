import React from "react";
import { useLocalization } from "../lib/LocalizationContext";

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLocalization();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as "en" | "uk" | "pl");
  };

  return (
    <div className="language-selector text-white">
      <select
        id="language-select"
        value={language}
        onChange={handleLanguageChange}
        className="bg-transparent border border-gray-700 rounded-md px-2 py-1 text-sm cursor-pointer hover:border-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        aria-label={t("language.selector")}
      >
        <option value="en" className="bg-gray-800 text-white">
          {t("language.en")}
        </option>
        <option value="uk" className="bg-gray-800 text-white">
          {t("language.uk")}
        </option>
        <option value="pl" className="bg-gray-800 text-white">
          {t("language.pl")}
        </option>
      </select>
    </div>
  );
};

export default LanguageSelector;
