export const nFormatter = (num: number): string => {
  // Trả về '0' nếu đầu vào là 0
  if (num === 0) {
    return "0";
  }

  // Xử lý các trường hợp đầu vào không hợp lệ
  if (!num || isNaN(num)) {
    return "";
  }

  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];

  // Tìm ra đơn vị phù hợp (K, M, B, ...)
  const item = lookup
    .slice()
    .reverse()
    .find((item) => num >= item.value);

  // Nếu không tìm thấy (trường hợp dự phòng), trả về số ban đầu
  if (!item) {
    return num.toString();
  }

  // Chia số cho giá trị của đơn vị và làm tròn đến tối đa 2 chữ số thập phân
  // Ví dụ 1: 10050 / 1000 = 10.05 => Math.round(10.05 * 100) / 100 = 10.05
  // Ví dụ 2: 10500 / 1000 = 10.5  => Math.round(10.5 * 100) / 100 = 10.5
  // Ví dụ 3: 10000 / 1000 = 10    => Math.round(10 * 100) / 100 = 10
  const formattedNum = Math.round((num / item.value) * 100) / 100;

  // Kết hợp số đã định dạng với ký hiệu đơn vị
  return formattedNum.toString() + item.symbol;
};
