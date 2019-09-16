export const isEmployee = employeeName => ({ employee }) => employee === employeeName
export const matchesMonth = (month, year) => ({ date }) => new Date(date).getMonth() === month - 1;

