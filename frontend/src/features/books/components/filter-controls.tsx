import { Fragment } from 'react';
import { Check, ChevronDown, SlidersHorizontal, X } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
  dotClassName?: string;
  activeClassName?: string;
}

export interface FilterOptionGroup {
  label?: string;
  options: readonly FilterOption[];
}

interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  groups: readonly FilterOptionGroup[];
  onChange: (value: string) => void;
  hideLabel?: boolean;
  className?: string;
}

export function FilterSelect({
  id,
  label,
  value,
  groups,
  onChange,
  hideLabel = false,
  className = '',
}: FilterSelectProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={
          hideLabel
            ? 'sr-only'
            : 'mb-1 block text-[11px] font-semibold text-ink-soft'
        }
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-field border border-surface-soft bg-white pl-3 pr-8 text-xs font-semibold text-ink transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:h-10"
        >
          {groups.map((group, index) =>
            group.label ? (
              <optgroup key={`${group.label}-${index}`} label={group.label}>
                {group.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ) : (
              <Fragment key={`group-${index}`}>
                {group.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Fragment>
            )
          )}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-soft"
          aria-hidden
        />
      </div>
    </div>
  );
}

interface FilterOptionGridProps {
  groups: readonly FilterOptionGroup[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterOptionGrid({
  groups,
  value,
  onChange,
}: FilterOptionGridProps) {
  return (
    <div className="space-y-4">
      {groups.map((group, groupIndex) => (
        <fieldset key={`${group.label ?? 'group'}-${groupIndex}`}>
          {group.label ? (
            <legend className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink-soft">
              {group.label}
            </legend>
          ) : null}
          <div className="grid grid-cols-2 gap-2">
            {group.options.map((option) => {
              const active = value === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange(option.value)}
                  className={`flex min-h-11 items-center justify-between gap-2 rounded-field border px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                    active
                      ? (option.activeClassName ??
                        'border-primary bg-primary text-white')
                      : 'border-surface-soft bg-white text-ink hover:border-primary/40'
                  }`}
                >
                  <span className="inline-flex min-w-0 items-center gap-1.5">
                    {option.dotClassName ? (
                      <span
                        aria-hidden
                        className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                          active ? option.dotClassName : 'bg-slate-300'
                        }`}
                      />
                    ) : null}
                    <span className="truncate">{option.label}</span>
                  </span>
                  {active ? (
                    <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  ) : null}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

interface FilterButtonProps {
  count: number;
  onClick: () => void;
  expanded: boolean;
  className?: string;
}

export function FilterButton({
  count,
  onClick,
  expanded,
  className = '',
}: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      aria-haspopup="dialog"
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-field border border-surface-soft bg-white px-3 text-xs font-semibold text-ink transition-colors hover:border-primary/40 hover:bg-surface-blue focus-visible:outline-2 focus-visible:outline-primary ${className}`}
    >
      <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden />
      Filter
      {count > 0 ? (
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
          {count}
        </span>
      ) : null}
    </button>
  );
}

interface ActiveFilterChipProps {
  label: string;
  onRemove: () => void;
  toneClassName?: string;
}

export function ActiveFilterChip({
  label,
  onRemove,
  toneClassName,
}: ActiveFilterChipProps) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Hapus filter ${label}`}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
        toneClassName
          ? `${toneClassName} hover:opacity-80`
          : 'border-primary/25 bg-surface-blue text-primary-deep hover:bg-primary/10'
      }`}
    >
      {label}
      <X className="h-3 w-3" aria-hidden />
    </button>
  );
}
