import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    loans: "My Loans",
    simulation: "Simulation",
    analysis: "Stress Analysis",
    fraudCheck: "Fraud Check",
    emergencyFund: "Emergency Fund",
    familyFinance: "Family Finance",
    voiceTrack: "Voice Track",
    myGoals: "My Goals",
    adminPanel: "Admin Panel",
    aiInsights: "AI Insights",
    logout: "Logout",

    // Dashboard
    hello: "Hello",
    dashboardDesc: "Here is your dynamic financial health and debt risk audit.",
    configureFinancials: "Configure Financials",
    injectDemo: "Inject Demo Dataset",
    monthlyIncome: "Monthly Income",
    expenses: "Expenses",
    totalEMI: "Total Active EMIs",
    managedOutflow: "Managed outflow",
    debtCommitments: "Debt Commitments",
    financesBreakdown: "Finances Breakdown",
    allocationMapping: "Allocation mapping of income commitments",
    activePortfolio: "Active Portfolio",
    portfolioDesc: "Comprehensive audit of active loan streams",
    manageLoans: "Manage Loans",
    loanDetails: "Loan Details",
    amount: "Amount",
    rate: "Rate",
    status: "Status",
    financialHealth: "Financial Health",
    healthStatusExcellent: "Excellent Standing",
    healthStatusModerate: "Moderate Health",
    healthStatusRisk: "Risk Profile Detected",
    healthDesc: "Your savings coverage is robust against active EMIs.",
    trajectory: "Debt-Stress Trajectory",
    retryConnection: "Retry Connection",
    reauthenticate: "Re-authenticate (Logout & Login)",
    failedSync: "Failed to Sync Dashboard",

    // Goals
    goalsTitle: "Emotional Money Timeline",
    goalsDesc: "Define savings goals and simulate purchase dates against unpruned flexible expenditures.",
    createGoal: "Create Target Goal",
    goalIdentifier: "Goal Identifier",
    targetCost: "Target Cost ($)",
    monthlyContribution: "Monthly Contribution",
    addTargetGoal: "Add Target Goal",
    forecastOnline: "Forecast Timelines",

    // Fraud
    fraudTitle: "AI Transaction Guard",
    fraudDesc: "Evaluate and audit high-risk merchant payments before confirming settlements.",
    analyzePayment: "Analyze Payment Criteria",
    settlementAmount: "Settlement Amount ($)",
    category: "Category",
    merchant: "Receiving Merchant",
    merchantLoc: "Merchant Location",
    analyzeSettlement: "Analyze Settlement",
    neuralEngine: "Neural Engine Active",

    // Family Finance
    familyTitle: "Family Financial Ecosystem",
    familyDesc: "Link accounts to coordinate shared wallets, family limits, elder alerts, and group saving plans.",
    groupManagement: "Group Management",
    establishGroup: "Establish Group",
    establishGroupDesc: "Initialize a secure shared financial workspace and issue invite linkages instantly.",
    createNewEcosystem: "Create New Ecosystem",
    ecosystemConnectionId: "Ecosystem Connection ID",
    provideConnectionIdDesc: "Provide an active family token ID to download shared wallet indexes.",
    synchronizeGroup: "Synchronize Group",
    synching: "Synching...",
    inviteCode: "Invite Code: ",
    shareCodeWithFamily: "Share Code With Family",
    sharedBalance: "Shared Balance",
    topUp: "+ Top Up",
    amountVal: "Amt ($)",
    primaryPool: "Primary Pool",
    activeWallet: "Active Wallet",
    ecosystemMembers: "Ecosystem Members",
    connected: "Connected",
    recentTransactions: "Recent Family Pool Transactions",
    liveLedger: "Live ledger",
    member: "Member",
    reason: "Reason",
    date: "Date",
    noTransactions: "No transactions recorded yet.",
    addMember: "Add Family Member",
    inviteMemberDesc: "Invite existing members using their email to coordinate limits and elder expenses.",
    emailAddress: "Email Address",
    nickname: "Nickname",
    role: "Role",
    monthlyLimit: "Monthly Limit ($)",
    parent: "Parent",
    child: "Child",
    elder: "Elder",
    sendingInvite: "Inviting...",
    inviteSuccess: "Successfully added family member!",

    // Emergency Fund
    fundTitle: "Emergency Shared Wallet & Fund",
    fundDesc: "Keep your critical funds reserved. Track runway estimation and contribute monthly to avoid debt stress.",
    fundBalance: "Fund Balance",
    monthsOfRunway: "Months of Runway",
    runwayDesc: "Estimated months of survival based on current balance and expenses.",
    fundGoal: "Fund Target",
    monthlyContributionGraph: "Monthly Contribution Progress",
    contribute: "Contribute to Fund",
    withdraw: "Emergency Withdrawal",

    // Simulation
    simTitle: "What-If Interest Rate Simulator",
    simDesc: "Simulate structural adjustments like principal changes, interest changes, or prepayments.",
    loanDetailsForm: "Loan Parameters",
    simulateButton: "Run Structural Simulation",
    simResults: "Simulation Insights & Metrics",

    // Stress Analysis
    stressTitle: "Debt Stress & Vulnerability Audit",
    stressDesc: "Analyze how vulnerable your cash flow is under various financial shocks.",
    runStressCheck: "Run Vulnerability Scan",

    // Voice Tracker
    voiceTitle: "Voice Debt Assistant",
    voiceDesc: "Command your loan manager with natural voice sentences. Real-time NLP parsing extracts actionable events.",
    speakCommand: "Tap to Speak Command",
    listening: "Listening...",

    // General UI
    save: "Save",
    cancel: "Cancel",
    loadingVal: "Loading...",
    backToDashboard: "Back to Dashboard",
    inviteCodeRequired: "Group ID is required to sync",

    // Loans
    manageLoansLocally: "Manage your loans locally. Simulation uses backend /api/loan/simulate.",
    addNewLoan: "Add New Loan",
    loanType: "Loan Type",
    loanTypePlaceholder: "e.g., Home Loan",
    amountPlaceholder: "150000",
    interestPlaceholder: "3.5",
    durationPlaceholder: "240",
    adding: "Adding...",
    addLoanButton: "Add Loan",
    yourLoans: "Your Loans",
    noLoans: "No loans added yet.",
    amountLabel: "Amount",
    interestLabel: "Interest",
    durationLabel: "Duration",
    statusLabel: "Status",

    // Simulation
    simSandbox: "Interactive Sandbox",
    simMainTitle: "Financial Scenario Simulator",
    simDescExtended: "Model prepayments, EMI adjustments, and refinance rates to unlock compounding interest savings.",
    scenarioParams: "Scenario Parameters",
    scenarioDesc: "Adjust inputs or use the precision sliders to test payoff schedules.",
    loanPrincipal: "Loan Principal ($)",
    tenureHorizon: "Tenure Horizon (Months)",
    tenure1Year: "1 Year (12m)",
    tenure15Years: "15 Years (180m)",
    tenure30Years: "30 Years (360m)",
    payoffBoosters: "What-If Payoff Boosters",
    extraMonthlyPayoff: "Extra Monthly Payoff ($)",
    oneTimePrepayment: "One-Time Prepayment ($)",
    simCompounding: "Simulating Repayment Compounding...",
    runSandbox: "Run Simulation Sandbox",
    calcException: "Calculation Exception",
    waitingScenario: "Waiting for Repayment Scenario",
    waitingScenarioDesc: "Select your simulation metrics and click 'Run Simulation' to model custom prepayment and interest amortization impacts.",
    interestSavings: "Interest Savings",
    interestSavingsDesc: "See how prepaying early eliminates thousands in compound interest.",
    timelineShortening: "Timeline Shortening",
    timelineShorteningDesc: "Model custom monthly buffers and track your new debt-free milestone date.",
    compoundingBenefit: "Compounding Benefit",
    repaymentSummary: "Repayment Summary",
    highOptimization: "High Optimization",
    projectedInterestSaved: "Projected Interest Saved",
    interestSavedDesc: "This is the total money that will stay in your wallet instead of going to interest charges.",
    newMonthlyEmi: "New Monthly EMI",
    remainingHorizon: "Remaining Payoff Horizon",
    optimizedDate: "Optimized Debt-Free Date",
    payoffComparison: "Payoff Amortization Comparison",
    originalHorizon: "Original Horizon",
    optimizedHorizon: "Optimized Horizon",
    quicker: "quicker!",
    aiScenarioCounsel: "AI Scenario Counsel",
    synthesizingData: "Synthesizing data...",
    retriggerAI: "Re-trigger AI Analysis",

    // Stress Analysis
    coreRiskDiagnostic: "Core Risk Diagnostic",
    debtStressAnalysisTitle: "Debt Stress Analysis",
    debtStressDescExtended: "Understand how heavily your monthly amortization commitments stress your active disposable cashflow.",
    incomeMinusExpenses: "Income minus fixed expenses",
    activeLoanPayments: "Sum of all active loan payments",
    disposableCashflow: "Disposable Cashflow",
    totalMonthlyEmi: "Total Monthly EMI",
    combinedStressScore: "Combined Stress Score",
    debtToDisposableRatio: "Debt-to-disposable ratio",
    historicalTrend: "Historical Risk Amortization Trend",
    timelineTrackStress: "Timeline track of your debt stress score index.",
    stressContribution: "Stress Contribution by Individual Loan",
    isolatedImpactScore: "Isolated impact score of each active loan item on your cashflow.",
    activeObligation: "Active Obligation",
    stressRatio: "stress ratio",
    noLoansDetected: "No Loans Detected",
    noLoansDetectedDesc: "Add amortized loan liabilities on the Loan Ledger page to review stress audits.",
    primaryStressDriver: "Primary Stress Driver",
    contributesLargest: "contributes the single largest cashflow pressure point",
    ratioText: "individual ratio.",
    debtDisposableRatioText: "Debt-to-Disposable Cashflow Ratio:",
    consumeDisposable: "Your amortized EMIs consume",
    safeCashflowRunway: "Safe Cashflow Runway:",
    preserveMonthlyNet: "You preserve a monthly net cash balance of",
    discretionarySavings: "for savings and discretionary activities.",
    cashflowAlert: "Cashflow Alert",
    stressExceedsWarning: "Your debt stress ratio exceeds the highly recommended 35% safe threshold. Prepayment modeling or loan refinancing is highly advised to prevent savings attrition.",

    // Fraud
    aiTransactionGuard: "AI Transaction Guard",
    fraudDescExtended: "Evaluate and audit high-risk merchant payments before confirming settlements.",
    neuralEngineActive: "Neural Engine Active",
    analyzePaymentCriteria: "Analyze Payment Criteria",
    auditPaymentRisk: "Audit Payment Risk",
    runningNeuralAudit: "Running Neural Audit...",
    threatScoreAssessment: "Threat score assessment",
    riskMetric: "Risk Metric",
    decisionMatrix: "Decision Matrix",
    safeApproved: "Safe Approved",
    riskWarning: "Risk Warning",
    reasonIdentified: "Reason identified:",
    aiGuardAnalysis: "AI Guard Analysis",
    consultingExplanationModel: "Consulting AI explanation model...",

    // Goals
    emotionalMoneyTimeline: "Emotional Money Timeline",
    goalsDescExtended: "Define savings goals and simulate purchase dates against unpruned flexible expenditures.",
    forecastTimelinesOnline: "Forecast Timelines Online",
    createTargetGoal: "Create Target Goal",
    aiMilestonesForecast: "AI Milestones Forecast",
    runningTimelinePredictions: "Running timeline predictions...",
    defineFirstPurchaseGoal: "Define your first purchase goal above to calculate auto timeline predictions.",
    completedText: "Completed",
    blockerText: "Blocker:",
    savedText: "Saved",
    targetText: "Target",

    // Voice Tracker
    voiceExpenseTracker: "Voice Expense Tracker",
    voiceDescExtended: "Dictate transactions dynamically using advanced NLP to categorize and file expenses instantly.",
    nlpParserActive: "NLP Parser Active",
    decodingAcousticMetrics: "Decoding acoustic metrics, extracting vectors...",
    recordedSpeech: "Recorded Speech",
    aiExtractedDetails: "AI Extracted Details",
    confirmAndLogEntry: "Confirm and Log Entry",
    recordedHistory: "Recorded History",
    parsedLogs: "Parsed logs",

    // Emergency Fund
    emergencyFundBuilder: "Emergency Fund Builder",
    fundDescExtended: "Deploy micro-savings mechanisms to accumulate automated emergency liquidity quietly.",
    smartRoundUpsEnabled: "Smart Round-Ups Enabled",
    currentBalance: "Current Balance",
    totalAccumulation: "Total Accumulation",
    fundTarget: "Fund Target:",
    savedPercentage: "Saved",
    progressText: "Progress",
    autoSavingHistory: "Auto-Saving History",
    aiMicroSavingIntensity: "AI Micro-Saving Intensity",
    calibrateMicroSavings: "Dynamically calibrate how aggressive the round-up algorithm rounding checks are.",
    supportRunway: "Support Runway",
    runwayAnalysisDesc: "Runway analysis based on your standard baseline expense profile.",
    runwayStable: "Runway Stable",
    aiAdvisorySuggestions: "AI Advisory Suggestions",
    formulatingSavingsDirectives: "Formulating micro-savings directives..."
  },
  kn: {
    // Navigation
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌",
    loans: "ನನ್ನ ಸಾಲಗಳು",
    simulation: "ಸಿಮ್ಯುಲೇಶನ್",
    analysis: "ಒತ್ತಡದ ವಿಶ್ಲೇಷಣೆ",
    fraudCheck: "ವಂಚನೆ ಪರಿಶೀಲನೆ",
    emergencyFund: "ತುರ್ತು ನಿಧಿ",
    familyFinance: "ಕುಟುಂಬ ಹಣಕಾಸು",
    voiceTrack: "ಧ್ವನಿ ಟ್ರ್ಯಾಕ್",
    myGoals: "ನನ್ನ ಗುರಿಗಳು",
    adminPanel: "ಅಡ್ಮಿನ್ ಪ್ಯಾನಲ್",
    aiInsights: "ಎಐ ಒಳನೋಟಗಳು",
    logout: "ಲಾಗ್ ಔಟ್",

    // Dashboard
    hello: "ನಮಸ್ಕಾರ",
    dashboardDesc: "ನಿಮ್ಮ ಹಣಕಾಸಿನ ಆರೋಗ್ಯ ಮತ್ತು ಸಾಲದ ಅಪಾಯದ ಲೆಕ್ಕಪರಿಶೋಧನೆ ಇಲ್ಲಿದೆ.",
    configureFinancials: "ಹಣಕಾಸು ಸಂರಚಿಸಿ",
    injectDemo: "ಡೆಮೊ ಡೇಟಾ ಸೇರಿಸಿ",
    monthlyIncome: "ಮಾಸಿಕ ಆದಾಯ",
    expenses: "ವೆಚ್ಚಗಳು",
    totalEMI: "ಒಟ್ಟು ಸಕ್ರಿಯ ಇಎಂಐಗಳು",
    managedOutflow: "ನಿರ್ವಹಿಸಿದ ಹೊರಹರಿವು",
    debtCommitments: "ಸಾಲದ ಬದ್ಧತೆಗಳು",
    financesBreakdown: "ಹಣಕಾಸು ವಿಭಜನೆ",
    allocationMapping: "ಆದಾಯ ಬದ್ಧತೆಗಳ ಹಂಚಿಕೆ ಮ್ಯಾಪಿಂಗ್",
    activePortfolio: "ಸಕ್ರಿಯ ಸಾಲಗಳು",
    portfolioDesc: "ಸಕ್ರಿಯ ಸಾಲದ ಸ್ಟ್ರೀಮ್‌ಗಳ ಸಮಗ್ರ ಲೆಕ್ಕಪರಿಶೋಧನೆ",
    manageLoans: "ಸಾಲಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
    loanDetails: "ಸಾಲದ ವಿವರಗಳು",
    amount: "ಮೊತ್ತ",
    rate: "ಬಡ್ಡಿ ದರ",
    status: "ಸ್ಥಿತಿ",
    financialHealth: "ಹಣಕಾಸು ಆರೋಗ್ಯ",
    healthStatusExcellent: "ಅತ್ಯುತ್ತಮ ಸ್ಥಿತಿ",
    healthStatusModerate: "ಮಧ್ಯಮ ಆರೋಗ್ಯ",
    healthStatusRisk: "ಅಪಾಯದ ಪ್ರೊಫೈಲ್ ಪತ್ತೆಯಾಗಿದೆ",
    healthDesc: "ನಿಮ್ಮ ಉಳಿತಾಯದ ವ್ಯಾಪ್ತಿಯು ಸಕ್ರಿಯ ಇಎಂಐಗಳ ವಿರುದ್ಧ ದೃಢವಾಗಿದೆ.",
    trajectory: "ಸಾಲದ ಒತ್ತಡದ ಪಥ",
    retryConnection: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    reauthenticate: "ಮತ್ತೆ ಲಾಗ್ ಇನ್ ಮಾಡಿ",
    failedSync: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಸಿಂಕ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ",

    // Goals
    goalsTitle: "ಭಾವನಾತ್ಮಕ ಹಣದ ಟೈಮ್‌ಲೈನ್",
    goalsDesc: "ಉಳಿತಾಯ ಗುರಿಗಳನ್ನು ವ್ಯಾಖ್ಯಾನಿಸಿ ಮತ್ತು ಹೊಂದಿಕೊಳ್ಳುವ ವೆಚ್ಚಗಳ ವಿರುದ್ಧ ಖರೀದಿ ದಿನಾಂಕಗಳನ್ನು ಸಿಮ್ಯುಲೇಟ್ ಮಾಡಿ.",
    createGoal: "ಗುರಿಯನ್ನು ರಚಿಸಿ",
    goalIdentifier: "ಗುರಿಯ ಹೆಸರು",
    targetCost: "ಗುರಿಯ ವೆಚ್ಚ ($)",
    monthlyContribution: "ಮಾಸಿಕ ಕೊಡುಗೆ",
    addTargetGoal: "ಗುರಿಯನ್ನು ಸೇರಿಸಿ",
    forecastOnline: "ಟೈಮ್‌ಲೈನ್ ಮುನ್ಸೂಚನೆ",

    // Fraud
    fraudTitle: "ಎಐ ವಹಿವಾಟು ಕಾವಲುಗಾರ",
    fraudDesc: "ವಹಿವಾಟು ಇತ್ಯರ್ಥಪಡಿಸುವ ಮೊದಲು ಹೆಚ್ಚಿನ ಅಪಾಯದ ಪಾವತಿಗಳನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ.",
    analyzePayment: "ಪಾವತಿ ಮಾನದಂಡಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
    settlementAmount: "ಪಾವತಿ ಮೊತ್ತ ($)",
    category: "ವರ್ಗ",
    merchant: "ಸ್ವೀಕರಿಸುವ ವ್ಯಾಪಾರಿ",
    merchantLoc: "ವ್ಯಾಪಾರಿಯ ಸ್ಥಳ",
    analyzeSettlement: "ಪಾವತಿ ವಿಶ್ಲೇಷಿಸಿ",
    neuralEngine: "ಎಐ ಎಂಜಿನ್ ಸಕ್ರಿಯವಾಗಿದೆ",

    // Family Finance
    familyTitle: "ಕುಟುಂಬ ಹಣಕಾಸು ಪರಿಸರ ವ್ಯವಸ್ಥೆ",
    familyDesc: "ಹಂಚಿಕೊಂಡ ವಾಲೆಟ್‌ಗಳು, ಕೌಟುಂಬಿಕ ಮಿತಿಗಳು, ಹಿರಿಯರ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಗುಂಪು ಉಳಿತಾಯ ಯೋಜನೆಗಳನ್ನು ಸಂಘಟಿಸಲು ಖಾತೆಗಳನ್ನು ಲಿಂಕ್ ಮಾಡಿ.",
    groupManagement: "ಗುಂಪು ನಿರ್ವಹಣೆ",
    establishGroup: "ಗುಂಪನ್ನು ಸ್ಥಾಪಿಸಿ",
    establishGroupDesc: "ಸುರಕ್ಷಿತ ಹಂಚಿಕೆಯ ಹಣಕಾಸು ಕಾರ್ಯಕ್ಷೇತ್ರವನ್ನು ಪ್ರಾರಂಭಿಸಿ ಮತ್ತು ತಕ್ಷಣವೇ ಆಮಂತ್ರಣ ಲಿಂಕ್‌ಗಳನ್ನು ನೀಡಿ.",
    createNewEcosystem: "ಹೊಸ ಪರಿಸರ ವ್ಯವಸ್ಥೆಯನ್ನು ರಚಿಸಿ",
    ecosystemConnectionId: "ಪರಿಸರ ವ್ಯವಸ್ಥೆಯ ಸಂಪರ್ಕ ಐಡಿ",
    provideConnectionIdDesc: "ಹಂಚಿಕೆಯ ವಾಲೆಟ್ ಸೂಚ್ಯಂಕಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಸಕ್ರಿಯ ಕುಟುಂಬ ಟೋಕನ್ ಐಡಿಯನ್ನು ಒದಗಿಸಿ.",
    synchronizeGroup: "ಗುಂಪನ್ನು ಸಿಂಕ್ರೊನೈಸ್ ಮಾಡಿ",
    synching: "ಸಿಂಕ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    inviteCode: "ಆಮಂತ್ರಣ ಕೋಡ್: ",
    shareCodeWithFamily: "ಕುಟುಂಬದೊಂದಿಗೆ ಕೋಡ್ ಹಂಚಿಕೊಳ್ಳಿ",
    sharedBalance: "ಹಂಚಿಕೆಯ ಬಾಕಿ",
    topUp: "+ ಟಾಪ್ ಅಪ್",
    amountVal: "ಮೊತ್ತ ($)",
    primaryPool: "ಪ್ರಾಥಮಿಕ ಪೂಲ್",
    activeWallet: "ಸಕ್ರಿಯ ವಾಲೆಟ್",
    ecosystemMembers: "ಪರಿಸರ ವ್ಯವಸ್ಥೆಯ ಸದಸ್ಯರು",
    connected: "ಸಂಪರ್ಕಿತ",
    recentTransactions: "ಇತ್ತೀಚಿನ ಕುಟುಂಬ ಪೂಲ್ ವಹಿವಾಟುಗಳು",
    liveLedger: "ಲೈವ್ ಲೆಡ್ಜರ್",
    member: "ಸದಸ್ಯರು",
    reason: "ಕಾರಣ",
    date: "ದಿನಾಂಕ",
    noTransactions: "ಇನ್ನೂ ಯಾವುದೇ ವಹಿವಾಟುಗಳು ದಾಖಲಾಗಿಲ್ಲ.",
    addMember: "ಕುಟುಂಬದ ಸದಸ್ಯರನ್ನು ಸೇರಿಸಿ",
    inviteMemberDesc: "ಮಿತಿಗಳು ಮತ್ತು ಹಿರಿಯರ ವೆಚ್ಚಗಳನ್ನು ಸಂಘಟಿಸಲು ಅವರ ಇಮೇಲ್ ಬಳಸಿ ಸದಸ್ಯರನ್ನು ಆಹ್ವಾನಿಸಿ.",
    emailAddress: "ಇಮೇಲ್ ವಿಳಾಸ",
    nickname: "ಅಡ್ಡಹೆಸರು",
    role: "ಪಾತ್ರ",
    monthlyLimit: "ಮಾಸಿಕ ಮಿತಿ ($)",
    parent: "ಪೋಷಕರು",
    child: "ಮಗು",
    elder: "ಹಿರಿಯರು",
    sendingInvite: "ಆಹ್ವಾನಿಸಲಾಗುತ್ತಿದೆ...",
    inviteSuccess: "ಕುಟುಂಬದ ಸದಸ್ಯರನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ!",

    // Emergency Fund
    fundTitle: "ತುರ್ತು ಹಂಚಿಕೆ ವಾಲೆಟ್ ಮತ್ತು ನಿಧಿ",
    fundDesc: "ನಿಮ್ಮ ಪ್ರಮುಖ ಹಣವನ್ನು ಕಾಯ್ದಿರಿಸಿ. ರನ್‌ವೇ ಅಂದಾಜನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ಸಾಲದ ಒತ್ತಡವನ್ನು ತಪ್ಪಿಸಲು ಮಾಸಿಕ ಕೊಡುಗೆ ನೀಡಿ.",
    fundBalance: "ನಿಧಿ ಬಾಕಿ",
    monthsOfRunway: "ರನ್‌ವೇಯ ತಿಂಗಳುಗಳು",
    runwayDesc: "ಪ್ರಸ್ತುತ ಬಾಕಿ ಮತ್ತು ವೆಚ್ಚಗಳ ಆಧಾರದ ಮೇಲೆ ಉಳಿಯುವ ಅಂದಾಜು ತಿಂಗಳುಗಳು.",
    fundGoal: "ನಿಧಿಯ ಗುರಿ",
    monthlyContributionGraph: "ಮಾಸಿಕ ಕೊಡುಗೆಯ ಪ್ರಗತಿ",
    contribute: "ನಿಧಿಗೆ ಕೊಡುಗೆ ನೀಡಿ",
    withdraw: "ತುರ್ತು ಹಿಂಪಡೆಯುವಿಕೆ",

    // Simulation
    simTitle: "ವಡ್ಡಿ ದರ ಸಿಮ್ಯುಲೇಟರ್",
    simDesc: "ಅಸಲು ಬದಲಾವಣೆಗಳು, ಬಡ್ಡಿ ಬದಲಾವಣೆಗಳು ಅಥವಾ ಅವಧಿಗೆ ಮುನ್ನ ಪಾವತಿಗಳಂತಹ ರಚನಾತ್ಮಕ ಹೊಂದಾಣಿಕೆಗಳನ್ನು ಸಿಮ್ಯುಲೇಟ್ ಮಾಡಿ.",
    loanDetailsForm: "ಸಾಲದ ನಿಯತಾಂಕಗಳು",
    simulateButton: "ಸಿಮ್ಯುಲೇಶನ್ ರನ್ ಮಾಡಿ",
    simResults: "ಸಿಮ್ಯುಲೇಶನ್ ಒಳನೋಟಗಳು ಮತ್ತು ಮೆಟ್ರಿಕ್ಸ್",

    // Stress Analysis
    stressTitle: "ಸಾಲದ ಒತ್ತಡ ಮತ್ತು ದುರ್ಬಲತೆಯ ತಪಾಸಣೆ",
    stressDesc: "ವಿವಿಧ ಆರ್ಥಿಕ ಆಘಾತಗಳ ಅಡಿಯಲ್ಲಿ ನಿಮ್ಮ ನಗದು ಹರಿವು ಎಷ್ಟು ದುರ್ಬಲವಾಗಿದೆ ಎಂಬುದನ್ನು ವಿಶ್ಲೇಷಿಸಿ.",
    runStressCheck: "ದುರ್ಬಲತೆಯ ಸ್ಕ್ಯಾನ್ ರನ್ ಮಾಡಿ",

    // Voice Tracker
    voiceTitle: "ಧ್ವನಿ ಸಾಲದ ಸಹಾಯಕ",
    voiceDesc: "ನೈಸರ್ಗಿಕ ಧ್ವನಿ ವಾಕ್ಯಗಳೊಂದಿಗೆ ನಿಮ್ಮ ಸಾಲದ ವ್ಯವಸ್ಥಾಪಕರಿಗೆ ಆದೇಶಿಸಿ. ನೈಜ-ಸಮಯದ ಎನ್‌ಎಲ್‌ಪಿ ಪಾರ್ಸಿಂಗ್ ಕಾರ್ಯಗತಗೊಳಿಸಬಹುದಾದ ಈವೆಂಟ್‌ಗಳನ್ನು ಹೊರತೆಗೆಯುತ್ತದೆ.",
    speakCommand: "ಆದೇಶವನ್ನು ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
    listening: "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ...",

    // General UI
    save: "ಉಳಿಸಿ",
    cancel: "ರದ್ದುಮಾಡಿ",
    loadingVal: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    backToDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
    inviteCodeRequired: "ಸಿಂಕ್ ಮಾಡಲು ಗ್ರೂಪ್ ಐಡಿ ಅಗತ್ಯವಿದೆ",

    // Loans
    manageLoansLocally: "ನಿಮ್ಮ ಸಾಲಗಳನ್ನು ಸ್ಥಳೀಯವಾಗಿ ನಿರ್ವಹಿಸಿ. ಸಿಮ್ಯುಲೇಶನ್ ಬ್ಯಾಕೆಂಡ್ ಅನ್ನು ಬಳಸುತ್ತದೆ.",
    addNewLoan: "ಹೊಸ ಸಾಲವನ್ನು ಸೇರಿಸಿ",
    loanType: "ಸಾಲದ ಪ್ರಕಾರ",
    loanTypePlaceholder: "ಉದಾಹರಣೆಗೆ, ಗೃಹ ಸಾಲ",
    amountPlaceholder: "150000",
    interestPlaceholder: "3.5",
    durationPlaceholder: "240",
    adding: "ಸೇರಿಸಲಾಗುತ್ತಿದೆ...",
    addLoanButton: "ಸಾಲ ಸೇರಿಸಿ",
    yourLoans: "ನಿಮ್ಮ ಸಾಲಗಳು",
    noLoans: "ಇನ್ನೂ ಯಾವುದೇ ಸಾಲಗಳನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ.",
    amountLabel: "ಮೊತ್ತ",
    interestLabel: "ಬಡ್ಡಿ",
    durationLabel: "ಅವಧಿ",
    statusLabel: "ಸ್ಥಿತಿ",

    // Simulation
    simSandbox: "ಸಂವಾದಾತ್ಮಕ ಸ್ಯಾಂಡ್‌ಬಾಕ್ಸ್",
    simMainTitle: "ಹಣಕಾಸು ಸನ್ನಿವೇಶ ಸಿಮ್ಯುಲೇಟರ್",
    simDescExtended: "ಮೊತ್ತದ ಮುಂಗಡ ಪಾವತಿ, ಇಎಂಐ ಹೊಂದಾಣಿಕೆಗಳು ಮತ್ತು ಬಡ್ಡಿ ಉಳಿತಾಯವನ್ನು ಅನ್ಲಾಕ್ ಮಾಡಲು ಸಿಮ್ಯುಲೇಟ್ ಮಾಡಿ.",
    scenarioParams: "ಸನ್ನಿವೇಶ ನಿಯತಾಂಕಗಳು",
    scenarioDesc: "ಪಾವತಿ ವೇಳಾಪಟ್ಟಿಗಳನ್ನು ಪರೀಕ್ಷಿಸಲು ಇನ್‌ಪುಟ್‌ಗಳನ್ನು ಹೊಂದಿಸಿ ಅಥವಾ ನಿಖರ ಸ್ಲೈಡರ್‌ಗಳನ್ನು ಬಳಸಿ.",
    loanPrincipal: "ಸಾಲದ ಅಸಲು ಮೊತ್ತ ($)",
    tenureHorizon: "ಅವಧಿ ಹಾರಿಜಾನ್ (ತಿಂಗಳುಗಳು)",
    tenure1Year: "೧ ವರ್ಷ (೧೨ತಿಂಗಳು)",
    tenure15Years: "೧೫ ವರ್ಷಗಳು (೧೮೦ತಿಂಗಳು)",
    tenure30Years: "೩೦ ವರ್ಷಗಳು (೩೬೦ತಿಂಗಳು)",
    payoffBoosters: "ಒಂದು ವೇಳೆ ಹೆಚ್ಚುವರಿ ಪಾವತಿ ಮಾಡಿದರೆ",
    extraMonthlyPayoff: "ಹೆಚ್ಚುವರಿ ಮಾಸಿಕ ಪಾವತಿ ($)",
    oneTimePrepayment: "ಒಂದು ಬಾರಿಯ ಮುಂಗಡ ಪಾವತಿ ($)",
    simCompounding: "ಮರುಪಾವತಿ ಉಳಿತಾಯವನ್ನು ಸಿಮ್ಯುಲೇಟ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    runSandbox: "ಸಿಮ್ಯುಲೇಶನ್ ರನ್ ಮಾಡಿ",
    calcException: "Calculation Exception",
    waitingScenario: "ಮರುಪಾವತಿ ಸನ್ನಿವೇಶಕ್ಕಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ",
    waitingScenarioDesc: "ನಿಮ್ಮ ಸಿಮ್ಯುಲೇಶನ್ ಮೆಟ್ರಿಕ್ಸ್ ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು 'ಸಿಮ್ಯುಲೇಶನ್ ರನ್ ಮಾಡಿ' ಕ್ಲಿಕ್ ಮಾಡಿ.",
    interestSavings: "ಬಡ್ಡಿ ಉಳಿತಾಯ",
    interestSavingsDesc: "ಮುಂಚಿತವಾಗಿ ಮರುಪಾವತಿ ಮಾಡುವುದರಿಂದ ಬಡ್ಡಿ ಹೇಗೆ ಕಡಿಮೆಯಾಗುತ್ತದೆ ಎಂಬುದನ್ನು ನೋಡಿ.",
    timelineShortening: "ಅವಧಿ ಕಡಿತ",
    timelineShorteningDesc: "ಮಾಸಿಕ ಬಫರ್‌ಗಳನ್ನು ರೂಪಿಸಿ ಮತ್ತು ಸಾಲಮುಕ್ತ ದಿನಾಂಕವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
    compoundingBenefit: "ಸಂಯುಕ್ತ ಬಡ್ಡಿಯ ಪ್ರಯೋಜನ",
    repaymentSummary: "ಮರುಪಾವತಿ ಸಾರಾಂಶ",
    highOptimization: "ಹೆಚ್ಚಿನ ಆಪ್ಟಿಮೈಸೇಶನ್",
    projectedInterestSaved: "Projected Interest Saved",
    interestSavedDesc: "ಇದು ಬಡ್ಡಿ ಶುಲ್ಕಗಳಿಗೆ ಹೋಗುವ ಬದಲಿಗೆ ನಿಮ್ಮ ವಾಲೆಟ್‌ನಲ್ಲಿ ಉಳಿಯುವ ಒಟ್ಟು ಹಣವಾಗಿದೆ.",
    newMonthlyEmi: "ಹೊಸ ಮಾಸಿಕ ಇಎಂಐ",
    remainingHorizon: "ಉಳಿದಿರುವ ಮರುಪಾವತಿ ಅವಧಿ",
    optimizedDate: "Optimized Debt-Free Date",
    payoffComparison: "ಮರುಪಾವತಿ ಅವಧಿಯ ಹೋಲಿಕೆ",
    originalHorizon: "Original Horizon",
    optimizedHorizon: "Optimized Horizon",
    quicker: "ವೇಗವಾಗಿ!",
    aiScenarioCounsel: "ಎಐ ಸನ್ನಿವೇಶ ಸಲಹೆ",
    synthesizingData: "ಡೇಟಾ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    retriggerAI: "ಎಐ ವಿಶ್ಲೇಷಣೆಯನ್ನು ಮರು-ಪ್ರಚೋದಿಸಿ",

    // Stress Analysis
    coreRiskDiagnostic: "Core Risk Diagnostic",
    debtStressAnalysisTitle: "ಸಾಲದ ಒತ್ತಡದ ವಿಶ್ಲೇಷಣೆ",
    debtStressDescExtended: "ನಿಮ್ಮ ಮಾಸಿಕ ಸಾಲದ ಬದ್ಧತೆಗಳು ನಿಮ್ಮ ನಗದು ಹರಿವಿನ ಮೇಲೆ ಎಷ್ಟು ಒತ್ತಡ ಹೇರುತ್ತವೆ ಎಂಬುದನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.",
    incomeMinusExpenses: "Income minus fixed expenses",
    activeLoanPayments: "ಎಲ್ಲಾ ಸಕ್ರಿಯ ಸಾಲ ಪಾವತಿಗಳ ಮೊತ್ತ",
    disposableCashflow: "Disposable Cashflow",
    totalMonthlyEmi: "ಒಟ್ಟು ಮಾಸಿಕ ಇಎಂಐ",
    combinedStressScore: "Combined Stress Score",
    debtToDisposableRatio: "Debt-to-disposable ratio",
    historicalTrend: "Historical Risk Amortization Trend",
    timelineTrackStress: "Timeline track of your debt stress score index.",
    stressContribution: "Stress Contribution by Individual Loan",
    isolatedImpactScore: "Isolated impact score of each active loan item on your cashflow.",
    activeObligation: "Active Obligation",
    stressRatio: "ಒತ್ತಡದ ಅನುಪಾತ",
    noLoansDetected: "ಯಾವುದೇ ಸಾಲಗಳು ಪತ್ತೆಯಾಗಿಲ್ಲ",
    noLoansDetectedDesc: "Add amortized loan liabilities on the Loan Ledger page to review stress audits.",
    primaryStressDriver: "Primary Stress Driver",
    contributesLargest: "contributes the single largest cashflow pressure point",
    ratioText: "individual ratio.",
    debtDisposableRatioText: "Debt-to-Disposable Cashflow Ratio:",
    consumeDisposable: "Your amortized EMIs consume",
    safeCashflowRunway: "Safe Cashflow Runway:",
    preserveMonthlyNet: "You preserve a monthly net cash balance of",
    discretionarySavings: "for savings and discretionary activities.",
    cashflowAlert: "Cashflow Alert",
    stressExceedsWarning: "ನಿಮ್ಮ ಸಾಲದ ಒತ್ತಡದ ಅನುಪಾತವು ಶಿಫಾರಸು ಮಾಡಲಾದ 35% ಮಿತಿಯನ್ನು ಮೀರಿದೆ. ಮರುಪಾವತಿ ಅಥವಾ ಮರುಹಣಕಾಸು ಮಾಡಲು ಸೂಚಿಸಲಾಗುತ್ತದೆ.",

    // Fraud
    aiTransactionGuard: "AI Transaction Guard",
    fraudDescExtended: "Evaluate and audit high-risk merchant payments before confirming settlements.",
    neuralEngineActive: "Neural Engine Active",
    analyzePaymentCriteria: "Analyze Payment Criteria",
    auditPaymentRisk: "Audit Payment Risk",
    runningNeuralAudit: "Running Neural Audit...",
    threatScoreAssessment: "Threat score assessment",
    riskMetric: "Risk Metric",
    decisionMatrix: "Decision Matrix",
    safeApproved: "Safe Approved",
    riskWarning: "Risk Warning",
    reasonIdentified: "Reason identified:",
    aiGuardAnalysis: "ಎಐ ಗಾರ್ಡ್ ವಿಶ್ಲೇಷಣೆ",
    consultingExplanationModel: "Consulting AI explanation model...",

    // Goals
    emotionalMoneyTimeline: "Emotional Money Timeline",
    goalsDescExtended: "Define savings goals and simulate purchase dates against unpruned flexible expenditures.",
    forecastTimelinesOnline: "Forecast Timelines Online",
    createTargetGoal: "Create Target Goal",
    aiMilestonesForecast: "ಎಐ ಮೈಲ್ಸ್ಟೋನ್ ಮುನ್ಸೂಚನೆಗಳು",
    runningTimelinePredictions: "Running timeline predictions...",
    defineFirstPurchaseGoal: "Define your first purchase goal above to calculate auto timeline predictions.",
    completedText: " Completed",
    blockerText: "Blocker: ",
    savedText: " Saved",
    targetText: " Target",

    // Voice Tracker
    voiceExpenseTracker: "Voice Expense Tracker",
    voiceDescExtended: "Dictate transactions dynamically using advanced NLP to categorize and file expenses instantly.",
    nlpParserActive: "NLP Parser Active",
    decodingAcousticMetrics: "Decoding acoustic metrics, extracting vectors...",
    recordedSpeech: "Recorded Speech",
    aiExtractedDetails: "AI Extracted Details",
    confirmAndLogEntry: "Confirm and Log Entry",
    recordedHistory: "Recorded History",
    parsedLogs: "Parsed logs",

    // Emergency Fund
    emergencyFundBuilder: "Emergency Fund Builder",
    fundDescExtended: "Deploy micro-savings mechanisms to accumulate automated emergency liquidity quietly.",
    smartRoundUpsEnabled: "Smart Round-Ups Enabled",
    currentBalance: "Current Balance",
    totalAccumulation: "Total Accumulation",
    fundTarget: "Fund Target:",
    savedPercentage: "Saved",
    progressText: "Progress",
    autoSavingHistory: "Auto-Saving History",
    aiMicroSavingIntensity: "AI Micro-Saving Intensity",
    calibrateMicroSavings: "Dynamically calibrate how aggressive the round-up algorithm rounding checks are.",
    supportRunway: "Support Runway",
    runwayAnalysisDesc: "Runway analysis based on your standard baseline expense profile.",
    runwayStable: "Runway Stable",
    aiAdvisorySuggestions: "ಎಐ ಸಲಹೆ ಸೂಚನೆಗಳು",
    formulatingSavingsDirectives: "Formulating micro-savings directives..."
  }
};

// Hindi UI strings (extends English fallbacks via t())
const hi = {
  ...translations.en,
  hello: 'नमस्ते',
  dashboardDesc: 'यहाँ आपके वित्तीय स्वास्थ्य और ऋण जोखिम का विश्लेषण है।',
  aiInsights: 'AI सुझाव',
  financialHealth: 'वित्तीय स्वास्थ्य',
  configureFinancials: 'वित्तीय जानकारी सेट करें',
  save: 'सहेजें',
  cancel: 'रद्द करें',
};

const allTranslations = { ...translations, hi };

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('language') || 'en';
    return allTranslations[saved] ? saved : 'en';
  });

  const setLanguage = (lang) => {
    if (!allTranslations[lang]) return;
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    const handler = (e) => {
      if (e?.detail && allTranslations[e.detail]) {
        setLanguageState(e.detail);
      }
    };
    window.addEventListener('language-change', handler);
    return () => window.removeEventListener('language-change', handler);
  }, []);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'kn' : 'en'));
  };

  const t = (key) => {
    return allTranslations[language]?.[key] || allTranslations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
