document.addEventListener('DOMContentLoaded', () => {
    const outfit = AppState.get("selected_outfit");
    if (!outfit) {
        document.getElementById('overall-score').innerText = "0 / 100";
        return;
    }

    const breakdown = outfit.breakdown || {style: 18, colour: 26, occasion: 18, budget: 15, compatibility: 14};
    const score = outfit.score || 85;
    const style = AppState.get("style", "Casual");
    const occasion = AppState.get("occasion", "College");

    document.getElementById('overall-score').innerText = `${Math.round(score)} / 100`;

    const scoreItems = [
        ["🎨 Colour Match", breakdown.colour, 30],
        ["👗 Style Match", breakdown.style, 20],
        ["📍 Occasion Match", breakdown.occasion, 20],
        ["🔗 Outfit Compatibility", breakdown.compatibility, 15],
        ["💰 Budget Fit", breakdown.budget, 15]
    ];

    const list = document.getElementById('breakdown-list');
    scoreItems.forEach(([label, value, total]) => {
        let pct = (value / total) * 100;
        list.innerHTML += `
            <div class="score-box" style="padding:1rem; margin-bottom:0.7rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
                    <div style="font-weight:700; color:#20192d;">${label}</div>
                    <div style="font-weight:800; color:#1d1528;">${value.toFixed(1)} / ${total}</div>
                </div>
                <div class="progress-bar"><span class="progress-fill" style="width:${pct}%"></span></div>
            </div>
        `;
    });

    const explains = [
        ["🎨 Colour Harmony", "The selected palette keeps the outfit polished and visually balanced with your overall style preferences."],
        ["👗 Style Compatibility", `This look supports the chosen ${style.toLowerCase()} direction and maintains a cohesive identity.`],
        ["📍 Occasion Fit", `The outfit is designed for ${occasion.toLowerCase()} and aligns with the mood of the setting.`],
        ["💰 Budget Fit", "The outfit remains conscious of your spend while still expressing a complete fashion-forward look."],
        ["✨ Overall Styling", "This combination balances comfort, polish and outfit coordination in a way that feels confident and intentional."]
    ];

    const explainList = document.getElementById('explain-list');
    explains.forEach(([title, desc]) => {
        explainList.innerHTML += `
            <div class="explain-card">
                <h4>${title}</h4>
                <p>${desc}</p>
            </div>
        `;
    });
});
