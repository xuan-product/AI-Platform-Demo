type Mode = "chat" | "agents" | "build";

type AppSidebarProps = {
  mode: Mode;
  drawer: boolean;
  switchMode: (mode: Mode) => void;
  source: string;
  setSource: (source: string) => void;
};

const chatItems = ["年度经营分析", "合同风险分析", "项目问题分析"];
const agentSources = ["平台智能体", "第三方智能体", "租户智能体"];
const devItems = [
  ["▦", "智能应用"],
  ["◫", "我的应用"],
  ["◇", "模板中心"],
  ["⌗", "数据模型管理"],
];

export function AppSidebar({ mode, drawer, switchMode, source, setSource }: AppSidebarProps) {
  return (
    <aside className={`work-sidebar ${drawer ? "open" : ""}`}>
      <div className="side-brand"><span>澄</span><strong>澄明 AI</strong><button aria-label="折叠侧栏">◧</button></div>
      <nav className="mode-nav" aria-label="产品模式">
        <button className={mode === "chat" ? "active" : ""} onClick={() => switchMode("chat")}><span>◯</span>对话</button>
        <button className={mode === "agents" ? "active" : ""} onClick={() => switchMode("agents")}><span>⌘</span>Agent</button>
        <button className={mode === "build" ? "active" : ""} onClick={() => switchMode("build")}><span>‹/›</span>开发</button>
      </nav>
      <button className="new-session"><span>⊕</span>{mode === "build" ? "新建智能应用" : "新会话"}</button>

      {mode === "chat" && <div className="side-content"><small className="side-label">今天</small>{chatItems.map((item, index) => <button className={index === 0 ? "selected" : ""} key={item}><i />{item}</button>)}<small className="side-label second">以前</small>{["竞品研究与市场机会", "管理层周报整理", "年度预算复盘"].map(item => <button key={item}>{item}</button>)}</div>}

      {mode === "agents" && <div className="side-content"><small className="side-label">智能体中心</small>{agentSources.map((item, index) => <button className={source === item ? "selected" : ""} onClick={() => setSource(item)} key={item}><span>{["◈", "↗", "⌘"][index]}</span>{item}</button>)}<small className="side-label second">最近使用</small>{["建筑行业助手", "合同审核助手", "财务分析助手"].map(item => <button key={item}>{item}</button>)}</div>}

      {mode === "build" && <div className="side-content dev-side-content"><small className="side-label">AI 开发工作台</small>{devItems.map(([icon, label], index) => <button className={index === 0 ? "selected" : ""} key={label}><span>{icon}</span>{label}{index === 1 && <b className="side-count">3</b>}</button>)}<small className="side-label second">最近应用</small>{["2026年度经营分析", "项目利润分析", "应收风险监控"].map((item, index) => <button key={item}><i className={`project-dot p${index + 1}`} />{item}</button>)}</div>}

      <div className="side-footer"><span className="user-dot">林</span><p>林先生<small>企业工作区</small></p><button aria-label="设置">⚙</button></div>
    </aside>
  );
}
