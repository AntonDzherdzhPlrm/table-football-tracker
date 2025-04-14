import { useLocalization } from "../../lib/LocalizationContext";

interface CategoryButtonsProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

/**
 * A reusable component for displaying emoji category selection buttons
 * Used in both PlayerDialog and TeamDialog components
 */
export function CategoryButtons({
  selectedCategory,
  setSelectedCategory,
}: CategoryButtonsProps) {
  const { t } = useLocalization();

  // Categories to display
  const categories = [
    { id: "all", label: "common.categories.all" },
    { id: "sports", label: "common.categories.sports" },
    { id: "animals", label: "common.categories.animals" },
    { id: "general", label: "common.categories.general" },
    { id: "games", label: "common.categories.games" },
    { id: "arts", label: "common.categories.arts" },
    { id: "tech", label: "common.categories.tech" },
  ];

  return (
    <div className="flex flex-wrap gap-1 mb-2">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={`px-2 py-1 text-xs rounded-md ${
            selectedCategory === category.id
              ? "bg-orange-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setSelectedCategory(category.id)}
        >
          {t(category.label)}
        </button>
      ))}
    </div>
  );
}
