import { useLocalization } from "../lib/LocalizationContext";

export function TermsOfUse() {
  const { t } = useLocalization();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-gray-800/50 backdrop-blur-sm text-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {t("terms.title")}
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">
            Acceptance of Terms
          </h2>
          <p>
            By accessing or using the Table Football Tracker website, you agree
            to be bound by these Terms of Use. If you do not agree to these
            terms, please do not use our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">
            User Accounts
          </h2>
          <p className="mb-4">
            When you create an account with us, you must provide information
            that is accurate, complete, and current at all times. Failure to do
            so constitutes a breach of the Terms, which may result in immediate
            termination of your account.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to
            access the service and for any activities or actions under your
            password.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">
            Content Policy
          </h2>
          <p className="mb-4">
            Our service allows you to post, link, store, share and otherwise
            make available certain information, text, graphics, or other
            material. You are responsible for the content that you post to the
            service, including its legality, reliability, and appropriateness.
          </p>
          <p>
            By posting content to the service, you grant us the right to use,
            modify, publicly perform, publicly display, reproduce, and
            distribute such content on and through the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">
            Intellectual Property
          </h2>
          <p>
            The service and its original content, features, and functionality
            are and will remain the exclusive property of Table Football Tracker
            and its licensors. The service is protected by copyright, trademark,
            and other laws of both the United States and foreign countries.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">
            Termination
          </h2>
          <p>
            We may terminate or suspend your account immediately, without prior
            notice or liability, for any reason whatsoever, including without
            limitation if you breach the Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">
            Limitation of Liability
          </h2>
          <p>
            In no event shall Table Football Tracker, nor its directors,
            employees, partners, agents, suppliers, or affiliates, be liable for
            any indirect, incidental, special, consequential or punitive
            damages, including without limitation, loss of profits, data, use,
            goodwill, or other intangible losses, resulting from your access to
            or use of or inability to access or use the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-orange-400">
            Changes to Terms
          </h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. If a revision is material we will try to
            provide at least 30 days notice prior to any new terms taking
            effect.
          </p>
        </section>
      </div>
    </div>
  );
}
