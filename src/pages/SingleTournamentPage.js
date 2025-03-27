import React from "react";
import { Users, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

// הדוגמה מציגה טורניר יחיד במקום רשימת חדרים
const SingleTournamentPage = () => {
  const navigate = useNavigate();

  // אובייקט יחיד שמייצג את הטורניר
  const tournament = {
    id: 999,
    name: "Chess Monad Tournament",
    entryFeeUSDT: 2,
    image: "./chess-monad-tournament.png", // תמונת הטורניר
    type: "Tournament",
    currency: "USDT"
  };

  // פונקציה שמנתבת לדף הפרטים של הטורניר
  const handleTournamentClick = () => {
    // המרה ל-slug עבור ה-URL
    const tournamentSlug = tournament.name
      .toLowerCase()
      .replace(/\s+/g, "-");

    // מעבר לדף הפרטים ושולחים את המידע ב-state
    navigate(`/tournamentdetails/${tournamentSlug}/${tournament.entryFeeUSDT}`, {
      state: { tournamentData: tournament },
    });
  };

  // אנימציה לדוט הירוק (כמו בדוגמה הקודמת)
  const pulsingDotAnimation = `
    @keyframes pulse {
      0% {
        opacity: 0.6;
        transform: scale(0.9);
      }
      50% {
        opacity: 1;
        transform: scale(1.1);
      }
      100% {
        opacity: 0.6;
        transform: scale(0.9);
      }
    }
    .pulse-dot {
      animation: pulse 1.5s infinite;
    }
  `;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* הגדרת האנימציה של הנקודה הירוקה */}
      <style>{pulsingDotAnimation}</style>

      <h2 className="text-3xl font-bold text-gray-100 mb-5 text-center">
        Now Live! 🔴 Chess Monad Tournament 🔥
      </h2>

      <div 
        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-red-500 transition-colors duration-200 cursor-pointer
                   mx-auto w-full"
        onClick={handleTournamentClick}
      >
        <div className="relative h-60">
          <img
            src={tournament.image || "/default-tournament.jpg"}
            alt={tournament.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

          <div className="absolute top-3 left-3 bg-purple-600 px-2 py-1 rounded-md text-sm font-medium">
            {tournament.type}
          </div>

          {tournament.currency && (
            <div
              className="absolute top-14 left-3 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"
              style={{
                backgroundColor:
                  tournament.currency === "USDT"
                    ? "rgba(0,128,0,0.7)"
                    : "rgba(255,215,0,0.3)",
                color:
                  tournament.currency === "USDT"
                    ? "white"
                    : "rgb(255,215,0)",
              }}
            >
              {tournament.currency === "USDT" ? (
                <>
                  <img
                    src="./USDT.png"
                    alt="USDT"
                    className="w-4 h-4"
                  />
                  <span>USDT</span>
                </>
              ) : (
                <>
                  <img
                    src="./favi.png"
                    alt="ePVP"
                    className="w-4 h-4"
                  />
                  <span>ePVP</span>
                </>
              )}
            </div>
          )}

          {/* כותרת הטורניר למטה */}
          <div className="absolute bottom-0 right-0 left-0 p-3">
            <div className="flex justify-between items-end">
              <h3 className="text-xl font-bold text-white transition-colors">
                {tournament.name}
              </h3>
              <div className="bg-gray-900 bg-opacity-70 rounded px-2 py-1">
                <div className="flex items-center text-sm">
                  <Users size={16} className="text-gray-300 mr-1" />
                  <span>
                    {tournament.participantsRequired}{" "}
                    <span className="text-gray-400">Participants:  </span>
                    100 Players
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              {tournament.currency === "USDT" ? (
                <>
                  <img
                    src="./USDT.png"
                    alt="USDT"
                    className="w-5 h-5 mr-1"
                  />
                  <span className="font-medium text-green-400 text-lg">
                    {tournament.entryFeeUSDT}
                  </span>
                </>
              ) : (
                <>
                  <img
                    src="./favi.png"
                    alt="ePVP"
                    className="w-5 h-5 mr-1"
                  />
                  <span className="font-medium text-yellow-400 text-lg">
                    כניסה ב-ePVP
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-400 flex items-center">
              <Brain size={14} className="mr-1 text-purple-400" />
              <span>Skill-based Tournament</span>
            </div>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
              onClick={handleTournamentClick}
            >
              Join
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="bg-gray-750 rounded-md p-2.5 text-xs">
              {tournament.currency === "USDT" ? (
                <div className="flex justify-between">
                  <div>
                    <div className="text-gray-400 mb-1">Win Rewards:</div>
                    <div className="flex items-center">
                      <img
                        src="./USDT.png"
                        alt="USDT"
                        className="w-3 h-3 mr-1"
                      />
                      <span className="text-green-400">
                        +{tournament.entryFeeUSDT * 150} USDT
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <img
                        src="./favi.png"
                        alt="ePVP"
                        className="w-3 h-3 mr-1"
                      />
                      <span className="text-yellow-400">+50000 ePVP</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-400 mb-1">Participation:</div>
                    <div className="flex items-center justify-end">
                      <img
                        src="/favi.png"
                        alt="ePVP"
                        className="w-3 h-3 mr-1"
                      />
                      <span className="text-yellow-400">+500 ePVP</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-gray-400">
                    Rewards based on entry fee + performance
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTournamentPage;
