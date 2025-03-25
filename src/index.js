import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import RoomsProvider from "./context/RoomsContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <RoomsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RoomsProvider>
  </AuthProvider>
);
