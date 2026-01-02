export function formatNumber(number: number) {
  const numberDigits = () => {
    if (number >= 10) {
      return 2;
    }
    if (number >= 100) {
      return 1;
    }
    if (number >= 1000) {
      return 0;
    }
    return 3;
  };
  return number.toLocaleString("en-US", {
    maximumFractionDigits: numberDigits(),
  });
}
