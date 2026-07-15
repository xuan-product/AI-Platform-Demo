"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  Bot,
  Building2,
  ChevronRight,
  FileCheck2,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const categories = ["全部", "办公效率", "行业助手", "数据分析", "内容创作", "自动化"];
const sources = [
  { id: "platform", label: "平台智能体", count: 12, icon: Sparkles },
  { id: "third", label: "第三方智能体", count: 8, icon: Users },
  { id: "tenant", label: "租户智能体", count: 5, icon: Building2 },
];
const agents = [
  { name: "建筑行业助手", description: "基于建筑行业知识库，帮助用户查询规范、分析项目风险。", category: "行业助手", icon: Building2, tone: "indigo", uses: "2.4k 次使用" },
  { name: "合同审核助手", description: "自动识别合同风险与异常条款，生成专业审核报告。", category: "办公效率", icon: FileCheck2, tone: "violet", uses: "1.8k 次使用" },
  { name: "财务分析助手", description: "深度分析经营数据，洞察趋势并生成财务分析报告。", category: "数据分析", icon: BarChart3, tone: "blue", uses: "1.2k 次使用" },
  { name: "项目风险雷达", description: "持续识别项目进度、成本与交付风险，给出行动建议。", category: "自动化", icon: ShieldCheck, tone: "cyan", uses: "896 次使用" },
  { name: "经营报告生成器", description: "汇总多源经营信息，一键生成管理层周报与月报。", category: "内容创作", icon: BadgeCheck, tone: "amber", uses: "756 次使用" },
  { name: "企业知识问答", description: "理解企业制度、文档与案例，为员工提供可信答案。", category: "办公效率", icon: Bot, tone: "slate", uses: "3.1k 次使用" },
];

export function AgentHub() {
  const [category, setCategory] = useState("全部");
  const [source, setSource] = useState("platform");
  const [query, setQuery] = useState("");
  const [launched, setLaunched] = useState<string | null>(null);
  const filtered = useMemo(() => agents.filter((agent) =>
    (category === "全部" || agent.category === category) &&
    (!query || `${agent.name}${agent.description}`.toLowerCase().includes(query.toLowerCase()))
  ), [category, query]);

  return (
    <section className="hub-page">
      <div className="hub-intro">
        <div>
          <span className="eyebrow"><Sparkles size={14} /> AGENT REGISTRY / 02</span>
          <h1>调用专业执行单元</h1>
          <p>按工作场景选择智能体，立即进入任务上下文。</p>
        </div>
        <label className="agent-search">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索智能体" />
          <kbd>⌘ K</kbd>
        </label>
      </div>

      <div className="category-row">
        {categories.map((item) => <button className={item === category ? "active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}
      </div>

      <div className="hub-body">
        <aside className="agent-source-nav">
          <small>智能体来源</small>
          {sources.map(({ id, label, count, icon: Icon }) => (
            <button key={id} className={source === id ? "active" : ""} onClick={() => setSource(id)}>
              <span><Icon size={17} /> {label}</span><em>{count}</em>
            </button>
          ))}
          <div className="agent-tip">
            <span><Sparkles size={16} /></span>
            <b>找不到需要的智能体？</b>
            <p>进入开发模式，用一句话创建。</p>
            <button>立即创建 <ChevronRight size={14} /></button>
          </div>
        </aside>

        <div className="agent-results">
          <div className="results-head">
            <div><h2>{sources.find((item) => item.id === source)?.label}</h2><span>{filtered.length} 个智能体</span></div>
            <button>最近使用</button>
          </div>
          <div className="agent-grid">
            {filtered.map(({ name, description, category: agentCategory, icon: Icon, tone, uses }, index) => (
              <article className="agent-card" key={name} onClick={() => setLaunched(name)}>
                <div className="agent-card-top">
                  <span className={`agent-icon ${tone}`}><Icon size={23} /></span>
                  <span className="agent-index">A-{String(index + 1).padStart(2, "0")}</span>
                  <button aria-label={`打开${name}`}><ArrowUpRight size={17} /></button>
                </div>
                <h3>{name}</h3>
                <p>{description}</p>
                <div className="agent-card-foot"><span><i /> 平台智能体</span><small>{agentCategory} · {uses}</small></div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && <div className="empty-result"><Search size={26} /><b>没有找到匹配的智能体</b><p>换个关键词试试</p></div>}
        </div>
      </div>
      {launched && <div className="toast"><span><Bot size={18} /></span><div><b>正在打开 {launched}</b><small>智能体工作空间已准备就绪</small></div><button onClick={() => setLaunched(null)}>关闭</button></div>}
    </section>
  );
}
