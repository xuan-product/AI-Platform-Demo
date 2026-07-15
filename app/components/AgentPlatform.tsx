"use client";

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";

type Mode = "chat" | "agents" | "build";

const agentCatalog = [
  { id: 1, name: "建筑行业助手", icon: "建", type: "平台智能体", category: "行业", description: "基于建筑行业知识库，帮助用户查询规范、分析项目风险。", tone: "green", users: "2.4k" },
  { id: 2, name: "合同审核助手", icon: "审", type: "平台智能体", category: "法务", description: "自动识别合同风险条款，生成结构化审核报告。", tone: "blue", users: "1.8k" },
  { id: 3, name: "财务分析助手", icon: "财", type: "平台智能体", category: "财务", description: "分析企业经营数据，生成财务洞察与管理报告。", tone: "amber", users: "1.5k" },
  { id: 4, name: "项目复盘助手", icon: "复", type: "平台智能体", category: "项目", description: "汇总项目资料，定位关键问题并沉淀复盘结论。", tone: "violet", users: "968" },
  { id: 5, name: "市场研究助手", icon: "研", type: "第三方智能体", category: "市场", description: "检索公开市场信息，快速形成行业研究摘要。", tone: "rose", users: "756" },
  { id: 6, name: "内部制度问答", icon: "制", type: "租户智能体", category: "知识", description: "基于企业内部制度文档，回答员工高频业务问题。", tone: "cyan", users: "642" },
];

const quickActions = [
  ["分析业务数据", "上传一份业务数据，帮我识别关键趋势与异常"],
  ["查询企业知识", "查询企业制度中关于差旅报销的规定"],
  ["审核合同", "帮我审核一份合同并标记高风险条款"],
  ["生成报告", "根据项目资料生成一份管理层周报"],
];

export function AgentPlatform() {
  const [mode, setMode] = useState<Mode>("chat");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [fileName, setFileName] = useState("");
  const [listening, setListening] = useState(false);
  const [sentPrompt, setSentPrompt] = useState("");
  const [agentType, setAgentType] = useState("平台智能体");
  const [agentSearch, setAgentSearch] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<(typeof agentCatalog)[number] | null>(null);
  const [buildPrompt, setBuildPrompt] = useState("");
  const [buildState, setBuildState] = useState<"idle" | "running" | "done">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  const visibleAgents = useMemo(() => agentCatalog.filter((agent) => {
    const matchesType = agent.type === agentType;
    const query = agentSearch.trim().toLowerCase();
    return matchesType && (!query || `${agent.name}${agent.description}${agent.category}`.toLowerCase().includes(query));
  }), [agentSearch, agentType]);

  function switchMode(next: Mode) {
    setMode(next);
    setMobileMenu(false);
    setSelectedAgent(null);
  }

  function submitChat(event: FormEvent) {
    event.preventDefault();
    if (!chatInput.trim()) return;
    setSentPrompt(chatInput.trim());
    setChatInput("");
  }

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    setFileName(event.target.files?.[0]?.name ?? "");
  }

  function startBuild() {
    if (!buildPrompt.trim()) return;
    setBuildState("running");
    window.setTimeout(() => setBuildState("done"), 1800);
  }

  return (
    <div className="platform-shell">
      <header className="topbar">
        <button className="mobile-trigger" onClick={() => setMobileMenu(!mobileMenu)} aria-label="打开菜单">☰</button>
        <button className="brand" onClick={() => switchMode("chat")}>
          <span className="brand-mark">澄</span><span>澄明 AI</span><small>企业智能体平台</small>
        </button>
        <nav className="mode-tabs" aria-label="平台模式">
          <button className={mode === "chat" ? "active" : ""} onClick={() => switchMode("chat")}>对话</button>
          <button className={mode === "agents" ? "active" : ""} onClick={() => switchMode("agents")}>Agent</button>
          <button className={mode === "build" ? "active" : ""} onClick={() => switchMode("build")}>开发</button>
        </nav>
        <div className="top-actions"><button className="icon-action" aria-label="帮助">?</button><button className="avatar">林</button></div>
      </header>

      {mode === "chat" && (
        <div className="chat-layout">
          <aside className={`chat-sidebar ${mobileMenu ? "open" : ""}`}>
            <button className="new-chat"><span>＋</span> 新对话 <kbd>⌘ K</kbd></button>
            <div className="history-heading">历史对话</div>
            <nav className="history-list">
              {[["年度经营分析", "刚刚"], ["合同风险分析", "昨天"], ["项目问题分析", "周一"]].map(([name, time], index) => (
                <button key={name} className={index === 0 ? "selected" : ""}><span>{name}<small>{time}</small></span><b>•••</b></button>
              ))}
            </nav>
            <div className="sidebar-foot"><span className="status-dot" /> 企业知识库已连接<small>所有对话均受组织安全策略保护</small></div>
          </aside>
          {mobileMenu && <button className="sidebar-overlay" onClick={() => setMobileMenu(false)} aria-label="关闭菜单" />}
          <main className="chat-main">
            {!sentPrompt ? (
              <section className="chat-home">
                <div className="eyebrow"><span /> 企业智能工作台</div>
                <h1>下午好，林先生</h1>
                <p className="lead">我是你的企业 AI 助手，可以帮助你分析问题、处理任务、生成内容。</p>
                <ChatComposer value={chatInput} onChange={setChatInput} onSubmit={submitChat} listening={listening} onListen={() => setListening(!listening)} onUpload={() => fileRef.current?.click()} fileName={fileName} />
                <input ref={fileRef} className="sr-only" type="file" onChange={chooseFile} />
                <div className="quick-grid">
                  {quickActions.map(([title, prompt], index) => <button key={title} onClick={() => setChatInput(prompt)}><span className={`quick-icon q${index + 1}`}>{["↗", "⌕", "✓", "▤"][index]}</span><strong>{title}</strong><small>{["洞察趋势与异常", "基于组织知识库", "识别风险条款", "自动整理成文"][index]}</small><b>→</b></button>)}
                </div>
              </section>
            ) : (
              <section className="conversation-view">
                <div className="conversation-title"><button onClick={() => setSentPrompt("")}>←</button><span>新的分析任务<small>通用企业模型</small></span></div>
                <div className="message user-message">{sentPrompt}</div>
                <div className="assistant-message"><span className="assistant-mark">澄</span><div><strong>澄明 AI</strong><p>好的，我会基于企业知识库与已授权的数据进行分析。为了让结论更准确，你可以继续补充相关文件、时间范围或期望的输出格式。</p><div className="answer-points"><span>1</span>梳理问题与已有材料<br/><span>2</span>识别关键信息和潜在风险<br/><span>3</span>生成结构化结论与下一步建议</div></div></div>
                <ChatComposer value={chatInput} onChange={setChatInput} onSubmit={submitChat} listening={listening} onListen={() => setListening(!listening)} onUpload={() => fileRef.current?.click()} fileName={fileName} compact />
              </section>
            )}
          </main>
        </div>
      )}

      {mode === "agents" && (
        <main className="agent-page">
          {selectedAgent ? (
            <section className="agent-detail">
              <button className="back-link" onClick={() => setSelectedAgent(null)}>← 返回智能体广场</button>
              <div className="detail-hero"><span className={`agent-icon ${selectedAgent.tone}`}>{selectedAgent.icon}</span><div><div className="tag-row"><span>{selectedAgent.type}</span><span>{selectedAgent.category}</span></div><h1>{selectedAgent.name}</h1><p>{selectedAgent.description}</p></div><button className="primary-button" onClick={() => { setChatInput(`使用${selectedAgent.name}开始一项新任务`); switchMode("chat"); }}>开始使用</button></div>
              <div className="detail-columns"><section><h2>它可以为你做什么</h2>{["理解并整理你的业务材料", "结合专业知识完成分析", "输出可直接使用的结构化结果"].map((x, i) => <div className="capability" key={x}><span>0{i + 1}</span><p>{x}<small>按企业数据权限范围安全处理</small></p></div>)}</section><aside><h3>智能体信息</h3><dl><div><dt>提供方</dt><dd>澄明 AI 平台</dd></div><div><dt>使用人数</dt><dd>{selectedAgent.users}</dd></div><div><dt>最近更新</dt><dd>2026-07-12</dd></div></dl></aside></div>
            </section>
          ) : (
            <>
              <section className="agent-intro"><div><span className="section-label">AGENT HUB</span><h1>找到适合工作的智能体</h1><p>发现经过组织审核的专业 AI 助手，让复杂任务从一个好工具开始。</p></div><label className="agent-search"><span>⌕</span><input value={agentSearch} onChange={(e) => setAgentSearch(e.target.value)} placeholder="搜索智能体" /></label></section>
              <div className="agent-content">
                <aside className="agent-categories"><small>智能体来源</small>{["平台智能体", "第三方智能体", "租户智能体"].map((type) => <button className={agentType === type ? "active" : ""} onClick={() => setAgentType(type)} key={type}><span>{type === "平台智能体" ? "◇" : type === "第三方智能体" ? "↗" : "⌂"}</span>{type}<b>{agentCatalog.filter(a => a.type === type).length}</b></button>)}<div className="category-note"><span>✓</span><p>安全可信<small>展示的智能体均经过平台或组织安全审核。</small></p></div></aside>
                <section className="agent-results"><div className="results-head"><h2>{agentType}</h2><span>{visibleAgents.length} 个智能体</span></div><div className="agent-grid">{visibleAgents.map(agent => <button className="agent-card" key={agent.id} onClick={() => setSelectedAgent(agent)}><div className="agent-card-top"><span className={`agent-icon ${agent.tone}`}>{agent.icon}</span><span className="open-arrow">↗</span></div><h3>{agent.name}</h3><p>{agent.description}</p><footer><span>{agent.category}</span><small>{agent.users} 人使用</small></footer></button>)}</div>{visibleAgents.length === 0 && <div className="empty-state">没有找到匹配的智能体</div>}</section>
              </div>
            </>
          )}
        </main>
      )}

      {mode === "build" && (
        <main className="build-page">
          <section className="build-heading"><span className="section-label">AI BUILDER</span><h1>用一句话，创建你的企业智能体</h1><p>描述你想解决的问题，AI 将自动完成角色、知识与工具配置。</p></section>
          <section className="builder-box">
            <div className="builder-label"><span>✦</span> 描述你的需求</div>
            <textarea value={buildPrompt} onChange={(e) => { setBuildPrompt(e.target.value); setBuildState("idle"); }} placeholder="请输入你想创建的智能体…\n例如：帮我创建一个销售数据分析助手" />
            <div className="builder-actions"><div><button>＋ 添加资料</button><button>⌁ 选择数据源</button></div><button className="create-button" disabled={!buildPrompt.trim() || buildState === "running"} onClick={startBuild}>{buildState === "running" ? "正在创建…" : "开始创建"} <span>→</span></button></div>
          </section>
          {buildState === "idle" && <div className="build-examples"><span>试试这样描述</span>{["创建一个销售数据分析助手", "创建一个合同风险审查助手", "创建一个项目周报生成器"].map(x => <button onClick={() => setBuildPrompt(x)} key={x}>{x}<b>↗</b></button>)}</div>}
          {buildState !== "idle" && <section className={`build-progress ${buildState}`}><div className="process-panel"><header><span className="spark">✦</span><div><strong>{buildState === "done" ? "智能体已创建" : "正在理解你的需求"}</strong><small>{buildState === "done" ? "所有配置已经完成" : "这通常只需要几秒钟"}</small></div><b>{buildState === "done" ? "100%" : "72%"}</b></header><div className="progress-bar"><i /></div>{["分析需求与任务目标", "创建智能体角色", "配置企业知识库", "绑定数据分析工具"].map((x, i) => <div className={`process-step ${buildState === "done" || i < 3 ? "complete" : "current"}`} key={x}><span>{buildState === "done" || i < 3 ? "✓" : "·"}</span>{x}<small>{i === 0 ? "已识别销售分析场景" : i === 1 ? "角色与输出规范已生成" : i === 2 ? "已连接授权知识" : "正在配置"}</small></div>)}</div>{buildState === "done" && <div className="build-result"><div className="result-head"><span className="agent-icon green">销</span><div><small>新智能体</small><h2>销售分析助手</h2><p>分析销售数据，识别增长机会并生成经营报告。</p></div></div><div className="ability-list"><small>已配置能力</small>{["查询销售数据", "生成可视化报表", "输出经营分析报告"].map(x => <span key={x}>✓ {x}</span>)}</div><div className="result-actions"><button>继续编辑</button><button className="primary-button">打开智能体 →</button></div></div>}</section>}
          <footer className="build-foot">你的数据和配置仅在当前组织内可见 · 支持随时调整</footer>
        </main>
      )}
    </div>
  );
}

function ChatComposer({ value, onChange, onSubmit, listening, onListen, onUpload, fileName, compact = false }: { value: string; onChange: (value: string) => void; onSubmit: (event: FormEvent) => void; listening: boolean; onListen: () => void; onUpload: () => void; fileName: string; compact?: boolean }) {
  return <form className={`chat-composer ${compact ? "compact" : ""}`} onSubmit={onSubmit}><textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder="请输入你的问题…" aria-label="对话输入" /><div className="composer-tools"><div><button type="button" className="round-tool" onClick={onUpload} aria-label="上传文件">＋</button><select aria-label="选择模型"><option>通用企业模型</option><option>推理增强模型</option><option>长文本模型</option></select>{fileName && <span className="file-chip">{fileName}</span>}</div><div><button type="button" onClick={onListen} className={`voice-button ${listening ? "active" : ""}`} aria-label="语音输入">{listening ? "停止" : "语音"}</button><button type="submit" className="send-button" disabled={!value.trim()} aria-label="发送">↑</button></div></div></form>;
}
