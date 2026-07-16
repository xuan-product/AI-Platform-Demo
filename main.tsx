import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgentPlatform } from "./app/components/AgentPlatform";
import "./app/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AgentPlatform />
  </StrictMode>,
);
