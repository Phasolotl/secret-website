const themeToggle = document.querySelector("#rosa-theme-toggle");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("theme-rosa");
    });
}