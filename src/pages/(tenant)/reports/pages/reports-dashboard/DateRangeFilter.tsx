import { Group, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";

type Props = {
  startDate?: string;
  endDate?: string;
  onChange: (start?: string, end?: string) => void;
};

const toISODate = (v: unknown): string | undefined => {
  if (!v) return undefined;
  if (v instanceof Date) return v.toISOString().split("T")[0];
  if (typeof v === "string") return v.includes("T") ? v.split("T")[0] : v;
  return undefined;
};

type Preset = "today" | "7d" | "30d" | "ytd" | "1y" | "custom";

const iso = (d: Date) => d.toISOString().split("T")[0];

const computePresetRange = (preset: Preset): { start?: string; end?: string } => {
  const now = new Date();
  const end = iso(now);
  if (preset === "today") {
    return { start: end, end };
  }
  if (preset === "7d") {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    return { start: iso(startDate), end };
  }
  if (preset === "30d") {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29);
    return { start: iso(startDate), end };
  }
  if (preset === "ytd") {
    const startDate = new Date(now.getFullYear(), 0, 1);
    return { start: iso(startDate), end };
  }
  if (preset === "1y") {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    return { start: iso(startDate), end };
  }
  return {} as any;
};

const deducePreset = (start?: string, end?: string): Preset => {
  const now = new Date();
  const endToday = iso(now);
  const matches = (a?: string, b?: string) => a === b;
  const eqRange = (s?: string, e?: string) => matches(s, start) && matches(e, end);

  if (eqRange(endToday, endToday)) return "today";
  const r7 = computePresetRange("7d");
  if (eqRange(r7.start, r7.end)) return "7d";
  const r30 = computePresetRange("30d");
  if (eqRange(r30.start, r30.end)) return "30d";
  const rytd = computePresetRange("ytd");
  if (eqRange(rytd.start, rytd.end)) return "ytd";
  const r1y = computePresetRange("1y");
  if (eqRange(r1y.start, r1y.end)) return "1y";
  return "custom";
};

const DateRangeFilter = ({ startDate, endDate, onChange }: Props) => {
  const preset = deducePreset(startDate, endDate);
  return (
    <div className="mb-4 flex flex-col gap-3">
      <Select
        size="xs"
        label="Select reporting time range"
        value={preset as string}
        onChange={(val) => {
          const p = (val as Preset) || "custom";
          if (p === "custom") {
            // Clear dates so preset becomes custom and inputs appear
            onChange(undefined, undefined);
            return;
          }
          const range = computePresetRange(p);
          onChange(range.start, range.end);
        }}
        data={[
          { value: "today", label: "Today" },
          { value: "7d", label: "Last 7 days" },
          { value: "30d", label: "Last 30 days" },
          { value: "ytd", label: "Year to date" },
          { value: "1y", label: "Last 1 year" },
          { value: "custom", label: "Custom" },
        ]}
      />
      {preset === "custom" && (
        <Group justify="flex-start" gap="md">
          <DatePickerInput
            label="Start date"
            placeholder="Select start date"
            value={startDate ? new Date(startDate) : null}
            onChange={(v: any) => {
              const s = toISODate(v);
              onChange(s, endDate);
            }}
            clearable
          />
          <DatePickerInput
            label="End date"
            placeholder="Select end date"
            value={endDate ? new Date(endDate) : null}
            onChange={(v: any) => {
              const e = toISODate(v);
              onChange(startDate, e);
            }}
            clearable
          />
        </Group>
      )}
    </div>
  );
};

export default DateRangeFilter;
