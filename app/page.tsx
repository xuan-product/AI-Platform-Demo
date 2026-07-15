"use client";

import { useState } from "react";
import { AppHeader, type ProductMode } from "./components/AppHeader";
import { ChatWorkspace } from "./components/ChatWorkspace";
import { AgentHub } from "./components/AgentHub";
import { BuildStudio } from "./components/BuildStudio";

export default function Home() {
  const [mode, setMode] = useState<ProductMode>("chat");

  return (
    <main className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <AppHeader mode={mode} onModeChange={setMode} />
      <div className="app-stage" key={mode}>
        {mode === "chat" && <ChatWorkspace />}
        {mode === "agents" && <AgentHub />}
        {mode === "build" && <BuildStudio />}
      </div>
    </main>
  );
}
