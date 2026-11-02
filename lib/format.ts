const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export const formatMoney = (n: number) => money.format(n);

/** 13 -> "1:00 PM", 24 -> "12:00 AM" */
export function formatHour(hour: number) {
  const h = hour % 24;
  const suffix = h < 12 ? "AM" : "PM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:00 ${suffix}`;
}

export function formatDate(date: string) {
  // Dates are stored as YYYY-MM-DD; parse as local so the day never shifts.
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function todayString() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export const SERVICE_FEE_RATE = 0.05;

export function quote(hourlyRate: number, securityDeposit: number, hours: number) {
  const round = (n: number) => Math.round(n * 100) / 100;
  const subtotal = round(hourlyRate * hours);
  const serviceFee = round(subtotal * SERVICE_FEE_RATE);
  return { subtotal, securityDeposit, serviceFee, total: round(subtotal + securityDeposit + serviceFee) };
}
