import { differenceInDays, format, isToday, isYesterday, parseISO, startOfDay } from 'date-fns';

export function getTodayDateString() {
    return format(new Date(), 'yyyy-MM-dd');
}

export function formatDatePretty(dateString: string) {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
}

export function formatMonthYear(date: Date) {
    return format(date, 'MMMM yyyy');
}

export function calculateStreak(dates: string[]): number {
    if (dates.length === 0) return 0;

    // Sort dates descending string-wise
    const sortedDates = [...new Set(dates)].sort((a, b) => b.localeCompare(a));

    const today = startOfDay(new Date());
    let streak = 0;

    const mostRecent = startOfDay(parseISO(sortedDates[0]));
    const diffToToday = differenceInDays(today, mostRecent);

    // If the most recent entry is older than yesterday, the streak is broken (0)
    if (diffToToday > 1) return 0;

    streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
        const current = startOfDay(parseISO(sortedDates[i]));
        const prev = startOfDay(parseISO(sortedDates[i - 1]));

        if (differenceInDays(prev, current) === 1) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}
