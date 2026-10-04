import BillingModel from './billing.model.js';
import { createAbaCheckoutPayload,createAbaCheckTransactionPayload } from '../../utils/abaPayWay.js';
import axios from 'axios';
import crypto from 'crypto';


const CHECK_URL = "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/check-transaction";
// 📋 យកវិក្កយបត្រទាំងអស់
export const getAllBills = async (req, res) => {
  try {
    const bills = await BillingModel.getAll();
    res.status(200).json({ success: true, data: bills });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ➕ បង្កើតវិក្កយបត្រថ្មី
export const createBill = async (req, res) => {
  try {
    const newBill = await BillingModel.create(req.body);
    res.status(201).json({ success: true, message: "Bill created successfully bro!", data: newBill });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 💳 Controller សម្រាប់ទូទាត់ជាមួយ ABA PayWay (24 Fields ស្ដង់ដារ)
export const checkoutWithAba = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await BillingModel.getById(id);

    if (!bill) {
      return res.status(404).json({ success: false, message: "Billing not found bro!" });
    }

    const { baseUrl, payload, tranId } = createAbaCheckoutPayload(bill);

    if (typeof BillingModel.updateTranId === 'function') {
      await BillingModel.updateTranId(id, tranId);
    }

    const response = await axios.post(baseUrl, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const resData = response.data;

    if (response.status === 200) {
      return res.status(200).json({
        success: true,
        message: "ABA PayWay USD Checkout initialized successfully bro!",
        billing_id: bill.id,
        tran_id: tranId,
        amount: `$${payload.amount}`,
        qr_code_image_base64: resData.qrImage || null,
        qr_string: resData.qrString || null,
        payment_url: resData.payment_url || null,
        deeplink: resData.abapay_deeplink || null,
        aba_response: resData
      });
    } else {
      return res.status(400).json({
        success: false,
        error: "Failed to initialize with ABA PayWay",
        aba_response: resData
      });
    }

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
};
export const checkAbaPaymentStatus = async (req, res) => {
  try {
    const { tran_id, status_val } = req.body;

    console.log("👉 Checking tran_id from request:", tran_id);

    const checkPayload = createAbaCheckTransactionPayload(tran_id);

    const checkRes = await axios.post(CHECK_URL, checkPayload, {
      headers: { 'Content-Type': 'application/json' }
    });

    const resData = checkRes.data;
    console.log("🔍 Full ABA Response Data:", resData);

    const abaStatus = resData.status;
    console.log("📊 Extracted abaStatus:", abaStatus, "Type:", typeof abaStatus);

    // ឆែកមើលលក្ខខណ្ឌទាំងអស់រួមទាំង status === 0 (ជោគជ័យរបស់ ABA)
    if (abaStatus === 0 || abaStatus === '0' || status_val === '0' || status_val === '00' || String(abaStatus).toUpperCase() === 'APPROVED') {
      
      if (typeof BillingModel !== 'undefined' && typeof BillingModel.updateStatusToPaid === 'function') {
        const updateResult = await BillingModel.updateStatusToPaid(tran_id, 'ABA_PAYWAY');
        console.log("✅ Database Update Result:", updateResult);
      } else {
        console.log("❌ Error: updateStatusToPaid function not found!");
      }

      return res.status(200).json({
        success: true,
        message: "Payment verified and updated to PAID successfully bro!",
        tran_id: tran_id,
        aba_data: resData
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment is pending or not yet approved bro!",
        aba_response: resData
      });
    }

  } catch (error) {
    console.error("🔥 Error in checkAbaPaymentStatus:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
};