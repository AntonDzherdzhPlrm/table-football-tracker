import { useLocalization } from "../lib/LocalizationContext";

export function PrivacyPolicy() {
  const { t } = useLocalization();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-gray-800/50 backdrop-blur-sm text-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {t("privacy.title")}
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">
            Information We Collect
          </h2>
          <p className="mb-4">
            We collect information you provide directly to us when you create an
            account, including your name, email address, and optional profile
            picture.
          </p>
          <p>
            We also automatically collect certain information about your device
            when you use our website, including your IP address, browser type,
            operating system, and other usage details.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">
            How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>
              To allow you to participate in interactive features when you
              choose to do so
            </li>
            <li>To provide customer support</li>
            <li>
              To gather analysis or valuable information so that we can improve
              our service
            </li>
            <li>To monitor the usage of our service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">
            Data Retention
          </h2>
          <p>
            We will retain your personal data only for as long as is necessary
            for the purposes set out in this Privacy Policy. We will retain and
            use your personal data to the extent necessary to comply with our
            legal obligations, resolve disputes, and enforce our legal
            agreements and policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">
            Security
          </h2>
          <p>
            The security of your data is important to us, but remember that no
            method of transmission over the Internet or method of electronic
            storage is 100% secure. While we strive to use commercially
            acceptable means to protect your personal data, we cannot guarantee
            its absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">
            Your Rights
          </h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Access the personal data we hold about you</li>
            <li>
              Request correction of any inaccurate personal data we hold about
              you
            </li>
            <li>Request deletion of your personal data</li>
            <li>Object to processing of your personal data</li>
            <li>Request restriction of processing of your personal data</li>
            <li>Request transfer of your personal data</li>
            <li>
              Withdraw consent at any time where we are relying on consent to
              process your personal data
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">
            Changes to This Privacy Policy
          </h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last Updated" date at the top of this Privacy
            Policy.
          </p>
        </section>
      </div>
    </div>
  );
}
