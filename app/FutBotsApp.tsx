"use client";

/* eslint-disable @next/next/no-img-element -- Exact Figma SVG sizing is intentional. */

import { FormEvent, useEffect, useMemo, useState } from "react";

type Screen =
  | "splash"
  | "auth"
  | "login"
  | "signup"
  | "dashboard"
  | "profile"
  | "plans"
  | "details";

type Team = {
  name: string;
  flag: string;
};

type Match = {
  id: string;
  date: string;
  teamA: Team;
  teamB: Team;
  status: "upcoming" | "live" | "complete";
  score?: string;
  round: string;
};

const teams = {
  spain: { name: "Spain", flag: "/assets/flag-es.svg" },
  argentina: { name: "Argentina", flag: "/assets/flag-ar.svg" },
  france: { name: "France", flag: "/assets/flag-fr.svg" },
  england: { name: "England", flag: "/assets/flag-gb-eng.svg" },
  portugal: { name: "Portugal", flag: "/assets/flag-pt.svg" },
};

const matches: Match[] = [
  {
    id: "final",
    date: "Jul 19, 2026 | 15:00",
    teamA: teams.spain,
    teamB: teams.argentina,
    status: "complete",
    score: "1:0",
    round: "World Cup Final",
  },
  {
    id: "semi-fr-es",
    date: "Jul 14, 2026 | 14:00",
    teamA: teams.france,
    teamB: teams.spain,
    status: "complete",
    score: "0:2",
    round: "Semi-final",
  },
  {
    id: "semi-en-ar",
    date: "Jul 15, 2026 | 15:00",
    teamA: teams.england,
    teamB: teams.argentina,
    status: "live",
    score: "1:2",
    round: "Semi-final",
  },
  {
    id: "round-pt-es",
    date: "Jul 6, 2026 | 15:00",
    teamA: teams.portugal,
    teamB: teams.spain,
    status: "upcoming",
    round: "Round of 16",
  },
];

const plans = [
  {
    id: "free",
    name: "Free Trial",
    price: "Free",
    copy: "Pre-match AI analysis and a concise conclusion for one match.",
    period: "",
  },
  {
    id: "weekend",
    name: "Weekend Pass",
    price: "2.99 USDT",
    copy: "AI expert analysis for all matches in the next 24 hours.",
    period: "24 Hour",
  },
  {
    id: "monthly",
    name: "Monthly Pass",
    price: "11.99 USDT",
    copy: "AI expert analysis for all matches in the next 7 days.",
    period: "1 Month",
  },
  {
    id: "premium",
    name: "Monthly Premium",
    price: "29.99 USDT",
    copy: "AI expert analysis for all matches in the next 30 days.",
    period: "1 Month",
    recommended: true,
  },
  {
    id: "max",
    name: "MAX",
    price: "49.99 USDT",
    copy: "Multiple AI models collaborate, aggregate results and provide a voting distribution.",
    period: "1 Month",
  },
];

function AssetIcon({
  src,
  alt = "",
  size = 18,
}: {
  src: string;
  alt?: string;
  size?: number;
}) {
  return (
    <img
      className="asset-icon"
      src={src}
      alt={alt}
      width={size}
      height={size}
    />
  );
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "logo logo--compact" : "logo"}>
      <img src="/assets/brand-ball.svg" alt="" />
      <img src="/assets/brand-wordmark.svg" alt="FutBots" />
    </div>
  );
}

function TeamFlag({ team, size = 34 }: { team: Team; size?: number }) {
  return (
    <img
      className="team-flag"
      src={team.flag}
      alt={`${team.name} flag`}
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="circle-button" onClick={onClick} aria-label="Go back">
      <AssetIcon src="/assets/back.svg" size={24} />
    </button>
  );
}

function BrandSplash() {
  return (
    <section className="splash" aria-label="FutBots">
      <div className="splash__background" />
      <div className="splash__brand">
        <div className="splash__ball">
          <img className="splash__ring" src="/assets/brand-ring.svg" alt="" />
          <img className="splash__rotor" src="/assets/brand-rotor.svg" alt="" />
          <img className="splash__core" src="/assets/brand-core.svg" alt="" />
        </div>
        <img
          className="splash__wordmark"
          src="/assets/brand-wordmark.svg"
          alt="FutBots"
        />
      </div>
    </section>
  );
}

function AuthShell({
  title,
  children,
  showBall = false,
}: {
  title?: string;
  children: React.ReactNode;
  showBall?: boolean;
}) {
  return (
    <section className={`auth-shell ${showBall ? "auth-shell--flags" : ""}`}>
      <div className="auth-shell__scrim" />
      <div className="auth-shell__content">
        {showBall && (
          <div className="auth-hero">
            <img src="/assets/brand-ball.svg" alt="" />
            <h1>Not Sure? Bot It</h1>
          </div>
        )}
        {title && <h1 className="auth-title">{title}</h1>}
        {children}
      </div>
      <div className="auth-footer">
        <img
          className="auth-footer__wordmark"
          src="/assets/brand-wordmark.svg"
          alt="FutBots"
        />
        <p>
          By continuing, you acknowledge that the predictions are provided for
          informational purposes only and will not be used to place bets
          automatically.
        </p>
      </div>
    </section>
  );
}

function AuthLanding({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <AuthShell showBall>
      <div className="social-actions">
        <button onClick={() => navigate("login")}>
          <AssetIcon src="/assets/brand-ball.svg" size={32} />
          Login with FutBot account
        </button>
        <button onClick={() => navigate("dashboard")}>
          <AssetIcon src="/assets/google.svg" size={32} />
          Continue with Google
        </button>
        <button onClick={() => navigate("dashboard")}>
          <AssetIcon src="/assets/telegram.svg" size={32} />
          Continue with Telegram
        </button>
      </div>
    </AuthShell>
  );
}

function AccountForm({
  mode,
  navigate,
}: {
  mode: "login" | "signup";
  navigate: (screen: Screen) => void;
}) {
  const submit = (event: FormEvent) => {
    event.preventDefault();
    navigate("dashboard");
  };
  const signup = mode === "signup";

  return (
    <AuthShell title={signup ? "Create account" : undefined} showBall={!signup}>
      <form className="account-form" onSubmit={submit}>
        <label>
          <span>Email</span>
          <input type="email" aria-label="Email" required />
        </label>
        <label>
          <span>Password</span>
          <input type="password" aria-label="Password" required />
        </label>
        {signup && (
          <label>
            <span>Confirm Password</span>
            <input type="password" aria-label="Confirm Password" required />
          </label>
        )}
        <button className="primary-button" type="submit">
          {signup ? "Create" : "Login"}
        </button>
        <button
          className="text-button"
          type="button"
          onClick={() => navigate(signup ? "login" : "signup")}
        >
          {signup ? "Login" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}

function CalendarStrip() {
  const dates = [
    ["S", "21"],
    ["M", "22"],
    ["T", "23"],
    ["W", "24"],
    ["T", "25"],
    ["F", "26"],
    ["S", "27"],
  ];
  return (
    <div className="calendar">
      <div className="calendar__month">
        <button aria-label="Previous month">
          <AssetIcon src="/assets/chevron-left.svg" size={10} />
        </button>
        <span>July 2026</span>
        <button aria-label="Next month">
          <AssetIcon src="/assets/chevron-right.svg" size={10} />
        </button>
      </div>
      <div className="calendar__days">
        {dates.map(([weekday, day]) => (
          <button
            className={day === "25" ? "calendar__day is-active" : "calendar__day"}
            key={day}
          >
            <span>{weekday}</span>
            <b>{day}</b>
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterControl({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="filter-control">
      <span>{label}</span>
      <button onClick={() => setOpen((current) => !current)}>
        {value}
        <AssetIcon src="/assets/chevron-down.svg" size={10} />
      </button>
      {open && (
        <div className="filter-popover">
          <button onClick={() => setOpen(false)}>{value}</button>
          <button onClick={() => setOpen(false)}>All matches</button>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ match }: { match: Match }) {
  if (match.status === "live") {
    return (
      <span className="status status--live">
        <AssetIcon src="/assets/live-dot.svg" size={6} /> Live
      </span>
    );
  }
  if (match.status === "complete") {
    return <span className="status status--complete">{match.round}</span>;
  }
  return (
    <span className="status status--soon">
      <AssetIcon src="/assets/clock.svg" size={12} />
      Starting soon
    </span>
  );
}

function MatchVersus({ match }: { match: Match }) {
  return (
    <div className="match-versus">
      <div>
        <TeamFlag team={match.teamA} />
        <span>{match.teamA.name}</span>
      </div>
      <b>{match.score ?? "vs."}</b>
      <div>
        <TeamFlag team={match.teamB} />
        <span>{match.teamB.name}</span>
      </div>
    </div>
  );
}

function PredictionCard({
  match,
  onAnalyze,
  onDetails,
  analyzing,
}: {
  match: Match;
  onAnalyze: () => void;
  onDetails: () => void;
  analyzing: boolean;
}) {
  return (
    <article className="prediction-card">
      <header>
        <span>{match.date}</span>
        <StatusBadge match={match} />
      </header>
      <MatchVersus match={match} />
      {analyzing ? (
        <div className="analyzing" aria-live="polite">
          <AssetIcon src="/assets/spinner.svg" size={18} />
          Analyzing...
        </div>
      ) : match.status === "complete" ? (
        <button className="card-link" onClick={onDetails}>
          See Predictions
          <AssetIcon src="/assets/row-arrow.svg" size={8} />
        </button>
      ) : (
        <button className="primary-button primary-button--card" onClick={onAnalyze}>
          <AssetIcon src="/assets/sparkle.svg" size={17} />
          Start Free Analyze
        </button>
      )}
    </article>
  );
}

function FreeScoreCard({ onClick }: { onClick: () => void }) {
  return (
    <article className="free-score-card">
      <div className="free-score-card__title">
        <AssetIcon src="/assets/sparkle.svg" size={17} />
        <h2>Free Score Day</h2>
        <span>FREE</span>
      </div>
      <MatchVersus match={matches[3]} />
      <button className="primary-button" onClick={onClick}>
        <AssetIcon src="/assets/sparkle.svg" size={17} />
        Try it for free
      </button>
    </article>
  );
}

function ConfirmModal({
  match,
  onClose,
  onConfirm,
}: {
  match: Match;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="prediction-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="prediction-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="prediction-modal__heading">
          <h2 id="prediction-dialog-title">
            You Have 1 Free Prediction Left
          </h2>
          <span>
            <AssetIcon src="/assets/ai-sparkle.svg" size={10} /> By FutBot AI
          </span>
        </div>
        <MatchVersus match={match} />
        <div className="prediction-modal__copy">
          <p>By clicking “Start Now,” you’ll receive predictions for:</p>
          <ul>
            <li>Score Predictions</li>
            <li>Over / Under</li>
            <li>Asian handicap</li>
          </ul>
          <p>Your free prediction will reset tomorrow.</p>
        </div>
        <button className="primary-button" onClick={onConfirm}>
          Start Now
        </button>
      </section>
    </div>
  );
}

function DashboardHeader({
  navigate,
  toggleMenu,
}: {
  navigate: (screen: Screen) => void;
  toggleMenu: () => void;
}) {
  return (
    <header className="dashboard-header">
      <button className="plan-pill" onClick={() => navigate("profile")}>
        <AssetIcon src="/assets/user.svg" size={24} />
        Free Trial
      </button>
      <button className="circle-button" onClick={toggleMenu} aria-label="Open menu">
        <AssetIcon src="/assets/menu.svg" size={24} />
      </button>
    </header>
  );
}

function SideNavigation({
  screen,
  navigate,
}: {
  screen: Screen;
  navigate: (screen: Screen) => void;
}) {
  return (
    <aside className="desktop-nav">
      <Logo />
      <nav>
        <button
          className={screen === "dashboard" ? "is-active" : ""}
          onClick={() => navigate("dashboard")}
        >
          Predictions
        </button>
        <button
          className={screen === "profile" ? "is-active" : ""}
          onClick={() => navigate("profile")}
        >
          My Profile
        </button>
        <button
          className={screen === "plans" ? "is-active" : ""}
          onClick={() => navigate("plans")}
        >
          Plans
        </button>
      </nav>
      <div className="desktop-nav__plan">
        <span>Current plan</span>
        <b>Monthly Pass</b>
        <small>AI access through Aug 19</small>
      </div>
    </aside>
  );
}

function Dashboard({
  navigate,
}: {
  navigate: (screen: Screen) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalMatch, setModalMatch] = useState<Match | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const startAnalysis = (match: Match) => setModalMatch(match);
  const confirm = () => {
    if (!modalMatch) return;
    const selected = modalMatch;
    setModalMatch(null);
    setAnalyzingId(selected.id);
    window.setTimeout(() => {
      setAnalyzingId(null);
      navigate("details");
    }, 1100);
  };

  return (
    <>
      <div className="app-with-nav">
        <SideNavigation screen="dashboard" navigate={navigate} />
        <main className="dashboard">
          <div className="dashboard__top">
            <DashboardHeader
              navigate={navigate}
              toggleMenu={() => setMenuOpen((current) => !current)}
            />
            {menuOpen && (
              <div className="mobile-menu">
                <button onClick={() => navigate("profile")}>Profile</button>
                <button onClick={() => navigate("plans")}>Plans</button>
                <button onClick={() => navigate("auth")}>Log out</button>
              </div>
            )}
            <CalendarStrip />
            <div className="filters">
              <FilterControl label="Date" value="Jul 15, 2026" />
              <FilterControl label="Match type" value="World Cup" />
            </div>
          </div>

          <div className="dashboard__content">
            <div className="dashboard__main">
              <FreeScoreCard onClick={() => startAnalysis(matches[3])} />
              <div className="section-heading">
                <h1>Predictions</h1>
                <span>FIFA World Cup 2026</span>
              </div>
              <div className="prediction-grid">
                {matches.map((match) => (
                  <PredictionCard
                    key={match.id}
                    match={match}
                    analyzing={analyzingId === match.id}
                    onAnalyze={() => startAnalysis(match)}
                    onDetails={() => navigate("details")}
                  />
                ))}
              </div>
            </div>
            <aside className="desktop-insight">
              <span className="eyebrow">FutBot AI</span>
              <h2>World Cup intelligence, match by match.</h2>
              <p>
                Compare scorelines, totals and handicap signals with one clear,
                model-backed view.
              </p>
              <div className="insight-stat">
                <b>104</b>
                <span>tournament matches tracked</span>
              </div>
              <button onClick={() => navigate("plans")}>Explore plans</button>
            </aside>
          </div>
        </main>
      </div>
      {modalMatch && (
        <ConfirmModal
          match={modalMatch}
          onClose={() => setModalMatch(null)}
          onConfirm={confirm}
        />
      )}
    </>
  );
}

function AiBadge() {
  return (
    <span className="ai-badge">
      <AssetIcon src="/assets/ai-sparkle.svg" size={10} /> By FutBot AI
    </span>
  );
}

function Details({ navigate }: { navigate: (screen: Screen) => void }) {
  const final = matches[0];
  return (
    <div className="app-with-nav">
      <SideNavigation screen="details" navigate={navigate} />
      <main className="details-page">
        <header className="page-title">
          <BackButton onClick={() => navigate("dashboard")} />
          <div>
            <span>World Cup Final</span>
            <h1>{final.teamA.name} vs. {final.teamB.name}</h1>
          </div>
          <img className="pitch-graphic" src="/assets/pitch.svg" alt="" />
        </header>
        <div className="details-grid">
          <section className="detail-panel score-panel">
            <header>
              <div>
                <AssetIcon src="/assets/section-ball.svg" size={18} />
                Score Predictions
              </div>
              <AiBadge />
            </header>
            {["1:0", "0:1", "0:0", "1:1"].map((score) => (
              <div className="score-row" key={score}>
                <span><TeamFlag team={final.teamA} size={22} />{final.teamA.name}</span>
                <b>{score}</b>
                <span><TeamFlag team={final.teamB} size={22} />{final.teamB.name}</span>
              </div>
            ))}
          </section>
          <section className="detail-panel">
            <header>
              <div><AssetIcon src="/assets/section-ball.svg" size={18} />Total</div>
              <AiBadge />
            </header>
            <div className="pick-layout">
              <div className="pick-options">
                <div><small>#1</small><b>Under 2 / 2.5 Goals</b></div>
                <div><small>#2</small><b>Under 2.5 Goals</b></div>
              </div>
              <div className="pick-teams">
                <span><TeamFlag team={final.teamB} size={22} />{final.teamB.name}</span>
                <span><TeamFlag team={final.teamA} size={22} />{final.teamA.name}</span>
              </div>
            </div>
          </section>
          <section className="detail-panel">
            <header>
              <div><AssetIcon src="/assets/section-ball.svg" size={18} />Asian Handicap</div>
              <AiBadge />
            </header>
            <div className="pick-layout pick-layout--single">
              <div><b>Argentina +0.25</b></div>
              <div className="pick-teams">
                <span><TeamFlag team={final.teamB} size={22} />{final.teamB.name}</span>
                <span><TeamFlag team={final.teamA} size={22} />{final.teamA.name}</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function MoreIcon() {
  return (
    <span className="more-icon" aria-hidden="true">
      <img src="/assets/more-left.svg" alt="" />
      <img src="/assets/more-middle.svg" alt="" />
      <img src="/assets/more-right.svg" alt="" />
    </span>
  );
}

function Profile({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <div className="app-with-nav">
      <SideNavigation screen="profile" navigate={navigate} />
      <main className="profile-page">
        <header className="simple-header">
          <BackButton onClick={() => navigate("dashboard")} />
          <h1>Profile</h1>
        </header>
        <div className="profile-layout">
          <section className="current-plan">
            <div>
              <span>Current Plan</span>
              <h2>Monthly Pass</h2>
              <p>AI expert analysis for all matches in the next 30 days.</p>
            </div>
            <button onClick={() => navigate("plans")} aria-label="Manage plan">
              <MoreIcon />
            </button>
          </section>
          <section className="history">
            <h2>My Predictions</h2>
            {matches.map((match) => (
              <button
                className="history-row"
                key={match.id}
                onClick={() => navigate("details")}
              >
                <div className="history-row__top">
                  <span>{match.date}</span>
                  <StatusBadge match={match} />
                </div>
                <div className="history-row__teams">
                  <span><TeamFlag team={match.teamA} />{match.teamA.name}</span>
                  <span><TeamFlag team={match.teamB} />{match.teamB.name}</span>
                </div>
                <AssetIcon src="/assets/row-arrow.svg" size={10} />
              </button>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}

function Plans({ navigate }: { navigate: (screen: Screen) => void }) {
  const [selected, setSelected] = useState("premium");
  const active = useMemo(
    () => plans.find((plan) => plan.id === selected) ?? plans[3],
    [selected],
  );
  return (
    <div className="app-with-nav">
      <SideNavigation screen="plans" navigate={navigate} />
      <main className="plans-page">
        <header className="simple-header">
          <BackButton onClick={() => navigate("profile")} />
          <div>
            <span>Choose your access</span>
            <h1>Plans</h1>
          </div>
        </header>
        <div className="plan-grid">
          {plans.map((plan) => (
            <button
              className={`plan-card ${selected === plan.id ? "is-selected" : ""}`}
              key={plan.id}
              onClick={() => setSelected(plan.id)}
            >
              {plan.recommended && <span className="recommended">Recommended</span>}
              <div className="plan-card__heading">
                <div><span>{plan.name}</span><b>{plan.price}</b></div>
                {plan.period && (
                  <small>
                    <AssetIcon
                      src={selected === plan.id ? "/assets/time-active.svg" : "/assets/time-muted.svg"}
                      size={13}
                    />
                    {plan.period}
                  </small>
                )}
              </div>
              <p>{plan.copy}</p>
            </button>
          ))}
        </div>
        <div className="plan-checkout">
          <button className="primary-button">
            {active.price === "Free" ? "Continue free" : `Pay now (${active.price})`}
          </button>
          {active.period && <p>Renews monthly until cancelled</p>}
        </div>
      </main>
    </div>
  );
}

export default function FutBotsApp() {
  const [screen, setScreen] = useState<Screen>("splash");

  useEffect(() => {
    const timer = window.setTimeout(() => setScreen("auth"), 1900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [screen]);

  if (screen === "splash") return <BrandSplash />;
  if (screen === "auth") return <AuthLanding navigate={setScreen} />;
  if (screen === "login") return <AccountForm mode="login" navigate={setScreen} />;
  if (screen === "signup") return <AccountForm mode="signup" navigate={setScreen} />;
  if (screen === "dashboard") return <Dashboard navigate={setScreen} />;
  if (screen === "details") return <Details navigate={setScreen} />;
  if (screen === "profile") return <Profile navigate={setScreen} />;
  return <Plans navigate={setScreen} />;
}
