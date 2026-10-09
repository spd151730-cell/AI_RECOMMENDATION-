// Global State Management mimicking Streamlit's st.session_state
const AppState = {
    get(key, defaultValue = null) {
        const val = localStorage.getItem('styleai_' + key);
        return val ? JSON.parse(val) : defaultValue;
    },
    set(key, value) {
        localStorage.setItem('styleai_' + key, JSON.stringify(value));
    },
    initDefaults() {
        if (!this.get('user_name')) this.set('user_name', 'Alex');
        if (!this.get('age')) this.set('age', 22);
        if (!this.get('gender')) this.set('gender', 'Female');
        if (!this.get('height')) this.set('height', 168);
        if (!this.get('weight')) this.set('weight', 58);
        if (!this.get('budget')) this.set('budget', 3500.0);
        if (!this.get('skin_tone')) this.set('skin_tone', 'Medium');
        if (!this.get('style')) this.set('style', 'Casual');
        if (!this.get('occasion')) this.set('occasion', 'College');
    }
};

AppState.initDefaults();

function money(value) {
    return '₹' + parseFloat(value).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function renderTopNav(active = "Home") {
    const labels = [
        ["Home", "index.html"],
        ["01 Profile", "pages/profile.html"],
        ["02 Appearance", "pages/appearance.html"],
        ["03 Preferences", "pages/preferences.html"],
        ["04 Avatar", "pages/avatar.html"],
        ["05 Recommendations", "pages/recommendations.html"],
        ["06 Complete Look", "pages/outfit-details.html"],
        ["07 Customize", "pages/customize.html"],
        ["08 Budget", "pages/budget.html"],
        ["09 Pairing", "pages/pairing.html"],
        ["10 Why", "pages/explanation.html"],
        ["10 Preview", "pages/virtual-styling.html"],
        ["11 Identity", "pages/multi-identity.html"],
        ["12 Final Look", "pages/final-look.html"]
    ];

    let links = "";
    for (let [label, path] of labels) {
        // Adjust path based on where we are
        let isRoot = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/");
        let href = isRoot ? path : (path.startsWith("pages/") ? path.replace("pages/", "") : "../" + path);
        let isActive = label.endsWith(active) || label === active;
        links += `<a class='top-link ${isActive ? 'active' : ''}' href='${href}'>${label}</a>`;
    }

    return `<nav class='top-nav'><div class='top-nav-brand'>STYLEAI</div>${links}</nav>`;
}

function renderPageHeader(title, subtitle, badge = "StyleAI", active = "Home") {
    return `
        ${renderTopNav(active)}
        <div class="brand-shell">
            <div class="brand-row">
                <div class="brand-left">
                    <div class="brand-mark">✦</div>
                    <div>
                        <p class="brand-title">${title}</p>
                        <p class="brand-sub">${subtitle}</p>
                    </div>
                </div>
                <div class="nav-pill">${badge}</div>
            </div>
        </div>
    `;
}

function renderSectionHeading(title, icon = "✨") {
    return `<div class="page-kicker" style="margin-top:0.8rem; margin-bottom:0.4rem;">${icon} ${title}</div>`;
}

function updateStatCards() {
    document.getElementById('stat-profile-value').innerText = AppState.get('user_name');
    document.getElementById('stat-profile-detail').innerText = `${AppState.get('gender')} · ${AppState.get('age')} yrs`;
    document.getElementById('stat-budget-value').innerText = money(AppState.get('budget'));
    document.getElementById('stat-style-value').innerText = AppState.get('style');
    document.getElementById('stat-occasion-value').innerText = AppState.get('occasion');
}

// Call on load if the stats element exists
document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.getElementById('nav-container');
    if (navContainer) {
        navContainer.innerHTML = renderPageHeader(navContainer.dataset.title, navContainer.dataset.subtitle, navContainer.dataset.badge, navContainer.dataset.active);
    }
    const statsContainer = document.getElementById('stats-container');
    if (statsContainer) {
        updateStatCards();
    }
});
