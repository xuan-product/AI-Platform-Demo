"use client";

import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Code2,
  Database,
  Eye,
  FileBarChart,
  Paperclip,
  Rocket,
  Sparkles,
  WandSparkles,
  Wrench,
} from "lucide-react";

const initialPrompt = "帮我创建一个销售数据分析助手";

export function BuildStudio() {
  const [prompt, setPrompt] = useState("");
  const [generated, setGenerated] = useState(false);
  const [published, setPublished] = useState(false);

  function generate(value = prompt) {
    if (!value.trim()) return;
    setPrompt(value);
    setGenerated(true);
    setPublished(false);
  }

  return (
    <section className="build-page">
      <div className="build-glow" />
      <div className="build-heading">
        <span className="eyebrow"><Code2 size={14} /> AI BUILD STUDIO</span>
        <h1>把想法变成 <span>AI 能力</span></h1>
        <p>无需代码，用自然语言创建智能体、技能和企业应用。</p>
      </div>

      <div className="build-composer">
        <div className="build-composer-label"><span><WandSparkles size={17} /></span> 描述你想创建的智能体</div>
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="例如：帮我创建一个销售数据分析助手..."
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              generate();
            }
          }}
        />
        <div className="build-actions">
          <div><button><Paperclip size={17} /> 添加参考文件</button><button>智能体 <ChevronDown size={14} /></button></div>
          <button className="generate-button" disabled={!prompt.trim()} onClick={() => generate()}>开始创建 <Sparkles size={16} /></button>
        </div>
      </div>

      {!generated ? (
        <div className="prompt-examples">
          <span>试试这样说</span>
          {[initialPrompt, "创建一个合同风险审查技能", "搭建一个项目周报生成应用"].map((item) => (
            <button key={item} onClick={() => generate(item)}>{item}<ArrowRight size={14} /></button>
          ))}
        </div>
      ) : (
        <div className="generation-workspace">
          <div className="generation-process">
            <div className="process-head"><span><Sparkles size={16} /></span><div><b>灵枢正在构建</b><small>已完成 · 18 秒</small></div></div>
            <div className="process-line done"><span><Check size={13} /></span><div><b>分析创建需求</b><small>识别为销售数据分析场景</small></div></div>
            <div className="process-line done"><span><Check size={13} /></span><div><b>创建智能体角色</b><small>企业销售分析专家</small></div></div>
            <div className="process-line done"><span><Check size={13} /></span><div><b>配置企业知识库</b><small>销售口径与业务规则</small></div></div>
            <div className="process-line done"><span><Check size={13} /></span><div><b>绑定分析工具</b><small>数据查询、图表与报告</small></div></div>
          </div>

          <div className="generated-agent">
            <div className="generated-badge">生成结果</div>
            <div className="generated-title"><span><BarChart3 size={24} /></span><div><h2>销售分析助手</h2><p>洞察业务趋势，辅助经营决策</p></div><em>草稿</em></div>
            <div className="capability-label">已配置能力</div>
            <div className="capability-list">
              <div><span><Database size={18} /></span><b>查询销售数据</b><small>连接企业数据源</small></div>
              <div><span><FileBarChart size={18} /></span><b>生成经营报表</b><small>自动图表与摘要</small></div>
              <div><span><Wrench size={18} /></span><b>输出分析报告</b><small>结构化决策建议</small></div>
            </div>
            <div className="result-actions">
              <button><Eye size={16} /> 预览</button>
              <button className="publish-button" onClick={() => setPublished(true)}><Rocket size={16} /> {published ? "已发布" : "发布智能体"}</button>
            </div>
          </div>
        </div>
      )}
      <footer className="build-footer"><Sparkles size={13} /> AI 生成内容可随时编辑和调整</footer>
    </section>
  );
}
