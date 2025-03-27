import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import UserProfile from "../pages/UserProfilePage";
import StakingDashboard from "../pages/StakingDashboard";
import LeaderboardPage from "../pages/LeaderboardPage";
import GameDetailsPage from "../pages/GameDetailsPage";
import TokenomicsDashboard from "../pages/TokenomicsDashboardPage";
import AIPlayerAnalytics from "../pages/AIPlayerAnalytics";
import ChessPage from "../pages/Games/Chess/ChessPage";
import Game2048Page from "../pages/Games/2048/2048Page";
import TournamentDetailsPage from "../pages/TournamentDetailsPage";

export const AppRoutes = () => {


  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/staking" element={<StakingDashboard />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/gameDetails/:gameSlug/:entryFee" element={<GameDetailsPage />} />
      <Route path="/TournamentDetails/:gameSlug/:entryFee" element={<TournamentDetailsPage />} />
      <Route path="/play/Chess" element={<ChessPage />}/>
      <Route path="/play/2048" element={<Game2048Page />}/>
      <Route path="/Statistics" element={<TokenomicsDashboard />} />
      <Route path="/AI" element={<AIPlayerAnalytics />} />
    </Routes>
  );
};
