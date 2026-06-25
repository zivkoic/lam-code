export type Industry = "banking" | "legal" | "vsaas" | "security";

export type UseCase = {
  id: string;
  industry: Industry;
  /** Persona label shown at the top of the card. */
  roleTag: string;
  /** Card title — one short sentence. */
  title: string;
  /** 1–2 sentence description of what the agent does. */
  description: string;
  /** The big number + label shown in the result block. */
  result: {
    value: string;
    label: string;
  };
  /** Pulled quote — every card has its own voice. No template repeated. */
  quote: string;
};

/* Top 4 per industry, ranked by a 4-dimension framework:
 * Urgency · Criticality · Need · Trend (each 1–10, summed /40).
 * Higher = ship first.
 *
 * Every card is hand-written: different opening voice, different stat
 * framing, different closer. Goal is 16 distinct product moments, not
 * 16 instances of the same template. */
export const USE_CASES: UseCase[] = [
  // ───────────────────────── BANKING ─────────────────────────
  // Top 4 from the "Most Valuable Workflows to Redesign" research deck.
  {
    id: "banking-commercial-underwriting",
    industry: "banking",
    roleTag: "Commercial Lender",
    title: "Commercial loan underwriting package.",
    description:
      "AI assembles borrower financials, spreads statements, summarises credit risk, and produces an underwriting memo draft for committee review.",
    result: {
      value: "89/100",
      label: "top-ranked workflow in commercial banking",
    },
    quote:
      "Document-heavy. Revenue-critical. The single workflow most likely to be redesigned in commercial banking this year. Lamatic builds it on your stack, with our team in the room.",
  },
  {
    id: "banking-sar",
    industry: "banking",
    roleTag: "AML Investigator",
    title: "SAR narrative drafting.",
    description:
      "AI composes Suspicious Activity Report narratives from transaction history and investigator notes — ready for filer review.",
    result: {
      value: "4.6M",
      label: "SARs filed by U.S. banks each year",
    },
    quote:
      "Banks file 4.6 million SARs a year. Each one is hours of investigator time spent on prose, not on pattern-finding. Lamatic absorbs the prose so your team can hunt the patterns.",
  },
  {
    id: "banking-annual-review",
    industry: "banking",
    roleTag: "Credit Risk Officer",
    title: "Commercial loan annual review.",
    description:
      "AI compiles updated borrower financials, drafts the renewal memo, and surfaces covenant exceptions ready for analyst review.",
    result: {
      value: "Every loan",
      label: "in the book becomes an annual memo",
    },
    quote:
      "Every renewed loan in your book is an annual memo waiting to be written. AI does the spread; your team makes the call. Built on your covenants, deployed on your stack.",
  },
  {
    id: "banking-kyc",
    industry: "banking",
    roleTag: "Treasury & Compliance",
    title: "New client onboarding & KYC.",
    description:
      "AI collects docs, verifies identity, screens sanctions lists, and prepares the approval packet — collapsing weeks of back-and-forth into a single pass.",
    result: {
      value: "Weeks → Days",
      label: "from first contact to active account",
    },
    quote:
      "Every day a treasury client waits to be onboarded is a day their deposits sit somewhere else. Lamatic compresses the weeks into days — and our team owns the rollout.",
  },

  // ───────────────────────── LEGAL ─────────────────────────
  {
    id: "legal-ediscovery",
    industry: "legal",
    roleTag: "eDiscovery Analyst",
    title: "eDiscovery review & privilege coding.",
    description:
      "First-pass relevance and privilege classification across the discovery corpus. High-priority documents surfaced for the review team — every decision logged, every output defensible.",
    result: {
      value: "DOJ + state AGs",
      label: "running AI-first review in production today",
    },
    quote:
      "When the U.S. DOJ and state Attorneys General run AI-first review in production, the bar for defensibility is set. Lamatic helps your firm meet it — on your data, with our team in the room.",
  },
  {
    id: "legal-mna",
    industry: "legal",
    roleTag: "M&A Associate",
    title: "M&A due-diligence document review.",
    description:
      "Ingest the data room. Extract change-of-control, assignment, MAC, and indemnity clauses. Output a reviewer-ready diligence report with provenance for every clause.",
    result: {
      value: "3,500 lawyers",
      label: "the largest gen-AI legal deployment to date",
    },
    quote:
      "The largest gen-AI legal deployment to date — 3,500 lawyers across 43 offices — was a diligence rollout. The bar is set. Lamatic builds yours, faster, with our team alongside yours.",
  },
  {
    id: "legal-brief",
    industry: "legal",
    roleTag: "Litigation Associate",
    title: "Brief drafting with citation verification.",
    description:
      "Draft motion sections grounded in firm precedent. Verify every citation against Shepard's / KeyCite. Flag hallucinated authority before it ever reaches the partner.",
    result: {
      value: "51 of 100",
      label: "Am Law 100 firms already onboarded",
    },
    quote:
      "Half of the Am Law 100 has already onboarded AI-assisted brief drafting and citation verification. Lamatic builds yours on your firm's precedent — and skips the procurement runway.",
  },
  {
    id: "legal-regchange",
    industry: "legal",
    roleTag: "Regulatory Counsel",
    title: "Regulatory change tracking & impact memos.",
    description:
      "Monitor regulator publications across SEC, FCA, BaFin, NYDFS. Map every change to your internal policies. Draft the impact memo with sources linked, ready for partner sign-off.",
    result: {
      value: "80,000+",
      label: "regulatory updates globally last year",
    },
    quote:
      "Enterprise compliance teams faced over 80,000 regulatory updates last year. Lamatic builds the agent that reads, maps, and drafts the memo — so your counsel reviews instead of researches.",
  },

  // ───────────────────────── VERTICAL SAAS ─────────────────────────
  {
    id: "vsaas-rcm",
    industry: "vsaas",
    roleTag: "Healthcare SaaS · Head of Product",
    title: "Embed prior-auth + RCM agents in your platform.",
    description:
      "Draft appeals. Run eligibility. Submit prior auths directly inside your EHR or practice-management surface. Built for the SaaS shipping it; owned by the provider running it.",
    result: {
      value: "#1",
      label: "revenue-leak workflow in U.S. healthcare",
    },
    quote:
      "Prior auths and denials are the single largest revenue leak in U.S. healthcare. Athenahealth, Notable, and Innovaccer are already shipping agents into the workflow. Lamatic helps your healthcare SaaS keep pace — with our team in the room.",
  },
  {
    id: "vsaas-support",
    industry: "vsaas",
    roleTag: "VP Customer Support / Head of AI",
    title: "Vertical-tuned support, end to end.",
    description:
      "A support agent that knows GxP if you sell to pharma, OSHA if you sell to construction, HIPAA if you sell to healthcare. Resolves tier-1/2 inside your help centre; escalates with full context.",
    result: {
      value: "#1 ROI",
      label: "use case in B2B SaaS · Bain 2024",
    },
    quote:
      "Bain's 2024 'Generative AI in B2B SaaS' report ranked vertical-tuned support as the #1 ROI use case. The companies winning it aren't using off-the-shelf chatbots — they're building agents on their own vocabulary, their own docs, their own data.",
  },
  {
    id: "vsaas-ccaas",
    industry: "vsaas",
    roleTag: "VP Customer Experience",
    title: "Embed agent-assist in your CX platform.",
    description:
      "Deflect tier-1 contacts. Draft real-time responses for live agents. Auto-summarise every call into CRM — without your customers running a single integration project.",
    result: {
      value: "SiriusXM · ADT · Sonos",
      label: "already shipping AI resolution in production",
    },
    quote:
      "Sierra at SiriusXM, ADT, Sonos. Decagon at Notion and Eventbrite. The contact-centre AI wave isn't theoretical anymore. Lamatic helps you ship the same calibre into your platform — fast, branded, on your data.",
  },
  {
    id: "vsaas-ncino",
    industry: "vsaas",
    roleTag: "Banking SaaS · VP Product",
    title: "Embed credit memo + loan origination agents.",
    description:
      "For the SaaS serving banks: pre-fill loan packages, spread financials, auto-generate credit memos inside your LOS. Your customers' lenders ship in minutes, not days.",
    result: {
      value: "GA April 2025",
      label: "live at U.S. Bank and Wesbanco within months",
    },
    quote:
      "nCino's Banking Advisor went GA in April 2025 — live at U.S. Bank and Wesbanco within months. Your banking-SaaS customers are already asking when yours ships. Lamatic builds it on your stack, with our team alongside yours.",
  },

  // ───────────────────────── SECURITY ─────────────────────────
  {
    id: "security-soc-triage",
    industry: "security",
    roleTag: "SOC Tier-1 Analyst",
    title: "Tier-1 alert triage & FP suppression.",
    description:
      "Auto-ingest SIEM alerts. Enrich with asset, user, and threat-intel context. Classify benign vs. escalate to Tier-2 with the full reasoning trail attached — no more swivelling between five tabs.",
    result: {
      value: "26% / 35%",
      label: "faster triage · higher accuracy (Microsoft RCT)",
    },
    quote:
      "Microsoft's randomised control trial settled it: 26% faster triage, 35% higher accuracy. The SOCs running this in production aren't going alone — they're running it with a team that's already done it.",
  },
  {
    id: "security-ir",
    industry: "security",
    roleTag: "IR Lead",
    title: "IR playbook + regulator notification.",
    description:
      "Execute containment across EDR, IdP, and firewall. Preserve evidence with chain of custody. Draft NYDFS 72-hr, SEC 4-day, and DORA notifications — on the clock, never late.",
    result: {
      value: "$2.22M",
      label: "saved per breach with AI + automation",
    },
    quote:
      "$2.22M per breach is what AI plus automation saves on average. Every NYDFS 72-hour, SEC 4-day, and DORA notification you miss costs your CISO board time. Lamatic builds the playbook agent that doesn't miss.",
  },
  {
    id: "security-phishing",
    industry: "security",
    roleTag: "Email Security Engineer",
    title: "Phishing email triage.",
    description:
      "Auto-analyse user-reported emails. Detonate URLs and attachments in sandboxes. Cluster campaigns and auto-purge mailboxes — turning the report-phish button into a real defensive primitive.",
    result: {
      value: "#1",
      label: "initial-access vector in financial services",
    },
    quote:
      "Phishing is still the #1 way attackers get in. Yet most SOCs still triage user-reported phish by hand. Lamatic builds the agent that handles the queue — so your engineers handle the campaigns.",
  },
  {
    id: "security-iam",
    industry: "security",
    roleTag: "IAM / IGA Engineer",
    title: "Joiner / mover / leaver access agent.",
    description:
      "Detect HRIS events. Map role to entitlements. Provision and deprovision across SaaS, AD, and privileged systems — with audit-ready evidence captured for every action.",
    result: {
      value: "$4.81M",
      label: "average cost of a stolen-credential breach",
    },
    quote:
      "Stolen credentials remain the costliest attack vector — $4.81M per breach on average. The leaver-cleanup workflow that closes that gap is the highest-ROI IAM project your team will run this year.",
  },
];

export const INDUSTRY_LABELS: Record<Industry, string> = {
  banking: "Banking",
  legal: "Legal",
  vsaas: "Vertical SaaS",
  security: "Security",
};

export const INDUSTRY_KICKERS: Record<Industry, string> = {
  banking: "From AI ideas to production AI.",
  legal: "From the deal room to the courtroom.",
  vsaas: "From your platform to your customers' workflows.",
  security: "From SOC to identity, end-to-end.",
};
