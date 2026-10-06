import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { requirePageSession } from "@/lib/auth/session";

export const metadata = { title: "Getting started" };

// Figures checked Oct 5, 2026 against the IRS and Schwab pages in SOURCES. They change every year:
// update FACTS_AS_OF and the numbers together.
const FACTS_AS_OF = "Oct 5, 2026";

type Step = { title: string; body: string; points?: readonly string[] };

const STEPS: readonly Step[] = [
  {
    title: "Check that you can put money in a Roth IRA",
    body: "A Roth takes money you have already paid tax on. Growth and qualified withdrawals are tax-free after that. The IRS sets who can contribute and how much.",
    points: [
      "You need earned income (wages or self-employment), at least as much as you put in.",
      "The 2026 limit is $7,500 across all your IRAs, or $8,600 if you are 50 or older.",
      "Your income (modified AGI) must be under the limit. The amount you can put in shrinks between $153,000 and $168,000 for single filers, and between $242,000 and $252,000 for married couples filing jointly.",
      "Money for 2026 can go in until the tax-filing deadline in April 2027.",
      "Putting in too much costs a 6% tax every year until the extra is taken out. Keep track if you have more than one IRA.",
    ],
  },
  {
    title: "Gather what Schwab asks for",
    body: "Have these ready before you start:",
    points: [
      "Social Security number",
      "Driver’s license or other government ID",
      "Employer’s name and address",
      "The bank account you will fund it from",
      "Who should inherit the account (beneficiaries)",
    ],
  },
  {
    title: "Open the Roth IRA",
    body: "On schwab.com, choose to open a Roth IRA. There is no minimum deposit.",
    points: [
      "Answer every question truthfully, including income, net worth and experience. Brokers are required to collect this to decide what you may trade. Inflating it to get approved faster is a false statement on a financial application.",
      "Name your beneficiaries now. They decide who receives the account, whatever a will says.",
    ],
  },
  {
    title: "Put money in",
    body: "Link your bank with Schwab MoneyLink, or send a wire or a check. Wait until the deposit has settled before trading with it.",
    points: [
      "Moving an existing IRA? Ask Schwab for a direct transfer, trustee to trustee. It does not count toward the yearly limit. It also avoids the 60-day deadline and the once-a-year limit on rollovers you handle yourself.",
      "The wheel needs enough cash to buy 100 shares at the strike. A $15 strike needs $1,500 per contract. Until there is enough, the DRIP tab shows what smaller amounts can do.",
    ],
  },
  {
    title: "Read the options risk document",
    body: "Before approving options, your broker must give you “Characteristics and Risks of Standardized Options”, the Options Disclosure Document (FINRA Rule 2360). It explains how options work and how they lose money. Read it before applying. The application asks you to confirm you have.",
  },
  {
    title: "Apply for options trading on the IRA",
    body: "In your Schwab account, go to Profile, then Margin & Options. Choose the Roth IRA and apply for the level you need.",
    points: [
      "Level 0 covers covered calls.",
      "Level 1 adds cash-secured equity puts. The wheel uses both, so Level 1 is the one it needs.",
      "Higher levels allow uncovered (naked) options and are not available in an IRA.",
      "Leave margin off. An IRA cannot borrow money.",
      "Schwab emails a decision, usually within three business days. If you are turned down, you can ask why, build experience, and apply again later. Never change your answers just to pass.",
    ],
  },
  {
    title: "Practice before risking money (optional)",
    body: "Schwab’s thinkorswim platform has paperMoney, a practice account with pretend money. Selling a few puts there shows how assignment, expiry and cash requirements feel before any real money is at stake.",
  },
];

const IRA_RULES = [
  {
    title: "Every put is fully backed by cash",
    body: "Strike × 100 in cash, set aside for each contract until it closes. Nothing is borrowed.",
  },
  {
    title: "Trade only with settled cash",
    body: "Buying with money from a sale that has not settled yet, then selling before it does, is a good-faith violation (Federal Reserve Regulation T). Repeated violations can restrict the account to settled cash for 90 days.",
  },
  {
    title: "No prohibited transactions",
    body: "No borrowing from the IRA, no using it as collateral for a loan, and no buying from or selling to yourself or close family (Internal Revenue Code §4975). Breaking this can end the account’s Roth status. It is then taxed as if you had withdrawn everything.",
  },
  {
    title: "Watch wash sales across accounts",
    body: "Selling a stock at a loss in a taxable account, then buying it back in the IRA within 30 days, loses that tax loss for good (IRS Revenue Ruling 2008-5).",
  },
  {
    title: "Know the withdrawal rules",
    body: "What you put in can come out at any time, tax- and penalty-free. Earnings come out tax-free once you are 59½ and five tax years have passed since your first Roth contribution. Earlier, they can owe tax plus a 10% penalty.",
  },
] as const;

const SOURCES = [
  { label: "IRS: 2026 IRA limits and Roth income ranges", href: "https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500" },
  { label: "IRS: Retirement topics, IRA contribution limits", href: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits" },
  { label: "IRS: Retirement topics, prohibited transactions", href: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-prohibited-transactions" },
  { label: "Schwab: Roth IRA", href: "https://www.schwab.com/ira/roth-ira" },
  { label: "Schwab: How to apply for options", href: "https://www.schwab.com/content/how-to-apply-options-trading" },
  { label: "Schwab: Options strategies allowed in an IRA", href: "https://www.schwab.com/learn/story/trading-options-retirement-account" },
  { label: "OCC: Characteristics and Risks of Standardized Options", href: "https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document" },
  { label: "FINRA Rule 2360 (Options)", href: "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2360" },
] as const;

export default async function GettingStartedPage() {
  await requirePageSession(); // docs/rules/AUTH.md: every page in (app) is its own gate
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Getting started</h1>
        <p className="max-w-2xl text-muted-foreground">
          How to open a Roth IRA at Charles Schwab and get approved for the two options the wheel uses: cash-secured puts
          and covered calls. The Harvester&rsquo;s account is at Schwab. Most brokers that allow options in an IRA follow
          similar steps.
        </p>
      </div>

      <p className="max-w-2xl rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
        General information, checked {FACTS_AS_OF}. It is not tax, legal or investment advice, and it is not a
        recommendation to open an account or use any strategy. Harvest the Wheel is not affiliated with, endorsed by or
        paid by Charles Schwab. Limits change every year; check the sources below, and ask a tax professional about your
        own situation.
      </p>

      <ol className="flex flex-col">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                {index + 1}
              </span>
              {index < STEPS.length - 1 && <span className="w-0.5 flex-1 bg-border" aria-hidden="true" />}
            </div>
            <div className="flex min-w-0 flex-col gap-2 pb-6">
              <h2 className="pt-1.5 text-lg font-semibold">{step.title}</h2>
              <p className="max-w-2xl text-muted-foreground">{step.body}</p>
              {step.points && (
                <ul className="flex max-w-2xl list-disc flex-col gap-1 pl-5 text-sm">
                  {step.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>

      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">IRA rules to know before the first trade</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            These keep the account within the law and keep its tax benefits.
          </p>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2">
          {IRA_RULES.map((rule) => (
            <div key={rule.title} className="rounded-xl border border-border bg-card p-4">
              <dt className="font-semibold">{rule.title}</dt>
              <dd className="text-sm text-muted-foreground">{rule.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flex flex-col gap-3 rounded-xl bg-accent-soft p-5">
        <h2 className="text-lg font-semibold">What can go wrong</h2>
        <p className="max-w-2xl text-sm">
          Money lost in a Roth cannot be deducted, and the yearly limit means it cannot simply be put back. A put can
          assign you shares that keep falling. Options are not suitable for everyone; the risk document in step 5 is
          the place to judge that.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Where these facts come from</h2>
        <ul className="flex flex-col gap-1 text-sm">
          {SOURCES.map((source) => (
            <li key={source.href}>
              <a href={source.href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard/learn" className={buttonClass()}>
          How the wheel works
        </Link>
        <Link href="/dashboard/drip" className={buttonClass("secondary")}>
          Not enough for 100 shares yet?
        </Link>
      </div>
    </div>
  );
}
