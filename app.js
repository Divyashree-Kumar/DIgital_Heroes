const state = {
  plans: {
    monthly: 29,
    yearly: 299
  },
  subscriber: {
    name: "Aarav Malhotra",
    email: "aarav@example.com",
    plan: "monthly",
    status: "active",
    renewalDate: "2026-04-18",
    charityId: "c1",
    charityPercent: 18,
    drawsEntered: 12,
    nextDraw: "2026-03-31",
    totalWon: 420,
    paymentStatus: "Pending",
    donations: 0
  },
  charities: [
    {
      id: "c1",
      name: "First Swing Foundation",
      tag: "Youth Access",
      description: "Funding junior golf access and mentoring for underrepresented communities.",
      event: "April 16 - Youth Golf Day",
      featured: true
    },
    {
      id: "c2",
      name: "Greens For Recovery",
      tag: "Mental Wellness",
      description: "Outdoor recovery programmes using golf clinics and peer support for adults rebuilding confidence.",
      event: "May 02 - Community Scramble",
      featured: false
    },
    {
      id: "c3",
      name: "Caddies To Classrooms",
      tag: "Education",
      description: "Scholarships and equipment grants for caddies and golf workers pursuing education.",
      event: "April 28 - Scholarship Cup",
      featured: false
    }
  ],
  scores: [
    { id: "s1", value: 34, date: "2026-03-18" },
    { id: "s2", value: 31, date: "2026-03-12" },
    { id: "s3", value: 29, date: "2026-03-05" },
    { id: "s4", value: 36, date: "2026-02-24" },
    { id: "s5", value: 32, date: "2026-02-18" }
  ],
  draw: {
    month: "2026-03",
    mode: "random",
    numbers: [31, 18, 34, 12, 29],
    published: false,
    rolloverJackpot: 4960
  },
  editingScoreId: null,
  winners: [
    {
      id: "w1",
      name: "Aarav Malhotra",
      tier: "4-number match",
      prize: 420,
      proof: "screenshot-scorecard-mar18.png",
      status: "Pending"
    },
    {
      id: "w2",
      name: "Naina Kapoor",
      tier: "3-number match",
      prize: 180,
      proof: "naina-stableford-proof.png",
      status: "Paid"
    }
  ]
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const currencyPrecise = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric"
});

function $(id) {
  return document.getElementById(id);
}

function formatDate(value) {
  return dateFormat.format(new Date(`${value}T00:00:00`));
}

function getCurrentCharity() {
  return state.charities.find((charity) => charity.id === state.subscriber.charityId) || state.charities[0];
}

function planAmount() {
  return state.plans[state.subscriber.plan];
}

function charityContributionAmount() {
  return (planAmount() * state.subscriber.charityPercent) / 100;
}

function scoreEntriesDescending() {
  return [...state.scores].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function updateHeroMetrics() {
  const subscribers = 248 + state.winners.filter((winner) => winner.status !== "Rejected").length;
  const charityTotal = 3720 + state.subscriber.donations + Math.round(charityContributionAmount() * 30);
  $("metricSubscribers").textContent = subscribers.toString();
  $("metricCharity").textContent = currency.format(charityTotal);
  $("metricJackpot").textContent = currency.format(state.draw.rolloverJackpot);
}

function renderCharityOptions() {
  const options = state.charities.map((charity) => `
    <option value="${charity.id}" ${charity.id === state.subscriber.charityId ? "selected" : ""}>
      ${charity.name}
    </option>
  `).join("");

  $("charitySelect").innerHTML = options;
  $("donationCharity").innerHTML = options;
}

function renderCharityList() {
  const search = $("charitySearch").value.trim().toLowerCase();
  const charities = state.charities.filter((charity) => {
    if (!search) return true;
    return [charity.name, charity.tag, charity.description, charity.event]
      .some((field) => field.toLowerCase().includes(search));
  });

  $("charityList").innerHTML = charities.map((charity) => `
    <article class="charity-card">
      <header>
        <div>
          <h3>${charity.name}</h3>
          <span class="pill">${charity.tag}</span>
        </div>
        ${charity.featured ? '<span class="chip">Featured</span>' : ""}
      </header>
      <p>${charity.description}</p>
      <p><strong>Upcoming:</strong> ${charity.event}</p>
    </article>
  `).join("");
}

function renderFeaturedCharity() {
  const featured = state.charities.find((charity) => charity.featured) || state.charities[0];
  $("featuredCharityName").textContent = featured.name;
  $("featuredCharitySummary").textContent = featured.description;
  $("featuredCharityEvent").textContent = featured.event;
}

function renderSubscriberSummary() {
  const currentCharity = getCurrentCharity();
  const active = state.subscriber.status === "active";

  $("summaryPlan").textContent = state.subscriber.plan === "monthly" ? "Monthly" : "Yearly";
  $("summaryRenewal").textContent = formatDate(state.subscriber.renewalDate);
  $("summaryCharity").textContent = currentCharity.name;
  $("summaryContribution").textContent = `${currencyPrecise.format(charityContributionAmount())} / billing cycle`;
  $("drawsEntered").textContent = state.subscriber.drawsEntered.toString();
  $("nextDraw").textContent = formatDate(state.subscriber.nextDraw);
  $("totalWon").textContent = currency.format(state.subscriber.totalWon);
  $("paymentStatus").textContent = state.subscriber.paymentStatus;

  const badge = $("subscriptionStatusBadge");
  badge.textContent = state.subscriber.status.charAt(0).toUpperCase() + state.subscriber.status.slice(1);
  badge.className = `status-badge${active ? " active" : ""}`;
}

function renderScores() {
  const scores = scoreEntriesDescending();
  $("scoreList").innerHTML = scores.map((score) => `
    <article class="score-item">
      <div class="score-main">
        <strong>${score.value} Stableford</strong>
        <span>${formatDate(score.date)}</span>
      </div>
      <div class="score-actions">
        <button class="ghost-button" type="button" data-edit-score="${score.id}">Edit</button>
      </div>
    </article>
  `).join("");
}

function calculatePrizeBreakdown() {
  const activeSubscribers = 248;
  const poolBase = state.subscriber.plan === "monthly" ? 20 : 220;
  const totalPrizePool = activeSubscribers * poolBase * 0.4;
  const fivePool = totalPrizePool * 0.4 + state.draw.rolloverJackpot;
  const fourPool = totalPrizePool * 0.35;
  const threePool = totalPrizePool * 0.25;

  return {
    totalPrizePool,
    fivePool,
    fourPool,
    threePool
  };
}

function renderPrizeBreakdown() {
  const breakdown = calculatePrizeBreakdown();
  $("prizeBreakdown").innerHTML = `
    <article>
      <span>5-number match - 40% - rollover</span>
      <strong>${currency.format(breakdown.fivePool)}</strong>
    </article>
    <article>
      <span>4-number match - 35%</span>
      <strong>${currency.format(breakdown.fourPool)}</strong>
    </article>
    <article>
      <span>3-number match - 25%</span>
      <strong>${currency.format(breakdown.threePool)}</strong>
    </article>
  `;

  $("adminPrizePool").textContent = currency.format(breakdown.totalPrizePool);
}

function renderDrawNumbers() {
  $("drawNumbers").innerHTML = state.draw.numbers
    .map((number) => `<span class="ball">${number}</span>`)
    .join("");
}

function renderWinners() {
  $("winnerList").innerHTML = state.winners.map((winner) => `
    <article class="winner-item ${winner.status.toLowerCase()}">
      <div class="winner-main">
        <strong>${winner.name}</strong>
        <span>${winner.tier} - ${currency.format(winner.prize)} - Proof: ${winner.proof}</span>
      </div>
      <div class="winner-actions">
        <button class="ghost-button" type="button" data-winner-action="Pending" data-winner-id="${winner.id}">Pending</button>
        <button class="ghost-button" type="button" data-winner-action="Paid" data-winner-id="${winner.id}">Mark Paid</button>
        <button class="ghost-button" type="button" data-winner-action="Rejected" data-winner-id="${winner.id}">Reject</button>
      </div>
    </article>
  `).join("");
}

function renderAdminSummary() {
  $("adminTotalUsers").textContent = "248";
  $("adminCharityTotal").textContent = currency.format(3720 + state.subscriber.donations);
  $("adminDrawMode").textContent = state.draw.mode === "random" ? "Random" : "Weighted";
  $("publishState").textContent = state.draw.published ? "Published" : "Draft results";
  $("drawSummary").textContent = state.draw.published
    ? `Official ${state.draw.mode} draw published for ${state.draw.month}.`
    : `Simulation ready for ${state.draw.month}. Review prize split and winner states before publishing.`;
}

function renderSubscriptionForm() {
  $("userName").value = state.subscriber.name;
  $("userEmail").value = state.subscriber.email;
  $("planSelect").value = state.subscriber.plan;
  $("subscriptionState").value = state.subscriber.status;
  $("renewalDate").value = state.subscriber.renewalDate;
  $("charityPercent").value = state.subscriber.charityPercent;
  $("drawMode").value = state.draw.mode;
  $("drawMonth").value = state.draw.month;
}

function resetScoreForm() {
  $("scoreForm").reset();
  state.editingScoreId = null;
  $("scoreMode").textContent = "Add a new score to replace the oldest of the stored five.";
  $("scoreForm").querySelector("button").textContent = "Add Score";
}

function refresh() {
  renderCharityOptions();
  renderCharityList();
  renderFeaturedCharity();
  renderSubscriptionForm();
  renderSubscriberSummary();
  renderScores();
  renderDrawNumbers();
  renderPrizeBreakdown();
  renderWinners();
  renderAdminSummary();
  updateHeroMetrics();
}

function weightedDrawNumbers() {
  const weighted = scoreEntriesDescending().map((entry) => entry.value);
  const unique = [...new Set(weighted)];
  while (unique.length < 5) {
    unique.push(Math.floor(Math.random() * 45) + 1);
  }
  return unique.slice(0, 5);
}

function randomDrawNumbers() {
  const values = new Set();
  while (values.size < 5) {
    values.add(Math.floor(Math.random() * 45) + 1);
  }
  return [...values];
}

function simulateDraw() {
  state.draw.numbers = state.draw.mode === "weighted" ? weightedDrawNumbers() : randomDrawNumbers();

  const scoreMatches = scoreEntriesDescending().filter((score) => state.draw.numbers.includes(score.value)).length;
  const breakdown = calculatePrizeBreakdown();

  const winners = [
    {
      id: "w2",
      name: "Naina Kapoor",
      tier: "3-number match",
      prize: Math.round(breakdown.threePool / 4),
      proof: "naina-stableford-proof.png",
      status: "Pending"
    }
  ];

  if (scoreMatches >= 3) {
    winners.unshift({
      id: "w1",
      name: state.subscriber.name,
      tier: scoreMatches >= 5 ? "5-number match" : scoreMatches === 4 ? "4-number match" : "3-number match",
      prize: Math.round(scoreMatches >= 5 ? breakdown.fivePool : scoreMatches === 4 ? breakdown.fourPool / 2 : breakdown.threePool / 4),
      proof: "subscriber-proof-upload.png",
      status: "Pending"
    });
  }

  state.winners = winners;

  state.draw.published = false;
  if (!state.winners.some((winner) => winner.tier === "5-number match")) {
    state.draw.rolloverJackpot += Math.round(breakdown.totalPrizePool * 0.1);
  }

  refresh();
}

function bindEvents() {
  $("charitySearch").addEventListener("input", renderCharityList);

  $("subscriptionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    state.subscriber.name = $("userName").value.trim();
    state.subscriber.email = $("userEmail").value.trim();
    state.subscriber.plan = $("planSelect").value;
    state.subscriber.status = $("subscriptionState").value;
    state.subscriber.renewalDate = $("renewalDate").value;
    state.subscriber.charityPercent = Number($("charityPercent").value);
    state.subscriber.charityId = $("charitySelect").value;
    refresh();
  });

  $("scoreForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const value = Number($("scoreValue").value);
    const date = $("scoreDate").value;

    if (!Number.isInteger(value) || value < 1 || value > 45) {
      $("scoreError").textContent = "Score must be between 1 and 45.";
      return;
    }

    $("scoreError").textContent = "";
    if (state.editingScoreId) {
      state.scores = state.scores.map((score) => score.id === state.editingScoreId ? { ...score, value, date } : score);
    } else {
      state.scores.push({
        id: `s${Date.now()}`,
        value,
        date
      });
      state.scores = scoreEntriesDescending().slice(0, 5);
    }

    resetScoreForm();
    refresh();
  });

  $("scoreList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-edit-score]");
    if (!button) return;
    const score = state.scores.find((entry) => entry.id === button.dataset.editScore);
    if (!score) return;
    state.editingScoreId = score.id;
    $("scoreValue").value = score.value;
    $("scoreDate").value = score.date;
    $("scoreMode").textContent = "Editing an existing score. Save to keep the five-score set intact.";
    $("scoreForm").querySelector("button").textContent = "Save Score";
  });

  $("donationForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const amount = Number($("donationAmount").value);
    const charityId = $("donationCharity").value;
    if (!amount || amount < 1) return;

    state.subscriber.donations += amount;
    const charity = state.charities.find((item) => item.id === charityId);
    $("donationFeedback").textContent = `${currencyPrecise.format(amount)} recorded for ${charity.name}.`;
    refresh();
  });

  $("drawMode").addEventListener("change", (event) => {
    state.draw.mode = event.target.value;
    refresh();
  });

  $("drawMonth").addEventListener("change", (event) => {
    state.draw.month = event.target.value;
    refresh();
  });

  $("simulateBtn").addEventListener("click", simulateDraw);

  $("publishBtn").addEventListener("click", () => {
    state.draw.published = true;
    state.subscriber.paymentStatus = "Pending";
    refresh();
  });

  $("winnerList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-winner-id]");
    if (!button) return;
    const winner = state.winners.find((entry) => entry.id === button.dataset.winnerId);
    if (!winner) return;
    winner.status = button.dataset.winnerAction;
    if (winner.name === state.subscriber.name) {
      state.subscriber.paymentStatus = winner.status;
      if (winner.status === "Paid") {
        state.subscriber.totalWon = Math.round(state.subscriber.totalWon + winner.prize);
      }
    }
    refresh();
  });

  $("charityForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const entry = {
      id: `c${Date.now()}`,
      name: $("charityNameInput").value.trim(),
      tag: $("charityTagInput").value.trim(),
      description: $("charityDescriptionInput").value.trim(),
      event: $("charityEventInput").value.trim(),
      featured: $("charityFeaturedInput").value === "true"
    };

    if (entry.featured) {
      state.charities.forEach((charity) => {
        charity.featured = false;
      });
    }

    state.charities.unshift(entry);
    $("charityForm").reset();
    refresh();
  });
}

refresh();
bindEvents();
resetScoreForm();
