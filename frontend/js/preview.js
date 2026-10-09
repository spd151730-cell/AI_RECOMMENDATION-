document.addEventListener('DOMContentLoaded', () => {
    const builder = AppState.get("avatar_builder");
    const cart = AppState.get("cart_items", {});
    const outfit = AppState.get("selected_outfit", {score: 85});
    const budget = AppState.get("budget", 3500);

    let totalCost = 0;
    Object.values(cart).forEach(item => { if(item) totalCost += item.price; });
    const diff = budget - totalCost;

    const scoreBox = document.getElementById('score-box');
    const isUnder = diff >= 0;
    scoreBox.innerHTML = `
        <div style="background: ${isUnder ? '#f0fdf4' : '#fef2f2'}; padding:1rem; border-radius:12px;">
            <strong>Total Outfit Price:</strong> ${money(totalCost)} (Budget: ${money(budget)})<br>
            <span style="color:${isUnder ? '#16a34a' : '#dc2626'};">${isUnder ? 'Under budget by' : 'Over budget by'} ${money(Math.abs(diff))}</span><br>
            <strong>Compatibility Score:</strong> ${Math.round(outfit.score)}/100
        </div>
    `;

    const details = document.getElementById('details-grid');
    const categories = ["Top", "Bottom", "Shoes", "Accessory"];
    const icons = ["👕", "👖", "👟", "⌚"];
    
    categories.forEach((cat, idx) => {
        const item = cart[cat];
        const name = item ? item.item_name : "Not Selected";
        details.innerHTML += `
            <div class="stColumn">
                <div class="mini-card">
                    <div style="font-size:2rem; margin-bottom:0.4rem;">${icons[idx]}</div>
                    <div style="font-weight:700; color:#20192d;">${cat}</div>
                    <div style="font-size:0.8rem; color:#625b6e;">${name}</div>
                </div>
            </div>
        `;
    });

    if (builder) {
        fetch('http://127.0.0.1:8000/api/avatar/render', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(builder)
        }).then(r=>r.json()).then(data => {
            document.getElementById('avatar-preview').innerHTML = data.svg_html;
        });
    }
});
