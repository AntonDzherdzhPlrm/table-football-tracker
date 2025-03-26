export function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white/90 backdrop-blur rounded-lg shadow-md my-8">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">
        Privacy Policy
      </h1>

      <section className="mb-8">
        <p className="mb-4">
          This Privacy Policy describes how Table Football Tracker ("we", "us",
          or "our") collects, uses, and shares your personal information when
          you use our website.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
        <p className="mb-4">
          When you use Table Football Tracker, we may collect the following
          types of information:
        </p>
        <ul className="space-y-3 list-disc pl-5">
          <li>
            <strong>Personal Information:</strong> Names and nicknames of
            players.
          </li>
          <li>
            <strong>Usage Data:</strong> Match scores, game statistics, and
            rankings.
          </li>
          <li>
            <strong>Technical Data:</strong> IP address, browser type, device
            information, and cookies.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          How We Use Your Information
        </h2>
        <p className="mb-4">We use your information to:</p>
        <ul className="space-y-3 list-disc pl-5">
          <li>Provide, maintain, and improve Table Football Tracker.</li>
          <li>Generate player statistics and rankings.</li>
          <li>Track match history and results.</li>
          <li>Analyze usage patterns to enhance user experience.</li>
          <li>Communicate with you about updates or changes to our service.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Data Storage and Security
        </h2>
        <p className="mb-4">
          All user data is stored in our Supabase database. We implement
          appropriate security measures to protect your personal information
          from unauthorized access, alteration, or disclosure.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Sharing Your Information
        </h2>
        <p className="mb-4">
          We do not sell or rent your personal information to third parties. We
          may share your information in the following circumstances:
        </p>
        <ul className="space-y-3 list-disc pl-5">
          <li>With your consent.</li>
          <li>To comply with legal obligations.</li>
          <li>To protect our rights or the safety of users.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
        <p className="mb-4">
          Depending on your location, you may have the following rights
          regarding your data:
        </p>
        <ul className="space-y-3 list-disc pl-5">
          <li>Access to your personal information.</li>
          <li>Correction of inaccurate data.</li>
          <li>Deletion of your data.</li>
          <li>Objection to processing of your data.</li>
          <li>Data portability.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Changes to This Privacy Policy
        </h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page and
          updating the "Last updated" date.
        </p>
      </section>
    </div>
  );
}
