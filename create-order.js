const Razorpay = require('razorpay');

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json').end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) return json(res, 500, { error: 'Razorpay server configuration is missing.' });

    const amount = Number(req.body?.amount);
    const currency = String(req.body?.currency || 'INR');
    const receipt = String(req.body?.receipt || `resumora_${Date.now()}`);

    if (!Number.isInteger(amount) || amount < 100) {
      return json(res, 400, { error: 'Amount must be an integer of at least 100 paise.' });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({ amount, currency, receipt });

    return json(res, 200, {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId
    });
  } catch (error) {
    const status = error?.statusCode === 401 || error?.statusCode === 403 ? 401 : 500;
    return json(res, status, { error: error?.error?.description || error?.description || 'Unable to create Razorpay order.' });
  }
};
