"use client";

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { BuildAppPage } from "./BuildAppPage";

type Mode = "chat" | "agents" | "build";
type Agent = { id:number; name:string; icon:string; type:string; category:string; description:string; uses:string };

const agents: Agent[] = [
  { id:1, name:"建筑行业助手", icon:"建", type:"平台智能体", category:"建筑工程", description:"查询行业规范，分析项目进度、质量与安全风险。", uses:"2.4k" },
  { id:2, name:"合同审核助手", icon:"审", type:"平台智能体", category:"法务合规", description:"识别合同关键条款与潜在风险，生成结构化审核报告。", uses:"1.8k" },
  { id:3, name:"财务分析助手", icon:"财", type:"平台智能体", category:"财务经营", description:"分析经营数据，定位异常并生成管理层财务洞察。", uses:"1.5k" },
  { id:4, name:"项目复盘助手", icon:"复", type:"平台智能体", category:"项目管理", description:"汇总项目材料，提炼问题、原因与行动建议。", uses:"968" },
  { id:5, name:"市场研究助手", icon:"研", type:"第三方智能体", category:"市场研究", description:"检索公开信息并快速形成行业研究与竞品分析。", uses:"756" },
  { id:6, name:"内部制度问答", icon:"制", type:"租户智能体", category:"企业知识", description:"基于组织制度与知识库回答员工的高频业务问题。", uses:"642" },
];

const suggestions = ["帮我分析这份经营数据", "今天有哪些行业动态", "帮我进行合同风险分析", "生成一份项目周报"];

export function AgentPlatform() {
  const [mode,setMode] = useState<Mode>("chat");
  const [drawer,setDrawer] = useState(false);
  const [chat,setChat] = useState("");
  const [file,setFile] = useState("");
  const [message,setMessage] = useState("");
  const [source,setSource] = useState("平台智能体");
  const [search,setSearch] = useState("");
  const [selected,setSelected] = useState<Agent|null>(null);
  const [buildPrompt,setBuildPrompt] = useState("");
  const [buildState,setBuildState] = useState<"idle"|"running"|"done">("idle");
  const fileInput = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => agents.filter(a => a.type === source && (!search.trim() || `${a.name}${a.description}${a.category}`.includes(search.trim()))),[source,search]);

  function switchMode(next:Mode){ setMode(next); setDrawer(false); setSelected(null); }
  function submitChat(e:FormEvent){ e.preventDefault(); if(!chat.trim()) return; setMessage(chat.trim()); setChat(""); }
  function onFile(e:ChangeEvent<HTMLInputElement>){ setFile(e.target.files?.[0]?.name || ""); }
  function startBuild(){ if(!buildPrompt.trim()) return; setBuildState("running"); window.setTimeout(()=>setBuildState("done"),1600); }

  return <div className="desktop-app">
    <button className="mobile-menu" onClick={()=>setDrawer(true)} aria-label="打开导航">☰</button>
    <AppSidebar mode={mode} drawer={drawer} switchMode={switchMode} source={source} setSource={(v)=>{setSource(v);setSelected(null);}} />
    {drawer && <button className="drawer-scrim" onClick={()=>setDrawer(false)} aria-label="关闭导航" />}

    <main className="workspace">
      {mode === "chat" && <ChatPage chat={chat} setChat={setChat} submitChat={submitChat} message={message} setMessage={setMessage} file={file} fileInput={fileInput} onFile={onFile} />}
      {mode === "agents" && <AgentPage source={source} search={search} setSearch={setSearch} filtered={filtered} selected={selected} setSelected={setSelected} useAgent={(agent)=>{setChat(`使用${agent.name}开始一项新任务`);switchMode("chat");}} />}
      {mode === "build" && <BuildAppPage prompt={buildPrompt} setPrompt={(v)=>{setBuildPrompt(v);setBuildState("idle");}} state={buildState} start={startBuild} reset={()=>{setBuildState("idle");setBuildPrompt("");}} />}
    </main>
  </div>;
}

function Sidebar({mode,drawer,switchMode,source,setSource,buildState}:{mode:Mode;drawer:boolean;switchMode:(m:Mode)=>void;source:string;setSource:(v:string)=>void;buildState:string}){
  return <aside className={`work-sidebar ${drawer?"open":""}`}>
    <div className="side-brand"><span>企</span><strong>企业智能体平台</strong><button aria-label="折叠侧栏">◧</button></div>
    <nav className="mode-nav">
      <button className={mode==="chat"?"active":""} onClick={()=>switchMode("chat")}><span>◯</span>对话</button>
      <button className={mode==="agents"?"active":""} onClick={()=>switchMode("agents")}><span>⌘</span>Agent</button>
      <button className={mode==="build"?"active":""} onClick={()=>switchMode("build")}><span>‹/›</span>开发</button>
    </nav>
    <button className="new-session"><span>⊕</span> 新会话</button>

    {mode==="chat" && <div className="side-content"><small className="side-label">今天</small>{["年度经营分析","合同风险分析","项目问题分析"].map((x,i)=><button className={i===0?"selected":""} key={x}><i />{x}</button>)}<small className="side-label second">以前</small>{["竞品研究与市场机会","管理层周报整理","年度预算复盘"].map(x=><button key={x}>{x}</button>)}</div>}
    {mode==="agents" && <div className="side-content"><small className="side-label">智能体中心</small>{["平台智能体","第三方智能体","租户智能体"].map((x,i)=><button className={source===x?"selected":""} onClick={()=>setSource(x)} key={x}><span>{["◇","↗","⌂"][i]}</span>{x}</button>)}<small className="side-label second">最近使用</small>{["建筑行业助手","合同审核助手","财务分析助手"].map(x=><button key={x}>{x}</button>)}</div>}
    {mode==="build" && <div className="side-content"><button className="selected"><span>ϟ</span>技能开发</button><button><span>▣</span>智能体开发</button><button><span>⌘</span>应用开发</button><small className="side-label second">项目 <b>＋</b></small>{["AI 销售分析助手","合同审核工作台","项目周报生成器"].map((x,i)=><button className={buildState!=="idle"&&i===0?"selected":""} key={x}><i className={`project-dot p${i+1}`} />{x}</button>)}</div>}
    <div className="side-footer"><span className="user-dot">林</span><p>林先生<small>企业工作区</small></p><button>⚙</button></div>
  </aside>;
}

function ChatPage({chat,setChat,submitChat,message,setMessage,file,fileInput,onFile}:{chat:string;setChat:(v:string)=>void;submitChat:(e:FormEvent)=>void;message:string;setMessage:(v:string)=>void;file:string;fileInput:React.RefObject<HTMLInputElement|null>;onFile:(e:ChangeEvent<HTMLInputElement>)=>void}){
  if(message) return <section className="conversation-page"><header className="page-bar"><div><strong>新的企业分析任务</strong><small>通用企业模型</small></div><button onClick={()=>setMessage("")}>＋ 新对话</button></header><div className="conversation-body"><div className="bubble user">{message}</div><div className="ai-answer"><span className="ai-dot">企</span><div><strong>企业智能体平台</strong><p>好的，我会结合企业知识与已授权的数据进行分析。你可以继续补充相关文件、时间范围或期望的输出格式。</p><ol><li>梳理问题与现有材料</li><li>识别关键信息及潜在风险</li><li>输出结构化结论与行动建议</li></ol></div></div></div><PromptBox value={chat} setValue={setChat} onSubmit={submitChat} onUpload={()=>fileInput.current?.click()} file={file} compact /></section>;
  return <section className="home-page dotted"><div className="home-center"><p className="hero-kicker">企业 AI 工作台</p><h1 className="greeting">下午好，林先生</h1><p className="hero-copy">我是你的企业 AI 助手，可以帮助你分析问题、处理任务、生成内容。</p><PromptBox value={chat} setValue={setChat} onSubmit={submitChat} onUpload={()=>fileInput.current?.click()} file={file} /><input ref={fileInput} className="sr-only" type="file" onChange={onFile}/><div className="prompt-chips">{suggestions.map(x=><button key={x} onClick={()=>setChat(x)}>{x}</button>)}</div></div></section>;
}

function PromptBox({value,setValue,onSubmit,onUpload,file,compact=false}:{value:string;setValue:(v:string)=>void;onSubmit:(e:FormEvent)=>void;onUpload:()=>void;file:string;compact?:boolean}){
  return <form className={`prompt-box ${compact?"compact":""}`} onSubmit={onSubmit}><textarea value={value} onChange={e=>setValue(e.target.value)} placeholder="请输入你的问题…" aria-label="消息输入"/><div className="prompt-tools"><div><button type="button" className="upload-action" onClick={onUpload}>＋ 上传文件</button><select aria-label="选择模型"><option>通用企业模型</option><option>深度推理模型</option><option>长文本模型</option></select>{file&&<span className="file-name">{file}</span>}</div><div><button type="button" className="voice-action">语音输入</button><button className="blue-send" disabled={!value.trim()}>↑</button></div></div></form>;
}

function AgentPage({source,search,setSearch,filtered,selected,setSelected,useAgent}:{source:string;search:string;setSearch:(v:string)=>void;filtered:Agent[];selected:Agent|null;setSelected:(a:Agent|null)=>void;useAgent:(a:Agent)=>void}){
  if(selected) return <section className="agent-detail-page"><header className="page-bar"><button className="plain-back" onClick={()=>setSelected(null)}>← 返回智能体</button><div><button>收藏</button><button className="primary-small" onClick={()=>useAgent(selected)}>立即使用</button></div></header><div className="detail-sheet"><div className="detail-title"><span className="agent-glyph">{selected.icon}</span><div><span className="type-tag">{selected.type}</span><h1>{selected.name}</h1><p>{selected.description}</p></div></div><div className="detail-meta"><div><small>分类</small><strong>{selected.category}</strong></div><div><small>累计使用</small><strong>{selected.uses}</strong></div><div><small>安全状态</small><strong className="safe">已审核</strong></div><div><small>更新时间</small><strong>2026.07.12</strong></div></div><section><h2>智能体介绍</h2><p>该智能体融合专业知识库与企业任务流程，支持连续对话、材料理解和结构化输出。所有数据仅在组织授权范围内使用。</p></section><section><h2>核心能力</h2><div className="detail-capabilities">{["理解并整理业务材料","结合专业知识完成分析","输出可直接使用的结果"].map((x,i)=><div key={x}><span>0{i+1}</span><strong>{x}</strong><p>按组织数据权限安全处理</p></div>)}</div></section></div></section>;
  return <section className="agent-hub-page"><header className="hub-header"><div><h1>Agent Hub</h1><p>发现并使用企业级专业智能体</p></div><button className="primary-small">＋ 创建智能体</button></header><div className="hub-tools"><div className="filter-tabs">{["全部","行业助手","企业管理","数据分析","内容创作"].map((x,i)=><button className={i===0?"active":""} key={x}>{x}</button>)}</div><label><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索智能体"/></label></div><div className="hub-summary"><strong>{source}</strong><span>{filtered.length} 个可用智能体</span></div><div className="hub-grid">{filtered.map(a=><button className="hub-card" onClick={()=>setSelected(a)} key={a.id}><span className="agent-glyph">{a.icon}</span><div className="hub-card-body"><small className="card-provider">{a.type === "平台智能体" ? "平台提供" : a.type}</small><h3>{a.name}</h3><p>{a.description}</p><footer><span>{a.category}</span><small><i />{a.uses} 人使用</small></footer></div><b className="card-arrow">↗</b></button>)}</div>{filtered.length===0&&<div className="empty">没有找到匹配的智能体</div>}</section>;
}

function BuildPage({prompt,setPrompt,state,start,reset}:{prompt:string;setPrompt:(v:string)=>void;state:"idle"|"running"|"done";start:()=>void;reset:()=>void}){
  if(state==="idle") return <section className="home-page dotted"><div className="home-center build-home"><p className="hero-kicker">自然语言开发</p><h1 className="greeting">描述需求，创建你的企业智能体</h1><p className="hero-copy">AI 将自动完成角色、知识库与工具配置，并生成可继续编辑的结果。</p><form className="prompt-box build-prompt" onSubmit={e=>{e.preventDefault();start();}}><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="例如：帮我创建一个销售数据分析助手"/><div className="prompt-tools"><div><button type="button" className="upload-action">＋ 添加资料</button><select><option>创建智能体</option><option>创建技能</option><option>创建应用</option></select><select><option>企业工作区</option></select><select><option>通用企业模型</option></select></div><button className="blue-send" disabled={!prompt.trim()}>↑</button></div></form><div className="prompt-chips">{["创建销售数据分析助手","创建合同风险审查助手","生成项目周报应用"].map(x=><button onClick={()=>setPrompt(x)} key={x}>{x}</button>)}</div></div></section>;
  return <section className="build-workbench"><div className="build-process"><header className="page-bar"><div><strong>销售分析助手的自然语言创建</strong><small>{state==="running"?"正在生成":"构建完成"}</small></div><button onClick={reset}>重新创建</button></header><div className="process-copy"><p>我已理解你的需求，将创建一个面向企业销售数据的分析助手。</p>{["分析需求与任务边界","创建智能体角色与指令","连接企业知识与数据工具","生成并检查智能体产物"].map((x,i)=><div className={`process-row ${state==="done"||i<3?"complete":"running"}`} key={x}><span>{state==="done"||i<3?"✓":"·"}</span><strong>{x}</strong><small>{i===0?"识别销售分析、报表和经营建议场景":i===1?"角色、职责与输出规范已生成":i===2?"企业知识库与数据工具已连接":"正在生成最终产物"}</small><b>›</b></div>)}</div><div className="generated-items"><article><span>▤</span><div><strong>销售分析助手</strong><small>企业智能体</small></div><b>›</b></article><article><span>▤</span><div><strong>销售经营分析技能</strong><small>技能</small></div><b>›</b></article></div><form className="mini-composer"><input placeholder="有描述或开发任务…"/><button>↑</button></form></div><div className="artifact-panel"><header><div><strong>智能体产物</strong><small>已保存</small></div><div><button>试玩</button><button className="primary-small">提交</button></div></header><div className="artifact-tabs"><button className="active">预览</button><button>检查</button></div><div className="artifact-body"><div className="artifact-title"><span className="agent-glyph">销</span><div><h2>AI 销售分析助手</h2><p>ai-sales-analysis-agent</p></div></div><section><h3>智能体说明</h3><p>面向企业销售数据的智能分析与经营建议，支持按客户、销售组织、时间范围等条件查询并生成报告。</p></section><section><h3>关联工具</h3><div className="tool-grid">{["销售订单查询","销售趋势分析","经营报告生成"].map(x=><div key={x}><span>⌘</span><strong>{x}</strong><small>MCP</small></div>)}</div></section><section><h3>基本信息</h3><p className="info-line">开发者：企业智能体平台　 ·　 连接企业知识库　 ·　 已通过安全检查</p></section><section><h3>更新日志</h3><p className="log-line"><b>1.0.0</b>　2026-07-15<br/>初始版本：支持销售数据查询、趋势分析和经营报告生成。</p></section></div></div></section>;
}
