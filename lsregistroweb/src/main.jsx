// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "@/routes/AppRouter.jsx";

// ✅ Import seguro (root absoluto)


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="">
      <AppRouter />
    </BrowserRouter>
  </React.StrictMode>
);
