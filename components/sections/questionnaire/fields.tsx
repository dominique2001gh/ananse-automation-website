"use client";

/**
 * Shared field primitives for the Client Discovery Questionnaire, styled to
 * match the existing contact form (components/sections/contact/ContactForm.tsx)
 * exactly -- same input classes, same pill-style select pattern -- so the
 * questionnaire feels like a natural extension of the site rather than a
 * bolted-on generic form. Nothing here touches ContactForm itself.
 */

export const questionnaireInputClass =
  "w-full rounded-xl border border-line bg-paper px-4 py-3 text-base text-ink placeholder:text-slate/50 transition-colors duration-150 focus:border-gold focus:outline-none sm:text-sm";

function pillClass(checked: boolean) {
  return `flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-3 text-sm leading-snug transition-colors duration-150 ${
    checked ? "border-gold bg-gold/10 text-ink" : "border-line text-slate hover:border-ink/30"
  }`;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  error,
  autoComplete,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "url";
  placeholder?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}{" "}
        {required ? (
          <span aria-hidden className="text-gold">
            *
          </span>
        ) : null}
      </label>
      {hint ? <p className="-mt-0.5 text-xs leading-relaxed text-slate/70">{hint}</p> : null}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className={questionnaireInputClass}
      />
      {error ? (
        <p role="alert" className="text-xs text-terracotta">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  error,
  hint,
  rows = 4,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  rows?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}{" "}
        {required ? (
          <span aria-hidden className="text-gold">
            *
          </span>
        ) : null}
      </label>
      {hint ? <p className="-mt-0.5 text-xs leading-relaxed text-slate/70">{hint}</p> : null}
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className={`${questionnaireInputClass} resize-y`}
      />
      {error ? (
        <p role="alert" className="text-xs text-terracotta">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function MultiSelectField<T extends string>({
  legend,
  hint,
  options,
  values,
  onChange,
  otherText,
  onOtherTextChange,
  columns = 2,
  required,
  error,
}: {
  legend: string;
  hint?: string;
  options: readonly T[];
  values: T[];
  onChange: (next: T[]) => void;
  otherText?: string;
  onOtherTextChange?: (value: string) => void;
  columns?: 1 | 2;
  required?: boolean;
  error?: string;
}) {
  function toggle(option: T) {
    if (values.includes(option)) onChange(values.filter((v) => v !== option));
    else onChange([...values, option]);
  }

  const showOtherInput =
    (options as readonly string[]).includes("Other") &&
    values.includes("Other" as T) &&
    Boolean(onOtherTextChange);

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-medium text-ink">
        {legend}{" "}
        {required ? (
          <span aria-hidden className="text-gold">
            *
          </span>
        ) : null}
      </legend>
      {hint ? <p className="-mt-1 text-xs leading-relaxed text-slate/70">{hint}</p> : null}
      <div
        className={`grid grid-cols-1 gap-2.5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}
      >
        {options.map((option) => {
          const checked = values.includes(option);
          return (
            <label key={option} className={pillClass(checked)}>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(option)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={`h-4 w-4 shrink-0 rounded-[0.3rem] border ${
                  checked ? "border-gold bg-gold" : "border-line"
                }`}
              />
              {option}
            </label>
          );
        })}
      </div>
      {showOtherInput ? (
        <input
          type="text"
          value={otherText ?? ""}
          onChange={(e) => onOtherTextChange?.(e.target.value)}
          placeholder="Please specify…"
          className={questionnaireInputClass}
        />
      ) : null}
      {error ? (
        <p role="alert" className="text-xs text-terracotta">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export function SingleSelectField<T extends string>({
  legend,
  hint,
  name,
  options,
  value,
  onChange,
  columns = 2,
  required,
  error,
}: {
  legend: string;
  hint?: string;
  name: string;
  options: readonly T[];
  value: T | "";
  onChange: (next: T) => void;
  columns?: 1 | 2;
  required?: boolean;
  error?: string;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-medium text-ink">
        {legend}{" "}
        {required ? (
          <span aria-hidden className="text-gold">
            *
          </span>
        ) : null}
      </legend>
      {hint ? <p className="-mt-1 text-xs leading-relaxed text-slate/70">{hint}</p> : null}
      <div
        className={`grid grid-cols-1 gap-2.5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}
      >
        {options.map((option) => {
          const checked = value === option;
          return (
            <label key={option} className={pillClass(checked)}>
              <input
                type="radio"
                name={name}
                checked={checked}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={`h-3.5 w-3.5 shrink-0 rounded-full border ${
                  checked ? "border-gold bg-gold" : "border-line"
                }`}
              />
              {option}
            </label>
          );
        })}
      </div>
      {error ? (
        <p role="alert" className="text-xs text-terracotta">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export function StepHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-semibold tracking-tight text-balance text-ink sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="text-sm leading-relaxed text-slate sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}
