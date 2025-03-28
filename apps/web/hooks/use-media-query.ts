import { useEffect, useState } from 'react';

/**
 * Hook to check if a media query matches
 *
 * @param query - The media query to check (e.g. '(max-width: 640px)')
 * @returns boolean - Whether the media query matches
 *
 * @example
 * ```tsx
 * function Component() {
 *   const isMobile = useMediaQuery('(max-width: 640px)');
 *
 *   return (
 *     <div>
 *       {isMobile ? 'Mobile View' : 'Desktop View'}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Return early if not in browser environment
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(query);
    const updateMatch = () => setMatches(media.matches);

    // Initial check
    updateMatch();

    // Add event listener for changes
    // Using addEventListener which is now supported in all modern browsers
    media.addEventListener('change', updateMatch);
    return () => media.removeEventListener('change', updateMatch);
  }, [query]);

  return matches;
}

/**
 * Common breakpoint helpers using Tailwind default breakpoints
 */
export const useBreakpoints = () => {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isLargeDesktop = useMediaQuery('(min-width: 1280px)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    // Additional helper
    isSmallScreen: isMobile || isTablet,
  };
};
