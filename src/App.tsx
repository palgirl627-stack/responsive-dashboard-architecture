import { useEffect, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Command,
  LayoutDashboard,
  Moon,
  PackageCheck,
  PanelLeft,
  Plus,
  Sun,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import { Route, Switch, Router as WouterRouter } from 'wouter';

type IconType = typeof LayoutDashboard;
type Range = '7d' | '30d' | '90d';

const navItems: { label: string; icon: IconType; count?: string }[] = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Revenue', icon: CircleDollarSign },
  { label: 'Customers', icon: Users },
  { label: 'Projects', icon: ClipboardCheck, count: '4' },
];

const chartData: Record<Range, { labels: string[]; values: number[]; previous: number[] }> = {
  '7d': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [42, 49, 46, 61, 57, 72, 79],
    previous: [37, 42, 41, 52, 49, 58, 64],
  },
  '30d': {
    labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
    values: [48, 57, 54, 79],
    previous: [41, 45, 50, 64],
  },
  '90d': {
    labels: ['Jan', 'Feb', 'Mar'],
    values: [39, 58, 79],
    previous: [31, 45, 64],
  },
};

function SparkChart({ range }: { range: Range }) {
  const { labels, values, previous } = chartData[range];
  const width = 700;
  const height = 225;
  const padX = 28;
  const padTop = 18;
  const padBottom = 28;
  const plotHeight = height - padTop - padBottom;
  const plotWidth = width - padX * 2;
  const max = 100;
  const points = values.map((value, index) => ({
    x: padX + (index * plotWidth) / (values.length - 1 || 1),
    y: padTop + ((max - value) / max) * plotHeight,
  }));
  const previousPoints = previous.map((value, index) => ({
    x: padX + (index * plotWidth) / (previous.length - 1 || 1),
    y: padTop + ((max - value) / max) * plotHeight,
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(' ');
  const previousLine = previousPoints.map((point) => `${point.x},${point.y}`).join(' ');
  const area = `${padX},${height - padBottom} ${line} ${width - padX},${height - padBottom}`;

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Revenue trend chart">
      {[25, 50, 75, 100].map((level) => {
        const y = padTop + ((max - level) / max) * plotHeight;
        return <line className="chart-grid-line" key={level} x1={padX} y1={y} x2={width - padX} y2={y} />;
      })}
      <polygon className="chart-area" points={area} />
      <polyline points={previousLine} fill="none" stroke="hsl(var(--brand-sky))" strokeWidth="2" strokeDasharray="4 5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline className="chart-line" points={line} />
      {points.map((point, index) => <circle className="chart-dot" key={`${labels[index]}-${point.x}`} cx={point.x} cy={point.y} r="4.5" />)}
      {labels.map((label, index) => <text className="chart-axis" key={label} x={points[index].x} y={height - 7} textAnchor="middle">{label}</text>)}
    </svg>
  );
}

function Sidebar({ active, setActive }: { active: string; setActive: (label: string) => void }) {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true"><Command size={16} /></div>
        <div><div className="brand-name">Northstar</div><div className="brand-subtitle">Operations</div></div>
      </div>
      <div className="nav-label">Workspace</div>
      <nav className="nav-list">
        {navItems.map(({ label, icon: NavIcon, count }) => (
          <button className={`nav-item ${active === label ? 'is-active' : ''}`} data-testid={`button-nav-${label.toLowerCase()}`} key={label} onClick={() => setActive(label)} type="button">
            <NavIcon aria-hidden="true" />
            <span className="nav-item-text">{label}</span>
            {count && <span className="nav-count">{count}</span>}
          </button>
        ))}
      </nav>
      <div className="nav-label nav-label-spaced">Manage</div>
      <nav className="nav-list">
        <button className={`nav-item ${active === 'Team' ? 'is-active' : ''}`} data-testid="button-nav-team" onClick={() => setActive('Team')} type="button"><Users aria-hidden="true" /><span className="nav-item-text">Team</span></button>
        <button className={`nav-item ${active === 'Goals' ? 'is-active' : ''}`} data-testid="button-nav-goals" onClick={() => setActive('Goals')} type="button"><Target aria-hidden="true" /><span className="nav-item-text">Goals</span></button>
      </nav>
      <div className="sidebar-foot">
        <div className="sidebar-note"><div className="sidebar-note-label">Weekly pulse</div><p>Four decisions are waiting for your attention.</p></div>
        <div className="sidebar-user"><div className="avatar">AM</div><div><strong>Alex Morgan</strong><span>Product lead</span></div></div>
      </div>
    </aside>
  );
}

function MetricCard({ label, value, delta, icon: MetricIcon, featured }: { label: string; value: string; delta: string; icon: IconType; featured?: boolean }) {
  return (
    <article className={`metric-card ${featured ? 'featured' : ''}`} data-testid={`card-metric-${label.toLowerCase().replaceAll(' ', '-')}`}>
      <div className="metric-head"><span className="metric-label">{label}</span><span className="metric-icon"><MetricIcon aria-hidden="true" /></span></div>
      <strong className="metric-value">{value}</strong>
      <span className="metric-delta">{delta.startsWith('+') ? <ArrowUpRight aria-hidden="true" /> : <ArrowDownRight aria-hidden="true" />}{delta}</span>
    </article>
  );
}

function Dashboard() {
  const [active, setActive] = useState('Overview');
  const [range, setRange] = useState<Range>('30d');
  const [dark, setDark] = useState(() => {
    const previewTheme = new URLSearchParams(window.location.search).get('theme');
    if (previewTheme === 'dark') return true;
    if (previewTheme === 'light') return false;
    return window.localStorage.getItem('northstar-theme') === 'dark';
  });
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const announce = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(''), 2600);
  };

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    window.localStorage.setItem('northstar-theme', next ? 'dark' : 'light');
    announce(`${next ? 'Dark' : 'Light'} theme enabled`);
  };

  const selectNav = (label: string) => {
    setActive(label);
    if (label !== 'Overview') announce(`${label} view selected — overview stays in this prototype`);
  };

  return (
    <div className="app-shell">
      <Sidebar active={active} setActive={selectNav} />
      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Tuesday, October 24, 2024 / 09:41</p>
            <h1 className="page-title">Good morning, Alex <em>↗</em></h1>
          </div>
          <div className="topbar-actions">
            <div className="period-control">
              <label htmlFor="time-range">Showing</label>
              <select id="time-range" data-testid="select-time-range" value={range} onChange={(event) => setRange(event.target.value as Range)}>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
            <button className="icon-button" data-testid="button-notifications" type="button" aria-label="View notifications" onClick={() => announce('You have 4 open items')}>
              <Bell aria-hidden="true" /><span className="notification-dot" aria-hidden="true" />
            </button>
            <button className="theme-button" data-testid="button-theme-toggle" type="button" aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} onClick={toggleTheme}>
              {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
            </button>
          </div>
        </header>

        {feedback && <div className="feedback" data-testid="status-feedback" role="status"><Check size={15} /> {feedback}</div>}

        <section className="summary-grid" aria-label="Business health">
          <MetricCard label="Net revenue" value="$84,290" delta="+12.8%" icon={CircleDollarSign} featured />
          <MetricCard label="Active customers" value="1,284" delta="+8.4%" icon={Users} />
          <MetricCard label="On-time delivery" value="92.6%" delta="+3.1%" icon={PackageCheck} />
          <MetricCard label="Team capacity" value="76.4%" delta="-2.6%" icon={Zap} />
        </section>

        <section className="dashboard-grid" aria-label="Performance overview">
          <article className="panel">
            <div className="panel-header">
              <div><h2 className="panel-title">Revenue pulse</h2><p className="panel-subtitle">A clear read on momentum across your business.</p></div>
              <button className="panel-link" data-testid="button-revenue-details" type="button" onClick={() => announce('Revenue detail view is ready to explore')}>View details <ChevronRight aria-hidden="true" /></button>
            </div>
            <div className="chart-wrap">
              <SparkChart range={range} />
              <div className="chart-legend"><span><i className="legend-dot" />Current period</span><span><i className="legend-dot secondary" />Previous period</span></div>
            </div>
          </article>
          <article className="panel attention-panel">
            <div className="panel-header"><div><h2 className="panel-title">Needs attention</h2><p className="panel-subtitle">Small actions, meaningful progress.</p></div><span className="metric-label">04 open</span></div>
            <div className="attention-list">
              {[
                ['Renewal at risk', 'Acme renewal due in 6 days', 'warn'],
                ['Capacity watch', 'Design team at 91% this sprint', ''],
                ['Review needed', 'Q4 launch brief is ready', 'info'],
                ['Data check', 'Two invoices need a category', ''],
              ].map(([title, detail, status], index) => (
                <div className="attention-item" data-testid={`row-attention-${index}`} key={title}>
                  <span className={`attention-status ${status}`} aria-hidden="true" />
                  <div className="attention-copy"><strong>{title}</strong><span>{detail}</span></div>
                  <button className="attention-action" data-testid={`button-attention-${index}`} type="button" aria-label={`Open ${title}`} onClick={() => announce(`${title} marked for follow-up`)}><ChevronRight aria-hidden="true" /></button>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="bottom-grid" aria-label="Team delivery">
          <article className="panel progress-panel">
            <div className="panel-header"><div><h2 className="panel-title">Delivery health</h2><p className="panel-subtitle">Where the team is spending its energy.</p></div><Activity size={18} color="hsl(var(--muted-foreground))" aria-hidden="true" /></div>
            <div className="progress-body">
              {[['Product roadmap', '68%', ''], ['Customer commitments', '84%', 'sky'], ['Operations hygiene', '47%', 'coral']].map(([label, value, color]) => (
                <div className="progress-row" key={label}><div className="progress-meta"><span>{label}</span><strong>{value}</strong></div><div className="progress-track"><div className={`progress-fill ${color}`} style={{ width: value }} /></div></div>
              ))}
            </div>
          </article>
          <article className="panel activity-panel">
            <div className="panel-header"><div><h2 className="panel-title">Recent activity</h2><p className="panel-subtitle">The latest movement across your workspace.</p></div><button className="panel-link" data-testid="button-add-activity" type="button" aria-label="Add an activity" onClick={() => announce('Activity composer opened')}><Plus aria-hidden="true" /></button></div>
            <div className="activity-list">
              {[
                ['Maya Chen', 'moved Launch brief to review', '12 min ago'],
                ['Theo Rivers', 'closed the Atlas support loop', '48 min ago'],
                ['You', 'approved the Q4 hiring plan', '2 hr ago'],
              ].map(([name, action, time]) => <div className="activity-item" key={`${name}-${time}`}><div className="activity-marker" aria-hidden="true" /><div className="activity-copy"><p><strong>{name}</strong> {action}</p><time>{time}</time></div></div>)}
            </div>
          </article>
        </section>
      </main>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.slice(0, 4).map(({ label, icon: NavIcon }) => <button className={`nav-item ${active === label ? 'is-active' : ''}`} data-testid={`button-mobile-nav-${label.toLowerCase()}`} key={label} onClick={() => selectNav(label)} type="button"><NavIcon aria-hidden="true" /><span className="nav-item-text">{label}</span></button>)}
        <button className="nav-item" data-testid="button-mobile-panel" type="button" onClick={() => announce('Quick navigation is available in the full sidebar')}><PanelLeft aria-hidden="true" /><span className="nav-item-text">More</span></button>
      </nav>
    </div>
  );
}

function App() {
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Switch><Route path="/" component={Dashboard} /><Route component={Dashboard} /></Switch></WouterRouter>;
}

export default App;