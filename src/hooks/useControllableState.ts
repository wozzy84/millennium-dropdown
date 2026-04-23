import { useState, useCallback } from 'react';

interface UseControllableStateOptions<V> {
  value?: V | null;
  defaultValue?: V;
  onChange?: (value: V) => void;
}

export function useControllableState<V>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<V>): [V | null, (next: V) => void] {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<V | null>(defaultValue ?? null);

  const resolvedValue: V | null = isControlled ? (value ?? null) : internalValue;

  const setValue = useCallback(
    (next: V) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [resolvedValue, setValue];
}
