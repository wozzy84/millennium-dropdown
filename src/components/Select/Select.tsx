import {
  useRef,
  useState,
  useId,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { createPortal } from 'react-dom';
import { SelectProps, SelectOption } from '../../types/select';
import { useSelectKeyboard } from '../../hooks/useSelectKeyboard';
import { useSelectPosition } from '../../hooks/useSelectPosition';
import { useControllableState } from '../../hooks/useControllableState';
import { SelectLabelRow } from './SelectLabelRow';
import { SelectOptionItem } from './SelectOptionItem';
import { cn } from './utils';
import styles from './Select.module.css';

function Select<V extends string = string>(
  props: SelectProps<V>,
  ref: React.Ref<HTMLButtonElement>,
) {
  const {
    value,
    defaultValue,
    onChange,
    options,
    placeholder = 'Wybierz...',
    disabled = false,
    error,
    label,
    tip,
    hint,
    id,
    name,
    required,
    maxListHeight = 224,
  } = props;

  const generatedId = useId();
  const triggerId = id ?? `select-trigger-${generatedId}`;
  const listboxId = `select-listbox-${generatedId}`;
  const labelId = `select-label-${generatedId}`;
  const errorId = `select-error-${generatedId}`;
  const hintId = `select-hint-${generatedId}`;

  const [selectedValue, setSelectedValue] = useControllableState({
    value,
    defaultValue,
    onChange,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useImperativeHandle(ref, () => triggerRef.current!);

  const { placement, maxHeight, updatePosition } = useSelectPosition(triggerRef, maxListHeight);

  const enabledOptions = options.filter((o) => !o.disabled);
  const selectedOption = options.find((o) => o.value === selectedValue) ?? null;

  const open = useCallback(() => {
    if (disabled) return;
    updatePosition();
    setTriggerRect(triggerRef.current?.getBoundingClientRect() ?? null);
    setIsOpen(true);
    setHighlightedIndex(-1);
  }, [disabled, updatePosition]);

  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  // Scroll highlighted option into view during keyboard navigation
  useEffect(() => {
    if (!isOpen || !listRef.current || highlightedIndex < 0) return;
    const items = listRef.current.querySelectorAll('[role="option"]:not([aria-disabled="true"])');
    items[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex, isOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        listRef.current?.contains(e.target as Node)
      ) return;
      close();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, close]);

  // Recalculate position and trigger rect on scroll/resize while open.
  // Close if trigger scrolls completely out of the visible viewport.
  useEffect(() => {
    if (!isOpen) return;
    const handler = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect || rect.bottom <= 0 || rect.top >= window.innerHeight) {
        close();
        return;
      }
      updatePosition();
      setTriggerRect(rect);
    };
    window.addEventListener('scroll', handler, true);
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler, true);
      window.removeEventListener('resize', handler);
    };
  }, [isOpen, updatePosition]);

  const selectOption = useCallback(
    (option: SelectOption<V>) => {
      if (option.disabled) return;
      setSelectedValue(option.value);
      close();
      triggerRef.current?.focus();
    },
    [setSelectedValue, close],
  );

  const { handleKeyDown } = useSelectKeyboard({
    isOpen,
    highlightedIndex,
    optionCount: enabledOptions.length,
    onOpen: open,
    onClose: () => { close(); triggerRef.current?.focus(); },
    onHighlight: setHighlightedIndex,
    onSelect: (idx) => selectOption(enabledOptions[idx]),
    getOptionLabel: (idx) => enabledOptions[idx]?.label ?? '',
  });

  const activeDescendant =
    highlightedIndex >= 0
      ? `${listboxId}-option-${enabledOptions[highlightedIndex]?.value}`
      : undefined;

  const ariaDescribedBy =
    [
      error ? errorId : null,
      hint ? hintId : null,
      props['aria-describedby'] ?? null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <div
      className={cn(
        styles.root,
        isOpen && placement === 'bottom' && styles.open,
        isOpen && placement === 'top' && styles.openTop,
        disabled && styles.disabled,
        !!error && styles.error,
      )}
    >
      {name && (
        <select
          name={name}
          value={selectedValue ?? ''}
          required={required}
          disabled={disabled}
          onChange={() => {}}
          aria-hidden="true"
          tabIndex={-1}
          style={{ display: 'none' }}
        >
          <option value="" />
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      )}

      <SelectLabelRow
        label={label}
        tip={tip}
        labelId={labelId}
        triggerId={triggerId}
        required={required}
      />

      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-labelledby={label ? labelId : undefined}
        aria-activedescendant={activeDescendant}
        aria-invalid={!!error}
        aria-required={required}
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
        className={styles.trigger}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleKeyDown}
      >
        <span
          className={cn(
            styles.triggerValue,
            !selectedOption && styles.triggerPlaceholder,
          )}
        >
          {selectedOption ? (selectedOption.content ?? selectedOption.label) : placeholder}
        </span>
        <span className={styles.chevron} aria-hidden="true" />
      </button>

      {isOpen && triggerRect && createPortal(
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          style={{
            position: 'fixed',
            left: triggerRect.left,
            width: triggerRect.width,
            maxHeight,
            ...(placement === 'bottom'
              ? { top: triggerRect.bottom - 1 }
              : { bottom: window.innerHeight - triggerRect.top - 1 }),
          }}
          className={cn(
            styles.listbox,
            placement === 'bottom' ? styles.listboxBottom : styles.listboxTop,
          )}
        >
          {options.map((option) => {
            const enabledIdx = enabledOptions.findIndex((o) => o.value === option.value);
            return (
              <SelectOptionItem
                key={option.value}
                option={option}
                isSelected={option.value === selectedValue}
                isHighlighted={enabledOptions[highlightedIndex]?.value === option.value}
                optionId={`${listboxId}-option-${option.value}`}
                onSelect={selectOption}
                onHighlight={() => setHighlightedIndex(enabledIdx)}
              />
            );
          })}
        </ul>,
        document.body,
      )}

      {error && (
        <div id={errorId} className={styles.errorMsg} role="alert">
          {error}
        </div>
      )}

      {hint && (
        <div id={hintId} className={styles.hint}>
          {hint}
        </div>
      )}
    </div>
  );
}

const SelectComponent = forwardRef(Select) as <V extends string = string>(
  props: SelectProps<V> & { ref?: React.Ref<HTMLButtonElement> },
) => JSX.Element;

export { SelectComponent as Select };
