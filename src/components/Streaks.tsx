import { useEffect, useRef, useState } from "react";
import { Flame, CalendarDays, TrendingUp, Trophy } from "lucide-react";
import { Section, SectionHeading } from "./ui";
import { profile } from "../data/content";
import { useLiveStats } from "../lib/stats";

const ROLLING_DAYS = 365;

function utcDay(date: Date) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

type ActivityCell =
  | { kind: "none" }
  | { kind: "day"; date: Date; count: number; future: boolean };

type MonthBlock = {
  label: string;
  year: number;
  month: number;
  columns: ActivityCell[][];
};

function leetCodeMonths(
  calendar: Record<string, number> | undefined,
  today = utcDay(new Date())
): MonthBlock[] {
  const windowStart = new Date(today);
  windowStart.setUTCDate(windowStart.getUTCDate() - ROLLING_DAYS);

  const firstMonth = new Date(
    Date.UTC(windowStart.getUTCFullYear(), windowStart.getUTCMonth(), 1)
  );
  const monthsSpan =
    (today.getUTCFullYear() - firstMonth.getUTCFullYear()) * 12 +
    (today.getUTCMonth() - firstMonth.getUTCMonth()) +
    1;

  const blocks: MonthBlock[] = [];
  for (let m = 0; m < monthsSpan; m++) {
    const first = new Date(firstMonth);
    first.setUTCMonth(first.getUTCMonth() + m);
    const year = first.getUTCFullYear();
    const month = first.getUTCMonth();
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const firstWeekday = first.getUTCDay();
    const columnCount = Math.ceil((firstWeekday + daysInMonth) / 7);

    const columns: ActivityCell[][] = Array.from(
      { length: columnCount },
      () => Array.from({ length: 7 }, () => ({ kind: "none" }) as ActivityCell)
    );

    for (let dayIndex = 0; dayIndex < daysInMonth; dayIndex++) {
      const time = Date.UTC(year, month, dayIndex + 1);
      const column = Math.floor((firstWeekday + dayIndex) / 7);
      const row = (firstWeekday + dayIndex) % 7;
      if (time < windowStart.getTime()) {
        columns[column][row] = { kind: "none" };
        continue;
      }
      const future = time > today.getTime();
      columns[column][row] = {
        kind: "day",
        date: new Date(time),
        future,
        count: future ? 0 : calendar?.[String(Math.floor(time / 1000))] ?? 0,
      };
    }

    while (columns.length > 1 && columns[0].every((cell) => cell.kind === "none")) {
      columns.shift();
    }

    blocks.push({
      label: first.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
      year,
      month,
      columns,
    });
  }
  return blocks;
}

function longestActivityStreak(blocks: MonthBlock[]): number {
  let max = 0;
  let run = 0;
  for (const block of blocks) {
    for (const column of block.columns) {
      for (const cell of column) {
        if (cell.kind !== "day") {
          run = 0;
          continue;
        }
        if (cell.future) {
          run = 0;
          continue;
        }
        if (cell.count > 0) {
          run += 1;
          if (run > max) max = run;
        } else {
          run = 0;
        }
      }
    }
  }
  return max;
}

function activityColor(count: number) {
  if (!count) return "var(--heatmap-empty)";
  if (count < 2) return "var(--heatmap-level-1)";
  if (count < 5) return "var(--heatmap-level-2)";
  if (count < 10) return "var(--heatmap-level-3)";
  return "var(--heatmap-level-4)";
}

export default function Streaks() {
  const { gfg, leetcode, fetchedAt, getLeetCodeActivity } = useLiveStats();
  const [today, setToday] = useState(() => utcDay(new Date()));
  const [calendar, setCalendar] = useState<Record<string, number>>({});
  const [activityState, setActivityState] = useState<"loading" | "ready">(
    "loading"
  );
  const [dataSource, setDataSource] = useState<"live" | "bundled" | "none">(
    "live"
  );
  const [snapshotAt, setSnapshotAt] = useState<string | null>(null);
  const bundledCalendarRef = useRef(leetcode.submissionCalendar);
  const fetchedAtRef = useRef(fetchedAt);
  bundledCalendarRef.current = leetcode.submissionCalendar;
  fetchedAtRef.current = fetchedAt;

  const windowStart = new Date(today);
  windowStart.setUTCDate(windowStart.getUTCDate() - ROLLING_DAYS);
  const fetchYears = [
    ...new Set([windowStart.getUTCFullYear(), today.getUTCFullYear()]),
  ];

  useEffect(() => {
    const nextDay = new Date(today);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    const timeout = window.setTimeout(
      () => setToday(utcDay(new Date())),
      Math.max(1000, nextDay.getTime() - Date.now())
    );
    return () => window.clearTimeout(timeout);
  }, [today]);

  useEffect(() => {
    let active = true;
    setCalendar({});
    setActivityState("loading");
    void Promise.all(fetchYears.map((year) => getLeetCodeActivity(year)))
      .then((calendars) => {
        if (!active) return;
        setCalendar(Object.assign({}, ...calendars));
        setDataSource("live");
        setActivityState("ready");
      })
      .catch(() => {
        if (!active) return;
        const bundled = bundledCalendarRef.current;
        if (bundled && Object.keys(bundled).length > 0) {
          setCalendar(bundled);
          setDataSource("bundled");
          const ts = fetchedAtRef.current;
          setSnapshotAt(
            ts
              ? new Date(ts).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : null
          );
        } else {
          setCalendar({});
          setDataSource("none");
        }
        setActivityState("ready");
      });
    return () => {
      active = false;
    };
  }, [getLeetCodeActivity, today]);

  const blocks = leetCodeMonths(calendar, today);
  const realDays: { count: number }[] = [];
  for (const block of blocks) {
    for (const column of block.columns) {
      for (const cell of column) {
        if (cell.kind === "day" && !cell.future) realDays.push(cell);
      }
    }
  }
  const activeDays = realDays.filter((day) => day.count > 0).length;
  const totalSubmissions = realDays.reduce((total, day) => total + day.count, 0);
  const maxStreak = longestActivityStreak(blocks);
  const longest = gfg.podLongestStreak ?? 0;
  const current = gfg.podCurrentStreak ?? 0;

  return (
    <Section id="streaks">
      <SectionHeading
        index="08 — CONSISTENCY"
        title="The daily practice"
        lead="A rolling year of real LeetCode submissions, alongside my current GeeksforGeeks problem-of-the-day streak."
      />

      <div className="rounded-2xl border border-[var(--heatmap-border)] bg-[var(--heatmap-card-bg)] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--heatmap-text)]">
              <CalendarDays size={16} className="text-accent" aria-hidden="true" />
              LeetCode activity
            </div>
            <p className="mt-1 text-xs text-[var(--heatmap-muted)]">
              {totalSubmissions.toLocaleString("en-IN")} submissions in the past year
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <p className="text-xs text-[var(--heatmap-muted)]">
              Total active days: <span className="font-semibold text-[var(--heatmap-text)]">{activeDays}</span>
              <span className="mx-2 text-base-600">·</span>
              Max streak: <span className="font-semibold text-[var(--heatmap-text)]">{maxStreak}</span>
            </p>
            <a
              href={profile.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring text-xs font-semibold text-accent transition-colors hover:text-accent-soft"
            >
              Open profile ↗
            </a>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto pb-1">
          <div className="flex w-full min-w-max items-start justify-between gap-2">
            {blocks.map((block) => (
              <div
                key={`${block.year}-${block.month}`}
                className="flex shrink-0 flex-col gap-1"
                aria-label={`${block.label} LeetCode submissions`}
              >
                <div className="flex w-max items-start gap-[2px]">
                  {block.columns.map((column, columnIndex) => (
                    <div
                      key={columnIndex}
                      className="flex shrink-0 flex-col gap-[2px]"
                    >
                      {column.map((cell, rowIndex) =>
                        cell.kind === "none" ? (
                          <span
                            key={rowIndex}
                            aria-hidden="true"
                            className="h-2.5 w-2.5 rounded-[3px]"
                            style={{ backgroundColor: "transparent" }}
                          />
                        ) : (
                          <span
                            key={rowIndex}
                            title={
                              cell.future
                                ? undefined
                                : `${cell.date.toISOString().slice(0, 10)} · ${cell.count} submission${cell.count === 1 ? "" : "s"}`
                            }
                            className={`h-2.5 w-2.5 rounded-[3px] ${
                              cell.future
                                ? ""
                                : "transition-transform duration-200 hover:scale-150"
                            }`}
                            style={{
                              backgroundColor: cell.future
                                ? "var(--heatmap-empty)"
                                : activityColor(cell.count),
                            }}
                          />
                        )
                      )}
                    </div>
                  ))}
                </div>
                <span className="text-center text-[10px] leading-none text-[var(--heatmap-label)]">
                  {block.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        {activityState === "loading" && (
          <p className="mt-3 text-xs text-[var(--heatmap-muted)]" role="status">
            Loading LeetCode activity…
          </p>
        )}
        {activityState === "ready" && dataSource === "bundled" && (
          <p className="mt-3 text-xs text-[var(--heatmap-muted)]" role="status">
            Live feed unavailable — showing last synced snapshot
            {snapshotAt ? ` · ${snapshotAt}` : ""}.
          </p>
        )}
        {activityState === "ready" && dataSource === "none" && (
          <p className="mt-3 text-xs text-amber-300" role="status">
            LeetCode activity is temporarily unavailable for the rolling year.
          </p>
        )}
        {activityState === "ready" && dataSource === "live" && activeDays === 0 && (
          <p className="mt-3 text-xs text-[var(--heatmap-muted)]">
            No submissions recorded in the past year.
          </p>
        )}
      </div>

      <div className="relative mt-5 overflow-hidden rounded-2xl border border-orange-400/20 bg-base-850 p-5 sm:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl"
        />
        <div className="relative flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-orange-400/40 bg-orange-500/10 text-orange-300"
            >
              <Flame size={22} strokeWidth={1.8} />
            </span>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-orange-300">
                GFG · Problem of the Day
              </p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-4xl font-bold text-orange-300 sm:text-5xl">
                  {current}
                </span>
                <span className="text-sm text-ink-dim">
                  {current === 1 ? "day current streak" : "days current streak"}
                </span>
              </p>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="hidden h-12 w-px bg-base-600 sm:block"
          />

          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-amber-300/30 bg-amber-400/10 text-amber-300"
            >
              <Trophy size={20} strokeWidth={1.8} />
            </span>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-300">
                Personal best
              </p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-4xl font-bold text-amber-300 sm:text-5xl">
                  {longest}
                </span>
                <span className="text-sm text-ink-dim">
                  {longest === 1 ? "day best streak" : "days best streak"}
                </span>
              </p>
            </div>
          </div>

          <a
            href={profile.gfg}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-base-600 px-4 py-2 text-xs font-semibold text-ink transition-colors hover:border-orange-400/50 hover:text-orange-300"
          >
            <TrendingUp size={13} aria-hidden="true" />
            View GFG profile
          </a>
        </div>
        <p className="relative mt-4 text-xs text-ink-faint">
          GFG provides verified streak totals, not a public daily calendar.
        </p>
      </div>
    </Section>
  );
}
