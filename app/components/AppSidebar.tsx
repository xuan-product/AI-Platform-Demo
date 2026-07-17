type Mode = "chat" | "agents";

type AppSidebarProps = {
  mode: Mode;
  drawer: boolean;
  switchMode: (mode: Mode) => void;
  source: string;
  setSource: (source: string) => void;
};

const chatItems = ["年度经营分析", "合同风险分析", "项目问题分析"];
const agentSources = ["平台智能体", "第三方智能体", "租户智能体"];
export function AppSidebar({ mode, drawer, switchMode, source, setSource }: AppSidebarProps) {
  return (
    <aside className={`work-sidebar ${drawer ? "open" : ""}`}>
      <div className="side-brand"><span>企</span><strong>企业智能体平台</strong><button aria-label="折叠侧栏">◧</button></div>
      <nav className="mode-nav" aria-label="产品模式">
        <button className={mode === "chat" ? "active" : ""} onClick={() => switchMode("chat")}><span>◯</span>对话</button>
        <button className={mode === "agents" ? "active" : ""} onClick={() => switchMode("agents")}><span>⌘</span>Agent</button>
      </nav>
      <button className="new-session"><span>⊕</span>新会话</button>

      {mode === "chat" && <div className="side-content"><small className="side-label">今天</small>{chatItems.map((item, index) => <button className={index === 0 ? "selected" : ""} key={item}><i />{item}</button>)}<small className="side-label second">以前</small>{["竞品研究与市场机会", "管理层周报整理", "年度预算复盘"].map(item => <button key={item}>{item}</button>)}</div>}

      {mode === "agents" && <div className="side-content"><small className="side-label">智能体中心</small>{agentSources.map((item, index) => <button className={source === item ? "selected" : ""} onClick={() => setSource(item)} key={item}><span>{["◈", "↗", "⌘"][index]}</span>{item}</button>)}<small className="side-label second">最近使用</small>{["建筑行业助手", "合同审核助手", "财务分析助手"].map(item => <button key={item}>{item}</button>)}</div>}

      <div className="side-footer"><span className="user-dot">林</span><p>林先生<small>企业工作区</small></p><button aria-label="设置">⚙</button></div>
    </aside>
  );
}
