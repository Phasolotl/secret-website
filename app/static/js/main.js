const themes = {
    default: {
        effects: null
    },

    rosa: {
        effects: initializeRosaEffects
    }
};


function getActiveTheme() {
    const themeClass = [...document.body.classList]
        .find(className => className.startsWith("theme-"));

    return themeClass
        ? themeClass.replace("theme-", "") : "default";
}

function clearThemeEffects() {
    const effectsContainer = document.querySelector(".theme-effects");

    if (!effectsContainer) {
        return;
    }

    effectsContainer.innerHTML = "";
}


function initializeThemeEffects(themeName) {
    const theme = themes[themeName];

    if (!theme || !theme.effects) {
        return;
    }

    theme.effects();
}

function setTheme(themeName) {

    if (!themes[themeName]) {
        return;
    }

    document.body.classList.remove(
        ...[...document.body.classList].filter(className =>
                className.startsWith("theme-")
            ));
    document.body.classList.add(`theme-${themeName}`);

    clearThemeEffects();
    initializeThemeEffects(themeName);
}

const themeToggle = document.querySelector("#rosa-theme-toggle");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme = getActiveTheme();

        if (currentTheme === "rosa") {
            setTheme("default");
        } else {
            setTheme("rosa");
        }
    });
}

initializeThemeEffects(
    getActiveTheme()
);