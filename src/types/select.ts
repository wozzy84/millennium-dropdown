import { ReactNode } from 'react';

export interface SelectOption<V extends string = string> {
  value: V;
  label: string;
  /** Custom content rendered in the list and the trigger. */
  content?: ReactNode;
  disabled?: boolean;
}

export interface SelectProps<V extends string = string> {
  // --- Controlled API ---
  value?: V | null;
  defaultValue?: V;
  onChange?: (value: V) => void;

  // --- Data ---
  options: SelectOption<V>[];
  placeholder?: string;

  // --- States ---
  disabled?: boolean;
  error?: ReactNode;

  // --- Labels & a11y ---
  label?: string;
  tip?: string;
  hint?: ReactNode;
  id?: string;
  name?: string;
  required?: boolean;
  'aria-describedby'?: string;

  // --- Positioning ---
  /** Maximum list height in px. */
  maxListHeight?: number;
}
