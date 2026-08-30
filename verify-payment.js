const crypto = require('crypto');

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json').end(JSON.stringify(body));
}

function safeEqual(a, b) {
  const aa = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const paymentId = req.body?.razorpay_payment_id;
  const orderId = req.body?.razorpay_order_id;
  const signature = req.body?.razorpay_signature;

  if (!paymentId || !orderId || !signature) {
    return json(res, 400, { verified: false, error: 'Missing payment verification fields.' });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return json(res, 500, { verified: false, error: 'Razorpay server configuration is missing.' });

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  if (!safeEqual(expected, String(signature))) {
    return json(res, 400, { verified: false, error: 'Payment signature mismatch.' });
  }

  return json(res, 200, {
    verified: true,
    payment_id: paymentId,
    order_id: orderId
  });
};
