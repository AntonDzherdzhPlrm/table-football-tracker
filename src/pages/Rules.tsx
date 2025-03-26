import { useLocalization } from "../lib/LocalizationContext";

export function Rules() {
  const { t } = useLocalization();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-gray-800/70 backdrop-blur-sm text-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {t("rules.title")}
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">
            {t("rules.basic")}
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>{t("rules.basic.1")}</li>
            <li>{t("rules.basic.2")}</li>
            <li>{t("rules.basic.3")}</li>
            <li>{t("rules.basic.4")}</li>
            <li>{t("rules.basic.5")}</li>
            <li>{t("rules.basic.6")}</li>
            <li>{t("rules.basic.7")}</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">
            {t("rules.fouls")}
          </h2>
          <ul className="list-disc pl-5 space-y-3">
            <li>{t("rules.fouls.spinning")}</li>
            <li>{t("rules.fouls.deadball")}</li>
            <li>{t("rules.fouls.jarring")}</li>
            <li>{t("rules.fouls.reaching")}</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">
            {t("rules.serving")}
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>{t("rules.serving.1")}</li>
            <li>{t("rules.serving.2")}</li>
            <li>{t("rules.serving.3")}</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">
            {t("rules.scoring")}
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>{t("rules.scoring.1")}</li>
            <li>{t("rules.scoring.2")}</li>
            <li>{t("rules.scoring.3")}</li>
          </ul>
          <p className="mt-4">{t("rules.scoring.rankings")}</p>
          <ol className="list-decimal pl-8 mt-2 space-y-1">
            <li>{t("rules.scoring.rankings.1")}</li>
            <li>{t("rules.scoring.rankings.2")}</li>
            <li>{t("rules.scoring.rankings.3")}</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">
            {t("rules.match")}
          </h2>
          <p>{t("rules.match.desc")}</p>
          <ol className="list-decimal pl-5 mt-3 space-y-2">
            <li>{t("rules.match.1")}</li>
            <li>{t("rules.match.2")}</li>
            <li>{t("rules.match.3")}</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">
            {t("rules.etiquette")}
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>{t("rules.etiquette.1")}</li>
            <li>{t("rules.etiquette.2")}</li>
            <li>{t("rules.etiquette.3")}</li>
            <li>{t("rules.etiquette.4")}</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
