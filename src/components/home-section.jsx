import { AccessCard } from "@/components/common";

export function HomeSection({
  visibleCharities,
  charityQuery,
  setCharityQuery,
  subscriberCredentials,
  adminCredentials,
  openDashboard,
  openAdmin,
  resetDemo
}) {
  return (
    <>
      <section className="section-grid">
        <article className="panel-card">
          <p className="card-label">How it works</p>
          <div className="steps">
            <div>
              <span>01</span>
              <h3>Subscribe</h3>
              <p>Choose monthly or yearly billing and direct at least 10% to charity.</p>
            </div>
            <div>
              <span>02</span>
              <h3>Track scores</h3>
              <p>Store the latest five Stableford scores and keep them in reverse chronological order.</p>
            </div>
            <div>
              <span>03</span>
              <h3>Run draws</h3>
              <p>Admins simulate, publish, verify winners, and manage prize distribution and rollover logic.</p>
            </div>
          </div>
        </article>
        <article className="panel-card">
          <div className="section-heading">
            <div>
              <p className="card-label">Charity directory</p>
              <h2>Emotion-led causes, not golf cliches</h2>
            </div>
            <input
              className="search-input"
              type="search"
              placeholder="Search charities"
              value={charityQuery}
              onChange={(event) => setCharityQuery(event.target.value)}
            />
          </div>
          <div className="charity-list">
            {visibleCharities.map((charity) => (
              <article className="charity-card" key={charity.id}>
                <header>
                  <div>
                    <h3>{charity.name}</h3>
                    <span className="pill">{charity.tag}</span>
                  </div>
                  {charity.featured ? <span className="chip">Featured</span> : null}
                </header>
                <p>{charity.description}</p>
                <p>
                  <strong>Upcoming:</strong> {charity.event}
                </p>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="section-grid credentials-grid">
        <AccessCard
          title="Subscriber demo"
          subtitle="Use these credentials for the user dashboard"
          email={subscriberCredentials.email}
          password={subscriberCredentials.password}
          onUse={openDashboard}
        />
        <AccessCard
          title="Admin demo"
          subtitle="Use these credentials for the admin dashboard"
          email={adminCredentials.email}
          password={adminCredentials.password}
          onUse={openAdmin}
          onReset={resetDemo}
        />
      </section>
    </>
  );
}
