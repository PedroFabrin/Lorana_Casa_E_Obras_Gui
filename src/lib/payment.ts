export const LAST_ORDER_KEY = "lorana:lastCheckoutOrderId";
export const PAYMENT_WINDOW_NAME = "lorana-mp-checkout";

const POPUP_WIDTH = 900;
const POPUP_HEIGHT = 860;

function paymentWindowFeatures(): string {
  const width = Math.min(POPUP_WIDTH, Math.round(window.screen.availWidth * 0.9));
  const height = Math.min(POPUP_HEIGHT, Math.round(window.screen.availHeight * 0.92));
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2));
  return `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no`;
}

export function openPaymentWindow(url = ""): Window | null {
  return window.open(url, PAYMENT_WINDOW_NAME, paymentWindowFeatures());
}
