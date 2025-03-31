import React, { useEffect, useState } from "react";

const TermsModal = ({ onAccept }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Delay the animation by 100ms to trigger the slide-in
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-gray-800 shadow-2xl p-4 sm:p-6 text-white rounded-t-2xl max-w-3xl mx-auto mb-4">
        <h2 className="text-xl font-semibold mb-2">Terms of Use & Privacy</h2>
        <p className="text-sm mb-2">
          Degen Games is an <strong>experimental platform</strong>. Do not use wallets with more than 10 USDT.
        </p>
        <p className="text-sm mb-4">
          By continuing, you agree to our{" "}
          <a href="/terms" target="_blank" className="text-blue-600 underline">
            Terms of Use & Privacy Policy
          </a>.
        </p>
        <div className="text-right">
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onAccept, 500); // Wait for animation to finish
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            I Understand and Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
