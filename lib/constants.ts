export const PLANS = {
  free: {
    label: "Free",
    credits: 7,
    price: 0,
  },
  starter: {
    label: "Basic",
    credits: 35,
    price: 7,
  },
  pro: {
    label: "Pro",
    credits: 150,
    price: 69,
  },
} as const;

export const CREDIT_COST_PER_GENERATION = 1;

export const MIN_CREDITS_TO_GENERATE = 1;

export const PRICING_PLANS = [
  {
    key: "free",
    label: "Free",
    description: "Start building. No credit card required.",
    price: 0,
    featured: false,
    planId: null,
    active: true,
    features: ["10 generations / month", "Live preview", "Export to zip"],
  },
  {
    key: "starter",
    label: "Starter",
    description: "For users who want to support us.",
    price: 9,
    featured: true,
    planId: "cplan_3DvxGsOeYA5bpJzGWPi8o7wScRD",
    active: false,
    features: [
      "50 generations / month",
      "Image uploads",
      "Live preview",
      "Export to zip",
    ],
  },
  {
    key: "pro",
    label: "Pro",
    description: "For Slop builders and Vibe coders.",
    price: 69,
    featured: false,
    planId: "cplan_3DvxTfywwB0NyQ1iqANclgNqlq8",
    active: false,
    features: [
      "150 generations / month",
      "Priority AI (faster response)",
      "Live preview",
      "Export to zip",
      "Image uploads",
      "Access to AI on code editor window",
    ],
  },
] as const;