// WisdomUp shop settings — read by the website (cart, checkout) AND by the order server (api/orders.py),
// so prices, fees and payment options can never disagree. Keep this file valid JSON after the "=".
window.WU_SHOP = {
  "currency": "PKR",
  "freeDeliveryFrom": 40000,
  "delivery": {
    "standard": { "label": "Standard delivery", "eta": "3–5 working days", "fee": 250, "freeOver": true },
    "express": { "label": "Express delivery", "eta": "1–2 working days", "fee": 450, "freeOver": false }
  },
  "giftWrap": 490,
  "maxQty": 10,
  "payments": {
    "cod": { "label": "Cash on Delivery", "note": "Pay the rider in cash when your order arrives." },
    "jazzcash": { "label": "JazzCash", "note": "Send the total to our JazzCash account, then share the receipt on WhatsApp.", "accountTitle": "", "accountNumber": "" },
    "easypaisa": { "label": "EasyPaisa", "note": "Send the total to our EasyPaisa account, then share the receipt on WhatsApp.", "accountTitle": "", "accountNumber": "" },
    "bank": { "label": "Bank transfer", "note": "Transfer the total to our bank account, then share the receipt on WhatsApp.", "bank": "", "accountTitle": "", "iban": "" }
  },
  "whatsapp": "923279800153",
  "statuses": ["new", "confirmed", "paid", "shipped", "delivered", "cancelled"]
};
