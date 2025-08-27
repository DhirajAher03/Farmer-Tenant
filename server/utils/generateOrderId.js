const generateOrderId = () => {
  const prefix = "ORD";
  const timestamp = Date.now().toString().slice(-6); // last 6 digits of timestamp
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digit random
  return `${prefix}-${timestamp}-${randomNum}`;
};

module.exports = generateOrderId;  // <-- CommonJS export
