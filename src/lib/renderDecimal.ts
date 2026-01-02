export const renderDecimal = (number: number, maxDecimal?: number) => {
  const newNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: maxDecimal || 2,
  }).format(number);
  return newNumber?.replace(",", "");
};
