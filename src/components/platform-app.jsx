"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ADMIN_CREDENTIALS,
  SUBSCRIBER_CREDENTIALS,
  initialState
} from "@/lib/mock-data";
import {
  getAnalytics,
  getCurrentCharity,
  getFeaturedCharity,
  getScoreList,
  Hero,
  simulateNumbers,
  TopNav
} from "@/components/common";
import { HomeSection } from "@/components/home-section";
import { DashboardGate, DashboardSection } from "@/components/dashboard-section";
import { AdminGate, AdminSection } from "@/components/admin-section";

const STORAGE_KEY = "birdie-for-good-demo-state";
const SESSION_KEY = "birdie-for-good-demo-session";

function cloneInitialState() {
  return JSON.parse(JSON.stringify(initialState));
}

export function PlatformApp({ mode }) {
  const [data, setData] = useState(initialState);
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState({ dashboard: false, admin: false });
  const [dashboardError, setDashboardError] = useState("");
  const [adminError, setAdminError] = useState("");
  const [scoreForm, setScoreForm] = useState({ value: "", date: "", editingId: null });
  const [charityQuery, setCharityQuery] = useState("");
  const [donationFeedback, setDonationFeedback] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const storedSession = window.sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
      setData(cloneInitialState());
    }
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, ready]);

  useEffect(() => {
    if (!ready) return;
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }, [session, ready]);

  const analytics = useMemo(() => getAnalytics(data), [data]);
  const currentCharity = useMemo(() => getCurrentCharity(data), [data]);
  const featuredCharity = useMemo(() => getFeaturedCharity(data.charities), [data.charities]);
  const visibleCharities = useMemo(() => {
    if (!charityQuery.trim()) return data.charities;
    const query = charityQuery.toLowerCase();
    return data.charities.filter((charity) =>
      [charity.name, charity.tag, charity.description, charity.event].some((field) =>
        field.toLowerCase().includes(query)
      )
    );
  }, [charityQuery, data.charities]);

  function patchData(updater) {
    setData((current) => updater(JSON.parse(JSON.stringify(current))));
  }

  function resetDemo() {
    setData(cloneInitialState());
    setScoreForm({ value: "", date: "", editingId: null });
    setDonationFeedback("");
  }

  function handleDashboardLogin(formData) {
    if (
      formData.get("email") === SUBSCRIBER_CREDENTIALS.email &&
      formData.get("password") === SUBSCRIBER_CREDENTIALS.password
    ) {
      setSession((current) => ({ ...current, dashboard: true }));
      setDashboardError("");
      return;
    }
    setDashboardError("Invalid subscriber credentials.");
  }

  function handleAdminLogin(formData) {
    if (
      formData.get("email") === ADMIN_CREDENTIALS.email &&
      formData.get("password") === ADMIN_CREDENTIALS.password
    ) {
      setSession((current) => ({ ...current, admin: true }));
      setAdminError("");
      return;
    }
    setAdminError("Invalid admin credentials.");
  }

  function updateSubscriber(formData) {
    patchData((draft) => {
      draft.subscriber.name = formData.get("name");
      draft.subscriber.email = formData.get("email");
      draft.subscriber.plan = formData.get("plan");
      draft.subscriber.status = formData.get("status");
      draft.subscriber.renewalDate = formData.get("renewalDate");
      draft.subscriber.charityPercent = Number(formData.get("charityPercent"));
      draft.subscriber.charityId = formData.get("charityId");
      return draft;
    });
  }

  function submitScore(formData) {
    const value = Number(formData.get("score"));
    const date = formData.get("date");
    if (!Number.isInteger(value) || value < 1 || value > 45 || !date) return;
    patchData((draft) => {
      if (scoreForm.editingId) {
        draft.scores = draft.scores.map((score) =>
          score.id === scoreForm.editingId ? { ...score, value, date } : score
        );
      } else {
        draft.scores.push({ id: `s${Date.now()}`, value, date });
        draft.scores = getScoreList(draft.scores).slice(0, 5);
      }
      return draft;
    });
    setScoreForm({ value: "", date: "", editingId: null });
  }

  function addDonation(formData) {
    const amount = Number(formData.get("amount"));
    const charityId = formData.get("charityId");
    const charity = data.charities.find((entry) => entry.id === charityId);
    if (!amount || amount < 1 || !charity) return;
    patchData((draft) => {
      draft.subscriber.independentDonations += amount;
      return draft;
    });
    setDonationFeedback(`${amount.toFixed(2)} USD recorded for ${charity.name}.`);
  }

  function simulateDraw() {
    patchData((draft) => {
      const numbers = simulateNumbers(draft.draw.mode, draft.scores);
      const matches = getScoreList(draft.scores).filter((score) => numbers.includes(score.value)).length;
      const breakdown = getAnalytics(draft).prizePool;
      draft.draw.numbers = numbers;
      draft.draw.published = false;
      draft.winners = [
        {
          id: "w2",
          name: "Naina Kapoor",
          tier: "3-number match",
          prize: Math.round(breakdown * 0.125),
          proof: "naina-proof.png",
          status: "Pending"
        }
      ];
      if (matches >= 3) {
        draft.winners.unshift({
          id: "w1",
          name: draft.subscriber.name,
          tier: matches >= 5 ? "5-number match" : matches === 4 ? "4-number match" : "3-number match",
          prize:
            matches >= 5
              ? Math.round(breakdown * 0.4 + draft.draw.rolloverJackpot)
              : matches === 4
                ? Math.round((breakdown * 0.35) / 2)
                : Math.round((breakdown * 0.25) / 4),
          proof: "subscriber-proof-upload.png",
          status: "Pending"
        });
      } else {
        draft.draw.rolloverJackpot += Math.round(breakdown * 0.1);
      }
      return draft;
    });
  }

  function publishDraw() {
    patchData((draft) => {
      draft.draw.published = true;
      return draft;
    });
  }

  function updateWinner(id, status) {
    patchData((draft) => {
      draft.winners = draft.winners.map((winner) => (winner.id === id ? { ...winner, status } : winner));
      const currentWinner = draft.winners.find((winner) => winner.name === draft.subscriber.name);
      draft.subscriber.paymentStatus = currentWinner?.status || "Pending";
      if (currentWinner?.status === "Paid") {
        draft.subscriber.totalWon = Math.max(draft.subscriber.totalWon, currentWinner.prize);
      }
      return draft;
    });
  }

  function addCharity(formData) {
    patchData((draft) => {
      const featured = formData.get("featured") === "true";
      if (featured) {
        draft.charities = draft.charities.map((charity) => ({ ...charity, featured: false }));
      }
      draft.charities.unshift({
        id: `c${Date.now()}`,
        name: formData.get("name"),
        tag: formData.get("tag"),
        description: formData.get("description"),
        event: formData.get("event"),
        featured
      });
      return draft;
    });
  }

  if (!ready) {
    return <main className="loading-screen">Loading platform...</main>;
  }

  return (
    <main className="page-shell">
      <TopNav />
      <Hero analytics={analytics} featuredCharity={featuredCharity} />
      {mode === "home" ? (
        <HomeSection
          visibleCharities={visibleCharities}
          charityQuery={charityQuery}
          setCharityQuery={setCharityQuery}
          subscriberCredentials={SUBSCRIBER_CREDENTIALS}
          adminCredentials={ADMIN_CREDENTIALS}
          openDashboard={() => {
            setSession((current) => ({ ...current, dashboard: true }));
            window.location.href = "/dashboard";
          }}
          openAdmin={() => {
            setSession((current) => ({ ...current, admin: true }));
            window.location.href = "/admin";
          }}
          resetDemo={resetDemo}
        />
      ) : null}
      {mode === "dashboard" ? (
        session.dashboard ? (
          <DashboardSection
            data={data}
            analytics={analytics}
            currentCharity={currentCharity}
            scoreForm={scoreForm}
            setScoreForm={setScoreForm}
            donationFeedback={donationFeedback}
            updateSubscriber={updateSubscriber}
            submitScore={submitScore}
            addDonation={addDonation}
          />
        ) : (
          <DashboardGate
            credentials={SUBSCRIBER_CREDENTIALS}
            error={dashboardError}
            onLogin={handleDashboardLogin}
          />
        )
      ) : null}
      {mode === "admin" ? (
        session.admin ? (
          <AdminSection
            data={data}
            analytics={analytics}
            featuredCharity={featuredCharity}
            currentCharity={currentCharity}
            patchData={patchData}
            simulateDraw={simulateDraw}
            publishDraw={publishDraw}
            updateWinner={updateWinner}
            addCharity={addCharity}
          />
        ) : (
          <AdminGate credentials={ADMIN_CREDENTIALS} error={adminError} onLogin={handleAdminLogin} />
        )
      ) : null}
    </main>
  );
}
