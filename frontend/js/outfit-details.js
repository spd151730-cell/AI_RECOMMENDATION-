const DEMO_FABRIC_NOTES = {
    "Cotton Blend": "Comfortable textile tailored for daily wear. Breathable and easy to maintain.",
    "Linen": "Highly breathable and lightweight. Perfect for warm weather.",
    "Denim": "Durable and structured fabric offering a classic, rugged aesthetic.",
    "Silk": "Luxurious, smooth texture providing an elegant drape and sheen.",
    "Wool Blend": "Provides excellent insulation and structure for cooler environments.",
    "Polyester": "Durable and wrinkle-resistant, often used in activewear or blended for stretch."
};

document.addEventListener('DOMContentLoaded', () => {
    const cart = AppState.get("cart_items", {});
    const occasion = AppState.get("occasion", "College");
    const skinTone = AppState.get("skin_tone", "Medium");
    const style = AppState.get("style", "Casual");
    const budget = AppState.get("budget", 3500);
    const outfit = AppState.get("selected_outfit", {items: cart, score: 85, total_price: 0, breakdown: {style:18, colour:26, occasion:18, budget:15, compatibility:14}});
    let lockedItems = AppState.get("locked_items", {Top:false, Bottom:false, Shoes:false, Accessory:false});

    // Update Text Elements
    document.getElementById('summary-title').innerText = `Curated ${occasion} Outfit`;
    document.getElementById('summary-desc').innerHTML = `This complete look coordinates your selected <strong>${skinTone}</strong> skin tone palette, <strong>${style}</strong> preference, and stays within your <strong>${money(budget)}</strong> budget.`;
    document.getElementById('summary-cost').innerText = money(outfit.total_price);
    document.getElementById('summary-score').innerText = `${outfit.score}/100`;
    document.getElementById('total-amount').innerText = money(outfit.total_price);

    // Fetch Avatar
    const builder = AppState.get("avatar_builder");
    if (builder) {
        // We simulate passing the outfit to the SVG generator.
        fetch('http://127.0.0.1:8000/api/avatar/render', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(builder) // The actual backend handles basic SVG currently
        })
        .then(r => r.json())
        .then(data => {
            document.getElementById('avatar-preview').innerHTML = data.svg_html;
        });
    }

    // Render Breakdown Items
    const itemsList = document.getElementById('items-list');
    const categories = ["Top", "Bottom", "Shoes", "Accessory"];
    const icons = {"Top": "👕", "Bottom": "👖", "Shoes": "👟", "Accessory": "⌚"};
    
    function renderItems() {
        itemsList.innerHTML = '';
        let total = 0;
        
        categories.forEach(cat => {
            const item = cart[cat];
            const isLocked = lockedItems[cat];
            
            if (item) {
                total += item.price;
                const row = document.createElement('div');
                row.className = 'breakdown-row';
                row.innerHTML = `
                    <div class="item-left">
                        <div class="item-icon-box">${icons[cat] || '✨'}</div>
                        <div>
                            <div class="item-title">${item.item_name} ${isLocked ? '🔒 (Locked)' : ''}</div>
                            <div class="item-subtitle">${cat} · ${item.colour} · ${item.fabric_tag || 'N/A'}</div>
                        </div>
                    </div>
                    <div class="item-right">
                        <div class="item-price">${money(item.price)}</div>
                    </div>
                `;
                
                const btnRow = document.createElement('div');
                btnRow.className = 'btn-row';
                
                const btnRemove = document.createElement('div');
                btnRemove.className = 'stButton';
                btnRemove.style.flex = 1;
                btnRemove.innerHTML = `<button class="btn-outline">[-] Remove</button>`;
                btnRemove.onclick = () => {
                    delete cart[cat];
                    AppState.set('cart_items', cart);
                    renderItems();
                };
                
                const btnReplace = document.createElement('div');
                btnReplace.className = 'stButton';
                btnReplace.style.flex = 1;
                btnReplace.innerHTML = `<button class="btn-secondary">Replace</button>`;
                btnReplace.onclick = () => {
                    AppState.set('replace_target', cat);
                    window.location.href = 'customize.html';
                };
                
                const btnLock = document.createElement('div');
                btnLock.className = 'stButton';
                btnLock.style.flex = 1;
                btnLock.innerHTML = `<button class="${isLocked ? 'btn-secondary' : 'btn-outline'}">${isLocked ? 'Unlock' : '🔒 Lock'}</button>`;
                btnLock.onclick = () => {
                    lockedItems[cat] = !isLocked;
                    AppState.set('locked_items', lockedItems);
                    renderItems();
                };
                
                btnRow.appendChild(btnRemove);
                btnRow.appendChild(btnReplace);
                btnRow.appendChild(btnLock);
                
                const container = document.createElement('div');
                container.appendChild(row);
                container.appendChild(btnRow);
                container.style.marginBottom = '1.5rem';
                
                itemsList.appendChild(container);
            }
        });
        
        document.getElementById('summary-cost').innerText = money(total);
        document.getElementById('total-amount').innerText = money(total);
    }
    
    renderItems();

    // Render Reasons
    const reasonsList = document.getElementById('reasons-list');
    reasonsList.innerHTML = `
        <p>✓ Strong match for your preferred <strong>${style}</strong> aesthetic</p>
        <p>✓ Aligns well with your <strong>${skinTone}</strong> skin tone palette</p>
        <p>✓ Highly appropriate for <strong>${occasion}</strong> settings</p>
        <p>✓ Comfortably fits within your <strong>${money(budget)}</strong> budget limit</p>
    `;

    // Render Score Bars
    const bd = outfit.breakdown || {style: 18, colour: 26, occasion: 18, budget: 15, compatibility: 14};
    const scores = [
        ["Style Match", Math.min(100, (bd.style/20.0)*100)],
        ["Colour Harmony", Math.min(100, (bd.colour/30.0)*100)],
        ["Occasion Fit", Math.min(100, (bd.occasion/20.0)*100)],
        ["Budget Score", Math.min(100, (bd.budget/15.0)*100)]
    ];
    
    const scoreBars = document.getElementById('score-bars');
    scores.forEach(([label, val]) => {
        scoreBars.innerHTML += `
            <div style="margin-bottom:0.6rem;">
                <div style="display:flex; justify-content:space-between; font-size:0.78rem; font-weight:700; color:#20192d;">
                    <span>${label}</span>
                    <span>${Math.round(val)}%</span>
                </div>
                <div class="progress-bar"><span class="progress-fill" style="width:${val}%;"></span></div>
            </div>
        `;
    });

    // Render Fabric Notes
    const fabricContainer = document.getElementById('fabric-notes');
    Object.values(cart).forEach(item => {
        if (item) {
            const fab = item.fabric || "Cotton Blend";
            const note = DEMO_FABRIC_NOTES[fab] || "Comfortable textile tailored for daily wear.";
            fabricContainer.innerHTML += `
                <div style="background:#ffffff; border:1px solid rgba(103,80,154,0.12); border-radius:12px; padding:1rem; margin-bottom:0.75rem;">
                    <h4 style="margin:0 0 0.5rem 0;">${item.category}: ${item.item_name}</h4>
                    <p style="margin:0; font-size:0.9rem;"><strong>Fabric:</strong> ${fab} (${item.fabric_tag || 'N/A'})</p>
                    <p style="font-size:0.76rem; color:#625b6e; margin-top:0.4rem;">${note}</p>
                </div>
            `;
        }
    });

});
