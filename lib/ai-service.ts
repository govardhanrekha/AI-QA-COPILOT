export type RiskLevel = "Low" | "Medium" | "High";

export type RequirementItem = {
  id: string;
  text: string;
  type: "Functional" | "Non-functional";
  priority: "High" | "Medium" | "Low";
  risk: RiskLevel;
};

export type AiAction =
  | "analyzeRequirements"
  | "generateTestPlan"
  | "generateTestCases"
  | "analyzeCoverage"
  | "triageBug"
  | "generateClosureSummary";

export async function runAiAction(action: AiAction, payload: Record<string, unknown>) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "AI request failed");
  }

  const data = await response.json();
  return data.result;
}

export function generateLocalStructuredResponse(action: AiAction, payload: Record<string, unknown>) {
  const rawText = String(payload.text ?? "");
  const requirementText = rawText.trim();

  if (action === "analyzeRequirements") {
    const normalized = requirementText || "Digital Payment Transfer\nCustomers can transfer funds using their registered bank account.\nThe maximum daily transfer amount is ₹2,00,000.\nTransactions above the daily limit must be rejected.\nCustomers must receive a notification after successful or failed transactions.";
    const lines = normalized
      .split(/\n|\.|\!/)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 12);

    const extracted: RequirementItem[] = [
      {
        id: "REQ-001",
        text: "Users should be able to transfer funds using their registered bank account.",
        type: "Functional",
        priority: "High",
        risk: "Medium",
      },
      {
        id: "REQ-002",
        text: "System should enforce a daily transfer limit of ₹2,00,000 for each customer.",
        type: "Functional",
        priority: "High",
        risk: "High",
      },
      {
        id: "REQ-003",
        text: "Transactions above the daily limit must be rejected with a clear validation message.",
        type: "Functional",
        priority: "High",
        risk: "High",
      },
      {
        id: "REQ-004",
        text: "Customers must receive notifications after successful and failed payment attempts.",
        type: "Functional",
        priority: "High",
        risk: "Medium",
      },
      {
        id: "REQ-005",
        text: "The payment workflow must be available and reliable during normal banking business hours.",
        type: "Non-functional",
        priority: "Medium",
        risk: "Medium",
      },
    ];

    const fallbackRequirements = lines.length > 0 ? lines.map((line, index) => ({
      id: `REQ-${String(index + 1).padStart(3, "0")}`,
      text: line.length > 140 ? `${line.slice(0, 137)}...` : line,
      type: /limit|validation|notification|security|response|performance|availability/i.test(line) ? "Non-functional" : "Functional",
      priority: /critical|must|high|limit|security/i.test(line) ? "High" : "Medium",
      risk: /limit|security|validation|notification|response|timeout/i.test(line) ? "High" : "Medium",
    })) : extracted;

    return {
      project: "Digital Payment Transfer",
      module: "Payments",
      businessObjective: "Enable customers to securely transfer funds and receive confirmation for successful or failed transactions.",
      functionalRequirements: [
        "Users can transfer funds using a registered bank account.",
        "Daily transfer limits are enforced.",
        "Over-limit transactions are rejected.",
        "Notifications are sent for success and failure cases.",
      ],
      nonFunctionalRequirements: [
        "Payment processing must be traceable and auditable.",
        "System must provide clear validation messages.",
        "The workflow should be resilient and available during business hours.",
      ],
      extractedRequirements: fallbackRequirements.slice(0, 5),
      overallRisk: "HIGH",
      riskBreakdown: { High: 4, Medium: 7, Low: 3 },
      ambiguities: [
        {
          requirement: "The system should respond quickly.",
          recommendation: "Define a measurable SLA, for example <= 2 seconds for 95% of requests.",
        },
      ],
      dependencies: ["Login", "Authentication", "User Session", "Authorization"],
      assumptions: [
        "Bank account verification is handled by the core banking system.",
        "Notification service is available for email and SMS alerts.",
      ],
    };
  }

  if (action === "generateTestPlan") {
    return {
      documentOverview: "This test plan covers end-to-end validation of digital payment transfers in the banking application.",
      objective: "Verify that customers can submit valid transactions, that daily limits are enforced, and that notifications are delivered correctly.",
      scope: "System testing, integration validation, and API verification for digital payment transfer workflows.",
      outOfScope: "Third-party bank core infrastructure performance benchmarking and unrelated modules.",
      testStrategy: "Risk-based testing with emphasis on validation logic, transaction integrity, and notification flows.",
      testingTypes: ["System Testing", "Integration Testing", "API Testing"],
      testEnvironment: "QA environment with mock banking integrations and production-like notification service configuration.",
      testData: "Valid accounts, invalid accounts, boundary amounts, duplicate transactions, and timeout scenarios.",
      entryCriteria: "Requirement sign-off complete, test data prepared, and environment stable.",
      exitCriteria: "All critical and high-priority test cases executed, defects triaged, and regression smoke passed.",
      rolesAndResponsibilities: [
        "QA Lead: create execution plan and final sign-off",
        "Test Engineer: execute scenarios and capture evidence",
        "Developer: resolve defects and validate fixes",
      ],
      risks: ["Business impact of over-limit transfers", "Notification failures", "Delayed API response times"],
      assumptions: ["Core payment service is available in QA env", "Notification channel APIs are functional"],
      dependencies: ["Bank account service", "Notification service", "Authentication service"],
      deliverables: ["Test plan", "Execution report", "Defect summary", "Closure recommendation"],
      defectManagement: "All defects logged with severity, steps, attachments, and priority before triage.",
      automationStrategy: "Automate critical payment validation and retry paths using API and end-to-end regression suites.",
    };
  }

  if (action === "generateTestCases") {
    const requirementList = Array.isArray(payload.requirements) ? payload.requirements : [
      { id: "REQ-001", text: "Users can transfer funds using a registered bank account." },
      { id: "REQ-002", text: "Daily transfer limit must be enforced." },
    ];

    const cases = [
      {
        id: "TC-001",
        requirementId: requirementList[0]?.id || "REQ-001",
        scenario: "Verify successful transfer using valid credentials and valid account.",
        precondition: "User is authenticated and has sufficient balance.",
        steps: ["Login to the banking application", "Enter valid recipient details", "Submit transfer request"],
        testData: "Valid account number, amount below daily limit.",
        expectedResult: "Transfer succeeds and confirmation message is shown.",
        priority: "High",
        severity: "High",
        type: "Functional",
      },
      {
        id: "TC-002",
        requirementId: requirementList[1]?.id || "REQ-002",
        scenario: "Verify transfer is rejected above daily threshold.",
        precondition: "User is logged in and amount exceeds daily limit.",
        steps: ["Enter amount above ₹2,00,000", "Submit transfer request"],
        testData: "Amount = ₹2,50,000.",
        expectedResult: "Transaction is rejected and limit warning is displayed.",
        priority: "High",
        severity: "Critical",
        type: "Negative",
      },
      {
        id: "TC-003",
        requirementId: requirementList[0]?.id || "REQ-001",
        scenario: "Verify failed transaction notifications are sent.",
        precondition: "Payment failure is simulated.",
        steps: ["Attempt transfer with invalid recipient account", "Observe system response"],
        testData: "Invalid recipient details.",
        expectedResult: "User receives failure notification and transaction is marked failed.",
        priority: "Medium",
        severity: "Medium",
        type: "API",
      },
    ];

    return { cases };
  }

  if (action === "analyzeCoverage") {
    return {
      overallCoverage: 91,
      coveredRequirements: 22,
      partiallyCovered: 1,
      notCovered: 1,
      missingCoverage: [
        {
          requirementId: "REQ-010",
          description: "Session timeout requirement has no associated test cases.",
          severity: "High",
        },
      ],
      insights: [
        "Missing negative validation scenarios for invalid transfer amounts.",
        "Boundary conditions for maximum transfer limit need coverage.",
        "Duplicate test cases detected around notification validations.",
      ],
      traceability: [
        { requirement: "REQ-001", description: "Login functionality", testCases: ["TC-001", "TC-002", "TC-003"], coverage: "100%", risk: "Medium", status: "Covered" },
      ],
    };
  }

  if (action === "triageBug") {
    return {
      classification: {
        severity: "Critical",
        priority: "P1",
        type: "Functional",
        module: "Payment",
      },
      rootCause: "Transaction validation appears to occur after the transaction is submitted rather than before authorization.",
      businessImpact: "Customers may be charged or debited incorrectly before the system validates the daily limit.",
      recommendedQaActions: [
        "Reproduce issue in QA environment using boundary transfer amount",
        "Validate authorization and validation order",
        "Review regression coverage for limit enforcement scenarios",
      ],
      bugReport: {
        title: "Payment transfer above daily limit is accepted before validation",
        description: "Customers can submit a payment above the configured daily maximum; the system validates after authorization rather than before transaction submission.",
        environment: "QA-Banking-02",
        preconditions: "User logged in; valid bank account; amount above configured limit.",
        steps: ["Log in", "Select fund transfer", "Enter amount above limit", "Submit request"],
        expectedResult: "Request is rejected before authorization.",
        actualResult: "Request is accepted and transaction proceeds.",
        severity: "Critical",
        priority: "P1",
        component: "Payment Transaction Service",
        businessImpact: "Customers may exceed transfer limits and staff may have to reverse incorrect transactions.",
        suggestedFixArea: "Validation layer and transaction workflow ordering.",
      },
    };
  }

  if (action === "generateClosureSummary") {
    return {
      passPercentage: 94,
      failPercentage: 4,
      executionPercentage: 92,
      defectDensity: 0.8,
      criticalDefectCount: 1,
      openDefects: 2,
      closedDefects: 18,
      recommendation: "GO WITH CONDITIONS",
      reason: "All critical test cases passed. Two medium-severity defects remain open but neither affects the core payment workflow.",
      summary: {
        testExecutionSummary: "Payment transfer workflow executed across system, integration, and API layers.",
        testResults: "94% pass rate with most critical scenarios validated successfully.",
        defectSummary: "19 defects were logged; 18 closed; 1 critical and 1 medium remain open.",
        requirementCoverage: "91% of requirements are fully covered across planned QA execution.",
        riskSummary: "Residual risk remains in edge-condition handling and notification recovery flows.",
        outstandingIssues: ["Two medium-defect backlog items remain", "Monitoring for notification retries is still being validated"],
        knownLimitations: "The test run excludes non-functional volume performance testing.",
        productionReadiness: "Ready for release with controlled conditions and monitoring.",
      },
    };
  }

  return {
    status: "Not specified in requirement.",
    recommendation: "Clarification required from BA/Product Owner.",
  };
}
