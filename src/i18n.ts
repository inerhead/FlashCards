const en = {
  // General
  appTitle: "English Flash Cards",
  loading: "Loading…",
  serverError: "Server error",

  // Auth
  authSubtitleLogin: "Sign in to continue",
  authSubtitleRegister: "Create your account to get started",
  emailPlaceholder: "Email",
  displayNamePlaceholder: "Display name",
  passwordPlaceholder: "Password",
  confirmPasswordPlaceholder: "Confirm password",
  passwordsMatch: "✓ Passwords match",
  passwordsMismatch: "✗ Passwords do not match",
  submitLoading: "Loading…",
  submitRegister: "Sign Up",
  submitLogin: "Sign In",
  alreadyHaveAccount: "Already have an account? ",
  noAccount: "Don't have an account? ",
  switchToLogin: "Sign in",
  switchToRegister: "Sign up",
  unexpectedError: "Unexpected error",

  // Level Select
  selectLevel: "Select a level to begin",
  logout: "Log out",
  loadingLevels: "Loading levels...",
  wordsLabel: "words",

  // FlashCard
  tapToSeeDetails: "Tap to see details →",
  translationLabel: "Translation",
  conjugationLabel: "Conjugation",
  examplesLabel: "Examples",
  knownSince: "Known since:",
  tapToGoBack: "Tap to go back ←",

  // Progress Bar
  knownLabel: "Known",
  learningLabel: "Learning",
  pendingLabel: "Pending",
  resetConfirm: "Reset all?",
  resetYes: "Yes",
  resetNo: "No",
  resetProgress: "↩️ Reset progress",
  completed: "completed",

  // Controls
  markLearning: "🔄 Learning",
  markKnown: "✅ Known",
  returnToPending: "↩️ Return to Pending",

  // Review Banner
  reviewBanner: (count: number) =>
    `🔄 Review Mode — Only cards marked as "Learning" (${count})`,

  // Audio
  pronounceTitle: (text: string) => `Pronounce: ${text}`,

  // Leaderboard
  leaderboardTitle: "🏆 Top Students",
  totalStudents: "students registered",

  // App (FlashCards view)
  loadingLevel: (name: string) => `Loading ${name}…`,
  headerWords: "words",
  btnLevels: "📚 Levels",
  btnViewAll: "📋 View All",
  btnLogout: "🚪 Log out",
  btnLevelsTitle: "Change level",
  btnViewAllTitle: "View all cards",
  btnLogoutTitle: "Log out",
  btnReview: "🔄 Review",
  btnReviewing: "🔄 Reviewing",
  btnReviewTitle: "Review cards marked as Learning",
  btnQuiz: (count: number) => `📝 Quiz (${count})`,
  btnQuizTitle: "Quiz on known cards (oldest first)",
  btnShuffleTitle: "Shuffle cards",
  quizBannerTitle: "📝 Known Cards Quiz — oldest first",
  quizQuantityLabel: "Quantity:",
  emptyReviewTitle: "No cards to review!",
  emptyQuizTitle: "No cards for the quiz!",
  emptyDefaultTitle: "No cards",
  emptyReviewText:
    'Mark some cards as "Learning" and come back here to review them.',
  emptyQuizText: 'Mark cards as "Known" to take a quiz.',
  emptyDefaultText: "No cards found with this filter.",
  backToAll: "← Back to all",
  flipHint: "Click the card to flip it",
} as const;

export type I18n = typeof en;
export default en;
