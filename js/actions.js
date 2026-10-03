const header = document.querySelector(".header");
const navLinks = document.querySelectorAll(".nav a");
const sections = document.querySelectorAll("main section[id]");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

// Add a stronger glass effect after scrolling.
function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 30);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

// Highlight the navigation item for the section currently in view.
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            navLinks.forEach((link) => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === "#" + entry.target.id
                );
            });
        }
    });
}, {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
});

sections.forEach((section) => observer.observe(section));

// Mobile navigation.
menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", open);
});

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

// Reveal cards as they enter the screen.
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
});




const backToTop = document.getElementById("backToTop");
const progressRing = document.querySelector(".progress-ring-fill");

const circumference = 2 * Math.PI * 19;

progressRing.style.strokeDasharray = circumference;
progressRing.style.strokeDashoffset = circumference;


function updateScrollProgress() {

    const scrollTop = window.scrollY;

    const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    const progress =
        documentHeight > 0
            ? scrollTop / documentHeight
            : 0;

    /* Circular progress */
    const offset =
        circumference - (progress * circumference);

    progressRing.style.strokeDashoffset = offset;


    /* Show button after scrolling */
    if (scrollTop > 350) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
}


window.addEventListener(
    "scroll",
    updateScrollProgress,
    { passive: true }
);


/* Initial state */
updateScrollProgress();


/* Smooth scroll to top */
backToTop.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

const profileStack = document.getElementById("profileStack");

let cards = Array.from(
profileStack.querySelectorAll(".profile-card")
);

let isAnimating = false;

function updateStack() {

    cards.forEach((card, index) => {

        card.style.zIndex = cards.length - index;

        if (index === 0) {

            card.style.transform =
                "translateY(0) scale(1)";

            card.style.filter =
                "brightness(1)";

            card.style.opacity = "1";

        }
        else if (index === 1) {

            card.style.transform =
                "translateY(12px) scale(.96)";

            card.style.filter =
                "brightness(.82)";

            card.style.opacity = "1";

        }
        else if (index === 2) {

            card.style.transform =
                "translateY(24px) scale(.92)";

            card.style.filter =
                "brightness(.68)";

            card.style.opacity = "1";

        }
        else {

            card.style.transform =
                "translateY(36px) scale(.88)";

            card.style.filter =
                "brightness(.55)";

            card.style.opacity = "1";
        }
    });
}


/* =========================================
    THROW CARD
========================================= */

function throwCard(direction = "right") {

if (isAnimating || cards.length < 2) return;

isAnimating = true;

const currentCard = cards[0];

currentCard.classList.add(
direction === "left"
? "throw-left"
: "throw-right"
);

setTimeout(() => {

    /*
        * Move the thrown card
        * to the bottom of the array.
        */
    cards.push(cards.shift());

/*
    * Remove throw animation.
    */
currentCard.classList.remove(
"throw-left",
"throw-right"
);

/*
    * Temporarily disable transition
    * so it can jump behind the stack.
    */
currentCard.style.transition = "none";

updateStack();

/*
    * Force browser reflow.
    */
currentCard.offsetHeight;

/*
    * Restore transition.
    */
currentCard.style.transition =
"transform 0.45s cubic-bezier(.22, .61, .36, 1), opacity 0.35s ease, filter 0.35s ease";

isAnimating = false;

}, 430);
}


/* =========================================
   CLICK / DRAG / SWIPE
========================================= */

let startX = 0;
let currentX = 0;
let dragging = false;

profileStack.addEventListener("pointerdown", (event) => {

    if (isAnimating) return;

    dragging = true;

    startX = event.clientX;
    currentX = startX;

    profileStack.setPointerCapture(event.pointerId);
});


profileStack.addEventListener("pointermove", (event) => {

    if (!dragging || isAnimating) return;

    currentX = event.clientX;

    const difference = currentX - startX;

    const currentCard = cards[0];

    /*
     * While dragging, let the card follow
     * the finger/mouse.
     */
    const rotation = difference * 0.08;

    currentCard.style.transition = "none";

    currentCard.style.transform =
        `translateX(${difference}px) rotate(${rotation}deg)`;
});


profileStack.addEventListener("pointerup", () => {

    if (!dragging || isAnimating) return;

    dragging = false;

    const difference = currentX - startX;

    /*
     * If the user dragged:
     *
     * right → throw right
     * left  → throw left
     *
     * If it was just a click/tap,
     * difference will be almost 0,
     * so throw it to the RIGHT.
     */
    let direction;

    if (Math.abs(difference) < 10) {
        direction = "right";
    } else {
        direction = difference > 0 ? "right" : "left";
    }

    /*
     * Reset the inline transform so the
     * existing throw animation takes over.
     */
    const currentCard = cards[0];

    currentCard.style.transition =
        "transform 0.45s cubic-bezier(.22, .61, .36, 1), opacity 0.35s ease, filter 0.35s ease";

    currentCard.style.transform = "";

    /*
     * NOW throw the card.
     */
    throwCard(direction);
});


profileStack.addEventListener("pointercancel", () => {

    if (isAnimating) return;

    dragging = false;

    const currentCard = cards[0];

    currentCard.style.transition =
        "transform 0.45s cubic-bezier(.22, .61, .36, 1)";

    currentCard.style.transform = "";

    updateStack();
});

/* Initial setup */
updateStack();

