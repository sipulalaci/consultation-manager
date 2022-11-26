export const blockInvalidNumberInputChar = (e: any) =>
  ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
