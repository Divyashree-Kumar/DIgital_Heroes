"use client";

import {
  ADMIN_CREDENTIALS,
  SUBSCRIBER_CREDENTIALS
} from "@/lib/mock-data";

export const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

export const currencyPrecise = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric"
});

export const planPrices = {
  monthly: 29,
  yearly: 299
};

export function formatDate(date) {
  return dateFormatter.format(new Date(`${date}T00:00:00`));
}

export function getScoreList(scores) {
  return [...scores].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getFeaturedCharity(charities) {
  return charities.find((charity) => charity.featured) || charities[0];
}

export function getCurrentCharity(data) {
  return data.charities.find((charity) => charity.id === data.subscriber.charityId) || data.charities[0];
}

export function simulateNumbers(mode, scores) {
  if (mode === "weighted") {
    const unique = [...new Set(getScoreList(scores).map((score) => score.value))];
    while (unique.length < 5) {
      unique.push(Math.floor(Math.random() * 45) + 1);
    }
    return unique.slice(0, 5);
  }

  const values = new Set();
  while (values.size < 5) {
    values.add(Math.floor(Math.random() * 45) + 1);
  }
  return [...values];
}

export function getAnalytics(data) {
  const planAmount = planPrices[data.subscriber.plan];
  const charityPerCycle = (planAmount * data.subscriber.charityPercent) / 100;
  const charityTotal = 3720 + data.subscriber.independentDonations + Math.round(charityPerCycle * 24);
  const activeSubscribers = 248;
  const prizePool = Math.round(activeSubscribers * (data.subscriber.plan === "monthly" ? 20 : 220) * 0.4);

  return {
    charityPerCycle,
    charityTotal,
    prizePool,
    currentJackpot: data.draw.rolloverJackpot,
    totalUsers: activeSubscribers
  };
}

export function TopNav() {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Digital Heroes sample build</p>
        <a className="brand" href="/">
          Birdie For Good
        </a>
      </div>
      <nav className="topnav">
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/admin">Admin</a>
      </nav>
    </header>
  );
}

export function Hero({ analytics, featuredCharity }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Win monthly. Give monthly. Track every round.</p>
        <h1>
          Charity-first golf subscriptions
          <span>with a modern monthly reward engine.</span>
        </h1>
        <p className="hero-text">
          This build covers the PRD end to end: subscription setup, score capture, rolling five-score logic,
          monthly draw simulation and publish flow, charity selection, winner verification, and admin tools.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="/dashboard">
            Open user dashboard
          </a>
          <a className="button button-secondary" href="/admin">
            Open admin panel
          </a>
        </div>
        <div className="hero-metrics">
          <article>
            <strong>{analytics.totalUsers}</strong>
            <span>Active subscribers</span>
          </article>
          <article>
            <strong>{currency.format(analytics.charityTotal)}</strong>
            <span>Charity impact</span>
          </article>
          <article>
            <strong>{currency.format(analytics.currentJackpot)}</strong>
            <span>Rollover jackpot</span>
          </article>
        </div>
      </div>
      <aside className="hero-panel">
        <div className="orb orb-coral" />
        <div className="orb orb-gold" />
        <div className="panel-card spotlight-card">
          <p className="card-label">Featured charity</p>
          <h2>{featuredCharity.name}</h2>
          <p>{featuredCharity.description}</p>
          <div className="spotlight-meta">
            <span>Upcoming event</span>
            <strong>{featuredCharity.event}</strong>
          </div>
        </div>
      </aside>
    </section>
  );
}

export function AccessCard({ title, subtitle, email, password, onUse, onReset }) {
  return (
    <article className="panel-card access-card">
      <p className="card-label">{title}</p>
      <h3>{subtitle}</h3>
      <div className="credential-block">
        <span>Email: {email}</span>
        <span>Password: {password}</span>
      </div>
      <div className="action-row">
        <button className="button button-primary" onClick={onUse} type="button">
          Open
        </button>
        {onReset ? (
          <button className="button button-secondary" onClick={onReset} type="button">
            Reset Demo Data
          </button>
        ) : null}
      </div>
    </article>
  );
}

export function CredentialHints() {
  return {
    subscriber: SUBSCRIBER_CREDENTIALS,
    admin: ADMIN_CREDENTIALS
  };
}
