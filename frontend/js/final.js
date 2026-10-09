document.addEventListener('DOMContentLoaded', () => {
    const builder = AppState.get("avatar_builder");
    const cart = AppState.get("cart_items", {});
    const budget = AppState.get("budget", 3500);
    const occasion = AppState.get("occasion", "College");
    const userName = AppState.get("user_name", "Alex");
    const skinTone = AppState.get("skin_tone", "Medium");

    let totalCost = 0;
    Object.values(cart).forEach(item => { if(item) totalCost += item.price; });

    document.getElementById('final-title').innerText = `${userName}'s ${occasion} Style`;
    document.getElementById('final-desc').innerHTML = `Your complete look is optimized for <strong>${occasion}</strong> propriety, complements your <strong>${skinTone}</strong> skin tone, and totals <strong>${money(totalCost)}</strong>.`;
    document.getElementById('final-cost').innerText = money(totalCost);
    document.getElementById('final-budget').innerText = `Budget Target: ${money(budget)}`;

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

function restart() {
    localStorage.clear();
    window.location.href = 'profile.html';
}
