export function formatUSD(amount: number): { whole: string; cents: string } {
  const [whole, cents] = amount.toFixed(2).split(".");
  return {
    whole: `$${Number(whole).toLocaleString("es-EC")}`,
    cents,
  };
}

export function formatAmount(amount: number): string {
  return amount.toLocaleString("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
