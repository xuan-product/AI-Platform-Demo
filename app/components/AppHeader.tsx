"use client";

import { Bot, ChevronDown, Code2, MessageCircle, Sparkles } from "lucide-react";

export type ProductMode = "chat" | "agents" | "build";

const modes: Array<{ id: ProductMode; label: string; icon: typeof MessageCircle }> = [
  { id: "chat", label: "对话", icon: MessageCircle },
  { id: "agents", label: "智能体", icon: Bot },
  { id: "build", label: "开发", icon: Code2 },
];

export function AppHeader({
  mode,
  onModeChange,
}: {
  mode: ProductMode;
  onModeChange: (mode: ProductMode) => void;
}) {
  return (
    <header className="app-header">
      <button className="brand" aria-label="灵枢 AI 首页">
        <span className="brand-mark"><Sparkles size={17} strokeWidth={2.3} /></span>
        <span>灵枢 AI</span>
      </button>

      <nav className="mode-switch" aria-label="产品模式">
        {modes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={mode === id ? "mode-button active" : "mode-button"}
            onClick={() => onModeChange(id)}
          >
            <Icon size={15} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <button className="profile-button" aria-label="账户菜单">
        <span className="avatar">张</span>
        <span className="profile-copy"><b>张明远</b><small>华辰集团</small></span>
        <ChevronDown size={15} />
      </button>
    </header>
  );
}
