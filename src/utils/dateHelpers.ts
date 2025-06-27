import moment from 'moment';

export const DateHelpers = {
  // Get today's date in YYYY-MM-DD format
  getTodayString: (): string => {
    return moment().format('YYYY-MM-DD');
  },

  // Get date string from Date object
  getDateString: (date: Date): string => {
    return moment(date).format('YYYY-MM-DD');
  },

  // Parse date string to Date object
  parseDate: (dateString: string): Date => {
    return moment(dateString).toDate();
  },

  // Check if date is today
  isToday: (dateString: string): boolean => {
    return moment(dateString).isSame(moment(), 'day');
  },

  // Check if date is in current week
  isThisWeek: (dateString: string): boolean => {
    return moment(dateString).isSame(moment(), 'week');
  },

  // Check if date is in current month
  isThisMonth: (dateString: string): boolean => {
    return moment(dateString).isSame(moment(), 'month');
  },

  // Get day of week (0-6, Sunday-Saturday)
  getDayOfWeek: (dateString: string): number => {
    return moment(dateString).day();
  },

  // Get formatted date for display
  getDisplayDate: (dateString: string): string => {
    const date = moment(dateString);
    if (date.isSame(moment(), 'day')) {
      return 'Today';
    } else if (date.isSame(moment().subtract(1, 'day'), 'day')) {
      return 'Yesterday';
    } else if (date.isSame(moment().add(1, 'day'), 'day')) {
      return 'Tomorrow';
    } else if (date.isSame(moment(), 'week')) {
      return date.format('dddd');
    } else if (date.isSame(moment(), 'year')) {
      return date.format('MMM D');
    } else {
      return date.format('MMM D, YYYY');
    }
  },

  // Get week start date
  getWeekStart: (dateString?: string): string => {
    const date = dateString ? moment(dateString) : moment();
    return date.startOf('week').format('YYYY-MM-DD');
  },

  // Get week end date
  getWeekEnd: (dateString?: string): string => {
    const date = dateString ? moment(dateString) : moment();
    return date.endOf('week').format('YYYY-MM-DD');
  },

  // Get month start date
  getMonthStart: (dateString?: string): string => {
    const date = dateString ? moment(dateString) : moment();
    return date.startOf('month').format('YYYY-MM-DD');
  },

  // Get month end date
  getMonthEnd: (dateString?: string): string => {
    const date = dateString ? moment(dateString) : moment();
    return date.endOf('month').format('YYYY-MM-DD');
  },

  // Get dates in range
  getDatesInRange: (startDate: string, endDate: string): string[] => {
    const dates: string[] = [];
    const start = moment(startDate);
    const end = moment(endDate);
    
    while (start.isSameOrBefore(end)) {
      dates.push(start.format('YYYY-MM-DD'));
      start.add(1, 'day');
    }
    
    return dates;
  },

  // Get days between two dates
  getDaysBetween: (startDate: string, endDate: string): number => {
    return moment(endDate).diff(moment(startDate), 'days');
  },

  // Add days to date
  addDays: (dateString: string, days: number): string => {
    return moment(dateString).add(days, 'days').format('YYYY-MM-DD');
  },

  // Subtract days from date
  subtractDays: (dateString: string, days: number): string => {
    return moment(dateString).subtract(days, 'days').format('YYYY-MM-DD');
  },

  // Get calendar month data
  getCalendarMonth: (dateString?: string) => {
    const date = dateString ? moment(dateString) : moment();
    const startOfMonth = date.clone().startOf('month');
    const endOfMonth = date.clone().endOf('month');
    const startOfCalendar = startOfMonth.clone().startOf('week');
    const endOfCalendar = endOfMonth.clone().endOf('week');

    const weeks: string[][] = [];
    let currentWeek: string[] = [];
    let current = startOfCalendar.clone();

    while (current.isSameOrBefore(endOfCalendar)) {
      currentWeek.push(current.format('YYYY-MM-DD'));
      
      if (current.day() === 6) { // Saturday
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      current.add(1, 'day');
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return {
      weeks,
      monthName: date.format('MMMM YYYY'),
      startOfMonth: startOfMonth.format('YYYY-MM-DD'),
      endOfMonth: endOfMonth.format('YYYY-MM-DD'),
    };
  },
};
