import React, { useEffect, useState } from "react";
import TermsModal from "../components/TermsModal";

export const Main = ({ children }) => {
  const [termsAccepted, setTermsAccepted] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const accepted = localStorage.getItem("degenGamesTermsAccepted") === "true";
      setTermsAccepted(accepted);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("degenGamesTermsAccepted", "true");
    setTermsAccepted(true);
  };

  if (termsAccepted === null) return null;

  return (
    <main className="bg-gray-700 flex-grow relative min-h-screen">
      {!termsAccepted && <TermsModal onAccept={handleAccept} />}
      {children}
    </main>
  );
};
