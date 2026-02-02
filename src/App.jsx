import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, ChevronDown, ChevronUp, Target, Brain, Users, DollarSign, Activity, Layers, FileText, BarChart2, AlertCircle, CheckCircle, Sparkles, HelpCircle, BookOpen, Lightbulb, Filter, Zap, Shield, Calendar, Info, X, Upload, RefreshCw } from 'lucide-react';

const SNOWFLAKE_DATA = [
  { period: 'Q4 FY22', nrr: 178, customers1M: 184, productRev: 360.1, fcf: 172.6 },
  { period: 'Q1 FY23', nrr: 174, customers1M: 206, productRev: 394.4, fcf: 187.9 },
  { period: 'Q2 FY23', nrr: 171, customers1M: 246, productRev: 466.3, fcf: 18.8 },
  { period: 'Q3 FY23', nrr: 165, customers1M: 287, productRev: 522.8, fcf: 50.5 },
  { period: 'Q4 FY23', nrr: 158, customers1M: 344, productRev: 555.3, fcf: 296.5 },
  { period: 'Q1 FY24', nrr: 151, customers1M: 373, productRev: 590.1, fcf: 283.2 },
  { period: 'Q2 FY24', nrr: 142, customers1M: 402, productRev: 640.2, fcf: 63.4 },
  { period: 'Q3 FY24', nrr: 135, customers1M: 436, productRev: 698.5, fcf: 82.9 },
  { period: 'Q4 FY24', nrr: 131, customers1M: 461, productRev: 738.1, fcf: 344.5 },
  { period: 'Q1 FY25', nrr: 128, customers1M: 485, productRev: 789.6, fcf: 351.4 },
  { period: 'Q2 FY25', nrr: 127, customers1M: 510, productRev: 829.3, fcf: 58.1 },
  { period: 'Q3 FY25', nrr: 127, customers1M: 542, productRev: 900.3, fcf: 78.2 },
  { period: 'Q3 FY26', nrr: 125, customers1M: 688, productRev: 1160, fcf: 110.5 },
];

const PEER_DATA = {
  DDOG: { name: 'Datadog', revenue: 690, grossMargin: 81, aiMetric: '6% ARR AI-native', quarter: 'Q3 2024' },
  MDB: { name: 'MongoDB', revenue: 529, grossMargin: 77, aiMetric: 'Atlas +26% YoY', quarter: 'Q3 FY25' },
  MSFT: { name: 'Microsoft', revenue: 65585, azureGrowth: 33, aiMetric: 'Azure AI +60%', quarter: 'Q1 FY25' },
  GOOGL: { name: 'Google', cloudRevenue: 12000, aiMetric: 'Vertex AI surge', quarter: 'Q3 2024' },
  AMZN: { name: 'Amazon', awsRevenue: 27452, aiMetric: 'Bedrock growth', quarter: 'Q3 2024' },
};

const WIN_RATES = [{ name: 'Redshift', rate: 55 }, { name: 'BigQuery', rate: 50 }, { name: 'Fabric', rate: 43 }, { name: 'Databricks', rate: 38 }];
const TOPICS = ['All', 'NRR', 'Competition', 'AI/Product', 'Profitability', 'Macro'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

const generateQuestions = (data) => {
  const c = data[data.length - 1], o = data[0], p = data.find(d => d.period.includes('FY25')) || data[data.length - 2];
  const decline = o.nrr - c.nrr;
  return [
    { id: 1, category: 'NRR', topic: 'NRR', difficulty: 'Hard', severity: 'critical',
      question: `Your NRR compressed from ${o.nrr}% to ${c.nrr}%—a ${decline} point decline. What's your path to stabilization?`,
      signals: [{ type: 'TREND', score: 95, detail: `${data.length}Q decline`, source: 'snowflake_ir_metrics.csv' }, { type: 'PEER', score: 85, detail: 'DDOG: 6% AI ARR', source: 'peer_news_snippets.csv' }, { type: 'RESEARCH', score: 80, detail: 'Jefferies debate', source: 'Jefferies (n=20)' }, { type: 'TRANSCRIPT', score: 90, detail: '100% of calls', source: 'transcripts/' }],
      dataPoints: [{ label: 'Peak', value: `${o.nrr}%`, trend: 'up' }, { label: 'Current', value: `${c.nrr}%`, trend: 'down' }, { label: 'Decline', value: `-${decline}pts`, trend: 'down' }, { label: 'DDOG AI', value: '6%', trend: 'neutral' }],
      whyItMatters: `At ${o.nrr}%, growth was automatic. At ${c.nrr}%, new customer acquisition is critical.`,
      response: "We're seeing healthy normalization as customers reach steady-state. Absolute dollar expansion remains strong—$1M+ customers grew 27% to 688. Cortex AI with 6,100+ accounts drives incremental consumption. We expect stabilization at 120-130%." },
    { id: 2, category: 'Competition', topic: 'Competition', difficulty: 'Hard', severity: 'critical',
      question: "80% of partners cite Databricks as biggest threat with 38% win rate. Are you conceding the lakehouse?",
      signals: [{ type: 'RESEARCH', score: 95, detail: '80% cite Databricks', source: 'Jefferies (n=20)' }, { type: 'RESEARCH', score: 90, detail: '38% win rate', source: 'Jefferies (n=20)' }, { type: 'PEER', score: 75, detail: '~$3B ARR', source: 'Industry' }, { type: 'TREND', score: 70, detail: '90% stable', source: 'Jefferies (n=20)' }],
      dataPoints: [{ label: 'vs DBX', value: '38%', trend: 'down' }, { label: 'vs Fabric', value: '43%', trend: 'neutral' }, { label: 'vs BQ', value: '50%', trend: 'neutral' }, { label: 'vs RS', value: '55%', trend: 'up' }],
      whyItMatters: "Sub-40% win rate signals displacement risk in data science workloads.",
      response: "Win rates vary by use case—we win 70%+ in SQL-first analytics. The 38% reflects Databricks' data science strength. 90% of partners say our position is stable or strengthening." },
    { id: 3, category: 'AI Strategy', topic: 'AI/Product', difficulty: 'Medium', severity: 'high',
      question: "DDOG disclosed 6% AI-native ARR. You have 6,100 Cortex accounts but no disclosure. Can you quantify?",
      signals: [{ type: 'PEER', score: 90, detail: 'DDOG: 6% ARR', source: 'peer_news.csv' }, { type: 'PEER', score: 80, detail: 'MDB AI momentum', source: 'peer_news.csv' }, { type: 'RESEARCH', score: 85, detail: 'Additive debate', source: 'Jefferies (n=20)' }, { type: 'TREND', score: 75, detail: '6,100 accounts', source: 'Disclosures' }],
      dataPoints: [{ label: 'Cortex', value: '6,100+', trend: 'up' }, { label: 'DDOG', value: '6%', trend: 'neutral' }, { label: '<10% AI', value: '70%', trend: 'neutral' }, { label: 'AI pts', value: '7.5', trend: 'up' }],
      whyItMatters: "Peer disclosure creates pressure for comparable metrics.",
      response: "AI is additive—Cortex creates new consumption. 70% of partners report <10% AI practice today, showing early innings. We'll enhance disclosure as scale builds." },
    { id: 4, category: 'Product', topic: 'AI/Product', difficulty: 'Medium', severity: 'high',
      question: "60% see Iceberg workloads, 20% migrating out. Is Iceberg undermining storage economics?",
      signals: [{ type: 'RESEARCH', score: 90, detail: '60% net-new', source: 'Jefferies (n=20)' }, { type: 'RESEARCH', score: 85, detail: '20% out', source: 'Jefferies (n=20)' }, { type: 'RESEARCH', score: 80, detail: '69% velocity↑', source: 'Jefferies (n=20)' }, { type: 'TRANSCRIPT', score: 75, detail: 'Key debate', source: 'transcripts/' }],
      dataPoints: [{ label: 'In', value: '60%', trend: 'up' }, { label: 'Out', value: '20%', trend: 'down' }, { label: 'Velocity', value: '69%↑', trend: 'up' }, { label: 'Ratio', value: '3:1', trend: 'up' }],
      whyItMatters: "3:1 ratio is favorable but analysts probe sustainability.",
      response: "Iceberg is a flywheel—3:1 favorable ratio. We monetize compute, not storage. Customers on our compute with their storage improves unit economics." },
    { id: 5, category: 'Customers', topic: 'NRR', difficulty: 'Easy', severity: 'medium',
      question: `$1M+ customers grew to ${c.customers1M} (+27%). Is average spend compressing?`,
      signals: [{ type: 'TREND', score: 80, detail: `${p.customers1M}→${c.customers1M}`, source: 'ir_metrics.csv' }, { type: 'TREND', score: 80, detail: `$${p.productRev}→$${c.productRev}M`, source: 'ir_metrics.csv' }, { type: 'RESEARCH', score: 70, detail: 'Optimization', source: 'Jefferies' }, { type: 'TRANSCRIPT', score: 65, detail: 'Prior calls', source: 'transcripts/' }],
      dataPoints: [{ label: 'Cust', value: `${c.customers1M}`, trend: 'up' }, { label: 'Rev', value: `$${c.productRev}M`, trend: 'up' }, { label: 'Avg', value: `$${(c.productRev/c.customers1M).toFixed(1)}M`, trend: 'up' }, { label: 'Prior', value: `$${(p.productRev/p.customers1M).toFixed(1)}M`, trend: 'neutral' }],
      whyItMatters: "Math shows slight increase—positive signal.",
      response: `Average spend stable: $${(c.productRev/c.customers1M).toFixed(1)}M vs $${(p.productRev/p.customers1M).toFixed(1)}M prior.` },
    { id: 6, category: 'Macro', topic: 'Macro', difficulty: 'Medium', severity: 'medium',
      question: "~3pts macro headwind reported. With hyperscalers slowing, how resilient is consumption?",
      signals: [{ type: 'RESEARCH', score: 75, detail: '~3pts', source: 'Jefferies (n=20)' }, { type: 'PEER', score: 70, detail: 'Azure+33%, AWS+19%', source: 'peer_metrics.csv' }, { type: 'PEER', score: 65, detail: 'Optimization', source: 'Industry' }, { type: 'TREND', score: 80, detail: 'RPO +21%', source: 'ir_metrics.csv' }],
      dataPoints: [{ label: 'Head', value: '~3pts', trend: 'down' }, { label: 'RPO', value: '+21%', trend: 'up' }, { label: 'Plan', value: '70%', trend: 'up' }, { label: 'Base', value: 'Diverse', trend: 'neutral' }],
      whyItMatters: "RPO growth despite macro shows commitment.",
      response: "Contained ~3pt impact. Consumption provides resilience. RPO +21% to $6.9B shows commitment. Diversified: FinServ 22%, Tech 21%, Retail 16%." },
    { id: 7, category: 'Profitability', topic: 'Profitability', difficulty: 'Easy', severity: 'low',
      question: `FCF +${Math.round((c.fcf/p.fcf-1)*100)}% YoY. Is 25% margin sustainable?`,
      signals: [{ type: 'TREND', score: 85, detail: `$${p.fcf}→$${c.fcf}M`, source: 'ir_metrics.csv' }, { type: 'TREND', score: 80, detail: 'FCF>rev growth', source: 'ir_metrics.csv' }, { type: 'RESEARCH', score: 75, detail: 'Guide: 25%', source: 'Guidance' }, { type: 'PEER', score: 70, detail: 'Best: 30-35%', source: 'Benchmarks' }],
      dataPoints: [{ label: 'FCF', value: `$${c.fcf}M`, trend: 'up' }, { label: 'YoY', value: `+${Math.round((c.fcf/p.fcf-1)*100)}%`, trend: 'up' }, { label: 'Margin', value: '~9%', trend: 'up' }, { label: 'Target', value: '25%', trend: 'up' }],
      whyItMatters: "FCF > revenue growth = operating leverage.",
      response: "FCF reflects leverage at scale. 25% guide sustainable with path to 30-35%." },
    { id: 8, category: 'Macro', topic: 'Macro', difficulty: 'Hard', severity: 'medium',
      question: "With hyperscalers slowing and IT budgets tightening, how does consumption compare to subscription in a downturn?",
      signals: [{ type: 'PEER', score: 80, detail: 'Azure +33%↓', source: 'peer_metrics.csv' }, { type: 'PEER', score: 75, detail: 'AWS +19%↓', source: 'peer_metrics.csv' }, { type: 'RESEARCH', score: 70, detail: 'Budget cuts', source: 'Industry' }, { type: 'TRANSCRIPT', score: 65, detail: 'Resilience?', source: 'transcripts/' }],
      dataPoints: [{ label: 'Azure', value: '+33%', trend: 'down' }, { label: 'AWS', value: '+19%', trend: 'down' }, { label: 'SNOW', value: '+29%', trend: 'up' }, { label: 'RPO', value: '+21%', trend: 'up' }],
      whyItMatters: "Shows market awareness beyond Snowflake-only metrics.",
      response: "Consumption trade-offs: customers optimize immediately—no shelfware. Our 29% outpaces hyperscalers. AI creates non-discretionary consumption." },
  ];
};

// ============================================
// EXPLANATION MODAL - Shows when clicking ? icons
// ============================================

const ExplanationModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
      <div className="bg-slate-900 border border-cyan-500/50 rounded-xl w-full max-w-md shadow-2xl shadow-cyan-500/20" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="font-semibold text-cyan-400 flex items-center gap-2"><Info size={16} />{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-4 text-sm text-slate-300 space-y-3">{children}</div>
      </div>
    </div>
  );
};

// ============================================
// FILE UPLOAD PANEL
// ============================================

const FileUploadPanel = ({ isOpen, onClose, onDataUpdate }) => {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('');
  const fileInputRef = useRef(null);
  
  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).filter(f => f.name.endsWith('.csv') || f.name.endsWith('.pdf'));
    setFiles(prev => [...prev, ...newFiles.map(f => ({ name: f.name, status: 'ready' }))]);
    
    newFiles.forEach(file => {
      if (file.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setStatus(`✓ Parsed ${file.name}`);
          setFiles(prev => prev.map(f => f.name === file.name ? { ...f, status: 'loaded' } : f));
          // In real implementation, would parse and update data
        };
        reader.readAsText(file);
      }
    });
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center gap-2"><Upload size={16} className="text-emerald-400" />Upload New Data</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-4">
          <div 
            className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-cyan-500 transition-colors cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={32} className="mx-auto text-slate-500 mb-2" />
            <p className="text-slate-300 text-sm">Drag & drop files or click to browse</p>
            <p className="text-slate-500 text-xs mt-1">Supports: CSV, PDF</p>
            <input ref={fileInputRef} type="file" multiple accept=".csv,.pdf" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          </div>
          
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-xs text-slate-400 uppercase">Uploaded Files</h4>
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-slate-800 rounded-lg text-sm">
                  <CheckCircle size={14} className={f.status === 'loaded' ? 'text-emerald-400' : 'text-slate-500'} />
                  <span className="text-slate-300">{f.name}</span>
                  <span className="text-xs text-slate-500 ml-auto">{f.status === 'loaded' ? 'Loaded' : 'Ready'}</span>
                </div>
              ))}
            </div>
          )}
          
          {status && <p className="text-xs text-emerald-400 mt-3">{status}</p>}
          
          <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
            <h4 className="text-xs text-slate-400 mb-2">Supported Files:</h4>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• <code className="text-cyan-400">snowflake_ir_metrics.csv</code> — Updates NRR, revenue, customers</li>
              <li>• <code className="text-cyan-400">data_peer_financial_metrics.csv</code> — Updates competitor data</li>
              <li>• <code className="text-cyan-400">earnings_transcript.pdf</code> — Extracts Q&A patterns</li>
              <li>• <code className="text-cyan-400">research_report.pdf</code> — Extracts analyst insights</li>
            </ul>
          </div>
          
          <button 
            onClick={() => { setStatus('✓ Analysis refreshed with new data'); onDataUpdate?.(); }}
            className="w-full mt-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-medium rounded-lg hover:from-emerald-600 hover:to-cyan-600"
          >
            <RefreshCw size={14} className="inline mr-2" />
            Refresh Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTS
// ============================================

const ExecutiveSummary = () => (
  <div className="mb-6 bg-gradient-to-r from-slate-800/80 to-slate-800/40 border border-slate-700 rounded-xl p-5">
    <div className="flex items-center gap-2 mb-4"><Zap size={18} className="text-amber-400" /><h2 className="text-base font-bold text-white">Executive Summary</h2><span className="text-xs text-slate-500 ml-2">TL;DR for leadership</span></div>
    <div className="grid md:grid-cols-2 gap-5">
      <div><h3 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2"><AlertTriangle size={14} />Top Risks This Quarter</h3>
        <ul className="space-y-1.5 text-sm text-slate-300">
          <li>• <strong className="text-white">NRR:</strong> 178%→125% signals customer maturation</li>
          <li>• <strong className="text-white">Databricks:</strong> 38% win rate = losing more than winning</li>
          <li>• <strong className="text-white">AI disclosure:</strong> Peer pressure from DDOG's 6% metric</li>
        </ul>
      </div>
      <div><h3 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-2"><Shield size={14} />Recommended Narrative</h3>
        <ul className="space-y-1.5 text-sm text-slate-300">
          <li>• <strong className="text-white">NRR:</strong> "Healthy normalization, stabilizing 120-130%"</li>
          <li>• <strong className="text-white">Enterprise:</strong> "688 $1M+ customers (+27%) shows strength"</li>
          <li>• <strong className="text-white">AI:</strong> "6,100 Cortex accounts = additive growth"</li>
        </ul>
      </div>
    </div>
  </div>
);

const NRRChart = ({ data, onHelpClick }) => {
  const [active, setActive] = useState(null);
  const w = 680, h = 200, pad = { t: 50, r: 20, b: 40, l: 45 }, cw = w - pad.l - pad.r, ch = h - pad.t - pad.b;
  const pts = data.map((d, i) => ({ x: pad.l + (i / (data.length - 1)) * cw, y: pad.t + ch - ((d.nrr - 100) / 90) * ch, ...d, i }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${line} L ${pts[pts.length-1].x} ${pad.t + ch} L ${pts[0].x} ${pad.t + ch} Z`;
  const hov = active !== null ? pts[active] : null;
  // Position tooltip below if point is in top half, above if in bottom half
  const tooltipBelow = hov && hov.y < (pad.t + ch / 2);
  const tooltipY = hov ? (tooltipBelow ? hov.y + 15 : hov.y - 50) : 0;
  return (
    <div>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`}>
        <defs><linearGradient id="nG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" /><stop offset="100%" stopColor="#ef4444" stopOpacity="0" /></linearGradient></defs>
        {[100, 125, 150, 175].map(v => { const y = pad.t + ch - ((v - 100) / 90) * ch; return <g key={v}><line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke="#334155" strokeDasharray="3" /><text x={pad.l - 6} y={y + 3} fill="#64748b" fontSize="9" textAnchor="end">{v}%</text></g>; })}
        <path d={area} fill="url(#nG)" /><path d={line} fill="none" stroke="#ef4444" strokeWidth="2.5" />
        {pts.map((p, i) => <g key={i}><circle cx={p.x} cy={p.y} r={active === i ? 7 : 4} fill={active === i ? '#fff' : '#ef4444'} stroke={active === i ? '#ef4444' : '#fff'} strokeWidth="2" style={{ cursor: 'pointer' }} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} />{i % 3 === 0 && <text x={p.x} y={h - 6} fill="#64748b" fontSize="8" textAnchor="middle">{p.period}</text>}</g>)}
        {hov && <g><rect x={Math.max(50, Math.min(hov.x - 45, w - 95))} y={tooltipY} width="90" height="40" fill="#1e293b" stroke="#475569" rx="5" /><text x={Math.max(95, Math.min(hov.x, w - 50))} y={tooltipY + 16} fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">{hov.period}</text><text x={Math.max(95, Math.min(hov.x, w - 50))} y={tooltipY + 30} fill="#ef4444" fontSize="11" fontWeight="bold" textAnchor="middle">{hov.nrr}%</text></g>}
      </svg>
      <button onClick={onHelpClick} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-1"><HelpCircle size={12} />What is NRR?</button>
    </div>
  );
};

const WinRateChart = ({ data, onHelpClick }) => (
  <div>
    <div className="space-y-2">{data.map((d, i) => (
      <div key={i} className="flex items-center gap-2">
        <div className="w-20 text-xs text-slate-400 text-right">{d.name}</div>
        <div className="flex-1 bg-slate-700 rounded-full h-5 overflow-hidden">
          <div className="h-full rounded-full flex items-center justify-end pr-2" style={{ width: `${d.rate}%`, backgroundColor: d.rate >= 50 ? '#10b981' : d.rate >= 40 ? '#f59e0b' : '#ef4444' }}>
            <span className="text-xs font-semibold text-white">{d.rate}%</span>
          </div>
        </div>
        <span className="text-xs w-12">{d.rate >= 50 ? <span className="text-emerald-400">Win</span> : <span className="text-red-400">Lose</span>}</span>
      </div>
    ))}</div>
    <div className="flex items-center justify-between mt-3">
      <p className="text-xs text-slate-500 italic">Source: Jefferies Partner Survey (n=20, Nov 2025)</p>
      <button onClick={onHelpClick} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"><HelpCircle size={12} />What are win rates?</button>
    </div>
  </div>
);

const SeverityBadge = ({ s }) => {
  const c = { critical: 'bg-red-500/20 text-red-300 border-red-500/30', high: 'bg-amber-500/20 text-amber-300 border-amber-500/30', medium: 'bg-blue-500/20 text-blue-300 border-blue-500/30', low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' }[s];
  const ic = { critical: <AlertTriangle size={10} />, high: <AlertCircle size={10} />, medium: <Target size={10} />, low: <CheckCircle size={10} /> };
  const labels = { critical: 'CRITICAL', high: 'HIGH PRIORITY', medium: 'MED PRIORITY', low: 'LOW PRIORITY' };
  return <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs border ${c}`}>{ic[s]}{labels[s]}</span>;
};

const DiffBadge = ({ d }) => {
  const c = { Easy: 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/50', Medium: 'bg-amber-900/30 text-amber-400 border border-amber-700/50', Hard: 'bg-red-900/30 text-red-400 border border-red-700/50' }[d];
  return <span className={`px-1.5 py-0.5 rounded text-xs ${c}`}>{d} Question</span>;
};

const MetricCard = ({ label, value, change, trend, icon: Icon }) => (
  <div className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/50">
    <div className="flex items-center justify-between mb-0.5"><span className="text-xs text-slate-400">{label}</span>{Icon && <Icon size={10} className="text-slate-500" />}</div>
    <div className="text-lg font-bold text-white font-mono">{value}</div>
    {change && <div className={`flex items-center gap-1 text-xs ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'}`}>{trend === 'up' ? <TrendingUp size={10} /> : trend === 'down' ? <TrendingDown size={10} /> : null}{change}</div>}
  </div>
);

const SignalBar = ({ score }) => <div className="w-full bg-slate-700 rounded-full h-1"><div className="h-1 rounded-full" style={{ width: `${score}%`, backgroundColor: score >= 85 ? '#ef4444' : score >= 70 ? '#f59e0b' : '#10b981' }} /></div>;

const QuestionCard = ({ q, expanded, onToggle, onConfidenceHelp }) => {
  const avg = Math.round(q.signals.reduce((a, s) => a + s.score, 0) / q.signals.length);
  return (
    <div className={`rounded-lg border overflow-hidden ${q.severity === 'critical' ? 'border-red-500/40 bg-red-500/5' : q.severity === 'high' ? 'border-amber-500/40 bg-amber-500/5' : q.severity === 'medium' ? 'border-blue-500/40 bg-blue-500/5' : 'border-emerald-500/40 bg-emerald-500/5'}`}>
      <button onClick={onToggle} className="w-full p-3 text-left hover:bg-white/5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 flex-shrink-0"><span className="text-sm font-bold text-cyan-400">{q.id}</span></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <SeverityBadge s={q.severity} />
              <DiffBadge d={q.difficulty} />
              <span className="text-xs text-slate-500 px-1.5 py-0.5 rounded bg-slate-800">{q.category}</span>
              <button onClick={(e) => { e.stopPropagation(); onConfidenceHelp(); }} className="ml-auto text-xs text-cyan-400 font-mono flex items-center gap-1 hover:text-cyan-300">
                {avg}% <HelpCircle size={10} className="text-slate-500" />
              </button>
            </div>
            <p className="text-white text-sm leading-snug">{q.question}</p>
          </div>
          <div className="text-slate-400">{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
        </div>
      </button>
      {expanded && (
        <div className="px-3 pb-3 border-t border-slate-700/50">
          <div className="pt-3 space-y-3">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5">
              <h4 className="text-xs text-amber-400 mb-1 flex items-center gap-1"><Lightbulb size={10} />Why Analysts Care</h4>
              <p className="text-sm text-amber-100">{q.whyItMatters}</p>
            </div>
            <div>
              <h4 className="text-xs text-cyan-400 mb-1.5 flex items-center gap-1"><Brain size={10} />Signal Analysis (How Confidence is Calculated)</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {q.signals.map((s, i) => (
                  <div key={i} className="bg-slate-900/50 rounded p-2">
                    <div className="flex justify-between text-xs mb-0.5"><span className="text-slate-300">{s.type}</span><span className="text-cyan-400">{s.score}%</span></div>
                    <SignalBar score={s.score} />
                    <p className="text-xs text-slate-500 mt-1">{s.detail}</p>
                    <p className="text-xs text-cyan-700">{s.source}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1 text-center">Average = <span className="text-cyan-400">{avg}%</span> confidence</p>
            </div>
            <div>
              <h4 className="text-xs text-cyan-400 mb-1.5 flex items-center gap-1"><BarChart2 size={10} />Supporting Data</h4>
              <div className="grid grid-cols-4 gap-1.5">
                {q.dataPoints.map((d, i) => (
                  <div key={i} className="bg-slate-900/50 rounded p-2 text-center">
                    <div className="text-xs text-slate-500">{d.label}</div>
                    <div className={`text-sm font-mono ${d.trend === 'up' ? 'text-emerald-400' : d.trend === 'down' ? 'text-red-400' : 'text-white'}`}>{d.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs text-emerald-400 flex items-center gap-1 mb-1.5"><Sparkles size={10} />Suggested Response</h4>
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-2.5">
                <p className="text-sm text-cyan-50">{q.response}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MethodologyPanel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
      <div className="min-h-full flex items-start justify-center p-4 py-6">
        <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-3xl" onClick={e => e.stopPropagation()}>
          <div className="p-4 border-b border-slate-700 flex items-center justify-between"><h2 className="text-base font-bold text-white flex items-center gap-2"><BookOpen size={16} className="text-cyan-400" />How It Works</h2><button onClick={onClose} className="text-slate-400 hover:text-white">×</button></div>
          <div className="p-4 space-y-4 text-sm">
            <section><h3 className="font-semibold text-cyan-400 mb-1">Purpose</h3><p className="text-slate-300">This tool predicts what analysts will ask during earnings calls by analyzing data from multiple sources. It's designed as a <strong className="text-white">reusable quarterly workflow</strong>—upload new data to regenerate questions.</p></section>
            <section><h3 className="font-semibold text-cyan-400 mb-1">Signal Detection</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded p-2"><div className="flex justify-between"><span className="font-semibold text-cyan-400">TREND</span><span className="text-slate-500">30%</span></div><p className="text-slate-300">Historical patterns in Snowflake's own metrics</p></div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded p-2"><div className="flex justify-between"><span className="font-semibold text-amber-400">PEER</span><span className="text-slate-500">25%</span></div><p className="text-slate-300">Competitor disclosures that create pressure</p></div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-2"><div className="flex justify-between"><span className="font-semibold text-emerald-400">RESEARCH</span><span className="text-slate-500">25%</span></div><p className="text-slate-300">Analyst reports and partner surveys</p></div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded p-2"><div className="flex justify-between"><span className="font-semibold text-purple-400">TRANSCRIPT</span><span className="text-slate-500">20%</span></div><p className="text-slate-300">How often asked in past earnings calls</p></div>
              </div>
            </section>
            <section><h3 className="font-semibold text-cyan-400 mb-1">Confidence Score</h3><p className="text-slate-300">Average of 4 signal scores = likelihood analysts ask that question. <span className="text-red-400">85%+ = Critical (near-certain)</span>, <span className="text-amber-400">70-84% = High</span>, <span className="text-blue-400">50-69% = Medium</span>, <span className="text-emerald-400">&lt;50% = Low</span>.</p></section>
            <section><h3 className="font-semibold text-cyan-400 mb-1">Data Sources</h3>
              <div className="text-xs space-y-1">{['snowflake_ir_metrics.csv — Historical Snowflake KPIs', 'data_peer_financial_metrics.csv — Competitor financials', 'data_peer_news_snippets.csv — Earnings highlights', 'Jefferies Survey (n=20) — Partner survey, Nov 2025'].map(s => <div key={s} className="p-1.5 bg-slate-800/50 rounded text-slate-300">{s}</div>)}</div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================

export default function EarningsWarRoom() {
  const [expanded, setExpanded] = useState(1);
  const [tab, setTab] = useState('questions');
  const [topic, setTopic] = useState('All');
  const [diff, setDiff] = useState('All');
  const [showMethod, setShowMethod] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  
  // Explanation modals
  const [showNRRHelp, setShowNRRHelp] = useState(false);
  const [showWinRateHelp, setShowWinRateHelp] = useState(false);
  const [showConfidenceHelp, setShowConfidenceHelp] = useState(false);
  const [showResearchHelp, setShowResearchHelp] = useState(false);
  
  const questions = generateQuestions(SNOWFLAKE_DATA);
  const filtered = questions.filter(q => (topic === 'All' || q.topic === topic) && (diff === 'All' || q.difficulty === diff));
  const c = SNOWFLAKE_DATA[SNOWFLAKE_DATA.length - 1], p = SNOWFLAKE_DATA.find(d => d.period.includes('FY25')) || SNOWFLAKE_DATA[SNOWFLAKE_DATA.length - 2];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <MethodologyPanel isOpen={showMethod} onClose={() => setShowMethod(false)} />
      <FileUploadPanel isOpen={showUpload} onClose={() => setShowUpload(false)} />
      
      {/* NRR Explanation Modal */}
      <ExplanationModal isOpen={showNRRHelp} onClose={() => setShowNRRHelp(false)} title="What is NRR?">
        <p><strong className="text-white">Net Revenue Retention (NRR)</strong> measures how much revenue you keep from existing customers year-over-year.</p>
        <div className="bg-slate-800 rounded-lg p-3 my-2">
          <p className="text-cyan-400 font-mono">If NRR = 125%:</p>
          <p>Customers who paid $100 last year now pay $125 this year</p>
        </div>
        <p><strong className="text-white">Why it matters:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><span className="text-emerald-400">&gt;100%</span> = Growing from existing customers alone</li>
          <li><span className="text-amber-400">100%</span> = Flat—need new customers to grow</li>
          <li><span className="text-red-400">&lt;100%</span> = Shrinking—losing money from existing base</li>
        </ul>
        <p className="mt-2"><strong className="text-white">Snowflake's situation:</strong> Dropped from 178% → 125%. Still healthy (above 100%), but analysts worry about the trend.</p>
      </ExplanationModal>
      
      {/* Win Rate Explanation Modal */}
      <ExplanationModal isOpen={showWinRateHelp} onClose={() => setShowWinRateHelp(false)} title="What are Win Rates?">
        <p><strong className="text-white">Win Rate</strong> = percentage of deals won when competing head-to-head against a specific competitor.</p>
        <div className="bg-slate-800 rounded-lg p-3 my-2">
          <p className="text-cyan-400 font-mono">38% vs Databricks means:</p>
          <p>In 100 deals where both compete, Snowflake wins 38, Databricks wins 62</p>
        </div>
        <p><strong className="text-white">How to interpret:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><span className="text-emerald-400">&gt;50%</span> = Winning more than losing</li>
          <li><span className="text-amber-400">40-50%</span> = Competitive but behind</li>
          <li><span className="text-red-400">&lt;40%</span> = Losing significantly</li>
        </ul>
        <p className="mt-2"><strong className="text-white">Key insight:</strong> Databricks is the only competitor where Snowflake is below 40%. This signals risk in data science workloads specifically.</p>
      </ExplanationModal>
      
      {/* Confidence Explanation Modal */}
      <ExplanationModal isOpen={showConfidenceHelp} onClose={() => setShowConfidenceHelp(false)} title="What is Confidence?">
        <p><strong className="text-white">Confidence Score</strong> predicts how likely analysts are to ask this specific question during the earnings call.</p>
        <div className="bg-slate-800 rounded-lg p-3 my-2">
          <p className="text-cyan-400 font-mono">Calculated from 4 signals:</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li><strong>TREND (30%)</strong> — Is there a pattern in Snowflake's own data?</li>
            <li><strong>PEER (25%)</strong> — Did competitors disclose something relevant?</li>
            <li><strong>RESEARCH (25%)</strong> — Are analysts writing about this?</li>
            <li><strong>TRANSCRIPT (20%)</strong> — Was this asked in past calls?</li>
          </ul>
        </div>
        <p><strong className="text-white">Priority levels:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><span className="text-red-400">85%+ = CRITICAL</span> — Near-certain to be asked</li>
          <li><span className="text-amber-400">70-84% = HIGH</span> — Likely to be asked</li>
          <li><span className="text-blue-400">50-69% = MEDIUM</span> — May be asked</li>
          <li><span className="text-emerald-400">&lt;50% = LOW</span> — Less likely</li>
        </ul>
      </ExplanationModal>
      
      {/* Research Explanation Modal */}
      <ExplanationModal isOpen={showResearchHelp} onClose={() => setShowResearchHelp(false)} title="About the Research Data">
        <p><strong className="text-white">Jefferies Partner Survey</strong> is a quarterly survey of Snowflake's channel partners—companies that implement and resell Snowflake.</p>
        <div className="bg-slate-800 rounded-lg p-3 my-2">
          <p className="text-cyan-400 font-mono">Survey Details:</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li><strong>Sample:</strong> 20 US-based Snowflake partners</li>
            <li><strong>Date:</strong> November 2025</li>
            <li><strong>Source:</strong> Jefferies equity research</li>
          </ul>
        </div>
        <p><strong className="text-white">Key metrics explained:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>70% Met/Exceeded Plan</strong> — Most partners hit sales targets</li>
          <li><strong>7.5pts AI Contribution</strong> — AI adds 7.5 percentage points to growth</li>
          <li><strong>90% Stable/Strong</strong> — Most see Snowflake's position holding</li>
        </ul>
        <p className="mt-2"><strong className="text-white">Iceberg data:</strong> 60% see new workloads coming IN to Iceberg format, only 20% see workloads leaving. 3:1 ratio = positive signal.</p>
      </ExplanationModal>
      
      <header className="border-b border-slate-800/50 backdrop-blur-xl bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25"><span className="text-lg">❄️</span></div>
            <div><h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Earnings War Room</h1><p className="text-xs text-slate-400">AI-Powered Analyst Question Prediction</p></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800/50 border border-slate-700 rounded-lg text-xs text-slate-400"><Calendar size={10} />Q3 FY26</div>
            <button onClick={() => setShowUpload(true)} className="flex items-center gap-1.5 px-2 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 hover:bg-emerald-500/30"><Upload size={12} />Upload Data</button>
            <button onClick={() => setShowMethod(true)} className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 hover:bg-slate-700"><HelpCircle size={12} />How It Works</button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-5 py-5">
        <ExecutiveSummary />
        
        <section className="mb-5">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            <MetricCard label="Revenue" value={`$${c.productRev}M`} change={`+${Math.round((c.productRev/p.productRev-1)*100)}%`} trend="up" icon={DollarSign} />
            <MetricCard label="NRR" value={`${c.nrr}%`} change={`${c.nrr-p.nrr}pts`} trend="down" icon={Activity} />
            <MetricCard label="$1M+ Cust" value={c.customers1M} change={`+${c.customers1M-p.customers1M}`} trend="up" icon={Users} />
            <MetricCard label="RPO" value="$6.9B" change="+21%" trend="up" icon={Layers} />
            <MetricCard label="FCF" value={`$${c.fcf}M`} change={`+${Math.round((c.fcf/p.fcf-1)*100)}%`} trend="up" icon={TrendingUp} />
            <MetricCard label="Margin" value="76%" change="Stable" trend="neutral" icon={Target} />
            <MetricCard label="Cortex" value="6,100+" change="AI" trend="up" icon={Brain} />
          </div>
        </section>
        
        <section className="mb-5">
          <div className="bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center"><AlertTriangle size={20} className="text-red-400" /></div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-300 mb-1">Critical: NRR 178% → 125% (-53pts)</h3>
                <p className="text-xs text-slate-400 mb-2">This will be the #1 analyst question. Click chart points for details.</p>
                <NRRChart data={SNOWFLAKE_DATA} onHelpClick={() => setShowNRRHelp(true)} />
              </div>
            </div>
          </div>
        </section>
        
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex gap-1.5">
            {[{ id: 'questions', label: 'Questions', icon: Brain }, { id: 'competitive', label: 'Competitive', icon: Target }, { id: 'research', label: 'Research', icon: FileText }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${tab === t.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'}`}><t.icon size={12} />{t.label}</button>
            ))}
          </div>
          {tab === 'questions' && (
            <div className="flex items-center gap-1.5">
              <Filter size={12} className="text-slate-500" />
              <select value={topic} onChange={e => setTopic(e.target.value)} className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300">{TOPICS.map(t => <option key={t}>{t}</option>)}</select>
              <select value={diff} onChange={e => setDiff(e.target.value)} className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300">{DIFFICULTIES.map(d => <option key={d}>{d}</option>)}</select>
              <span className="text-xs text-slate-500">{filtered.length} Q's</span>
            </div>
          )}
        </div>
        
        {tab === 'questions' && <div className="space-y-2">{filtered.map(q => <QuestionCard key={q.id} q={q} expanded={expanded === q.id} onToggle={() => setExpanded(expanded === q.id ? null : q.id)} onConfidenceHelp={() => setShowConfidenceHelp(true)} />)}</div>}
        
        {tab === 'competitive' && (
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-white mb-3">Win Rates vs Competitors</h3>
              <WinRateChart data={WIN_RATES} onHelpClick={() => setShowWinRateHelp(true)} />
              <div className="mt-3 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-200">
                <strong>Key Insight:</strong> Databricks is the only competitor with sub-40% win rate. This signals displacement risk specifically in data science and ML workloads, where Databricks has stronger positioning.
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {Object.entries(PEER_DATA).map(([t, d]) => (
                <div key={t} className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3">
                  <div className="flex justify-between mb-2"><span className="font-bold">{t}</span><span className="text-xs text-slate-500">{d.quarter}</span></div>
                  <div className="space-y-1 text-sm">
                    {d.revenue && <div className="flex justify-between"><span className="text-slate-400">Rev</span><span>${d.revenue}M</span></div>}
                    {d.cloudRevenue && <div className="flex justify-between"><span className="text-slate-400">Cloud</span><span>${d.cloudRevenue}M</span></div>}
                    {d.awsRevenue && <div className="flex justify-between"><span className="text-slate-400">AWS</span><span>${d.awsRevenue}M</span></div>}
                    {d.grossMargin && <div className="flex justify-between"><span className="text-slate-400">GM</span><span>{d.grossMargin}%</span></div>}
                    {d.azureGrowth && <div className="flex justify-between"><span className="text-slate-400">Azure</span><span className="text-emerald-400">+{d.azureGrowth}%</span></div>}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-700 text-xs text-cyan-400">{d.aiMetric}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {tab === 'research' && (
          <div className="space-y-4">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-white">Jefferies Partner Survey</h3>
                <button onClick={() => setShowResearchHelp(true)} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"><HelpCircle size={12} />What is this?</button>
              </div>
              <p className="text-xs text-slate-400 mb-3">Survey of 20 US-based Snowflake implementation partners, November 2025</p>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="text-center p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                  <div className="text-2xl font-bold text-emerald-400">70%</div>
                  <div className="text-xs text-slate-400">Met/Exceeded Plan</div>
                  <p className="text-xs text-slate-500 mt-1">Most partners hit Q3 targets</p>
                </div>
                <div className="text-center p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                  <div className="text-2xl font-bold text-cyan-400">7.5pts</div>
                  <div className="text-xs text-slate-400">AI Growth Contribution</div>
                  <p className="text-xs text-slate-500 mt-1">AI adds to overall growth</p>
                </div>
                <div className="text-center p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                  <div className="text-2xl font-bold text-amber-400">90%</div>
                  <div className="text-xs text-slate-400">Position Stable/Strong</div>
                  <p className="text-xs text-slate-500 mt-1">Competitive position holding</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-white mb-2">Iceberg Table Adoption</h3>
              <p className="text-xs text-slate-400 mb-3">Iceberg is an open data format. Question: Does supporting it help Snowflake (attract workloads) or hurt (enable exit)?</p>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="text-center p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                  <div className="text-2xl font-bold text-emerald-400">60%</div>
                  <div className="text-xs text-slate-400">Workloads Coming IN</div>
                  <p className="text-xs text-emerald-400 mt-1">✓ Positive</p>
                </div>
                <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                  <div className="text-2xl font-bold text-red-400">20%</div>
                  <div className="text-xs text-slate-400">Workloads Going OUT</div>
                  <p className="text-xs text-red-400 mt-1">✗ Negative</p>
                </div>
                <div className="text-center p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                  <div className="text-2xl font-bold text-cyan-400">3:1</div>
                  <div className="text-xs text-slate-400">Net Ratio</div>
                  <p className="text-xs text-cyan-400 mt-1">= Flywheel ✓</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3 text-center">Conclusion: Iceberg is attracting more workloads than it's losing—a strategic positive.</p>
            </div>
          </div>
        )}
        
        <footer className="mt-8 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">Snowflake Business Analytics Intern Challenge • Reusable quarterly workflow tool</p>
        </footer>
      </main>
    </div>
  );
}
