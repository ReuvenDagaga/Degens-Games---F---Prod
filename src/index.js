import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import RoomsProvider from "./context/RoomsContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
console.log("CLIENT ID:", process.env.REACT_APP_GOOGLE_CLIENT_ID);

root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID
  }>
    <AuthProvider>
      <RoomsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </RoomsProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);
