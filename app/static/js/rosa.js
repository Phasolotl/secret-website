let isCharging = false;
let chargeStartTime = null;
let chargeAmount = 0;

const MAX_CHARGE_TIME = 3000;
const MIN_SWIPE_SPEED = 0.8;
const MIN_SWIPE_DISTANCE = 80;
const SWIPE_WINDOW = 150;

let chargeStartX = 0;
let chargeStartY = 0;

let movementHistory = [];
let slashPath = [];
let chargeAnimationFrame = null;

function initializeRosaEffects() {

    const container =
        document.querySelector(".theme-effects");

    if (!container) {
        return;
    }

    // Create Rosa effect elements

    const starContainer = document.createElement("div");
    starContainer.classList.add("rosa-stars");

    const glow = document.createElement("div");
    glow.classList.add("rosa-glow");

    const charge = document.createElement("div");
    charge.classList.add("rosa-charge");

    const trailContainer = document.createElement("div");
    trailContainer.classList.add("rosa-trail");

    container.appendChild(starContainer);
    container.appendChild(glow);
    container.appendChild(charge);
    container.appendChild(trailContainer);

    // Initialize effects

    generateStars(starContainer);

    const cleanupCursor = CursorGlow(trailContainer);

    updateCharge();

    return function cleanupRosaEffects() {
        cleanupCursor();
        stopChargeAnimation();

        container.innerHTML = "";
        document.documentElement.style.setProperty("--charge", "0");

        isCharging = false;
        chargeStartTime = null;
        chargeAmount = 0;

        movementHistory = [];
        slashPath = [];
    };
}

function generateStars(starContainer) {

    if (!starContainer) {
        return;
    }

    const starCount = 120;

    const starColors = [
        "#9E2D5C", // dark pink
        "#EAACD1", // light pink
        "#FF3BC1", // hot pink
        "#4DA6FF"  // blue
    ];

    for (let i = 0; i < starCount; i++) {

        const star = document.createElement("span");

        star.classList.add("rosa-star");

        star.textContent = "✦";

        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        // Random color
        const color =
            starColors[
                Math.floor(Math.random() * starColors.length)
            ];

        star.style.setProperty("--star-color", color);

        // Random size
        const size = Math.random() * 6 + 5;

        star.style.fontSize = `${size}px`;

        // Random animation duration
        const duration = Math.random() * 3 + 4;

        star.style.setProperty(
            "--star-duration",
            `${duration}s`
        );

        // Random animation delay
        const delay = Math.random() * 8;

        star.style.setProperty(
            "--star-delay",
            `-${delay}s`
        );

        // Star Movements
        const xMovement = Math.random() * 20 + 100;
        const yMovement = Math.random() * 20 + 100;

        star.style.setProperty("--drift-x", `${xMovement}px`);
        star.style.setProperty("--drift-y", `${yMovement}px`);

        // Drift
        const driftDuration = Math.random() * 10 + 8;
        star.style.setProperty("--drift-duration", `${driftDuration}s`);

        starContainer.appendChild(star);
    }
}

function CursorGlow(trailContainer) {
    const handleMouseMove = (event) => {

        const x = event.clientX;
        const y = event.clientY;
        const now = performance.now()

        document.documentElement.style.setProperty(
            "--mouse-x",
            `${x}px`
        );

        document.documentElement.style.setProperty(
            "--mouse-y",
            `${y}px`
        );

        if (isCharging) {
            movementHistory.push({
                x: x,
                y: y,
                time: now
            });
            const cutoff = now - SWIPE_WINDOW;

            movementHistory = movementHistory.filter(point => point.time >= cutoff);
        }

    }

    const handleMouseDown = (event) => {
        if (event.button !== 0) {
            return;
        }

        isCharging = true;

        chargeStartX = event.clientX;
        chargeStartY = event.clientY;
        chargeStartTime = performance.now();

        chargeAmount = 0;

        movementHistory = [
            {
                x: event.clientX,
                y: event.clientY,
                time: performance.now()
            }
        ];
        slashPath = [];
    }

    const handleMouseUp = (event) => {
        if (event.button !== 0) {
            return;
        }

        if (!isCharging) {
            return;
        }

        const finalCharge = chargeAmount;

        const releaseX = event.clientX;
        const releaseY = event.clientY;
        const releaseTime = performance.now();

        const swipeStart = movementHistory[0];

        if (swipeStart) {
            const dx = releaseX - swipeStart.x;
            const dy = releaseY - swipeStart.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const elapsed = releaseTime - swipeStart.time;
            const speed = elapsed > 0 ? distance / elapsed : 0;
            const angle = Math.atan2(dy, dx);
            const didSlash =
                distance >= MIN_SWIPE_DISTANCE &&
                speed >= MIN_SWIPE_SPEED;

            const centerX = (chargeStartX + releaseX) / 2;
            const centerY = (chargeStartY + releaseY) / 2;

            console.log({
                points: slashPath.length,
                charge: finalCharge,
                distance: distance,
                speed: speed,
                angle: angle,
                didSlash: didSlash
            });

            if (didSlash) {

                slashPath = [
                    ...movementHistory,
                    {
                        x: releaseX,
                        y: releaseY,
                        time: releaseTime
                    }
                ];

                createSlash({
                    charge: finalCharge,
                    distance: distance,
                    speed: speed,
                    path: slashPath,
                    trailContainer: trailContainer
                });
            }

        }
        isCharging = false;
        chargeStartTime = null;
        chargeAmount = 0;

        movementHistory = [];
        slashPath = [];

        document.documentElement.style.setProperty(
            "--charge",
            "0"
        );
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return function cleanupCursorGlow() {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mouseup", handleMouseUp);
    };
}

function updateCharge() {
    if (isCharging) {
        const elapsed =
            performance.now() - chargeStartTime;

        chargeAmount = Math.min(elapsed / MAX_CHARGE_TIME, 1);

        document.documentElement.style.setProperty(
            "--charge",
            chargeAmount
        );
    }
    chargeAnimationFrame =
            requestAnimationFrame(updateCharge);
}
function stopChargeAnimation() {

    if (chargeAnimationFrame !== null) {
        cancelAnimationFrame(chargeAnimationFrame);
        chargeAnimationFrame = null;
    }
}

function createSlash({ charge, distance, speed, path, trailContainer }) {
    if (!path || path.length < 2) {
        return;
    }

    const slash = document.createElement("div");
    slash.classList.add("rosa-slash");

    const tear = document.createElement("div");
    tear.classList.add("rosa-slash__tear");

    const glow = document.createElement("div");
    glow.classList.add("rosa-slash__glow");

    const core = document.createElement("div");
    core.classList.add("rosa-slash__core");

    slash.appendChild(tear);
    slash.appendChild(glow);
    slash.appendChild(core);

    const start = path[0];
    const end = path[path.length - 1];

    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const angle = Math.atan2(dy, dx);

    const slashLength = Math.max(distance, 100 + charge * 300);
    const speedFactor = Math.min(speed / 3, 1);
    const slashWidth = 4 + speedFactor * 8;

    slash.style.left = `${start.x}px`;
    slash.style.top = `${start.y}px`;

    slash.style.setProperty("--slash-angle", `${angle}rad`);

    slash.style.width = `${slashLength}px`;
    slash.style.height = `${slashWidth}px`;

    slash.style.setProperty("--slash-charge", charge);
    slash.style.setProperty("--slash-speed", `${speedFactor}`);

    slash.addEventListener(
        "animationend",
        () => {
            slash.remove();
        }
    );

    trailContainer.appendChild(slash);
}
