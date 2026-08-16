const starContainer = document.querySelector(".rosa-stars");
const trailContainer = document.querySelector(".rosa-trail");

let isMouseDown = false;
let previousX = null;
let previousY = null;

function generateStars() {

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
        const xMovement = Math.random() * 20 + 30;
        const yMovement = Math.random() * 20 - 10;

        star.style.setProperty("--drift-x", `${xMovement}px`);
        star.style.setProperty("--drift-y", `${yMovement}px`);

        // Drift
        const driftDuration = Math.random() * 10 + 8;
        star.style.setProperty("--drift-duration", `${driftDuration}s`);

        starContainer.appendChild(star);
    }
}

function CursorGlow() {
    const glow = document.querySelector(".rosa-glow");

    if (!glow) {
        return;
    }
    document.addEventListener("mousedown", (event) => {
        if (event.button === 0) { // Left mouse button
            isMouseDown = true;
        }
    });

    document.addEventListener("mouseup", () => {
        isMouseDown = false;

        previousX = null;
        previousY = null;
    });

    document.addEventListener("mousemove", (event) => {
        const x = event.clientX;
        const y = event.clientY;

        document.documentElement.style.setProperty(
            "--mouse-x",
            `${x}px`
        );

        document.documentElement.style.setProperty(
            "--mouse-y",
            `${y}px`
        );
        if (isMouseDown && previousX !== null) {
            createSlash(
                previousX,
                previousY,
                x,
                y
            );
        }

        previousX = x;
        previousY = y;
    });
}


function createSlash(previousX, previousY, currentX, currentY) {

    const dx = currentX - previousX;
    const dy = currentY - previousY;

    const distance = Math.sqrt(
        dx * dx + dy * dy
    );

    const angle =
        Math.atan2(dy, dx) * 180 / Math.PI;

    const slash = document.createElement("span");

    slash.classList.add("rosa-trail-segment");

    slash.style.left = `${previousX}px`;
    slash.style.top = `${previousY}px`;

    slash.style.width = `${distance}px`;

    slash.style.transform =
        `rotate(${angle}deg)`;

    trailContainer.appendChild(slash);

    slash.addEventListener("animationend", () => {
        slash.remove();
    });
}

generateStars();
CursorGlow();
