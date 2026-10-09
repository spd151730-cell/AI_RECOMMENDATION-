document.addEventListener('DOMContentLoaded', () => {
    // Setup Chips
    const DEMO_SUGGESTION_CHIPS = [
        "Minimalist & clean", "Bright & colorful", "Comfortable first",
        "Layered look", "Monochrome", "Trendy & bold",
        "Classic & timeless", "Sporty / Athleisure", "Business casual"
    ];
    
    const chipsContainer = document.getElementById('chips-container');
    const promptArea = document.getElementById('prompt-area');
    
    promptArea.value = AppState.get('preference_text', '');
    
    DEMO_SUGGESTION_CHIPS.forEach(chip => {
        const btn = document.createElement('span');
        btn.className = 'chip';
        btn.innerText = chip;
        btn.onclick = () => {
            if (!promptArea.value.includes(chip)) {
                promptArea.value = (promptArea.value + " " + chip).trim();
                AppState.set('preference_text', promptArea.value);
            }
        };
        chipsContainer.appendChild(btn);
    });

    // Setup Palette
    const skinTone = AppState.get("skin_tone", "Medium");
    const occasion = AppState.get("occasion", "College");
    document.getElementById('palette-subtitle').innerHTML = `Curated color swatches based on your <strong>${skinTone}</strong> skin tone and <strong>${occasion}</strong> setting.`;
    
    const DEMO_PALETTES = {
        "Light": [
            {"name": "Navy Blue", "hex": "#0a192f"},
            {"name": "Burgundy", "hex": "#800020"},
            {"name": "Emerald", "hex": "#50c878"},
            {"name": "Soft Pink", "hex": "#ffd1dc"}
        ],
        "Medium": [
            {"name": "Teal", "hex": "#008080"},
            {"name": "Olive", "hex": "#808000"},
            {"name": "Mustard", "hex": "#ffdb58"},
            {"name": "Maroon", "hex": "#800000"}
        ],
        "Tan": [
            {"name": "Rust", "hex": "#b7410e"},
            {"name": "Sage", "hex": "#9dc183"},
            {"name": "Camel", "hex": "#c19a6b"},
            {"name": "Chocolate", "hex": "#7b3f00"}
        ],
        "Deep": [
            {"name": "Pure White", "hex": "#ffffff"},
            {"name": "Cobalt", "hex": "#0047ab"},
            {"name": "Ruby Red", "hex": "#e0115f"},
            {"name": "Lavender", "hex": "#e6e6fa"}
        ]
    };
    
    let paletteKey = "Medium";
    if (["Porcelain", "Light Beige"].includes(skinTone)) paletteKey = "Light";
    else if (["Golden Tan", "Tan"].includes(skinTone)) paletteKey = "Tan";
    else if (["Deep Cocoa", "Espresso", "Deep"].includes(skinTone)) paletteKey = "Deep";

    const paletteGrid = document.getElementById('palette-grid');
    DEMO_PALETTES[paletteKey].forEach(swatch => {
        paletteGrid.innerHTML += `
            <div class="palette-swatch">
                <div class="color-box" style="background:${swatch.hex};"></div>
                <div class="color-name">${swatch.name}</div>
            </div>
        `;
    });
});

function analyzeStyle() {
    AppState.set('preference_text', document.getElementById('prompt-area').value);
    
    const style = AppState.get('style', 'Casual');
    const occasion = AppState.get('occasion', 'College');
    
    document.getElementById('style-profile-title').innerText = `${style} + ${occasion} + Comfortable`;
    document.getElementById('style-profile-result').style.display = 'block';
    
    document.getElementById('loading-indicator').style.display = 'block';
    document.getElementById('outfits-container').innerHTML = '';
    
    // Build Profile Payload
    const profile = {
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

    fetch('http://127.0.0.1:8000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: profile })
    })
    .then(r => r.json())
    .then(data => {
        document.getElementById('loading-indicator').style.display = 'none';
        renderOutfits(data.outfits);
    })
    .catch(e => {
        console.error(e);
        document.getElementById('loading-indicator').style.display = 'none';
        document.getElementById('outfits-container').innerHTML = '<p style="color:red;">Failed to fetch recommendations. Ensure backend is running.</p>';
    });
}

function renderOutfits(outfits) {
    const container = document.getElementById('outfits-container');
    if (!outfits || outfits.length === 0) {
        container.innerHTML = '<p>No outfits found for this criteria.</p>';
        return;
    }
    
    outfits.forEach((outfit, idx) => {
        const block = document.createElement('div');
        block.className = 'outfit-block';
        
        let headerHtml = `
            <div class="outfit-header">
                <div>
                    <div style="font-size:1.2rem; font-weight:800; color:#1d1528;">Recommended Outfit ${idx + 1}</div>
                    <div style="font-size:0.9rem; color:#625b6e;">Total: ${money(outfit.total_price)} | Compatibility Score: ${outfit.score}/100</div>
                </div>
                <div class="stButton" style="width: auto;">
                    <button class="btn-primary" onclick="selectOutfit(${idx})">Select Outfit ${idx + 1}</button>
                </div>
            </div>
            <div class="product-grid">
        `;
        
        ['Top', 'Bottom', 'Shoes', 'Accessory'].forEach(cat => {
            if (outfit.items[cat]) {
                const item = outfit.items[cat];
                const imgUrl = `https://placehold.co/400x500/e6e4eb/1d1528?text=${encodeURIComponent(item.item_name)}`;
                
                headerHtml += `
                    <div class="product-card">
                        <div class="product-image-container">
                            <img src="${imgUrl}" alt="${item.item_name}"/>
                            <div class="platform-badge">${item.category}</div>
                        </div>
                        <div class="product-info">
                            <div class="product-name">${item.item_name}</div>
                            <div class="product-meta">${item.colour} · ${item.style}</div>
                            <div class="product-price-row">
                                <div class="product-price">${money(item.price)}</div>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        headerHtml += `</div>`;
        block.innerHTML = headerHtml;
        container.appendChild(block);
        
        // Store in global window for selection
        window[`outfit_${idx}`] = outfit;
    });
}

function selectOutfit(idx) {
    const outfit = window[`outfit_${idx}`];
    AppState.set("selected_outfit", outfit);
    AppState.set("cart_items", outfit.items);
    window.location.href = 'outfit-details.html';
}
