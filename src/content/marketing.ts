export const navigation = [
  { label: "Why Relay", href: "/#why-us", brandLabel: true },
  { label: "How it works", href: "/#how-it-works" },
  { label: "About us", href: "/about" },
  { label: "FAQs", href: "/#faqs" },
  { label: "Contact", href: "/contact" },
] as const;

export const problems = [
  {
    number: "01",
    title: "The customer is waiting. The details are somewhere else.",
    text: "A name in a spreadsheet. A package in a notebook. A dealer on WhatsApp. Sound familiar?",
    resolution: "One customer. One complete picture.",
    icon: "users",
  },
  {
    number: "02",
    title: "Your network grew. Your process didn’t.",
    text: "More areas, more packages, more people to coordinate. The work shouldn’t multiply with every connection.",
    resolution: "Keep every moving part connected.",
    icon: "network",
  },
  {
    number: "03",
    title: "Your team needs answers, not another handoff.",
    text: "When only one person knows the whole story, everyone else has to wait. Including your customers.",
    resolution: "Give the right people the right access.",
    icon: "shield",
  },
] as const;

export const steps = [
  {
    number: "01",
    title: "Make room for your network.",
    description:
      "Start with your organization, service areas, and internet packages. Build a workspace that reflects the way you already work.",
    tag: "Your business, mapped out",
  },
  {
    number: "02",
    title: "Bring the customer story together.",
    description:
      "Connect each customer to their package, area, dealer, and connection details. Stop piecing the picture together across different places.",
    tag: "Every detail has a home",
  },
  {
    number: "03",
    title: "Give your people a shared view.",
    description:
      "Invite your team and assign their roles. Everyone gets the access they need to keep customer information useful and up to date.",
    tag: "Clarity for the whole team",
  },
  {
    number: "04",
    title: "Get back to the people you connect.",
    description:
      "Find a record, understand a connection, and give a better answer. Less searching around. More time for your customers.",
    tag: "Better relationships, every day",
  },
] as const;

export const faqs = [
  {
    question: "Who is this built for?",
    answer:
      "Internet service providers who want a clearer way to organize customers, packages, service areas, dealers, and team access. Whether you run one network or manage multiple organizations, the workspace keeps each organization’s records separate.",
  },
  {
    question: "What can I keep in a customer record?",
    answer:
      "Contact information, service area, package, dealer, connection identifiers, status, monthly price, and balance information. Customer identity documents are supported through protected document access.",
  },
  {
    question: "Can different team members have different access?",
    answer:
      "Yes. Access is based on roles and permissions within each organization. A person can belong to multiple organizations and have a different role in each one.",
  },
  {
    question: "Can you help us understand the setup?",
    answer:
      "Absolutely. Tell us how you currently manage your customers, and we’ll walk through how your areas, packages, dealers, and team fit together. Use the contact form to arrange a conversation.",
  },
  {
    question: "Can I find customers by their area or package?",
    answer:
      "Yes. Search your customer records and narrow them down by service area, package, dealer, or status. Your team can get to the right information without sorting through everything else.",
  },
  {
    question: "How do I get pricing or see a demo?",
    answer:
      "Get in touch with your team size and a little about your network. We’ll discuss your requirements, talk through the options, and walk you through the product.",
  },
] as const;
