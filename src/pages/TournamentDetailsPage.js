import React, { useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTournament } from "../context/TournamentContext"; // קונטקסט לטורנירים
import { joinTournamentOrCreate } from "../services/TournamentService"; // שירות מותאם
import { updateUser } from "../services/userServices";

import TournamentHeaderSection from "../components/TournamentDetails/TournamentHeaderSection";
import TournamentInfoSection from "../components/TournamentDetails/TournamentInfoSection";
import TournamentSidebarSection from "../components/TournamentDetails/TournamentSidebarSection";
import TournamentActionsSection from "../components/TournamentDetails/TournamentActionsSection";

const TournamentDetailsPage = () => {
  const { user, setUser } = useAuth() || {};
  const { contextTournament, setContextTournament } = useTournament() || {};
  const { tournamentSlug, entryFee } = useParams();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const tournament = {
    name: tournamentSlug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    type: tournamentSlug,
    currency: "USDT",
    entryFeeUSDT: Number(entryFee),
    participantsRequired: 16,
    image: `/${tournamentSlug}.png`,
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleJoinTournament = () => {
    setShowConfirmModal(true);
  };

  const cancelJoin = () => {
    setShowConfirmModal(false);
  };

  const confirmJoin = useCallback(async () => {
    if (!user || isProcessing) return;

    try {
      setIsProcessing(true);
      setShowConfirmModal(false);

      const updatedUser = await updateUser(
        user._id,
        { status: "competing" },
        { new: true }
      );
      setUser(updatedUser);

      if (updatedUser?.status === "competing") {
        const joined = await joinTournamentOrCreate(user._id, tournamentSlug, tournament.entryFeeUSDT);

        if (joined?.data) {
          setContextTournament(joined.data);

          if (joined.data.users?.length >= tournament.participantsRequired) {
            updatedUser.usdtBalance -= tournament.entryFeeUSDT;
            setUser(updatedUser);
            navigate(`/tournamentplay/${tournamentSlug}`);
          }
        }
      }
    } catch (error) {
      console.error("Error joining tournament:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [
    user,
    isProcessing,
    tournamentSlug,
    tournament.entryFeeUSDT,
    setUser,
    setContextTournament,
    navigate,
    tournament.participantsRequired,
  ]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <TournamentHeaderSection
        tournament={tournament}
        handleBack={handleBack}
        handleJoin={handleJoinTournament}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <TournamentInfoSection tournament={tournament} />
        <TournamentSidebarSection />
      </div>

      <TournamentActionsSection
        handleJoin={handleJoinTournament}
        showConfirmModal={showConfirmModal}
        tournament={tournament}
        cancelJoin={cancelJoin}
        confirmJoin={confirmJoin}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default TournamentDetailsPage;
