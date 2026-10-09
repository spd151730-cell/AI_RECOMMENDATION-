document.addEventListener('DOMContentLoaded', () => {
    const budget = AppState.get("budget", 3500);
    const cart = AppState.get("cart_items", {});
    
    let currentPrice = 0;
    Object.values(cart).forEach(item => { if(item) currentPrice += item.price; });
    
    const remaining = budget - currentPrice;
    
    // Budget Overview
    const overview = document.getElementById('budget-overview');
    overview.innerHTML = `
        <div class="budget-box">
            <div class="page-kicker">Budget overview</div>
            <div style="font-size:1.8rem; font-weight:800; color:#1d1528; margin-top:0.2rem;">Your budget: ${money(budget)}</div>
            <div style="color:#5f5a6d; margin-top:0.2rem;">Current outfit: ${money(currentPrice)}</div>
            <div style="margin-top:0.7rem; font-weight:700; color:${remaining < 0 ? '#9a2d4a' : '#2f7d57'};">
                ${remaining < 0 ? 'Over budget by ' + money(Math.abs(remaining)) : 'Within budget by ' + money(remaining)}
            </div>
        </div>
    `;

    // Smart suggestions
    const altCards = [
        ["White Sneakers", "₹1,799", "Black Sneakers", "₹699", "Save ₹1,100"],
        ["Leather Watch", "₹2,499", "Minimal Watch", "₹1,299", "Save ₹1,200"],
        ["Denim Jacket", "₹2,999", "Cotton Overshirt", "₹1,699", "Save ₹1,300"]
    ];
    
    const suggContainer = document.getElementById('alt-suggestions');
    altCards.forEach(card => {
        suggContainer.innerHTML += `
            <div class="alt-card">
                <div style="display:flex; gap:2rem;">
                    <div>
                        <div style="font-size:0.75rem; color:#666; font-weight:600; text-transform:uppercase;">Current</div>
                        <div style="font-weight:800; color:#1d1528;">${card[0]}</div>
                        <div style="font-size:0.85rem; color:#666;">${card[1]}</div>
                    </div>
                    <div>
                        <div style="font-size:0.75rem; color:#666; font-weight:600; text-transform:uppercase;">Alternative</div>
                        <div style="font-weight:800; color:#1d1528;">${card[2]}</div>
                        <div style="font-size:0.85rem; color:#666;">${card[3]}</div>
                    </div>
                </div>
                <div style="font-weight:700; color:#5e3b80; font-size:1.1rem;">
                    ${card[4]}
                </div>
            </div>
        `;
    });
    
    // Budget Status Progress
    let progress = (currentPrice / budget) * 100;
    progress = Math.min(100, progress); // Cap at 100 for display
    
    document.getElementById('budget-status-box').innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <div style="font-weight:700; color:#1d1528;">${money(currentPrice)} / ${money(budget)}</div>
            <div style="font-size:0.75rem; font-weight:800; padding:0.3rem 0.8rem; border-radius:999px; background:${remaining >= 0 ? '#e6f4ea' : '#fce8e8'}; color:${remaining >= 0 ? '#137333' : '#a50e0e'};">
                ${remaining >= 0 ? 'Within budget ✓' : 'Over budget ⚠'}
            </div>
        </div>
        <div class="progress-bar"><span class="progress-fill" style="width:${progress}%; background: ${remaining < 0 ? '#ef4444' : 'linear-gradient(90deg, #6b4bb0, #ef7d8f)'};"></span></div>
    `;
});
