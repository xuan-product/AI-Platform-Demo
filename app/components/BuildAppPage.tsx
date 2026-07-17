import { FormEvent, useMemo, useState } from "react";

type BuildState = "idle" | "running" | "done";

type BuildAppPageProps = {
  prompt: string;
  setPrompt: (value: string) => void;
  state: BuildState;
  start: () => void;
  reset: () => void;
};

const templates = [
  { icon: "营", tone: "blue", name: "企业经营分析", desc: "分析收入、成本、利润趋势", uses: "2,486 次使用" },
  { icon: "项", tone: "violet", name: "项目利润分析", desc: "查看项目盈利能力和风险", uses: "1,832 次使用" },
  { icon: "收", tone: "cyan", name: "应收账款分析", desc: "分析客户回款情况", uses: "1,215 次使用" },
];

const quickPrompts = ["创建财务经营分析页面", "创建项目利润分析", "创建应收账款分析"];
const generatedPrompt = "帮我生成一个2026年度财务经营分析页面";

export function BuildAppPage({ prompt, setPrompt, state, start, reset }: BuildAppPageProps) {
  const [dataSource, setDataSource] = useState("财务系统");
  const [scope, setScope] = useState("公司级");
  const [dataAdded, setDataAdded] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("企业经营分析");
  const [saved, setSaved] = useState(false);
  const [published, setPublished] = useState(false);
  const [previewMode, setPreviewMode] = useState<"canvas" | "application">("canvas");

  const activePrompt = prompt || generatedPrompt;
  const appStatus = useMemo(() => published ? "已发布" : saved ? "已保存到我的应用" : "草稿自动保存", [published, saved]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) setPrompt(generatedPrompt);
    setPreviewMode("canvas");
    start();
  }

  function chooseTemplate(name: string) {
    setSelectedTemplate(name);
    const target = templates.find(item => item.name === name);
    setPrompt(`帮我创建一个${name}页面，${target?.desc || "展示核心经营指标"}`);
  }

  return (
    <section className={`app-dev-page ${previewMode === "application" ? "application-mode" : ""}`}>
      <div className="dev-main-column">
        <header className="dev-page-header">
          <div><span className="dev-eyebrow">AI APPLICATION STUDIO</span><h1>AI开发</h1><p>通过自然语言描述需求，快速生成企业应用</p></div>
          <div className="dev-header-actions"><span className={`save-state ${published ? "published" : ""}`}>● {appStatus}</span>{state === "done" && <button className="ghost-button" onClick={reset}>重新创建</button>}</div>
        </header>

        <div className="dev-scroll-area">
          <form className="app-builder-card" onSubmit={submit}>
            <div className="builder-title"><div className="spark-icon">✦</div><div><strong>描述你想创建的业务应用</strong><small>AI 将结合数据源与模板生成可编辑页面</small></div></div>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={'例如：“帮我创建一个财务经营分析页面，展示今年收入、成本、利润情况，并分析异常项目”'} aria-label="应用需求描述" />
            <div className="builder-controls">
              <button type="button" className={dataAdded ? "data-button active" : "data-button"} onClick={() => setDataAdded(!dataAdded)}>{dataAdded ? "✓ 已添加财务经营数据" : "+ 添加数据"}</button>
              <label><span>数据源</span><select value={dataSource} onChange={e => setDataSource(e.target.value)} aria-label="选择数据源">{["财务系统", "项目管理系统", "合同系统", "采购系统"].map(item => <option key={item}>{item}</option>)}</select></label>
              <label><span>应用范围</span><select value={scope} onChange={e => setScope(e.target.value)} aria-label="选择应用范围">{["公司级", "部门级", "项目级"].map(item => <option key={item}>{item}</option>)}</select></label>
              <button className="generate-button" disabled={state === "running"}><span>{state === "running" ? "◌" : "✦"}</span>{state === "running" ? "正在生成" : "生成应用"}</button>
            </div>
          </form>

          <div className="quick-examples"><span>快捷示例</span>{quickPrompts.map(item => <button onClick={() => setPrompt(item)} key={item}>{item}<b>↗</b></button>)}</div>

          {state === "running" && <GenerationProgress prompt={activePrompt} />}
          {state === "done" ? <GeneratedApplication dataSource={dataSource} scope={scope} onView={() => setPreviewMode("application")} onEdit={() => setPreviewMode("canvas")} onSave={() => setSaved(true)} onPublish={() => setPublished(true)} saved={saved} published={published} /> : <>
            <section className="dev-section template-section"><div className="section-heading"><div><h2>推荐模板</h2><p>从成熟的企业分析场景开始创建</p></div><button>查看全部模板 →</button></div><div className="template-grid">{templates.map(item => <button className={`template-card ${selectedTemplate === item.name ? "selected" : ""}`} onClick={() => chooseTemplate(item.name)} key={item.name}><span className={`template-icon ${item.tone}`}>{item.icon}</span><span className="template-copy"><strong>{item.name}</strong><small>{item.desc}</small><em>◷ {item.uses}</em></span><b>{selectedTemplate === item.name ? "✓" : "↗"}</b></button>)}</div></section>
            <section className="dev-section my-apps-section"><div className="section-heading"><div><h2>我的应用</h2><p>继续编辑或查看最近生成的应用</p></div><button>管理我的应用 →</button></div><div className="my-app-list">{[["2026年度经营分析", "财务系统 · 公司级", "今天 09:42"], ["项目利润分析", "项目管理系统 · 项目级", "昨天 16:18"], ["应收风险监控", "财务系统 · 部门级", "07月15日"]].map((item, index) => <button key={item[0]}><span className={`app-list-icon app${index + 1}`}>{["经", "项", "收"][index]}</span><span><strong>{item[0]}</strong><small>{item[1]}</small></span><time>{item[2]}</time><b>›</b></button>)}</div></section>
          </>}
        </div>
      </div>

      <aside className="dev-right-rail">
        <section className="capability-card"><div className="rail-heading"><span>数据能力</span><b>运行正常</b></div><div className="capability-grid">{[["12", "数据源"], ["86", "数据表"], ["1,245", "字段"], ["实时", "更新"]].map(([value, label]) => <div key={label}><strong>{value}</strong><small>{label}</small></div>)}</div></section>
        <section className="rail-section"><div className="rail-heading"><span>最近数据源</span><button>管理</button></div><div className="source-list">{[["财", "财务系统", "刚刚同步", "blue"], ["项", "项目系统", "5分钟前", "violet"], ["合", "合同系统", "12分钟前", "cyan"]].map(([icon, name, time, tone]) => <button key={name}><span className={tone}>{icon}</span><div><strong>{name}</strong><small>{time}</small></div><i>●</i></button>)}</div></section>
        <section className="rail-section guide-section"><div className="rail-heading"><span>开发指南</span></div>{["如何创建数据应用", "如何使用模板", "如何配置数据模型"].map((item, index) => <button key={item}><span>0{index + 1}</span>{item}<b>↗</b></button>)}</section>
        <div className="rail-tip"><span>✦</span><div><strong>AI 建议</strong><p>连接数据模型后，生成的指标口径会更准确。</p></div></div>
      </aside>
    </section>
  );
}

function GenerationProgress({ prompt }: { prompt: string }) {
  return <section className="generation-progress"><div className="generation-top"><div className="ai-orb">✦</div><div><strong>正在生成业务页面</strong><p>{prompt}</p></div><span>约 10 秒</span></div><div className="progress-track"><i /></div><div className="generation-steps">{["理解业务需求", "匹配数据模型", "生成指标与图表", "检查页面布局"].map((item, index) => <div className={index < 2 ? "complete" : index === 2 ? "active" : ""} key={item}><span>{index < 2 ? "✓" : index + 1}</span><small>{item}</small></div>)}</div></section>;
}

function GeneratedApplication({ dataSource, scope, onView, onEdit, onSave, onPublish, saved, published }: { dataSource: string; scope: string; onView: () => void; onEdit: () => void; onSave: () => void; onPublish: () => void; saved: boolean; published: boolean }) {
  return <section className="generated-app-section"><div className="generation-success"><span>✓</span><div><strong>应用生成完成</strong><p>已基于 {dataSource} 创建 {scope} 财务经营分析页面</p></div><button onClick={onSave}>{saved ? "✓ 已保存" : "保存为我的应用"}</button></div><article className="business-dashboard"><header><div><span className="dashboard-mark">经</span><div><h2>2026年度财务经营分析</h2><p>数据更新于 2026-07-17 10:24 · {dataSource}</p></div></div><div className="dashboard-actions"><button onClick={onView}>查看应用</button><button onClick={onEdit}>编辑模板</button><button className="publish-button" onClick={onPublish}>{published ? "✓ 已发布" : "发布"}</button></div></header><div className="metric-grid">{[["收入", "2.34亿", "+12.8%", "up"], ["成本", "1.82亿", "+8.3%", "neutral"], ["利润", "5,200万", "+18.6%", "up"], ["利润率", "22.3%", "+1.7pp", "up"]].map(([label, value, change, tone]) => <div className="metric-card" key={label}><span>{label}</span><strong>{value}</strong><small className={tone}>↗ {change} <em>较上年</em></small></div>)}</div><div className="dashboard-grid"><div className="chart-card trend-card"><div className="chart-title"><div><strong>收入成本趋势</strong><small>单位：万元</small></div><span><i className="income-dot" />收入 <i className="cost-dot" />成本</span></div><svg viewBox="0 0 520 190" role="img" aria-label="收入成本趋势折线图"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3976f6" stopOpacity=".2"/><stop offset="1" stopColor="#3976f6" stopOpacity="0"/></linearGradient></defs><g className="grid-lines"><line x1="35" y1="35" x2="500" y2="35"/><line x1="35" y1="80" x2="500" y2="80"/><line x1="35" y1="125" x2="500" y2="125"/><line x1="35" y1="170" x2="500" y2="170"/></g><path className="area-path" d="M35 146 L112 128 L189 116 L266 91 L343 78 L420 52 L500 34 L500 170 L35 170 Z"/><polyline className="income-line" points="35,146 112,128 189,116 266,91 343,78 420,52 500,34"/><polyline className="cost-line" points="35,154 112,144 189,131 266,119 343,103 420,94 500,81"/></svg><div className="chart-axis">{["1月", "2月", "3月", "4月", "5月", "6月", "7月"].map(item => <span key={item}>{item}</span>)}</div></div><div className="chart-card cost-card"><div className="chart-title"><div><strong>成本占比</strong><small>本年度累计</small></div><button>•••</button></div><div className="donut-wrap"><div className="donut"><span><strong>1.82亿</strong><small>总成本</small></span></div><div className="donut-legend">{[["材料成本", "46%", "blue"], ["人工成本", "28%", "cyan"], ["管理费用", "16%", "violet"], ["其他", "10%", "gray"]].map(([name, value, tone]) => <div key={name}><i className={tone}/><span>{name}</span><b>{value}</b></div>)}</div></div></div><div className="chart-card ranking-card"><div className="chart-title"><div><strong>项目利润 TOP5</strong><small>按利润贡献排序</small></div><button>查看明细</button></div><div className="ranking-list">{[["华东数字化项目", "1,280万", "92"], ["总部园区建设", "960万", "76"], ["供应链升级项目", "740万", "62"], ["西南区域项目", "620万", "53"], ["智能制造一期", "510万", "45"]].map(([name, value, width], index) => <div key={name}><span>{index + 1}</span><strong>{name}</strong><i><b style={{ width: `${width}%` }} /></i><em>{value}</em></div>)}</div></div><div className="alert-card"><div className="alert-icon">!</div><div><span>异常提醒</span><strong>项目A利润下降18%</strong><p>主要原因：材料成本上涨，较预算增加 420 万元。</p></div><button>查看分析 →</button></div></div></article></section>;
}
