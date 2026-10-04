import crypto from 'crypto';
import axios from 'axios';

// 🛠 មុខងារបង្កើត req_time ទម្រង់ YYYYMMDDHHmmss
const getAbaReqTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};
// 🔐 មុខងារគណនា Hash និងបង្កើត Payload សម្រាប់ឆែកស្ថានភាពទូទាត់ជាមួយ ABA
export const createAbaCheckTransactionPayload = (tranId) => {
  const apiKey = process.env.ABA_API_KEY;
  const merchantId = process.env.ABA_MERCHANT_ID;
  const reqTime = getAbaReqTime();

  // ស្ដង់ដារ Fields របស់ ABA check-transaction API (req_time + merchant_id + tran_id)
  const hashFields = [
    reqTime,
    merchantId,
    tranId
  ];

  const stringToHash = hashFields.join("");
  
  const hash = crypto
    .createHmac('sha512', apiKey)
    .update(stringToHash, 'utf-8')
    .digest('base64');

  return {
    req_time: reqTime,
    merchant_id: merchantId,
    tran_id: tranId,
    hash: hash
  };
};

// 🔐 មុខងារគណនា Hash តាមស្ដង់ដារ ២៤ Fields របស់ ABA Purchase API
export const createAbaCheckoutPayload = (billData) => {
  const apiKey = process.env.ABA_API_KEY;
  const merchantId = process.env.ABA_MERCHANT_ID;
  const baseUrl = "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase";

  const reqTime = getAbaReqTime();
  // បង្កើត tran_id ស្រដៀងនឹងកូដ Django របស់អ្នក
  const tranId = `INV${billData.id}${reqTime.slice(-10)}`;
  const amount = Number(billData.total_amount || 0).toFixed(2);
  const currency = "USD";
  const typeVal = "purchase";
  const shipping = "0";

  // Items encoded base64
  const itemsList = [{
    name: `Invoice #${billData.id}`,
    quantity: 1,
    price: parseFloat(amount)
  }];
  const items = Buffer.from(JSON.stringify(itemsList)).toString('base64');

  // Return URL (អាចដាក់ URL វេបសាយរបស់អ្នក ឬ ngrok)
  const returnUrl = Buffer.from("https://example.com/payment-callback/").toString('base64');

  const firstName = billData.firstname || "Patient";
  const lastName = billData.lastname || "User";
  const email = billData.email || "user@example.com";
  const phone = billData.phone || "012345678";

  // 🟢 លំដាប់ Field ទាំង ២៤ ស្របគ្នាបេះបិទជាមួយកូដ Django របស់អ្នក
  const hashFields = [
    reqTime,
    merchantId,
    tranId,
    amount,
    items,
    shipping,
    firstName,
    lastName,
    email,
    phone,
    typeVal,
    "",          // payment_option
    returnUrl,
    "",          // cancel_url
    "",          // continue_success_url
    "",          // return_deeplink
    currency,
    "",          // custom_fields
    "",          // return_params
    "",          // payout
    "",          // lifetime
    "",          // additional_params
    "",          // google_pay_token
    "",          // skip_success_page
  ];

  const stringToHash = hashFields.join("");
  
  const hash = crypto
    .createHmac('sha512', apiKey)
    .update(stringToHash, 'utf-8')
    .digest('base64');

  // Payload សម្រាប់ផ្ញើទៅកាន់ ABA API
  const payload = {
    req_time: reqTime,
    merchant_id: merchantId,
    tran_id: tranId,
    amount: amount,
    items: items,
    shipping: shipping,
    firstname: firstName,
    lastname: lastName,
    email: email,
    phone: phone,
    type: typeVal,
    return_url: returnUrl,
    currency: currency,
    hash: hash
  };

  return { baseUrl, payload, tranId };
};