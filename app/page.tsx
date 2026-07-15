import type { Metadata } from "next";
import { AgentPlatform } from "./components/AgentPlatform";

export const metadata: Metadata = {
  title: "澄明 AI｜企业智能体平台",
  description: "面向企业的 AI 对话、智能体发现与自然语言开发平台。",
};

export default function Home() {
  return <AgentPlatform />;
}
