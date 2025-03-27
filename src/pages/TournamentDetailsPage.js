import React, { useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { joinRoomOrCreate } from "../services/RoomService";
import { useRoom } from "../context/RoomsContext";
import { updateUser } from "../services/userServices";
import TournamentHeaderSection from "../components/TournamentDetails/TournamentHeaderSection";
import TournamentInfoSection from "../components/TournamentDetails/TournamentInfoSection";
import TournamentSidebarSection from "../components/TournamentDetails/TournamentSidebarSection";
import TournamentActionsSection from "../components/TournamentDetails/TournamentActionsSection";

const TournamentDetailsPage = () => {
  const { user, setUser } = useAuth() || {};
  const { contextRoom, setcontextRoom } = useRoom() || {};
  const { gameSlug, entryFee } = useParams();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const room = {
    name: gameSlug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    type: `${gameSlug}`,
    currency: "USDT",
    entryFeeUSDT: `${entryFee}`,
    playersPerMatch: 2,
    image: `/${gameSlug}.png`,
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handlePlay = () => {
    setShowConfirmModal(true);
  };

  const cancelPlay = () => {
    setShowConfirmModal(false);
  };

  const confirmPlay = useCallback(async () => {
    if (!user || isProcessing) return;

    try {
      setIsProcessing(true);
      setShowConfirmModal(false);
      const updatedUser = await updateUser(
        user._id,
        { status: "playing" },
        { new: true }
      );
      setUser(updatedUser);
      if (updatedUser?.status === "playing") {
        const joinedRoom = await joinRoomOrCreate(user._id, gameSlug, room.entryFeeUSDT);
        if (joinedRoom?.data) {
          setcontextRoom(joinedRoom.data);
          if (joinedRoom.data.users && joinedRoom.data.users.length >= 2) {
            updatedUser.usdtBalance -= room.entryFeeUSDT;
            setUser(updatedUser);
            navigate(`/play/${gameSlug}`);
          }
        }
      }
    } catch (error) {
      console.error("Error during game start:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [
    user,
    isProcessing,
    room.entryFeeUSDT,
    gameSlug,
    setUser,
    setcontextRoom,
    navigate,
  ]);

  // Don't automatically call confirmPlay on mount
  // This function should only be called when the user confirms the modal

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <TournamentHeaderSection
        room={room}
        handleBack={handleBack}
        handlePlay={handlePlay}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <TournamentInfoSection room={room} />
        <TournamentSidebarSection />
      </div>

      <TournamentActionsSection
        handlePlay={handlePlay}
        showConfirmModal={showConfirmModal}
        room={room}
        cancelPlay={cancelPlay}
        confirmPlay={confirmPlay}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default TournamentDetailsPage;
