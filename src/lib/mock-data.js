export const SUBSCRIBER_CREDENTIALS = {
  email: "player@birdieforgood.com",
  password: "Birdie123!"
};

export const ADMIN_CREDENTIALS = {
  email: "admin@birdieforgood.com",
  password: "Admin123!"
};

export const initialState = {
  subscriber: {
    name: "Divyashree Kumar",
    email: SUBSCRIBER_CREDENTIALS.email,
    plan: "monthly",
    status: "active",
    renewalDate: "2026-04-21",
    charityId: "c1",
    charityPercent: 15,
    drawsEntered: 9,
    totalWon: 360,
    paymentStatus: "Pending",
    independentDonations: 75
  },
  charities: [
    {
      id: "c1",
      name: "First Swing Foundation",
      tag: "Youth Access",
      description:
        "Funding junior golf access, coaching scholarships, and travel support for underrepresented players.",
      event: "April 16 - Youth Golf Day",
      featured: true
    },
    {
      id: "c2",
      name: "Greens For Recovery",
      tag: "Mental Wellness",
      description:
        "Outdoor recovery programmes using golf clinics, mentoring, and structured wellbeing sessions.",
      event: "May 02 - Community Scramble",
      featured: false
    },
    {
      id: "c3",
      name: "Caddies To Classrooms",
      tag: "Education",
      description:
        "Scholarships and equipment grants for caddies and golf support workers pursuing education.",
      event: "April 28 - Scholarship Cup",
      featured: false
    }
  ],
  scores: [
    { id: "s1", value: 34, date: "2026-03-19" },
    { id: "s2", value: 31, date: "2026-03-15" },
    { id: "s3", value: 28, date: "2026-03-10" },
    { id: "s4", value: 36, date: "2026-03-02" },
    { id: "s5", value: 33, date: "2026-02-24" }
  ],
  draw: {
    month: "2026-03",
    mode: "random",
    numbers: [31, 12, 34, 22, 28],
    published: false,
    rolloverJackpot: 4960
  },
  winners: [
    {
      id: "w1",
      name: "Divyashree Kumar",
      tier: "4-number match",
      prize: 360,
      proof: "score-proof-mar19.png",
      status: "Pending"
    },
    {
      id: "w2",
      name: "Naina Kapoor",
      tier: "3-number match",
      prize: 180,
      proof: "naina-proof.png",
      status: "Paid"
    }
  ]
};
