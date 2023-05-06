export const convertToEth = (amount) => {
  if (!amount) {
    return null;
  }
  if (typeof amount === "string") {
    amount = parseInt(amount);
  }
  return amount / 1e18;
};
