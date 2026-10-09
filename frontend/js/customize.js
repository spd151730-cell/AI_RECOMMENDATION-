const categories = ["Top", "Bottom", "Shoes", "Accessory"];
const icons = {"Top": "👕", "Bottom": "👖", "Shoes": "👟", "Accessory": "⌚"};

let cart = AppState.get("cart_items", {});
let outfit = AppState.get("selected_outfit", {items: cart});
let lockedItems = AppState.get("locked_items", {Top:false, Bottom:false, Shoes:false, Accessory:false});
let replaceTarget = AppState.get("replace_target", null);
const budget = AppState.get("budget", 3500);

function renderUI() {
    // Render Lock Grid
    const lockGrid = document.getElementById('lock-grid');
    lockGrid.innerHTML = '';
    categories.forEach(cat => {
        const isLocked = lockedItems[cat];
        lockGrid.innerHTML += `
            <div class="stColumn">
                <div class="mini-card">
                    <div style="font-size:1.5rem; margin-bottom:0.4rem;">${icons[cat] || '✨'}</div>
                    <div style="font-weight:700; color:#1b1528;">${cat}</div>
                </div>
                <div style="text-align:center;">
                    <label><input type="checkbox" ${isLocked ? 'checked' : ''} onchange="toggleLock('${cat}', this.checked)"> Lock ${cat}</label>
                </div>
            </div>
        `;
    });

    // Budget Info
    let totalCost = 0;
    Object.values(cart).forEach(item => { if(item) totalCost += item.price; });
    const diff = budget - totalCost;
    const bInfo = document.getElementById('budget-info');
    if (diff >= 0) {
        bInfo.innerHTML = `
            <div class="budget-box budget-ok">
                <strong>Total Outfit Price:</strong> ${money(totalCost)} (Budget: ${money(budget)})<br>
                <span style="color:#16a34a; font-weight:bold;">Under budget by ${money(diff)}</span>
            </div>
        `;
    } else {
        bInfo.innerHTML = `
            <div class="budget-box budget-over">
                <strong>Total Outfit Price:</strong> ${money(totalCost)} (Budget: ${money(budget)})<br>
                <span style="color:#dc2626; font-weight:bold;">Over budget by ${money(Math.abs(diff))}</span>
            </div>
        `;
    }

    // Render Items Container
    const itemsContainer = document.getElementById('items-container');
    itemsContainer.innerHTML = '';
    categories.forEach(cat => {
        if (!cart[cat]) return;
        const item = cart[cat];
        const isLocked = lockedItems[cat];
        
        let html = `
            <div class="item-container">
                <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.6rem;">
                    <div style="font-size:1.4rem;">${icons[cat]}</div>
                    <div style="font-weight:800; color:#1d1528;">${cat} ${isLocked ? '🔒' : ''}</div>
                </div>
                <div style="font-weight:700; color:#20192d;">${item.item_name}</div>
                <div style="font-size:0.8rem; color:#666; margin-top:0.2rem; margin-bottom: 1rem;">${item.colour} · ${item.style} · ${money(item.price)}</div>
        `;
        
        if (!isLocked) {
            html += `
                <div style="display:flex; gap:1rem;">
                    <div class="stButton" style="flex:1;">
                        <button class="btn-secondary" onclick="requestReplace('${cat}')">Replace ${cat}</button>
                    </div>
                    <div class="stButton" style="flex:1;">
                        <button class="btn-secondary" onclick="requestCheaper('${cat}')">Cheaper Option</button>
                    </div>
                </div>
            `;
        } else {
            html += `<div style="background:#f0f9ff; color:#0369a1; padding:0.8rem; border-radius:8px;">Item is locked. Unlock to replace.</div>`;
        }
        
        // Replacement Candidates Box
        if (replaceTarget === cat) {
            html += `
                <div style="margin-top:1rem; padding:1rem; border:1px dashed #6b4bb0; border-radius:12px;" id="repl-box-${cat}">
                    <strong>Loading candidates...</strong>
                </div>
            `;
            fetchCandidates(cat); // Trigger fetch
        }
        
        html += `</div>`;
        itemsContainer.innerHTML += html;
    });
}

function toggleLock(cat, checked) {
    lockedItems[cat] = checked;
    AppState.set("locked_items", lockedItems);
    renderUI();
}

function regenerateUnlocked() {
    const profile = getProfile();
    const payload = {
        profile: profile,
        locked_items: {}
    };
    // Add locked items to payload
    for (const [cat, isLocked] of Object.entries(lockedItems)) {
        if (isLocked && cart[cat]) {
            payload.locked_items[cat] = cart[cat];
        }
    }
    
    fetch('http://127.0.0.1:8000/api/outfit/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(r=>r.json()).then(data => {
        if (data.outfits && data.outfits.length > 0) {
            cart = data.outfits[0].items;
            outfit = data.outfits[0];
            AppState.set("cart_items", cart);
            AppState.set("selected_outfit", outfit);
            renderUI();
        }
    });
}

function requestReplace(cat) {
    replaceTarget = cat;
    AppState.set("replace_target", cat);
    renderUI();
}

function getProfile() {
    return {
        name: AppState.get('user_name', 'Alex'),
        age: AppState.get('age', 22),
        gender: AppState.get('gender', 'Female'),
        height: AppState.get('height', 168),
        weight: AppState.get('weight', 58),
        budget: AppState.get('budget', 3500),
        skin_tone: AppState.get('skin_tone', 'Medium'),
        style: AppState.get('style', 'Casual'),
        occasion: AppState.get('occasion', 'College'),
        favorite_colours: AppState.get('favorite_colours', []),
        avoid_colours: AppState.get('avoid_colours', []),
        preferred_fit: AppState.get('preferred_fit', 'Regular Fit')
    };
}

function fetchCandidates(cat) {
    const payload = {
        profile: getProfile(),
        locked_items: cart, // Pass entire current cart as context
        category: cat
    };
    
    fetch('http://127.0.0.1:8000/api/outfit/replace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(r=>r.json()).then(data => {
        const box = document.getElementById(`repl-box-${cat}`);
        if (!data.candidates || data.candidates.length === 0) {
            box.innerHTML = `<span style="color:red">No suitable replacement found.</span>`;
            return;
        }
        
        let html = `<strong>Select Replacement:</strong><br>`;
        data.candidates.slice(0, 3).forEach((cand, idx) => {
            const item = cand.items[cat];
            // store globally for selection
            window[`cand_${cat}_${idx}`] = cand;
            html += `
                <div class="cand-row">
                    <div>
                        <strong>${item.item_name}</strong><br>
                        <span style="font-size:0.8rem; color:#666;">${item.colour} · ${money(item.price)}</span>
                    </div>
                    <div class="stButton" style="width:80px;">
                        <button class="btn-primary" onclick="useCandidate('${cat}', ${idx})">Use</button>
                    </div>
                </div>
            `;
        });
        box.innerHTML = html;
    });
}

function useCandidate(cat, idx) {
    const cand = window[`cand_${cat}_${idx}`];
    cart[cat] = cand.items[cat];
    AppState.set("cart_items", cart);
    outfit.items = cart;
    AppState.set("selected_outfit", outfit);
    
    replaceTarget = null;
    AppState.set("replace_target", null);
    renderUI();
}

function requestCheaper(cat) {
    const payload = {
        locked_items: cart,
        category: cat
    };
    fetch('http://127.0.0.1:8000/api/outfit/cheaper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(r=>r.json()).then(data => {
        if (data.alternative && data.alternative.item_id) {
            cart[cat] = data.alternative;
            AppState.set("cart_items", cart);
            outfit.items = cart;
            AppState.set("selected_outfit", outfit);
            alert("Found a cheaper alternative!");
            renderUI();
        } else {
            alert("No cheaper compatible alternative found in catalog.");
        }
    });
}

document.addEventListener('DOMContentLoaded', renderUI);
