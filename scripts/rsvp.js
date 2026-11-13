var SUPPORTED_LANGS = ["vi", "en"];
let currentLang = "vi";
let isSubmitting = false;
// -------------------------
// 1. Function chạy sau khi load
// -------------------------
function initPage() {
  console.log('--- CurrentLang ---', currentLang);
  console.log("Trang đã load xong!");
}

function isSupported(lang) {
  return SUPPORTED_LANGS.indexOf(lang) !== -1;
}

function getLangFromURL() {
  var params = new URLSearchParams(window.location.search);
  var lang = params.get("lang");
  return isSupported(lang) ? lang : null;
}

// -------------------------
// 2. Function xử lý khi submit form
// -------------------------
async function handleFormSubmit(e, lang = "vi", sheet = "confirm") {
  e.preventDefault();

  // Prevent duplicate submit
  if (isSubmitting) { return; }

  const form = e.target;

  // if (!form) {
  //   console.error("RSVP form not found");
  //   return;
  // }

  // =========================
  // i18n Messages
  // =========================
  const messages = {
    vi: {
      sendingTitle: "Đang gửi...",
      sendingText: "Vui lòng chờ trong giây lát",
      successTitle: "Thành công!",
      successText:
        "Cảm ơn bạn đã xác nhận. Thông tin đã được chuyển đến cô dâu và chú rể rồi nha.",
      errorTitle: "Lỗi!",
      errorServer: "OPPS! Không tìm thấy server",
      errorRetry: "Thử lại",
    },
    en: {
      sendingTitle: "Sending...",
      sendingText: "Please wait a moment",
      successTitle: "Success!",
      successText:
        "Thank you for your confirmation. Your information has been forwarded to the bride and groom.",
      errorTitle: "Error!",
      errorServer: "OPPS! Server not found",
      errorRetry: "Try again",
    },
  };

  const t = messages[lang] || messages.vi;

  // Lock submit
  isSubmitting = true;

  // Disable submit button
  // const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
  // if (submitButton) {
  //   submitButton.disabled = true;
  //   submitButton.dataset.originalText = submitButton.textContent;
  //   if (submitButton.tagName === "BUTTON") {
  //     submitButton.textContent = t.sendingTitle;
  //   }
  // }

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const {
    name = "",
    confirm = "",
    guest_number = "",
    guest_name = "",
    phone = "",
    message = "",
  } = data;

  // =========================
  // Loading popup
  // =========================
  Swal.fire({
    title: t.sendingTitle,
    text: t.sendingText,
    icon: "info",
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading(),
  });

  const sheetURL = `https://script.google.com/macros/s/AKfycbwAKYVOE8CrBachguHnpNGe--1pickN7FjiyG0W37wyrpus4gfqPBup5DWSjV7owbZ-/exec?sheet=${sheet}`;

  const controller = new AbortController();

  const timeout = setTimeout(() => { controller.abort(); }, 15000);

  try {
    const body = new URLSearchParams({ name, confirm, guest_number, guest_name, phone, message });
    const res = await fetch(sheetURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8", },
      body,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    // Nếu server lỗi HTTP
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    let result;
    try {
      result = await res.json();
    } catch (error) {
      throw new Error("Invalid server response");
    }

    if (!result || result.success === false) {
      throw new Error(t.errorServer);
    }

    // Success
    form.reset();

    Swal.fire({
      title: t.successTitle,
      text: t.successText,
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#3c7fc2",
    });
  } catch (error) {
    console.error("Error:", error);
    clearTimeout(timeout);
    console.error("RSVP submit error:", error);

    let errorMessage = t.errorServer;
    if (error.name === "AbortError") {
      errorMessage = t.errorTimeout;
    }

    await Swal.fire({
      title: t.errorTitle,
      text: error.message || t.errorServer,
      icon: "error",
      confirmButtonText: t.errorRetry,
      confirmButtonColor: "#3c7fc2",
    });
  } finally {
    isSubmitting = false;
    // if (submitButton) {
    //   submitButton.disabled = false;
    //   if (submitButton.tagName === "BUTTON") {
    //     submitButton.textContent = submitButton.dataset.originalText || "Submit";
    //   }
    // }
  }
}

// -------------------------
// 3. Gắn sự kiện khi DOM ready
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
  initPage();

  const form = document.forms["rsvp-form"];
  currentLang = getLangFromURL();
  if (form) {
    form.addEventListener("submit", (e) => handleFormSubmit(e, currentLang, "confirm"));
  }
});

document.addEventListener("langchange", () => {
  currentLang = getLangFromURL();
  console.log('--- Lang ---', currentLang);
});
