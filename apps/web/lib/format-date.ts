/**
 * Format a date string into a readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);

    // Format: "Jan 1, 2023"
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

/**
 * Format a date string with time
 * @param dateString - ISO date string
 * @returns Formatted date string with time
 */
export function formatDateTime(dateString: string): string {
    const date = new Date(dateString);

    // Format: "Jan 1, 2023, 12:00 PM"
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}
