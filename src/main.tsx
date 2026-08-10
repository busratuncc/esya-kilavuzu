import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GuidePage } from "../app/Pages/GuidePage";
import "../app/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GuidePage />
  </StrictMode>,
);
