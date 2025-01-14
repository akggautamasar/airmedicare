import { loadScript } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const initializeRazorpay = async () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount: number) => {
  try {
    const response = await fetch("/api/create-razorpay-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
};

export const processPayment = async ({
  amount,
  orderId,
  currency = "INR",
  name = "Airmedi Connect",
  description = "Medical Consultation",
  prefill = {},
}) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: amount * 100, // Razorpay expects amount in paise
    currency,
    name,
    description,
    order_id: orderId,
    prefill,
    handler: function (response: any) {
      console.log(response);
      // Handle successful payment
      return response;
    },
    modal: {
      ondismiss: function () {
        console.log("Payment modal closed");
      },
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};