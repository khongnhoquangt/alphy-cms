import { nFormatter } from "@/lib/nFormatter";
import { renderDecimal } from "@/lib/renderDecimal";

export const renderTokenAmount = (tokenAmount?: string | number) => {
  return Number(tokenAmount) > 1000
    ? nFormatter(Number(tokenAmount))
    : renderDecimal(Number(tokenAmount), 6);
};
