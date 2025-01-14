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

interface PaymentOptions {
  amount: number;
  orderId: string;
  currency?: string;
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

export const processPayment = (options: PaymentOptions): Promise<{ razorpay_payment_id: string }> => {
  return new Promise((resolve, reject) => {
    const razorpayOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: options.amount * 100,
      currency: options.currency || "INR",
      name: options.name || "Airmedi Connect",
      description: options.description || "Medical Consultation",
      order_id: options.orderId,
      prefill: options.prefill || {},
      handler: function (response: any) {
        resolve(response);
      },
      modal: {
        ondismiss: function () {
          reject(new Error("Payment cancelled"));
        },
      },
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  });
};