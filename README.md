# 🤖 AI QA Copilot

> **AI-powered quality engineering assistant for transforming software requirements into actionable QA deliverables.**

AI QA Copilot is a real-world QA productivity application designed to reduce repetitive test documentation and help QA engineers move faster from **requirements → test strategy → test cases → coverage → defect analysis → release readiness**.

## 🚀 Problem Statement

In real software projects, QA engineers spend significant time manually converting requirements into:
- Requirement analysis
- Test plans
- Detailed test cases
- Test coverage and traceability
- Defect triage and root-cause analysis
- Test closure / release readiness summaries

This work is repetitive, time-consuming, and can lead to missed scenarios, inconsistent documentation, and incomplete traceability.

## 💡 Solution

**AI QA Copilot** provides a centralized QA workspace where a tester can analyze a requirement document and generate structured QA artifacts.

### Key capabilities

| Module | Purpose |
|---|---|
| 📄 Requirement Analyzer | Upload/analyze PDF or TXT requirements and identify requirements |
| 📋 Test Plan | Generate a professional test plan from analyzed requirements |
| 🧪 Test Cases | Generate structured functional, negative, and boundary test cases |
| 📊 Test Coverage | Measure requirement coverage and identify missing scenarios |
| 🐞 Bug Triage | Analyze defect impact, expected vs actual behavior, and root cause |
| ✅ Test Closure | Generate a release-readiness / test closure summary |

## ✨ Why This Solves a Real QA Problem

The application follows a practical QA workflow rather than generating isolated AI content:

**Requirement → Analysis → Test Plan → Test Cases → Coverage → Bug Triage → Test Closure**

This makes it useful as a **QA productivity copilot** for projects where testers need to produce consistent, traceable testing artifacts quickly.

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Styling:** CSS / responsive UI
- **Document Processing:** PDF.js
- **Package Management:** npm
- **Deployment:** Vercel
- **Source Control:** GitHub
- **QA/AI Concept:** AI-assisted test design, coverage analysis, defect triage and release readiness

## 🏗️ Application Workflow

```text
Requirement PDF/TXT
        ↓
Requirement Analyzer
        ↓
Test Plan
        ↓
Test Cases
        ↓
Test Coverage
        ↓
Bug Triage
        ↓
Test Closure
```

## ▶️ How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/govardhanrekha/AI-QA-COPILOT.git
cd AI-QA-COPILOT
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000`.

### 4. Create a production build

```bash
npm run build
```

### 5. Run the production server

```bash
npm start
```

## 🌐 Live Demo

**Vercel:** https://ai-qa-copilot-3x3kyu75y-govardhanrekhas-projects.vercel.app/

**GitHub:** https://github.com/govardhanrekha/AI-QA-COPILOT

## 📸 Screenshots

### 1. Dashboard
![AI QA Copilot Dashboard](docs/screenshots/dashboard.png)

### 2. Requirement Analyzer
Upload a PDF/TXT requirement document and analyze its content.
![Requirement Analyzer](docs/screenshots/requirement-analyzer.png)

### 3. Test Plan Generator
Generate a structured professional test plan from analyzed requirements.
![Test Plan Generator](docs/screenshots/test-plan.png)

### 4. Test Case Generator
Generate structured scenarios with requirement IDs, preconditions, steps, expected results, priority, severity, and type.
![Test Case Generator](docs/screenshots/test-cases.png)

### 5. Test Coverage Dashboard
Review overall coverage, uncovered requirements, AI insights, and requirement-to-test-case traceability.
![Test Coverage Dashboard](docs/screenshots/test-coverage.png)

### 6. Bug Triage
Analyze defects using title, environment, actual result, and expected result.
![Bug Triage](docs/screenshots/bug-triage.png)

### 7. Test Closure Summary
Generate a release-readiness review using testing dates and test execution metrics.
![Test Closure Summary](docs/screenshots/test-closure.png)

## 🎯 Hackathon Value Proposition

**AI QA Copilot helps QA engineers reduce repetitive documentation effort and improve test completeness and traceability.**

Instead of manually creating multiple QA artifacts from the same requirement, testers can use one workflow to accelerate the QA lifecycle.

### Key benefits
- ⏱️ Reduces repetitive QA documentation effort
- 🎯 Improves test scenario completeness
- 🔗 Supports requirement-to-test traceability
- 📊 Highlights coverage gaps
- 🐞 Supports faster defect triage
- 🚦 Helps assess release readiness
- 📁 Provides structured, reusable QA outputs

## 🔮 Future Enhancements

- LLM integration for production-grade requirement analysis
- Jira / Azure DevOps integration
- Excel, Word and Jira-compatible exports
- API test generation from OpenAPI specifications
- Selenium / Playwright automation skeleton generation
- AI-powered risk-based testing
- Requirement change impact analysis
- Authentication and multi-project workspaces
- Persistent project history

## 👩‍💻 Author

**Rekha Govardhanan**

Senior QA Engineer | 11+ Years in Software Testing | Banking & BFSI | Manual & Functional Testing | AI Testing

---

⭐ If you find this project useful, consider giving the repository a star.
