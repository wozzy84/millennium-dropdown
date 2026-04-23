import styles from './Select.module.css';

interface SelectLabelRowProps {
  label?: string;
  tip?: string;
  labelId: string;
  triggerId: string;
  required?: boolean;
}

export function SelectLabelRow({ label, tip, labelId, triggerId, required }: SelectLabelRowProps) {
  if (!label && !tip) return null;

  return (
    <div className={styles.labelRow}>
      {label && (
        <label id={labelId} htmlFor={triggerId} className={styles.label}>
          {label}
          {required && (
            <span aria-hidden="true" className={styles.required}>*</span>
          )}
        </label>
      )}
      {tip && (
        <span
          className={styles.tip}
          tabIndex={0}
          aria-label={tip}
        >
          <span aria-hidden="true">i</span>
          <span className={styles.tipPopup} aria-hidden="true">{tip}</span>
        </span>
      )}
    </div>
  );
}
