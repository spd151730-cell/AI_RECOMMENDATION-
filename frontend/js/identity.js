document.addEventListener('DOMContentLoaded', () => {
    const identities = [
        ["College Me", "Casual", "Comfortable", "Sneakers", "👩"],
        ["Office Me", "Professional", "Minimal", "Formal", "💼"],
        ["Party Me", "Trendy", "Stylish", "Accessorized", "✨"],
        ["Traditional Me", "Elegant", "Ethnic", "Traditional", "🌸"]
    ];

    const list = document.getElementById('identities-list');
    identities.forEach(id => {
        list.innerHTML += `
            <div class="identity-box">
                <div class="identity-visual">${id[4]}</div>
                <div style="font-size:1.2rem; font-weight:800; color:#1d1528;">${id[0]}</div>
                <div style="margin-top:0.6rem; margin-bottom:1rem;">
                    <span class="chip">${id[1]}</span>
                    <span class="chip">${id[2]}</span>
                    <span class="chip">${id[3]}</span>
                </div>
                <div class="stButton" style="width:120px;">
                    <button class="btn-secondary" onclick="selectIdentity('${id[1]}')">Select</button>
                </div>
            </div>
        `;
    });
});

function selectIdentity(style) {
    AppState.set("style", style);
    window.location.href = 'recommendations.html';
}
