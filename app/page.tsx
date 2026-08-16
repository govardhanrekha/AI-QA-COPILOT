"use client";

import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  Bug,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Download,
  FileText,
  Filter,
  FolderOpen,
  Grid2x2,
  Home,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  XCircle,
} from "lucide-react";
import { runAiAction } from "@/lib/ai-service";

const demoRequirement = `Digital Payment Transfer

Customers can transfer funds using their registered bank account.
The maximum daily transfer amount is ₹2,00,000.
Transactions above the daily limit must be rejected.
Customers must receive a notification after successful or failed transactions.`;

type TabKey =
  | "dashboard"
  | "requirements"
  | "test-plan"
  | "test-cases"
  | "coverage"
  | "bug-triage"
  | "closure"
  | "settings";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "requirements", label: "Requirement Analyzer", icon: FileText },
  { id: "test-plan", label: "Test Plan", icon: BookOpen },
  { id: "test-cases", label: "Test Cases", icon: ClipboardCheck },
  { id: "coverage", label: "Test Coverage", icon: BarChart3 },
  { id: "bug-triage", label: "Bug Triage", icon: Bug },
  { id: "closure", label: "Test Closure", icon: ShieldCheck },
  { id: "settings", label: "Settings", icon: Grid2x2 },
] as const;

const defaultSummary = {
  project: "Digital Payment Transfer",
  module: "Payments",
  businessObjective: "Enable customers to securely transfer funds using registered bank accounts.",
  functionalRequirements: [],
  nonFunctionalRequirements: [],
  extractedRequirements: [],
  overallRisk: "HIGH",
  riskBreakdown: { High: 4, Medium: 7, Low: 3 },
  ambiguities: [],
  dependencies: ["Login", "Authentication", "User Session", "Authorization"],
};

const initialTestCases = [
  {
    id: "TC-001",
    requirementId: "REQ-001",
    scenario: "Verify successful login using valid credentials",
    precondition: "User has a valid registered account.",
    steps: ["Open login page", "Enter valid email and password", "Click login"],
    testData: "Valid email and password",
    expectedResult: "User is redirected to the dashboard.",
    priority: "High",
    severity: "High",
    type: "Functional",
  },
];

const initialCoverage = {
  overallCoverage: 91,
  coveredRequirements: 22,
  partiallyCovered: 1,
  notCovered: 1,
  traceability: [
    { requirement: "REQ-001", description: "Login functionality", testCases: ["TC-001", "TC-002", "TC-003"], coverage: "100%", risk: "Medium", status: "Covered" },
    { requirement: "REQ-010", description: "Session timeout requirement", testCases: [], coverage: "0%", risk: "High", status: "Not Covered" },
  ],
  missingCoverage: [{ requirementId: "REQ-010", description: "Session timeout requirement has no associated test cases.", severity: "High" }],
  insights: ["Missing test scenarios", "Untested requirements", "Boundary conditions not covered"],
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [requirementText, setRequirementText] = useState(demoRequirement);
  const [analysis, setAnalysis] = useState<any>(defaultSummary);
  const [testPlan, setTestPlan] = useState<any>(null);
  const [testCases, setTestCases] = useState<any[]>(initialTestCases);
  const [coverage, setCoverage] = useState<any>(initialCoverage);
  const [bugReport, setBugReport] = useState<any>(null);
  const [closure, setClosure] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState("AI Status: ● Ready");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("Payment_Requirements.pdf");
  const [pdfPages, setPdfPages] = useState(12);
  const [requirementsFound, setRequirementsFound] = useState(24);
  const [bugForm, setBugForm] = useState({
    title: "Payment transfer above daily limit is accepted before validation",
    actualResult: "System accepted a transfer above the daily limit and processed it.",
    expectedResult: "Transfer should have been blocked before authorization.",
    stepsToReproduce: "Log in, set amount above ₹2,00,000, submit transfer.",
    environment: "QA-Banking-02",
    logs: "ValidationError: transaction accepted before limit check.",
  });
  const [closureForm, setClosureForm] = useState({
    projectName: "Digital Payment Transfer",
    releaseVersion: "v2.4.1",
    testingStartDate: "2026-08-01",
    testingEndDate: "2026-08-15",
    totalTestCases: 128,
    passed: 121,
    failed: 4,
    blocked: 2,
    notExecuted: 1,
    totalDefects: 19,
    criticalDefects: 1,
    highDefects: 3,
    mediumDefects: 7,
    lowDefects: 8,
  });
  const [showDocModal, setShowDocModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueSubmitted, setIssueSubmitted] = useState(false);
  const [issueForm, setIssueForm] = useState({ title: "", description: "", priority: "Medium" });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const summaryCards = useMemo(
    () => [
      { label: "Requirements Analyzed", value: "24", tone: "blue" },
      { label: "Test Cases Generated", value: "128", tone: "purple" },
      { label: "Coverage", value: "91%", tone: "green" },
      { label: "High Risk Items", value: "6", tone: "red" },
    ],
    [],
  );

  const handleLoading = (message: string) => {
    setIsLoading(true);
    setStatusMessage(message);
    setError("");
  };

  const handleAnalyzeRequirement = async () => {
    if (!requirementText.trim()) {
      setError("Please upload or paste a requirement before analysis.");
      return;
    }

    handleLoading("Analyzing requirement...");
    try {
      const result = await runAiAction("analyzeRequirements", { text: requirementText });
      setAnalysis(result);
      setStatusMessage("AI Status: ● Ready");
      setActiveTab("requirements");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to analyze the requirement.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTestPlan = async () => {
    handleLoading("Generating test plan...");
    try {
      const result = await runAiAction("generateTestPlan", { text: requirementText, analysis });
      setTestPlan(result);
      setStatusMessage("AI Status: ● Ready");
      setActiveTab("test-plan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate the test plan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTestCases = async (category: "standard" | "more" | "negative" | "boundary" = "standard") => {
    handleLoading(`Generating ${category === "standard" ? "" : category + " "}test cases...`);
    try {
      const result = await runAiAction("generateTestCases", {
        requirements: analysis?.extractedRequirements ?? [],
        module: analysis?.module ?? "Payments",
        category,
      });
      if (category === "more") {
        setTestCases((prev) => [...prev, ...(result.cases ?? [])]);
      } else {
        setTestCases(result.cases ?? []);
      }
      setStatusMessage("AI Status: ● Ready");
      setActiveTab("test-cases");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate test cases.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeCoverage = async () => {
    handleLoading("Analyzing coverage...");
    try {
      const result = await runAiAction("analyzeCoverage", { requirements: analysis?.extractedRequirements ?? [] });
      setCoverage(result);
      setStatusMessage("AI Status: ● Ready");
      setActiveTab("coverage");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to analyze coverage.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeBug = async () => {
    handleLoading("Triaging bug...");
    try {
      const result = await runAiAction("triageBug", { ...bugForm, requirementContext: requirementText });
      setBugReport(result);
      setStatusMessage("AI Status: ● Ready");
      setActiveTab("bug-triage");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to triage the defect.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateClosure = async () => {
    handleLoading("Generating closure summary...");
    try {
      const result = await runAiAction("generateClosureSummary", { project: closureForm.projectName, ...closureForm });
      setClosure(result);
      setStatusMessage("AI Status: ● Ready");
      setActiveTab("closure");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate the closure report.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadJson = (data: unknown, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    const header = ["Test Case ID", "Requirement ID", "Scenario", "Priority", "Severity", "Type"]; 
    const rows = testCases.map((caseItem) => [
      caseItem.id,
      caseItem.requirementId,
      caseItem.scenario,
      caseItem.priority,
      caseItem.severity,
      caseItem.type,
    ]);

    const csv = [header, ...rows].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "test-cases.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatusMessage("AI Status: ● Ready");
    } catch {
      setError("Copy action is not available in this browser context.");
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setError("No file selected.");
      return;
    }

    try {
      if (file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf")) {
        const { GlobalWorkerOptions, getDocument } = await import("pdfjs-dist");
        GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument({ data: arrayBuffer }).promise;
        const pages: string[] = [];
        for (let i = 1; i <= pdf.numPages; i += 1) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          pages.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
        }

        const text = pages.join("\n");
        setRequirementText(text || "");
        setFileName(file.name);
        setPdfPages(pdf.numPages);
        setRequirementsFound(Math.max(1, text.split(/\s+/).length / 10));
      } else if (file.type.includes("text") || file.name.toLowerCase().endsWith(".txt")) {
        const text = await file.text();
        setRequirementText(text);
        setFileName(file.name);
        setPdfPages(1);
        setRequirementsFound(Math.max(1, text.split(/\n+/).filter(Boolean).length));
      } else {
        throw new Error("Unsupported file type. Please upload a PDF or TXT file.");
      }

      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to read the uploaded file.");
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="card-surface rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between text-sm text-slate-500">
              <span>{card.label}</span>
              <span className={`h-2.5 w-2.5 rounded-full ${card.tone === "blue" ? "bg-blue-500" : card.tone === "purple" ? "bg-violet-500" : card.tone === "green" ? "bg-emerald-500" : "bg-red-500"}`} />
            </div>
            <div className="text-3xl font-semibold">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="card-surface rounded-3xl p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Recent QA Activity</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2">
                <span>Requirement analyzed</span>
                <span className="font-medium text-slate-800">UPI Payment Requirements.pdf</span>
                <span>2 minutes ago</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2">
                <span>Test cases generated</span>
                <span className="font-medium text-slate-800">Payment Module</span>
                <span>10 minutes ago</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Bug triaged</span>
                <span className="font-medium text-slate-800">PAY-2451</span>
                <span>20 minutes ago</span>
              </div>
            </div>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1B1B1B] px-5 py-3 text-sm font-medium text-white"
            onClick={() => setActiveTab("requirements")}
          >
            Upload Requirement <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderRequirements = () => (
    <div className="space-y-6">
      <div className="card-surface rounded-3xl p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Requirement Analyzer</p>
            <h2 className="mt-2 text-2xl font-semibold">Upload and analyze requirements</h2>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" /> Upload PDF / TXT
          </button>
        </div>

        <input ref={fileInputRef} type="file" accept=".pdf,.txt" className="hidden" onChange={handleFileUpload} />

        <div className="mt-6 space-y-4 rounded-2xl border border-dashed border-slate-300 bg-white/50 p-4">
          <textarea
            value={requirementText}
            onChange={(e) => setRequirementText(e.target.value)}
            rows={10}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none ring-0 placeholder:text-slate-400"
            placeholder="Paste requirement text or upload a PDF/TXT file..."
          />

          {fileName && (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-[#F4F0EA] p-3">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">File</div>
                <div className="mt-2 font-medium">{fileName}</div>
              </div>
              <div className="rounded-xl bg-[#F4F0EA] p-3">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Pages</div>
                <div className="mt-2 font-medium">{pdfPages}</div>
              </div>
              <div className="rounded-xl bg-[#F4F0EA] p-3">
                <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Requirements Found</div>
                <div className="mt-2 font-medium">{Math.round(requirementsFound)}</div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button onClick={handleAnalyzeRequirement} className="rounded-xl bg-[#1B1B1B] px-5 py-3 text-sm font-medium text-white" disabled={isLoading}>
              {isLoading ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</span> : "Analyze Requirement"}
            </button>
            <button onClick={() => setRequirementText(demoRequirement)} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium">Load Demo Requirement</button>
          </div>
        </div>
      </div>

      {analysis && (
        <div className="space-y-6">
          <div className="card-surface rounded-3xl p-6">
            <h3 className="text-xl font-semibold">Requirement Summary</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Project</div><div className="mt-2 font-medium">{analysis.project}</div></div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Module</div><div className="mt-2 font-medium">{analysis.module}</div></div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 md:col-span-2"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Business Objective</div><div className="mt-2 font-medium">{analysis.businessObjective}</div></div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Functional Requirements</div><div className="mt-2 space-y-1 text-sm text-slate-700">{analysis.functionalRequirements.map((item: string, idx: number) => <div key={`${item}-${idx}`}>• {item}</div>)}</div></div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Non-functional Requirements</div><div className="mt-2 space-y-1 text-sm text-slate-700">{analysis.nonFunctionalRequirements.map((item: string, idx: number) => <div key={`${item}-${idx}`}>• {item}</div>)}</div></div>
            </div>
          </div>

          <div className="card-surface rounded-3xl p-6">
            <h3 className="text-xl font-semibold">Extracted Requirements</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {(analysis.extractedRequirements ?? []).map((req: any) => (
                <div key={req.id} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-violet-600">{req.id}</div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{req.text}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">Type: {req.type}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">Priority: {req.priority}</span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">Risk: {req.risk}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface rounded-3xl p-6">
            <h3 className="text-xl font-semibold">AI Risk Analysis</h3>
            <div className="mt-4 flex flex-wrap gap-6 text-sm">
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-red-700 font-medium">Overall Risk: {analysis.overallRisk}</div>
              <div className="rounded-2xl bg-slate-100 px-4 py-3">High Risk: {analysis.riskBreakdown?.High ?? 0}</div>
              <div className="rounded-2xl bg-slate-100 px-4 py-3">Medium Risk: {analysis.riskBreakdown?.Medium ?? 0}</div>
              <div className="rounded-2xl bg-slate-100 px-4 py-3">Low Risk: {analysis.riskBreakdown?.Low ?? 0}</div>
            </div>
          </div>

          <div className="card-surface rounded-3xl p-6">
            <h3 className="text-xl font-semibold">Ambiguity Detection</h3>
            <div className="mt-4 space-y-4">
              {(analysis.ambiguities ?? []).map((item: any, idx: number) => (
                <div key={`${item.requirement}-${idx}`} className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <div className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4" /> Ambiguous Requirement</div>
                  <p className="mt-2">“{item.requirement}”</p>
                  <p className="mt-2"><span className="font-semibold">AI Recommendation:</span> {item.recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface rounded-3xl p-6">
            <h3 className="text-xl font-semibold">Requirement Dependencies</h3>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              {(analysis.dependencies ?? []).map((dependency: string, idx: number) => (
                <div key={dependency} className="flex items-center gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-2 font-medium">{dependency}</span>
                  {idx < (analysis.dependencies ?? []).length - 1 && <ChevronRight className="h-4 w-4 text-slate-400" />}
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={handleGenerateTestPlan} className="rounded-xl bg-[#1B1B1B] px-4 py-2.5 text-sm font-medium text-white">Generate Test Plan</button>
              <button onClick={() => handleGenerateTestCases("standard")} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium">Generate Test Cases</button>
              <button onClick={handleAnalyzeCoverage} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium">Analyze Coverage</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTestPlan = () => (
    <div className="card-surface rounded-3xl p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Test Plan Generator</p>
          <h2 className="mt-2 text-2xl font-semibold">Professional test plan</h2>
        </div>
        {testPlan && (
          <div className="flex gap-2">
            <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" onClick={() => handleCopy(JSON.stringify(testPlan, null, 2))}>Copy</button>
            <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" onClick={() => handleDownloadJson(testPlan, "test-plan.json")}>Download JSON</button>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white/80 p-4">
        <div className="mb-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Source: Analyzed Requirement</span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">System Testing</span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">Integration Testing</span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">API Testing</span>
        </div>
        <button onClick={handleGenerateTestPlan} className="rounded-xl bg-[#1B1B1B] px-5 py-3 text-sm font-medium text-white" disabled={isLoading}>{isLoading ? "Generating..." : "Generate Test Plan"}</button>
      </div>

      {testPlan && (
        <div className="mt-6 space-y-4">
          {[
            ["Document Overview", testPlan.documentOverview],
            ["Objective", testPlan.objective],
            ["Scope", testPlan.scope],
            ["Out of Scope", testPlan.outOfScope],
            ["Test Strategy", testPlan.testStrategy],
            ["Testing Types", Array.isArray(testPlan.testingTypes) ? testPlan.testingTypes.join(", ") : ""],
            ["Test Environment", testPlan.testEnvironment],
            ["Test Data", testPlan.testData],
            ["Entry Criteria", testPlan.entryCriteria],
            ["Exit Criteria", testPlan.exitCriteria],
            ["Roles and Responsibilities", Array.isArray(testPlan.rolesAndResponsibilities) ? testPlan.rolesAndResponsibilities.join("; ") : ""],
            ["Risks", Array.isArray(testPlan.risks) ? testPlan.risks.join("; ") : ""],
            ["Assumptions", Array.isArray(testPlan.assumptions) ? testPlan.assumptions.join("; ") : ""],
            ["Dependencies", Array.isArray(testPlan.dependencies) ? testPlan.dependencies.join("; ") : ""],
            ["Deliverables", Array.isArray(testPlan.deliverables) ? testPlan.deliverables.join("; ") : ""],
            ["Defect Management", testPlan.defectManagement],
            ["Automation Strategy", testPlan.automationStrategy],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
              <div className="mt-2 text-sm leading-6 text-slate-700">{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTestCases = () => (
    <div className="card-surface rounded-3xl p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Test Case Generator</p>
          <h2 className="mt-2 text-2xl font-semibold">Structured QA scenarios</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleCopy(JSON.stringify(testCases, null, 2))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">Copy</button>
          <button onClick={handleDownloadCsv} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">Download CSV</button>
          <button onClick={() => handleDownloadJson(testCases, "test-cases.json")} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">Download JSON</button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
          <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Requirement</label>
          <input value={analysis?.project ?? "Digital Payment Transfer"} readOnly className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
          <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Module</label>
          <input value={analysis?.module ?? "Payments"} readOnly className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
          <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Number of Test Cases</label>
          <input value={testCases.length} readOnly className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={() => handleGenerateTestCases("standard")} className="rounded-xl bg-[#1B1B1B] px-4 py-2.5 text-sm font-medium text-white hover:bg-black transition-colors">Generate Test Cases</button>
        <button onClick={() => handleGenerateTestCases("more")} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors">Generate More</button>
        <button onClick={() => handleGenerateTestCases("negative")} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors">Generate Negative Cases</button>
        <button onClick={() => handleGenerateTestCases("boundary")} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors">Generate Boundary Cases</button>
      </div>

      <div className="mt-6 overflow-x-auto soft-scroll">
        <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm">
          <thead>
            <tr className="text-slate-500">
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Req.</th>
              <th className="px-3 py-2">Scenario</th>
              <th className="px-3 py-2">Precondition</th>
              <th className="px-3 py-2">Steps</th>
              <th className="px-3 py-2">Expected</th>
              <th className="px-3 py-2">Priority</th>
              <th className="px-3 py-2">Severity</th>
              <th className="px-3 py-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {testCases.map((item) => (
              <tr key={item.id} className="rounded-2xl bg-white/80">
                <td className="rounded-l-2xl border border-r-0 border-slate-200 px-3 py-3 font-medium">{item.id}</td>
                <td className="border border-r-0 border-slate-200 px-3 py-3">{item.requirementId}</td>
                <td className="border border-r-0 border-slate-200 px-3 py-3">{item.scenario}</td>
                <td className="border border-r-0 border-slate-200 px-3 py-3">{item.precondition}</td>
                <td className="border border-r-0 border-slate-200 px-3 py-3">{item.steps.join("; ")}</td>
                <td className="border border-r-0 border-slate-200 px-3 py-3">{item.expectedResult}</td>
                <td className="border border-r-0 border-slate-200 px-3 py-3">{item.priority}</td>
                <td className="border border-r-0 border-slate-200 px-3 py-3">{item.severity}</td>
                <td className="rounded-r-2xl border border-slate-200 px-3 py-3">{item.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCoverage = () => (
    <div className="space-y-6">
      <div className="card-surface rounded-3xl p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Coverage Dashboard</p>
            <h2 className="mt-2 text-2xl font-semibold">Overall Coverage</h2>
          </div>
          <button onClick={handleAnalyzeCoverage} className="rounded-xl bg-[#1B1B1B] px-4 py-2.5 text-sm font-medium text-white">Generate Missing Test Cases</button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
            <div className="text-sm text-slate-500">Overall Coverage</div>
            <div className="mt-4 text-5xl font-semibold text-emerald-600">{coverage.overallCoverage ?? 91}%</div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[91%] rounded-full bg-emerald-500" />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3 text-sm">
              <div className="rounded-xl bg-slate-100 p-3"><div className="text-slate-500">Covered Requirements</div><div className="mt-2 font-semibold">{coverage.coveredRequirements ?? 22}</div></div>
              <div className="rounded-xl bg-amber-100 p-3"><div className="text-amber-700">Partially Covered</div><div className="mt-2 font-semibold">{coverage.partiallyCovered ?? 1}</div></div>
              <div className="rounded-xl bg-red-100 p-3"><div className="text-red-700">Not Covered</div><div className="mt-2 font-semibold">{coverage.notCovered ?? 1}</div></div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
            <h3 className="text-lg font-semibold">AI Coverage Insights</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {(coverage.insights ?? []).map((item: string, idx: number) => (
                <li key={`${item}-${idx}`} className="flex items-start gap-2"><Sparkles className="mt-0.5 h-4 w-4 text-violet-500" /> {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="card-surface rounded-3xl p-6">
        <h3 className="text-xl font-semibold">Traceability Matrix</h3>
        <div className="mt-6 overflow-x-auto soft-scroll">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="px-3 py-2">Requirement</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Test Cases</th>
                <th className="px-3 py-2">Coverage</th>
                <th className="px-3 py-2">Risk</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {(coverage.traceability ?? []).map((row: any) => (
                <tr key={row.requirement} className="rounded-2xl bg-white/80">
                  <td className="border border-slate-200 px-3 py-3">{row.requirement}</td>
                  <td className="border border-slate-200 px-3 py-3">{row.description}</td>
                  <td className="border border-slate-200 px-3 py-3">{row.testCases.join(", ") || "-"}</td>
                  <td className="border border-slate-200 px-3 py-3">{row.coverage}</td>
                  <td className="border border-slate-200 px-3 py-3">{row.risk}</td>
                  <td className="border border-slate-200 px-3 py-3">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-surface rounded-3xl p-6">
        <h3 className="text-xl font-semibold">Missing Coverage</h3>
        <div className="mt-4 space-y-3">
          {(coverage.missingCoverage ?? []).map((item: any) => (
            <div key={item.requirementId} className="flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <div className="flex items-center gap-2"><span className="font-bold">🔴 {item.requirementId}</span> <span>{item.description}</span></div>
              <button onClick={() => handleGenerateTestCases("more")} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700 transition-colors cursor-pointer">Generate Missing Tests</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBug = () => (
    <div className="card-surface rounded-3xl p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Bug Triage</p>
          <h2 className="mt-2 text-2xl font-semibold">Analyze defect impact and root cause</h2>
        </div>
        <button onClick={handleAnalyzeBug} className="rounded-xl bg-[#1B1B1B] px-4 py-2.5 text-sm font-medium text-white">Analyze Bug</button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
          <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Bug Title</label>
          <input value={bugForm.title} onChange={(e) => setBugForm({ ...bugForm, title: e.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
          <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Environment</label>
          <input value={bugForm.environment} onChange={(e) => setBugForm({ ...bugForm, environment: e.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 md:col-span-2">
          <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Actual Result</label>
          <textarea value={bugForm.actualResult} onChange={(e) => setBugForm({ ...bugForm, actualResult: e.target.value })} rows={3} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 md:col-span-2">
          <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Expected Result</label>
          <textarea value={bugForm.expectedResult} onChange={(e) => setBugForm({ ...bugForm, expectedResult: e.target.value })} rows={3} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 md:col-span-2">
          <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Steps to Reproduce</label>
          <textarea value={bugForm.stepsToReproduce} onChange={(e) => setBugForm({ ...bugForm, stepsToReproduce: e.target.value })} rows={3} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 md:col-span-2">
          <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Logs / Error Message</label>
          <textarea value={bugForm.logs} onChange={(e) => setBugForm({ ...bugForm, logs: e.target.value })} rows={3} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
        </div>
      </div>

      {bugReport && (
        <div className="mt-8 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <h3 className="text-lg font-semibold">Bug Classification</h3>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-red-100 px-3 py-1 text-red-700">Severity: {bugReport.classification.severity}</span>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-700">Priority: {bugReport.classification.priority}</span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">Type: {bugReport.classification.type}</span>
              <span className="rounded-full bg-violet-100 px-3 py-1 text-violet-700">Module: {bugReport.classification.module}</span>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <h3 className="text-lg font-semibold">AI Root Cause Hypothesis</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">Possible Root Cause: {bugReport.rootCause}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <h3 className="text-lg font-semibold">Business Impact</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">{bugReport.businessImpact}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <h3 className="text-lg font-semibold">Recommended QA Actions</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              {(bugReport.recommendedQaActions ?? []).map((item: string) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <h3 className="text-lg font-semibold">Bug Report</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <div><strong>Title:</strong> {bugReport.bugReport.title}</div>
              <div><strong>Description:</strong> {bugReport.bugReport.description}</div>
              <div><strong>Environment:</strong> {bugReport.bugReport.environment}</div>
              <div><strong>Preconditions:</strong> {bugReport.bugReport.preconditions}</div>
              <div><strong>Steps:</strong> {bugReport.bugReport.steps.join("; ")}</div>
              <div><strong>Expected Result:</strong> {bugReport.bugReport.expectedResult}</div>
              <div><strong>Actual Result:</strong> {bugReport.bugReport.actualResult}</div>
              <div><strong>Severity:</strong> {bugReport.bugReport.severity}</div>
              <div><strong>Priority:</strong> {bugReport.bugReport.priority}</div>
              <div><strong>Component:</strong> {bugReport.bugReport.component}</div>
              <div><strong>Business Impact:</strong> {bugReport.bugReport.businessImpact}</div>
              <div><strong>Suggested Fix Area:</strong> {bugReport.bugReport.suggestedFixArea}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderClosure = () => (
    <div className="card-surface rounded-3xl p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Test Closure Summary</p>
          <h2 className="mt-2 text-2xl font-semibold">Release readiness review</h2>
        </div>
        <button onClick={handleGenerateClosure} className="rounded-xl bg-[#1B1B1B] px-4 py-2.5 text-sm font-medium text-white">Generate Closure Summary</button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {Object.entries(closureForm).map(([key, value]) => (
          <div key={key} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <label className="text-xs uppercase tracking-[0.18em] text-slate-500">{key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase())}</label>
            <input value={value} onChange={(e) => setClosureForm({ ...closureForm, [key]: e.target.value })} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
          </div>
        ))}
      </div>

      {closure && (
        <div className="mt-8 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <div className="text-xl font-semibold text-emerald-700">Recommendation: {closure.recommendation}</div>
            <p className="mt-2 text-sm leading-6 text-slate-700">{closure.reason}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Pass Percentage</div><div className="mt-2 text-2xl font-semibold">{closure.passPercentage}%</div></div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Fail Percentage</div><div className="mt-2 text-2xl font-semibold">{closure.failPercentage}%</div></div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Execution Percentage</div><div className="mt-2 text-2xl font-semibold">{closure.executionPercentage}%</div></div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Defect Density</div><div className="mt-2 text-2xl font-semibold">{closure.defectDensity}</div></div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Open Defects</div><div className="mt-2 text-2xl font-semibold">{closure.openDefects}</div></div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-500">Closed Defects</div><div className="mt-2 text-2xl font-semibold">{closure.closedDefects}</div></div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="card-surface rounded-3xl p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Settings</p>
        <h2 className="mt-2 text-2xl font-semibold">Application Configuration</h2>
      </div>

      <div className="mt-8 grid gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">API Configuration</h3>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <label className="text-xs uppercase tracking-[0.18em] text-slate-500">OpenAI API Endpoint</label>
            <input value="https://api.openai.com/v1/chat/completions" readOnly className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Model</label>
            <input value="gpt-4" readOnly className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Application Settings</h3>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Application Name</label>
            <input value="AI QA Copilot" readOnly className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Version</label>
            <input value="1.0.0" readOnly className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Environment</label>
            <input value="Production" readOnly className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">About</h3>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <p className="text-sm text-slate-700">AI QA Copilot is an AI-powered quality engineering assistant that helps automate testing, analysis, and QA processes.</p>
            <div className="mt-4 flex gap-4">
              <button onClick={() => setShowDocModal(true)} className="rounded-lg bg-[#1B1B1B] px-4 py-2 text-sm font-medium text-white hover:bg-black transition-colors">View Documentation</button>
              <button onClick={() => setShowIssueModal(true)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">Report Issue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#141414]">
      <div className="mx-auto flex max-w-[1600px] flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-200 bg-[#F9F5EE] lg:w-72 lg:border-r lg:border-b-0">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B1B1B] text-sm font-semibold text-white">AI</div>
              <div>
                <div className="text-xl font-semibold">AI QA Copilot</div>
              </div>
            </div>

            <nav className="mt-8 space-y-2">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium ${activeTab === id ? "bg-[#1B1B1B] text-white" : "text-slate-700 hover:bg-white/60"}`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>

            <div className="mt-8 border-t border-slate-200 pt-4">
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium ${activeTab === "settings" ? "bg-[#1B1B1B] text-white" : "text-slate-700 hover:bg-white/60"}`}
              >
                <Grid2x2 className="h-4 w-4" /> Settings
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <header className="border-b border-slate-200 bg-[#FBF8F3]/80 px-6 py-5 backdrop-blur">
            <div className="flex items-center justify-between gap-5">
              <div>
                <h1 className="text-3xl font-semibold">AI QA Copilot</h1>
                <p className="text-sm text-slate-500">AI-powered quality engineering assistant</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> {statusMessage.replace("AI Status: ", "")}
              </div>
            </div>
          </header>

          <div className="p-6">
            {error && (
              <div className="mb-5 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <XCircle className="h-4 w-4" /> {error}
              </div>
            )}

            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "requirements" && renderRequirements()}
            {activeTab === "test-plan" && renderTestPlan()}
            {activeTab === "test-cases" && renderTestCases()}
            {activeTab === "coverage" && renderCoverage()}
            {activeTab === "bug-triage" && renderBug()}
            {activeTab === "closure" && renderClosure()}
            {activeTab === "settings" && renderSettings()}
          </div>
        </main>
      </div>

      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="card-surface max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-xl font-semibold">AI QA Copilot Documentation</h3>
              <button onClick={() => setShowDocModal(false)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-4 space-y-4 text-sm text-slate-700">
              <h4 className="font-semibold text-slate-900">Features Overview</h4>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong>Requirement Analyzer:</strong> Parses raw requirements or uploaded PDFs/TXT files to extract structured functional & non-functional requirements and risk ratings.</li>
                <li><strong>Test Plan Generator:</strong> Creates an enterprise-grade QA Test Plan complete with strategy, scope, entry/exit criteria, and deliverables.</li>
                <li><strong>Test Case Generator:</strong> Automatically drafts detailed positive, negative, and boundary test scenarios with step-by-step actions.</li>
                <li><strong>Test Coverage & Traceability:</strong> Maps test scenarios directly to requirement IDs and highlights uncovered features.</li>
                <li><strong>Bug Triage:</strong> Analyzes defect reports to determine severity, priority, business impact, and potential root cause hypotheses.</li>
                <li><strong>Test Closure:</strong> Evaluates execution status and defect metrics to provide release readiness recommendations.</li>
              </ul>
              <h4 className="mt-4 font-semibold text-slate-900">API Integration</h4>
              <p>Configure `AI_API_KEY` in environment variables to enable OpenAI GPT-4 powered response generation, or rely on built-in offline QA heuristics.</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setShowDocModal(false)} className="rounded-xl bg-[#1B1B1B] px-5 py-2.5 text-sm font-medium text-white hover:bg-black">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="card-surface w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-xl font-semibold">Report an Issue</h3>
              <button onClick={() => { setShowIssueModal(false); setIssueSubmitted(false); }} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            {issueSubmitted ? (
              <div className="my-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h4 className="text-lg font-semibold text-slate-800">Issue Submitted</h4>
                <p className="mt-1 text-sm text-slate-600">Thank you! Your feedback has been logged successfully.</p>
                <button
                  onClick={() => { setShowIssueModal(false); setIssueSubmitted(false); setIssueForm({ title: "", description: "", priority: "Medium" }); }}
                  className="mt-5 rounded-xl bg-[#1B1B1B] px-5 py-2.5 text-sm font-medium text-white hover:bg-black"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!issueForm.title.trim()) return;
                  setIssueSubmitted(true);
                }}
                className="mt-4 space-y-4 text-sm"
              >
                <div>
                  <label className="font-medium text-slate-700">Issue Summary</label>
                  <input
                    required
                    value={issueForm.title}
                    onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })}
                    placeholder="Brief description of the issue..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none ring-0 focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700">Priority</label>
                  <select
                    value={issueForm.priority}
                    onChange={(e) => setIssueForm({ ...issueForm, priority: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none ring-0 focus:border-slate-400"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700">Details / Steps to Reproduce</label>
                  <textarea
                    rows={4}
                    value={issueForm.description}
                    onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                    placeholder="Provide additional details or logs..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none ring-0 focus:border-slate-400"
                  />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowIssueModal(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50">
                    Cancel
                  </button>
                  <button type="submit" className="rounded-xl bg-[#1B1B1B] px-5 py-2.5 text-sm font-medium text-white hover:bg-black">
                    Submit Issue
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
