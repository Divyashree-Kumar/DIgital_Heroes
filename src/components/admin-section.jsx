import { currency } from "@/components/common";

export function AdminGate({ credentials, error, onLogin }) {
  return (
    <section className="gate-section">
      <article className="panel-card gate-card">
        <p className="card-label">Admin access</p>
        <h2>Sign in to the admin dashboard</h2>
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

export function AdminSection({
  data,
  analytics,
  featuredCharity,
  currentCharity,
  patchData,
  simulateDraw,
  publishDraw,
  updateWinner,
  addCharity
}) {
  return (
    <section className="dashboard-section">
      <div className="section-heading stack-mobile">
        <div>
          <p className="card-label">Admin dashboard</p>
          <h2>Draw management, winner verification, charities, and analytics</h2>
        </div>
        <span className="status-badge">Admin mode</span>
      </div>
      <div className="dashboard-grid">
        <article className="panel-card">
          <h3>Platform analytics</h3>
          <div className="metrics-grid">
            <div>
              <span>Total users</span>
              <strong>{analytics.totalUsers}</strong>
            </div>
            <div>
              <span>Prize pool</span>
              <strong>{currency.format(analytics.prizePool)}</strong>
            </div>
            <div>
              <span>Charity contributions</span>
              <strong>{currency.format(analytics.charityTotal)}</strong>
            </div>
            <div>
              <span>Draw mode</span>
              <strong>{data.draw.mode === "random" ? "Random" : "Weighted"}</strong>
            </div>
          </div>
        </article>

        <article className="panel-card">
          <div className="section-heading stack-mobile">
            <div>
              <h3>Monthly draw engine</h3>
              <p>Simulate first, then publish official results.</p>
            </div>
            <span className="chip">{data.draw.published ? "Published" : "Draft results"}</span>
          </div>
          <div className="form-grid compact-grid">
            <label>
              Draw mode
              <select
                defaultValue={data.draw.mode}
                onChange={(event) =>
                  patchData((draft) => {
                    draft.draw.mode = event.target.value;
                    return draft;
                  })
                }
              >
                <option value="random">Random generation</option>
                <option value="weighted">Algorithmic weighted mode</option>
              </select>
            </label>
            <label>
              Draw month
              <input
                defaultValue={data.draw.month}
                type="month"
                onChange={(event) =>
                  patchData((draft) => {
                    draft.draw.month = event.target.value;
                    return draft;
                  })
                }
              />
            </label>
            <button className="button button-secondary" onClick={simulateDraw} type="button">
              Run simulation
            </button>
            <button className="button button-primary" onClick={publishDraw} type="button">
              Publish results
            </button>
          </div>
          <div className="draw-panels">
            <div>
              <p className="card-label">Generated numbers</p>
              <div className="balls-row">
                {data.draw.numbers.map((number) => (
                  <span className="ball" key={number}>
                    {number}
                  </span>
                ))}
              </div>
            </div>
            <div className="prize-breakdown">
              <article>
                <span>5-number match - 40% - rollover</span>
                <strong>{currency.format(Math.round(analytics.prizePool * 0.4 + data.draw.rolloverJackpot))}</strong>
              </article>
              <article>
                <span>4-number match - 35%</span>
                <strong>{currency.format(Math.round(analytics.prizePool * 0.35))}</strong>
              </article>
              <article>
                <span>3-number match - 25%</span>
                <strong>{currency.format(Math.round(analytics.prizePool * 0.25))}</strong>
              </article>
            </div>
          </div>
        </article>

        <article className="panel-card full-width">
          <h3>Winner verification</h3>
          <div className="winner-list">
            {data.winners.map((winner) => (
              <article className={`winner-item ${winner.status.toLowerCase()}`} key={winner.id}>
                <div className="winner-main">
                  <strong>{winner.name}</strong>
                  <span>
                    {winner.tier} - {currency.format(winner.prize)} - Proof: {winner.proof}
                  </span>
                </div>
                <div className="winner-actions">
                  <button className="ghost-button" onClick={() => updateWinner(winner.id, "Pending")} type="button">
                    Pending
                  </button>
                  <button className="ghost-button" onClick={() => updateWinner(winner.id, "Paid")} type="button">
                    Mark paid
                  </button>
                  <button className="ghost-button" onClick={() => updateWinner(winner.id, "Rejected")} type="button">
                    Reject
                  </button>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="panel-card">
          <h3>Charity management</h3>
          <form className="form-grid" action={addCharity}>
            <label>
              Charity name
              <input name="name" required />
            </label>
            <label>
              Search tag
              <input name="tag" required />
            </label>
            <label className="full-span">
              Description
              <textarea name="description" rows="4" required />
            </label>
            <label>
              Upcoming event
              <input name="event" required />
            </label>
            <label>
              Featured
              <select defaultValue="false" name="featured">
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </label>
            <button className="button button-primary full-span" type="submit">
              Add charity
            </button>
          </form>
        </article>

        <article className="panel-card">
          <h3>Current spotlight</h3>
          <div className="summary-list">
            <div>
              <span>Name</span>
              <strong>{featuredCharity.name}</strong>
            </div>
            <div>
              <span>Event</span>
              <strong>{featuredCharity.event}</strong>
            </div>
            <div>
              <span>Subscriber charity</span>
              <strong>{currentCharity.name}</strong>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
