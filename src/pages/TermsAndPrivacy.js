import React from "react";

const TermsAndPrivacy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-100">
      <h1 className="text-3xl font-bold mb-4">Terms of Use & Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">1. Experimental Platform</h2>
        <p>
          Degen Games is an <strong>experimental platform under development</strong>, intended for testing,
          educational, and entertainment purposes only. No guarantees are provided regarding functionality,
          stability, or security. Use at your own risk.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">2. Wallet Connection Disclaimer</h2>
        <p>
          Degen Games may prompt users to connect a Web3 wallet (e.g., MetaMask).{' '}
          <strong>You are solely responsible</strong> for reviewing and verifying all interactions.
        </p>
        <p className="mt-2">
          <strong>DO NOT connect wallets with more than 10 USDT or any assets of significant value.</strong>{' '}
          We do not store, access, or manage your private keys or assets.
        </p>
        <p className="mt-2">
          We are not liable for any loss, theft, unauthorized access, or damages resulting from wallet use,
          smart contract interactions, or third-party breaches.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">3. Limitation of Liability</h2>
        <p>
          Degen Games and its operators shall <strong>not be held liable</strong> for any damages – direct or indirect
          – arising from your use of the platform. No warranties of any kind are provided.
        </p>
        <p className="mt-2">
          You acknowledge that the platform may contain bugs, exploits, or be subject to downtime or
          malicious activity.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">4. User Responsibility</h2>
        <p>
          Users are responsible for understanding Web3 technologies and accepting the risks involved. Degen
          Games should not be used for any critical or financial reliance.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">5. Final Disclaimer</h2>
        <p>
          Degen Games is provided <strong>“as-is”</strong> and <strong>“as-available”</strong>. Your use confirms
          your understanding and acceptance of all associated risks.
        </p>
      </section>

      <hr className="my-6" />

      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">1. Data Collection</h2>
        <p>
          Degen Games does not collect personal identifying information unless you explicitly provide it.
          Anonymous data (such as browser type, time of visit, and country) may be collected for analytics.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">2. Use of Cookies</h2>
        <p>
          This site may use <strong>cookies</strong> to improve user experience, track performance, and store
          minimal local preferences. By using the site, you consent to the use of cookies.
        </p>
        <p className="mt-2">
          You can disable cookies via your browser settings. Please note that disabling cookies may affect
          site functionality.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">3. Wallet & Blockchain Data</h2>
        <p>
          If you connect a Web3 wallet, the only data accessible to us is your public wallet address and
          related public blockchain activity. No private keys or sensitive data are ever accessed or stored.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">4. Third-Party Services</h2>
        <p>
          We may use third-party services (e.g., analytics or authentication tools). These services may
          collect limited data per their own policies. Degen Games is not responsible for third-party data
          practices.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">5. Updates</h2>
        <p>
          This policy may be updated from time to time. Continued use of the platform after changes constitutes
          your agreement to the revised terms.
        </p>
      </section>
    </div>
  );
};

export default TermsAndPrivacy;
