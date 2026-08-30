# Resumora — Vercel + Razorpay

## Deploy
1. Push this folder to GitHub.
2. Import the repository into Vercel.
3. In Vercel → Settings → Environment Variables add:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
4. Redeploy.

Use Razorpay **Test Mode** credentials while testing.

## Payment plans
- Pro: ₹149 → 14900 paise
- One-time Resume Transformation: ₹299 → 29900 paise

## Important
`RAZORPAY_KEY_SECRET` is server-only. It is never included in `index.html`.

## Test
Open the deployed site → Pricing → Upgrade → Razorpay Checkout. After payment, the browser posts the three Razorpay response fields to `/api/verify-payment`.

This implementation verifies the checkout signature. It does not create a database record or activate a user account yet. For a production subscription system, add authentication, a database, and Razorpay subscription/webhook handling.
