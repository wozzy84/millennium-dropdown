import { SelectOption } from '../../types/select';
import { cn } from './utils';
import styles from './Select.module.css';

interface SelectOptionItemProps<V extends string = string> {
  option: SelectOption<V>;
  isSelected: boolean;
  isHighlighted: boolean;
  optionId: string;
  onSelect: (option: SelectOption<V>) => void;
  onHighlight: () => void;
}

export function SelectOptionItem<V extends string = string>({
  option,
  isSelected,
  isHighlighted,
  optionId,
  onSelect,
  onHighlight,
}: SelectOptionItemProps<V>) {
  return (
    <li
      id={optionId}
      role="option"
      aria-selected={isSelected}
      aria-disabled={option.disabled ?? false}
      onMouseDown={(e) => {
        e.preventDefault();
        if (!option.disabled) onSelect(option);
      }}
      onMouseEnter={() => {
        if (!option.disabled) onHighlight();
      }}
      className={cn(
        styles.option,
        isSelected && styles.optionSelected,
        isHighlighted && styles.optionHighlighted,
        option.disabled && styles.optionDisabled,
      )}
    >
      <span className={styles.optionContent}>{option.content ?? option.label}</span>
      <span className={styles.checkmark} aria-hidden="true" />
    </li>
  );
}
