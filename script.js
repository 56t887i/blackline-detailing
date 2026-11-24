
document.addEventListener("DOMContentLoaded", () => {

    // ELEMENTS

    const preloader = document.getElementById("preloader");
    const header = document.getElementById("header");
    const burger = document.getElementById("burger");
    const nav = document.getElementById("nav");

    const carType = document.getElementById("carType");
    const checkboxes = document.querySelectorAll(".service-checkbox");
    const totalPrice = document.getElementById("totalPrice");

    const calcBook = document.getElementById("calcBook");

    const bookingModal = document.getElementById("bookingModal");
    const modalClose = document.getElementById("modalClose");
    const modalOverlay = document.getElementById("modalOverlay");
    const modalAction = document.getElementById("modalAction");

    const contactForm = document.getElementById("contactForm");

    const toast = document.getElementById("toast");
    const toastText = document.getElementById("toastText");


    // PRELOADER

    function hidePreloader() {
        if (preloader) {
            preloader.classList.add("hidden");
        }
    }

    window.addEventListener("load", hidePreloader);
    setTimeout(hidePreloader, 2500);


    // SERVICE IMAGE LABELS
    // Фотографии задаются в index.html, чтобы каждая услуга имела своё изображение.

    const serviceLabels = [
        "DETAILED CLEANING",
        "PAINT CORRECTION",
        "CERAMIC PROTECTION",
        "PAINT PROTECTION FILM"
    ];

    document.querySelectorAll(".service-card").forEach((card, index) => {
        const image = card.querySelector(".service-image img");
        const imageContainer = card.querySelector(".service-image");

        if (image) {
            image.decoding = "async";
            image.loading = "lazy";
        }

        if (!image || !imageContainer || !serviceLabels[index]) return;

        // Защита от повторного добавления подписи.
        if (!imageContainer.querySelector(".service-image-label")) {
            const label = document.createElement("span");
            label.className = "service-image-label";
            label.textContent = serviceLabels[index];
            imageContainer.appendChild(label);
        }

        image.addEventListener("error", () => {
            imageContainer.classList.add("image-fallback");
        }, { once: true });
    });


    // HEADER SCROLL

    function updateHeader() {
        if (!header) return;
        header.classList.toggle("scrolled", window.scrollY > 40);
    }

    window.addEventListener("scroll", updateHeader);
    updateHeader();


    // MOBILE NAVIGATION

    const menuBackdrop = document.createElement("div");
    menuBackdrop.className = "menu-backdrop";
    document.body.appendChild(menuBackdrop);

    const menuFooter = document.createElement("div");
    menuFooter.className = "nav-mobile-footer";

    menuFooter.innerHTML = `
        <span class="nav-footer-label">BLACKLINE DETAILING STUDIO</span>
        <a href="#contacts" class="nav-footer-button">
            ЗАПИСАТЬСЯ НА УХОД <span>↗</span>
        </a>
        <span class="nav-footer-caption">
            THE ART OF PERFECTION
        </span>
    `;

    if (nav) {
        nav.appendChild(menuFooter);
    }

    function openMenu() {
        if (!burger || !nav) return;

        burger.classList.add("active");
        nav.classList.add("active");
        menuBackdrop.classList.add("active");

        document.body.classList.add("menu-open");

        burger.setAttribute("aria-expanded", "true");
    }

    function closeMenu() {
        if (burger) {
            burger.classList.remove("active");
            burger.setAttribute("aria-expanded", "false");
        }

        if (nav) {
            nav.classList.remove("active");
        }

        menuBackdrop.classList.remove("active");
        document.body.classList.remove("menu-open");
    }

    if (burger && nav) {
        burger.setAttribute("aria-expanded", "false");

        burger.addEventListener("click", () => {
            if (nav.classList.contains("active")) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMenu);
        });
    }

    menuBackdrop.addEventListener("click", closeMenu);


    // ESCAPE KEY

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeMenu();
            closeModal();
            closeGallery();
        }

    });


    // REVEAL ANIMATIONS — лёгкое появление один раз
    // После появления элемент перестаёт наблюдаться, поэтому прокрутка не дёргается.

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.06,
            rootMargin: "0px 0px -45px 0px"
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add("visible");
        });
    }


    // CALCULATOR

    function calculatePrice() {

        if (!carType || !totalPrice) return 0;

        const multiplier = Number(carType.value);

        let basePrice = 0;

        checkboxes.forEach(checkbox => {

            if (checkbox.checked) {
                basePrice += Number(checkbox.value);
            }

        });

        const finalPrice = Math.round(basePrice * multiplier);

        totalPrice.textContent =
            finalPrice.toLocaleString("ru-RU") + " ₽";

        return finalPrice;
    }

    if (carType) {
        carType.addEventListener("change", calculatePrice);
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", calculatePrice);
    });

    calculatePrice();


    // TOAST

    let toastTimeout;

    function showToast(message) {

        if (!toast || !toastText) return;

        toastText.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimeout);

        toastTimeout = setTimeout(() => {
            toast.classList.remove("show");
        }, 3500);

    }


    // MODAL

    function openModal(description) {

        if (!bookingModal) return;

        const modalDescription = document.getElementById("modalDescription");

        if (modalDescription) {
            modalDescription.textContent =
                description || "Оставьте заявку, и мы свяжемся с вами.";
        }

        bookingModal.classList.add("active");
        bookingModal.setAttribute("aria-hidden", "false");

        document.body.classList.add("modal-open");

        if (modalClose) {
            modalClose.focus();
        }

    }

    function closeModal() {

        if (!bookingModal) return;

        bookingModal.classList.remove("active");
        bookingModal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("modal-open");

    }

    if (modalClose) {
        modalClose.addEventListener("click", closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener("click", closeModal);
    }


    // CALCULATOR BOOKING

    if (calcBook) {
        calcBook.addEventListener("click", () => {

            const price = calculatePrice();

            if (price === 0) {
                showToast("Сначала выберите хотя бы одну услугу.");
                return;
            }

            openModal(
                "Вы выбрали услуги на предварительную сумму " +
                price.toLocaleString("ru-RU") +
                " ₽. Оставьте заявку, чтобы обсудить детали."
            );

        });
    }


    // MODAL ACTION

    if (modalAction) {
        modalAction.addEventListener("click", () => {

            closeModal();

            const contacts = document.getElementById("contacts");

            if (contacts) {
                contacts.scrollIntoView({
                    behavior: "smooth"
                });
            }

            setTimeout(() => {
                const clientName = document.getElementById("clientName");

                if (clientName) {
                    clientName.focus();
                }
            }, 700);

        });
    }


    // CONTACT FORM

    if (contactForm) {
        contactForm.addEventListener("submit", event => {

            event.preventDefault();

            const name = document.getElementById("clientName").value.trim();
            const phone = document.getElementById("clientPhone").value.trim();
            const service = document.getElementById("clientService").value;

            if (name.length < 2) {
                showToast("Введите корректное имя.");
                return;
            }

            if (phone.replace(/\D/g, "").length < 10) {
                showToast("Проверьте номер телефона.");
                return;
            }

            if (!service) {
                showToast("Выберите интересующую услугу.");
                return;
            }

            // ДЕМОНСТРАЦИОННАЯ ФОРМА.
            // ДАННЫЕ НИКУДА НЕ ОТПРАВЛЯЮТСЯ.

            console.log("DEMO APPLICATION:", {
                name,
                phone,
                service,
                comment: document.getElementById("clientComment").value.trim()
            });

            showToast("Демо-форма работает. Отправка пока не подключена.");

            contactForm.reset();

        });
    }


    // SMOOTH SCROLL

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", event => {

            const targetId = anchor.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });

        });

    });


    // GALLERY FILTERS + LIGHTBOX

    const gallery = document.querySelector(".gallery");
    const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
    const galleryFilters = document.querySelectorAll(".gallery-filter");
    const lightbox = document.getElementById("galleryLightbox");

    let activeGalleryIndex = 0;
    let lastGalleryTrigger = null;

    function visibleGalleryItems() {
        return galleryItems.filter(item => !item.hidden);
    }

    galleryFilters.forEach(filter => {
        filter.addEventListener("click", () => {
            const category = filter.dataset.filter;

            galleryFilters.forEach(button => {
                const active = button === filter;
                button.classList.toggle("active", active);
                button.setAttribute("aria-pressed", String(active));
            });

            galleryItems.forEach(item => {
                item.hidden = item.dataset.category !== category;
            });
        });
    });

    // При загрузке показываем экстерьер; интерьер открывается отдельным фильтром.
    const initialGalleryFilter = document.querySelector(".gallery-filter.active");
    if (initialGalleryFilter) {
        const initialCategory = initialGalleryFilter.dataset.filter;
        galleryItems.forEach(item => {
            item.hidden = item.dataset.category !== initialCategory;
        });
    }

    function showGalleryImage(index) {
        if (!lightbox) return;

        const items = visibleGalleryItems();
        if (!items.length) return;

        activeGalleryIndex = (index + items.length) % items.length;
        const item = items[activeGalleryIndex];
        const source = item.querySelector("img");
        const caption = item.querySelector(".gallery-caption strong");
        const image = lightbox.querySelector(".lightbox-figure img");
        const captionTarget = lightbox.querySelector(".lightbox-figure figcaption");
        const count = lightbox.querySelector(".lightbox-count");

        image.src = source.currentSrc || source.src;
        image.alt = source.alt;
        captionTarget.textContent = caption ? caption.textContent : source.alt;
        count.textContent = `${String(activeGalleryIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
    }

    function openGallery(item) {
        if (!lightbox) return;
        const items = visibleGalleryItems();
        activeGalleryIndex = items.indexOf(item);
        lastGalleryTrigger = item;
        showGalleryImage(activeGalleryIndex);
        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");
        lightbox.querySelector(".lightbox-close").focus();
    }

    function closeGallery() {
        if (!lightbox) return;
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-open");
        if (lastGalleryTrigger) lastGalleryTrigger.focus();
    }

    galleryItems.forEach(item => {
        item.addEventListener("click", () => openGallery(item));
    });

    if (lightbox) {
        lightbox.querySelector(".lightbox-close").addEventListener("click", closeGallery);
        lightbox.addEventListener("click", event => {
            if (event.target === lightbox) closeGallery();
        });
        lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showGalleryImage(activeGalleryIndex - 1));
        lightbox.querySelector(".lightbox-next").addEventListener("click", () => showGalleryImage(activeGalleryIndex + 1));
    }

    document.addEventListener("keydown", event => {
        if (!lightbox || !lightbox.classList.contains("active")) return;
        if (event.key === "ArrowLeft") showGalleryImage(activeGalleryIndex - 1);
        if (event.key === "ArrowRight") showGalleryImage(activeGalleryIndex + 1);
    });

    // IMAGE FALLBACK

    document.querySelectorAll("img").forEach(image => {

        image.addEventListener("error", () => {

            image.classList.add("image-error");

            if (image.parentElement) {
                image.parentElement.classList.add("image-fallback");
            }

        });

    });

});
