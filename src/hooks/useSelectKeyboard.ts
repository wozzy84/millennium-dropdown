import { KeyboardEvent } from 'react';

interface UseSelectKeyboardProps {
  isOpen: boolean;
  highlightedIndex: number;
  optionCount: number;
  onOpen: () => void;
  onClose: () => void;
  onHighlight: (index: number) => void;
  onSelect: (index: number) => void;
  getOptionLabel: (index: number) => string;
}

export function useSelectKeyboard({
  isOpen,
  highlightedIndex,
  optionCount,
  onOpen,
  onClose,
  onHighlight,
  onSelect,
  getOptionLabel,
}: UseSelectKeyboardProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (!isOpen) {
          onOpen();
          onHighlight(0);
          return;
        }
        onHighlight(Math.min(highlightedIndex + 1, optionCount - 1));
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (!isOpen) {
          onOpen();
          onHighlight(optionCount - 1);
          return;
        }
        onHighlight(Math.max(highlightedIndex - 1, 0));
        break;
      }
      case 'Home': {
        e.preventDefault();
        if (isOpen) onHighlight(0);
        break;
      }
      case 'End': {
        e.preventDefault();
        if (isOpen) onHighlight(optionCount - 1);
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (!isOpen) { onOpen(); return; }
        if (highlightedIndex >= 0) onSelect(highlightedIndex);
        break;
      }
      case 'Escape': {
        e.preventDefault();
        onClose();
        break;
      }
      case 'Tab': {
        if (isOpen) onClose();
        break;
      }
      default: {
        if (e.key.length === 1) {
          if (!isOpen) onOpen();
          const char = e.key.toLowerCase();
          // Start search from next position and wrap around for intuitive cycling
          const start = isOpen ? highlightedIndex + 1 : 0;
          for (let i = 0; i < optionCount; i++) {
            const idx = (start + i) % optionCount;
            if (getOptionLabel(idx).toLowerCase().startsWith(char)) {
              onHighlight(idx);
              break;
            }
          }
        }
      }
    }
  };

  return { handleKeyDown };
}
