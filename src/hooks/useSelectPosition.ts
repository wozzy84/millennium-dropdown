import { useState, useCallback, RefObject } from 'react';

export type Placement = 'bottom' | 'top';

interface UseSelectPositionReturn {
  placement: Placement;
  maxHeight: number;
  updatePosition: () => void;
}

const DEFAULT_MAX_HEIGHT = 224;
// Gap between the list edge and the viewport boundary — prevents flush-to-screen rendering.
const VIEWPORT_MARGIN = 8;
// Smallest usable list height; prevents the list from collapsing to an unusable sliver.
const MIN_LIST_HEIGHT = 120;

/**
 * Determines whether the dropdown list should open below or above the trigger (flip),
 * and clamps its height to the available viewport space.
 */
export function useSelectPosition(
  triggerRef: RefObject<HTMLButtonElement>,
  preferredMaxHeight = DEFAULT_MAX_HEIGHT,
): UseSelectPositionReturn {
  const [placement, setPlacement] = useState<Placement>('bottom');
  const [maxHeight, setMaxHeight] = useState(preferredMaxHeight);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - rect.bottom - VIEWPORT_MARGIN;
    const spaceAbove = rect.top - VIEWPORT_MARGIN;

    // Prefer bottom; flip to top when there is enough room above but not below;
    // when neither side fits fully, pick the side with more space.
    const placement: Placement =
      spaceBelow >= preferredMaxHeight ? 'bottom' :
      spaceAbove >= preferredMaxHeight ? 'top' :
      spaceBelow >= spaceAbove         ? 'bottom' : 'top';

    const availableSpace = placement === 'bottom' ? spaceBelow : spaceAbove;
    const height = availableSpace >= preferredMaxHeight
      ? preferredMaxHeight
      : Math.max(availableSpace, MIN_LIST_HEIGHT);

    setPlacement(placement);
    setMaxHeight(height);
  }, [triggerRef, preferredMaxHeight]);

  return { placement, maxHeight, updatePosition };
}
