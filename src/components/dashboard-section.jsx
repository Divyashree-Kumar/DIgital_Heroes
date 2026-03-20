import {
  currency,
  currencyPrecise,
  formatDate,
  getScoreList
} from "@/components/common";

export function DashboardGate({ credentials, error, onLogin }) {
  return (
    <section className="gate-section">
      <article className="panel-card gate-card">
        <p className="card-label">Subscriber access</p>
        <h2>Sign in to the user dashboard</h2>
        <form className="form-grid" action={onLogin}>
          <label>
            Email
            <input defaultValue={credentials.email} name="email" type="email" required />
          </label>
          <label>
            Password
            <input defaultValue={credentials.password} name="password" type="password" required />
          </label>
          <button className="button button-primary full-span" type="submit">
            Sign in
          </button>
        </form>
        <p className="inline-error">{error}</p>
      </article>
    </section>
  );
}

export function DashboardSection({
  data,
  analytics,
  currentCharity,
  scoreForm,
  setScoreForm,
  donationFeedback,
  updateSubscriber,
  submitScore,
  addDonation
}) {
  return (
    <section className="dashboard-section">
      <div className="section-heading stack-mobile">
        <div>
          <p className="card-label">Subscriber dashboard</p>
          <h2>Subscription, charity, score tracking, and winnings</h2>
        </div>
        <span className={`status-badge ${data.subscriber.status === "active" ? "active" : ""}`}>
          {data.subscriber.status}
        </span>
      </div>
      <div className="dashboard-grid">
        <article className="panel-card">
          <h3>Subscription setup</h3>
          <form className="form-grid" action={updateSubscriber}>
            <label>
              Full name
              <input defaultValue={data.subscriber.name} name="name" required />
            </label>
            <label>
              Email
              <input defaultValue={data.subscriber.email} name="email" type="email" required />
            </label>
            <label>
              Plan
              <select defaultValue={data.subscriber.plan} name="plan">
                <option value="monthly">Monthly - $29</option>
                <option value="yearly">Yearly - $299</option>
              </select>
            </label>
            <label>
              Subscription state
              <select defaultValue={data.subscriber.status} name="status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="lapsed">Lapsed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
            <label>
              Renewal date
              <input defaultValue={data.subscriber.renewalDate} name="renewalDate" type="date" required />
            </label>
            <label>
              Charity percentage
              <input defaultValue={data.subscriber.charityPercent} max="90" min="10" name="charityPercent" type="number" required />
            </label>
            <label className="full-span">
              Selected charity
              <select defaultValue={data.subscriber.charityId} name="charityId">
                {data.charities.map((charity) => (
                  <option key={charity.id} value={charity.id}>
                    {charity.name}
                  </option>
                ))}
              </select>
            </label>
            <button className="button button-primary full-span" type="submit">
              Save subscription
            </button>
          </form>
        </article>

        <article className="panel-card">
          <h3>Account summary</h3>
          <div className="summary-list">
            <div>
              <span>Plan</span>
              <strong>{data.subscriber.plan === "monthly" ? "Monthly" : "Yearly"}</strong>
            </div>
            <div>
              <span>Renewal</span>
              <strong>{formatDate(data.subscriber.renewalDate)}</strong>
            </div>
            <div>
              <span>Selected charity</span>
              <strong>{currentCharity.name}</strong>
            </div>
            <div>
              <span>Charity contribution</span>
              <strong>{currencyPrecise.format(analytics.charityPerCycle)}</strong>
            </div>
            <div>
              <span>Total won</span>
              <strong>{currency.format(data.subscriber.totalWon)}</strong>
            </div>
            <div>
              <span>Payment state</span>
              <strong>{data.subscriber.paymentStatus}</strong>
            </div>
          </div>
        </article>

        <article className="panel-card full-width">
          <div className="section-heading stack-mobile">
            <div>
              <h3>Latest 5 Stableford scores</h3>
              <p>Add a new score to replace the oldest entry automatically, or edit an existing one.</p>
            </div>
            <div className="chip-row">
              <span className="chip">Range 1-45</span>
              <span className="chip">Reverse chronological</span>
            </div>
          </div>
          <form className="score-form" action={submitScore}>
            <label>
              Score
              <input
                key={`score-value-${scoreForm.editingId || "new"}`}
                defaultValue={scoreForm.value}
                min="1"
                max="45"
                name="score"
                type="number"
                required
              />
            </label>
            <label>
              Date
              <input
                key={`score-date-${scoreForm.editingId || "new"}`}
                defaultValue={scoreForm.date}
                name="date"
                type="date"
                required
              />
            </label>
            <button className="button button-primary" type="submit">
              {scoreForm.editingId ? "Save score" : "Add score"}
            </button>
          </form>
          <div className="score-list">
            {getScoreList(data.scores).map((score) => (
              <article className="score-item" key={score.id}>
                <div className="score-main">
                  <strong>{score.value} Stableford</strong>
                  <span>{formatDate(score.date)}</span>
                </div>
                <div className="score-actions">
                  <button className="ghost-button" onClick={() => setScoreForm({ value: String(score.value), date: score.date, editingId: score.id })} type="button">
                    Edit
                  </button>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="panel-card">
          <h3>Participation</h3>
          <div className="summary-list">
            <div>
              <span>Draws entered</span>
              <strong>{data.subscriber.drawsEntered}</strong>
            </div>
            <div>
              <span>Next draw</span>
              <strong>31 Mar 2026</strong>
            </div>
            <div>
              <span>Current draw state</span>
              <strong>{data.draw.published ? "Published" : "Awaiting publish"}</strong>
            </div>
          </div>
        </article>

        <article className="panel-card">
          <h3>Independent donation</h3>
          <form className="form-grid compact-grid" action={addDonation}>
            <label>
              Amount
              <input defaultValue="25" min="1" name="amount" type="number" required />
            </label>
            <label>
              Charity
              <select defaultValue={data.subscriber.charityId} name="charityId">
                {data.charities.map((charity) => (
                  <option key={charity.id} value={charity.id}>
                    {charity.name}
                  </option>
                ))}
              </select>
            </label>
            <button className="button button-secondary full-span" type="submit">
              Record donation
            </button>
          </form>
          <p className="inline-note">{donationFeedback || "Independent donations stay outside gameplay logic."}</p>
        </article>
      </div>
    </section>
  );
}
