import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

// Define available languages
export type Language = "en" | "uk" | "pl";

// Create context type
type LocalizationContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
};

// Create the context
const LocalizationContext = createContext<LocalizationContextType | undefined>(
  undefined
);

// Create a provider component
export function LocalizationProvider({ children }: { children: ReactNode }) {
  // Get saved language preference or use browser language or default to English
  const getSavedLanguage = (): Language => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["en", "uk", "pl"].includes(savedLanguage)) {
      return savedLanguage;
    }

    // Try to detect from browser
    const browserLang = navigator.language.split("-")[0];
    if (browserLang === "uk") return "uk";
    if (browserLang === "pl") return "pl";

    return "en"; // Default to English
  };

  const [language, setLanguageState] = useState<Language>("en");
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Set language and save to localStorage
  const setLanguage = (newLanguage: Language) => {
    localStorage.setItem("language", newLanguage);
    setLanguageState(newLanguage);
  };

  // Load translations for current language
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const translationModule = await import(
          `../translations/${language}.json`
        );
        setTranslations(translationModule.default);
      } catch (error) {
        console.error(`Failed to load translations for ${language}`, error);
        // Fallback to English if translations fail to load
        if (language !== "en") {
          const fallbackModule = await import("../translations/en.json");
          setTranslations(fallbackModule.default);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  // Initialize language from localStorage or browser
  useEffect(() => {
    setLanguageState(getSavedLanguage());
  }, []);

  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    // If translations are still loading, return the key
    if (isLoading) return key;

    // Get the translation or fall back to the key
    let translation = translations[key] || key;

    // Replace parameters if any
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{{${paramKey}}}`, value);
      });
    }

    return translation;
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
}

// Custom hook to use localization
export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error(
      "useLocalization must be used within a LocalizationProvider"
    );
  }
  return context;
}
