"use client";

import { useState } from "react";
import {
  ArrowUp,
  BarChart3,
  ChevronDown,
  FileCheck2,
  FileText,
  Library,
  Menu,
  Mic,
  PanelLeftClose,
  Paperclip,
  Plus,
  Sparkles,
} from "lucide-react";

const history = ["年度经营分析", "合同风险分析", "项目问题分析"];
const shortcuts = [
  { icon: BarChart3, title: "分析业务数据", hint: "发现趋势与关键变化", tone: "blue" },
  { icon: Library, title: "查询企业知识", hint: "从企业知识库中寻找答案", tone: "violet" },
  { icon: FileCheck2, title: "审核合同", hint: "识别条款风险与异常", tone: "amber" },
  { icon: FileText, title: "生成报告", hint: "快速形成结构化文档", tone: "cyan" },
];

export function ChatWorkspace() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState("");

  function submit() {
    if (!message.trim()) return;
    setSubmitted(message.trim());
    setMessage("");
  }

  return (
    <section className="chat-layout">
      <aside className={sidebarOpen ? "chat-sidebar open" : "chat-sidebar"}>
        <div className="sidebar-topline">
          <span className="sidebar-title">最近对话</span>
          <button className="icon-button desktop-only" aria-label="收起侧栏"><PanelLeftClose size={17} /></button>
        </div>
        <button className="new-chat"><Plus size={17} /> 新对话 <span>⌘ K</span></button>
        <div className="history-list">
          <small>今天</small>
          {history.map((item, index) => (
            <button className={index === 0 ? "history-item selected" : "history-item"} key={item}>{item}</button>
          ))}
        </div>
        <div className="sidebar-foot">
          <span className="secure-dot" />
          <div><b>企业数据已保护</b><small>连接 12 个内部知识源</small></div>
        </div>
      </aside>

      {sidebarOpen && <button className="sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="关闭侧栏" />}

      <div className="chat-main">
        <button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="打开历史对话"><Menu size={19} /></button>
        <div className="chat-hero">
          <h1>早上好，张总。<br className="hero-break" />今天想做点<span>什么？</span></h1>

          <div className="composer-shell">
            {submitted && (
              <div className="submitted-message">
                <span>已收到你的问题</span>
                <b>{submitted}</b>
              </div>
            )}
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submit();
                }
              }}
              placeholder="向我提问或布置任务，输入 @ 唤起技能或选择智能体"
              aria-label="向企业 AI 助手提问"
            />
            <div className="composer-actions">
              <div>
                <button className="tool-button" aria-label="上传文件"><Paperclip size={18} /></button>
                <button className="model-button"><span className="model-gem" /> 灵枢 Pro <ChevronDown size={14} /></button>
              </div>
              <div>
                <button className="tool-button" aria-label="语音输入"><Mic size={18} /></button>
                <button className="send-button" onClick={submit} disabled={!message.trim()} aria-label="发送"><ArrowUp size={18} /></button>
              </div>
            </div>
          </div>
          <span className="composer-tip">按 Enter 发送 · Shift + Enter 换行</span>

          <div className="shortcut-grid">
            {shortcuts.map(({ icon: Icon, title, hint, tone }) => (
              <button key={title} className="shortcut-card" onClick={() => setMessage(title)}>
                <span className={`shortcut-icon ${tone}`}><Icon size={19} /></span>
                <span><b>{title}</b><small>{hint}</small></span>
                <ArrowUp className="shortcut-arrow" size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
