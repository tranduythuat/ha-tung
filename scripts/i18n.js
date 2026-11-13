(function () {
    "use strict";

    var SUPPORTED_LANGS = ["vi", "en"];
    var DEFAULT_LANG = "vi";

    /* =========================================================
     * Translation dictionary
     * Keys map to data-i18n / data-i18n-placeholder attributes.
     * Values can contain simple HTML (span/br/strong) since some
     * source strings already include inline markup.
     * ========================================================= */
    var translations = {
        vi: {
            "lang.popupTitle": "Chọn ngôn ngữ / Select language /",
            "lang.vi": "Tiếng Việt",
            "lang.en": "English",

            "cover.invite": "TRÂN TRỌNG KÍNH MỜI BẠN",
            "cover.time": "DÀNH THỜI GIAN ĐẾN THAM DỰ TIỆC THÂN MẬT CỦA",
            "cover.names": "Nhật Hà & Sơn Tùng",

            "time.title": "Thời gian",
            "time.label": "VÀO LÚC 17:30 - THỨ SÁU",
            "time.date": "27.11.2026",

            "location.title": "Địa điểm",
            "location.name": "Hanoi Tower Wedding & Convention",
            "location.address": "49 Hai Bà Trưng, Cửa Nam, Hà Nội",
            "location.map": "MAPS",
            "location.quote": "“AT THE TIME OF MEETING THE RIGHT PEOPLE. <br> NOT A STRONG VIBRATION BUT A LIFETIME OF PEACE”",

            "timeline.title": "Timeline",
            "timeline.item.welcome": "17:30 - Đón khách",
            "timeline.item.ceremony": "18:00 - Hôn lễ",
            "timeline.item.toasting": "18:30 - Nâng ly",

            "dresscode.title": "Dresscode",
            "dresscode.text": "“VUI LÒNG KHÔNG MẶC TRANG PHỤC MÀU TRẮNG”",
            "dresscode.white": "Trắng",
            "dresscode.cream": "Kem",
            "dresscode.pink": "Hồng",
            "dresscode.green": "Xanh pastel",
            "dresscode.brown": "Nâu",
            "dresscode.red": "Đỏ burgundy",
            "dresscode.navy": "Xanh navy",
            "dresscode.black": "Đen",

            "rsvp.title": "Gửi lời chúc đến Hà & Tùng",
            "rsvp.text": "HÃY DÀNH CHÚT THỜI GIAN ĐỂ XÁC NHẬN SỰ THAM DỰ CỦA BẠN <br><strong> TRƯỚC NGÀY 20.12.2026 </strong>NHÉ",
            "rsvp.confirmYes": "Sẽ có mặt",
            "rsvp.confirmNo": "Xin lỗi, không thể tham dự",
            "rsvp.namePlaceholder": "Tên của bạn",
            "rsvp.guestNumberPlaceholder": "Số khách mời đi kèm",
            "rsvp.guestNamePlaceholder": "Tên khách mời đi kèm",
            "rsvp.phonePlaceholder": "Số điện thoại của bạn",
            "rsvp.messagePlaceholder": "Lời nhắn đến cô dâu chú rể",
            "rsvp.submit": "Xác nhận"
        },
        en: {
            "lang.popupTitle": "Choose language / Chọn ngôn ngữ /",
            "lang.vi": "Tiếng Việt",
            "lang.en": "English",

            "cover.invite": "WE KINDLY INVITE YOU",
            "cover.time": "PLEASE JOIN US FOR OUR INTIMATE CELEBRATION",
            "cover.names": "Jolie Le & Tung Doan",

            "time.title": "Time",
            "time.label": "AT 17:30 - FRIDAY",
            "time.date": "27.11.2026",

            "location.title": "Location",
            "location.name": "Hanoi Tower Wedding & Convention",
            "location.address": "49 Hai Ba Trung Street, Cua Nam Ward, Ha Noi",
            "location.map": "MAPS",
            "location.quote": "“AT THE TIME OF MEETING THE RIGHT PEOPLE. <br> NOT A STRONG VIBRATION BUT A LIFETIME OF PEACE”",

            "timeline.title": "Timeline",
            "timeline.item.welcome": "17:30 - Guest Reception",
            "timeline.item.ceremony": "18:00 - Ceremony",
            "timeline.item.toasting": "18:30 - Toast",

            "dresscode.title": "Dresscode",
            "dresscode.text": "“PLEASE AVOID WEARING WHITE”",
            "dresscode.white": "White",
            "dresscode.cream": "Cream",
            "dresscode.pink": "Dusty Pink",
            "dresscode.green": "Pastel Blue",
            "dresscode.brown": "Brown",
            "dresscode.red": "Burgundy",
            "dresscode.navy": "Navy",
            "dresscode.black": "Black",

            "rsvp.title": "Send your wishes to Jolie & Tung",
            "rsvp.text": "PLEASE TAKE A MOMENT TO CONFIRM YOUR ATTENDANCE <br><strong> BEFORE 20.12.2026 </strong> THANK YOU",
            "rsvp.confirmYes": "Will attend",
            "rsvp.confirmNo": "Sorry, unable to attend",
            "rsvp.namePlaceholder": "Your name",
            "rsvp.guestNumberPlaceholder": "Number of guests accompanying you",
            "rsvp.guestNamePlaceholder": "Name of accompanying guest",
            "rsvp.phonePlaceholder": "Your phone number",
            "rsvp.messagePlaceholder": "A message to the bride and groom",
            "rsvp.submit": "Confirm"
        }
    };

    var switcherLabels = { vi: "English", en: "Tiếng Việt" };

    function isSupported(lang) {
        return SUPPORTED_LANGS.indexOf(lang) !== -1;
    }

    function getLangFromURL() {
        var params = new URLSearchParams(window.location.search);
        var lang = params.get("lang");
        return isSupported(lang) ? lang : null;
    }

    function updateURL(lang) {
        try {
            var url = new URL(window.location.href);
            url.searchParams.set("lang", lang);
            window.history.replaceState({}, "", url.toString());
        } catch (e) {
            /* ignore for very old browsers */
        }
    }

    function applyTranslations(lang) {
        var dict = translations[lang] || translations[DEFAULT_LANG];

        document.documentElement.setAttribute("lang", lang);

        document.querySelectorAll("[data-i18n]").forEach(function (el) {
            var key = el.getAttribute("data-i18n");
            if (dict[key] !== undefined) {
                el.innerHTML = dict[key];
            }
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
            var key = el.getAttribute("data-i18n-placeholder");
            if (dict[key] !== undefined) {
                el.setAttribute("placeholder", dict[key]);
            }
        });

        var switcher = document.getElementById("langSwitcher");
        if (switcher) {
            switcher.textContent = switcherLabels[lang] || switcherLabels[DEFAULT_LANG];
            switcher.setAttribute("data-current-lang", lang);
        }
    }

    function setScrollLocked(isLocked) {
        if (!document.body) return;

        document.body.classList.toggle("no-scroll", isLocked);
        document.documentElement.classList.toggle("no-scroll", isLocked);

        if (isLocked) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        }
    }

    function hidePopup() {
        var overlay = document.getElementById("langOverlay");
        if (overlay) {
            overlay.classList.remove("is-visible");
        }
        setScrollLocked(false);
    }

    function showPopup() {
        var overlay = document.getElementById("langOverlay");
        if (overlay) {
            overlay.classList.add("is-visible");
        }
        setScrollLocked(true);
    }

    function selectLang(lang, options) {
        if (!isSupported(lang)) return;
        var opts = options || {};

        applyTranslations(lang);
        updateURL(lang);
        hidePopup();

        if (!opts.silent) {
            document.dispatchEvent(
                new CustomEvent("langchange", { detail: { lang: lang } })
            );
        }
    }

    function initPopupButtons() {
        document.querySelectorAll(".lang-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
                selectLang(btn.getAttribute("data-lang"));
            });
        });
    }

    function initSwitcher() {
        var switcher = document.getElementById("langSwitcher");
        if (!switcher) return;
        switcher.addEventListener("click", function () {
            var current = switcher.getAttribute("data-current-lang") || DEFAULT_LANG;
            var next = current === "vi" ? "en" : "vi";
            selectLang(next);
        });
    }

    function init() {
        initPopupButtons();
        initSwitcher();

        var urlLang = getLangFromURL();

        if (urlLang) {
            // Language is chosen via URL param; no popup needed.
            applyTranslations(urlLang);
        } else {
            // No lang param: show the language picker so the visitor can choose.
            applyTranslations(DEFAULT_LANG);
            showPopup();
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
