import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

const fieldClasses =
  'w-full rounded-field border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-ink-soft';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string | null;
  leadingIcon?: ReactNode;
  trailingNode?: ReactNode;
  id: string;
}

export function Input({
  label,
  hint,
  error,
  leadingIcon,
  trailingNode,
  className = '',
  id,
  ...rest
}: InputProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        {leadingIcon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft">
            {leadingIcon}
          </span>
        ) : null}
        <input
          id={id}
          className={`${fieldClasses} ${leadingIcon ? 'pl-10' : ''} ${
            trailingNode ? 'pr-11' : ''
          } ${
            error
              ? 'border-danger focus:border-danger focus:ring-danger/20'
              : 'border-slate-200'
          } ${className}`}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {trailingNode ? (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">{trailingNode}</span>
        ) : null}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string | null;
  id: string;
}

export function Textarea({
  label,
  hint,
  error,
  className = '',
  id,
  ...rest
}: TextareaProps) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <textarea
        id={id}
        className={`${fieldClasses} ${
          error
            ? 'border-danger focus:border-danger focus:ring-danger/20'
            : 'border-slate-200'
        } min-h-24 resize-y ${className}`}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  id: string;
  options: { value: string; label: string }[];
}

export function Select({
  label,
  hint,
  className = '',
  id,
  options,
  ...rest
}: SelectProps) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <select
        id={id}
        className={`${fieldClasses} border-slate-200 ${className}`}
        aria-describedby={hint ? `${id}-hint` : undefined}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
