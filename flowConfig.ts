export type IndustryKey = "banking" | "legal" | "security";

export type InputDoc = {
  id: string;
  label: string;
  sub?: string;
  icon: "pdf" | "xls" | "id" | "bank" | "mail" | "doc" | "shield" | "key" | "cloud" | "user" | "policy";
};

export type Node = { id: string; label: string; icon: string };

export type Outcome = {
  id: string;
  title: string;
  sub: string;
  tone: "red" | "green" | "amber" | "violet" | "blue";
  icon: string;
};

export type KPI = { value: string; label: string };

export type Tool = { id: string; name: string; icon: string };

export type IndustryConfig = {
  key: IndustryKey;
  name: string;
  kicker: string;
  inputsTitle: string;
  outcomesTitle: string;
  inputs: InputDoc[];
  tools: Tool[]; // integration apps that feed the brain
  nodes: Node[]; // ordered along the flow
  outcomes: Outcome[];
  dashboardTitle: string;
  metrics: { label: string; value: string; kind: "bar" | "ring" | "line" }[];
  kpis: KPI[];
  bottomChips: { icon: string; label: string }[];
};

export const INDUSTRIES: Record<IndustryKey, IndustryConfig> = {
  banking: {
    key: "banking",
    name: "Banking",
    kicker: "AI ideas everywhere",
    inputsTitle: "Raw loan data",
    outcomesTitle: "Lending outcomes",
    bottomChips: [
      { icon: "doc", label: "Audit trails" },
      { icon: "key", label: "E2E encryption" },
      { icon: "shield", label: "Access controls" },
    ],
    tools: [
      { id: "teams", name: "Teams", icon: "teams" },
      { id: "sp", name: "SharePoint", icon: "sharepoint" },
      { id: "pa", name: "Power Automate", icon: "powerauto" },
    ],
    inputs: [
      { id: "loan", label: "Loan application.pdf", sub: "Application form", icon: "pdf" },
      { id: "fin", label: "Borrower financials.xlsx", sub: "P&L, Balance sheet", icon: "xls" },
      { id: "kyc", label: "KYC documents", sub: "ID proof, Address", icon: "id" },
      { id: "bureau", label: "Credit bureau report", sub: "Experian / CIBIL", icon: "bank" },
      { id: "email", label: "Email: lending request", sub: "From: relationship.mgr", icon: "mail" },
      { id: "policy", label: "Underwriting policy", sub: "Guidelines.pdf", icon: "policy" },
    ],
    nodes: [
      { id: "verify", label: "Verify KYC", icon: "user" },
      { id: "analyze", label: "Analyze financials", icon: "chart" },
      { id: "score", label: "Score risk", icon: "shield" },
      { id: "send", label: "Send decision", icon: "send" },
    ],
    outcomes: [
      { id: "memo", title: "Credit memo generated", sub: "Ready for disbursement", tone: "red", icon: "doc" },
      { id: "kycv", title: "KYC verified", sub: "All documents verified", tone: "red", icon: "shield" },
      { id: "queue", title: "Exception queue ready", sub: "Cases routed for review", tone: "amber", icon: "alert" },
      { id: "decision", title: "Decision sent", sub: "Customer notified via email", tone: "red", icon: "send" },
      { id: "portfolio", title: "Portfolio review triggered", sub: "Added to monitoring", tone: "red", icon: "bag" },
      { id: "compliance", title: "Compliance logged", sub: "Audit trail captured", tone: "green", icon: "shield" },
    ],
    dashboardTitle: "Loan operations dashboard",
    metrics: [
      { label: "Applications", value: "1,248", kind: "bar" },
      { label: "Approval rate", value: "72%", kind: "ring" },
      { label: "Turnaround", value: "1.8d", kind: "line" },
    ],
    kpis: [
      { value: "4 weeks", label: "from project start to deployed" },
      { value: "Positive ROI", label: "in year 1" },
      { value: "2× faster", label: "loan decision turnaround" },
    ],
  },
  legal: {
    key: "legal",
    name: "Legal",
    kicker: "Legal work becomes workflow",
    inputsTitle: "Raw legal inputs",
    outcomesTitle: "Legal outcomes",
    bottomChips: [
      { icon: "doc", label: "Version history" },
      { icon: "send", label: "Approval routing" },
      { icon: "shield", label: "Matter audit logs" },
    ],
    tools: [
      { id: "teams", name: "Teams", icon: "teams" },
      { id: "outlook", name: "Outlook", icon: "outlook" },
      { id: "sp", name: "SharePoint", icon: "sharepoint" },
    ],
    inputs: [
      { id: "vendor", label: "Vendor Contract.pdf", icon: "pdf" },
      { id: "msa", label: "MSA redline.docx", icon: "doc" },
      { id: "policy", label: "Policy update", icon: "policy" },
      { id: "reg", label: "Regulatory memo", icon: "doc" },
      { id: "client", label: "Client questionnaire", icon: "id" },
      { id: "notes", label: "Matter notes email", icon: "mail" },
    ],
    nodes: [
      { id: "extract", label: "Extract clauses", icon: "key" },
      { id: "redline", label: "Draft redlines", icon: "doc" },
      { id: "flag", label: "Flag deviations", icon: "flag" },
      { id: "send", label: "Send to client", icon: "send" },
    ],
    outcomes: [
      { id: "review", title: "First-pass review completed", sub: "Issues identified & summarized", tone: "green", icon: "check" },
      { id: "redline", title: "Redline draft ready", sub: "AI-drafted redlines for review", tone: "red", icon: "doc" },
      { id: "risk", title: "Clause risk summary", sub: "High-risk clauses flagged", tone: "amber", icon: "alert" },
      { id: "compliance", title: "Compliance memo generated", sub: "Regulatory alignment & guidance", tone: "violet", icon: "doc" },
      { id: "report", title: "Client-ready report", sub: "Clear, concise, branded", tone: "blue", icon: "chart" },
      { id: "audit", title: "Audit-ready", sub: "Every decision traceable", tone: "green", icon: "shield" },
    ],
    dashboardTitle: "Matter operations",
    metrics: [
      { label: "Matters", value: "342", kind: "bar" },
      { label: "First-pass accuracy", value: "94%", kind: "ring" },
      { label: "Cycle time", value: "−60%", kind: "line" },
    ],
    kpis: [
      { value: "2× faster", label: "review cycles" },
      { value: "60% lower", label: "repetitive drafting effort" },
      { value: "Full audit trail", label: "every decision traceable" },
    ],
  },
  security: {
    key: "security",
    name: "Security",
    kicker: "Secure by design",
    inputsTitle: "Raw security inputs",
    outcomesTitle: "Security outcomes",
    bottomChips: [
      { icon: "user", label: "RBAC" },
      { icon: "key", label: "Encryption" },
      { icon: "chart", label: "Observability" },
    ],
    tools: [
      { id: "onedrive", name: "OneDrive", icon: "onedrive" },
      { id: "sp", name: "SharePoint", icon: "sharepoint" },
      { id: "pa", name: "Power Automate", icon: "powerauto" },
    ],
    inputs: [
      { id: "logs", label: "Access logs", icon: "key" },
      { id: "dash", label: "Security dashboard", icon: "shield" },
      { id: "tools", label: "Internal tools", icon: "cloud" },
      { id: "email", label: "Customer email", icon: "mail" },
      { id: "sme", label: "SME knowledge", icon: "user" },
      { id: "cloud", label: "Cloud storage", icon: "cloud" },
    ],
    nodes: [
      { id: "encrypt", label: "Encrypt data", icon: "shield" },
      { id: "redact", label: "Redact PII", icon: "shield" },
      { id: "policy", label: "Enforce policy", icon: "shield" },
      { id: "audit", label: "Audit every step", icon: "doc" },
    ],
    outcomes: [
      { id: "access", title: "Access controls enforced", sub: "Least privilege by design", tone: "red", icon: "shield" },
      { id: "e2e", title: "End-to-end encryption", sub: "Data protected in transit & rest", tone: "red", icon: "key" },
      { id: "audit", title: "Detailed audit logs", sub: "Every action accounted for", tone: "red", icon: "doc" },
      { id: "pen", title: "Pen test verified", sub: "Third-party tested & validated", tone: "red", icon: "shield" },
      { id: "wf", title: "Workflow executed", sub: "Secure, governed execution", tone: "red", icon: "check" },
      { id: "trust", title: "Trust dashboard", sub: "Real-time visibility & assurance", tone: "red", icon: "chart" },
    ],
    dashboardTitle: "Trust dashboard",
    metrics: [
      { label: "Security posture", value: "Excellent", kind: "bar" },
      { label: "Controls", value: "98%", kind: "ring" },
      { label: "Audit events", value: "12,842", kind: "line" },
    ],
    kpis: [
      { value: "SOC 2 aligned", label: "security & availability controls" },
      { value: "SSO / SAML", label: "enterprise-ready access" },
      { value: "Pen tested", label: "third-party verified defenses" },
    ],
  },
};
