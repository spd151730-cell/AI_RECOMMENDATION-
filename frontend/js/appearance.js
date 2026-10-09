function showSubstep(stepId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${stepId}`).classList.add('active');
    
    document.querySelectorAll('.substep-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(`substep-${stepId}`).classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Skin Tone Setup ---
    const tones = [
        ["Light", "#f6d7c5", "Cool/Fair undertones. Pairs best with Navy, Burgundy, Emerald, White."],
        ["Medium", "#c9906d", "Warm Almond undertones. Pairs best with Teal, Olive, Mustard, Maroon, Cream."],
        ["Tan", "#ad704f", "Golden Olive undertones. Pairs best with Rust, Sage, Camel, Chocolate, Cream."],
        ["Deep", "#794936", "Rich Cocoa undertones. Pairs best with Pure White, Cobalt, Emerald, Coral, Lavender."]
    ];
    let currentTone = AppState.get("skin_tone", "Medium");
    
    function renderTones() {
        const grid = document.getElementById('skin-tone-grid');
        grid.innerHTML = '';
        tones.forEach(([name, hex, desc]) => {
            const isSel = currentTone === name;
            const card = document.createElement('div');
            card.className = `select-card ${isSel ? 'active' : ''}`;
            card.innerHTML = `
                <div style="width:54px; height:54px; border-radius:50%; background:${hex}; margin:0 auto 0.6rem; border:3px solid #ffffff; box-shadow:0 6px 14px rgba(0,0,0,0.15);"></div>
                <div class="card-title">${name} ${isSel ? '✓' : ''}</div>
                <div style="font-size:0.72rem; color:#625b6e; margin-top:0.4rem;">${desc}</div>
                <button class="${isSel ? 'btn-primary' : 'btn-secondary'}" style="margin-top:1rem; width:100%; padding:0.4rem; border-radius:8px;">
                    Select ${name}
                </button>
            `;
            card.onclick = () => {
                currentTone = name;
                AppState.set("skin_tone", name);
                renderTones();
            };
            grid.appendChild(card);
        });
    }

    // --- Colours Setup ---
    const availableColours = [
        ["Black", "#1a1a1a"], ["White", "#f8f9fa"], ["Navy", "#1B2A47"],
        ["Blue", "#2563eb"], ["Green", "#166534"], ["Pink", "#ec4899"],
        ["Red", "#dc2626"], ["Brown", "#78350f"], ["Beige", "#d97706"],
        ["Lavender", "#a855f7"], ["Olive", "#65a30d"], ["Mustard", "#eab308"],
        ["Burgundy", "#831843"]
    ];
    let currentFavs = AppState.get("favorite_colours", ["Navy", "Beige", "White"]);

    function renderColors() {
        const grid = document.getElementById('colors-grid');
        grid.innerHTML = '';
        availableColours.forEach(([name, hex]) => {
            const isFav = currentFavs.includes(name);
            const card = document.createElement('div');
            card.className = `select-card ${isFav ? 'active' : ''}`;
            card.style = "display:flex; align-items:center; gap:0.6rem; padding:0.7rem 0.9rem; text-align:left;";
            card.innerHTML = `
                <div style="width:24px; height:24px; border-radius:50%; background:${hex}; border:1px solid rgba(0,0,0,0.2);"></div>
                <div class="card-title" style="font-size:0.82rem; margin-bottom:0; flex-grow:1;">${name} ${isFav ? '✓' : ''}</div>
            `;
            card.onclick = () => {
                if (isFav) {
                    currentFavs = currentFavs.filter(c => c !== name);
                } else {
                    currentFavs.push(name);
                }
                AppState.set("favorite_colours", currentFavs);
                renderColors();
            };
            grid.appendChild(card);
        });
        document.getElementById('active-palette-list').innerText = currentFavs.join(", ");
    }

    // --- Style Setup ---
    const styles = [
        ["Minimal", "✨", "Clean lines, solid neutrals, effortless cuts."],
        ["Casual", "👟", "Relaxed everyday denim, comfortable tees, sneakers."],
        ["Formal", "👔", "Crisp blazers, tailored trousers, polished footwear."],
        ["Smart Casual", "🧥", "Elevated everyday look blending structure and comfort."],
        ["Trendy", "🔥", "Fashion-forward statement cuts and current silhouettes."],
        ["Traditional", "🌸", "Heritage ethnic wear, kurtas, sarees and classic drapes."],
        ["Elegant", "💎", "Refined evening dresses, graceful drapes and subtle luxury."],
        ["Streetwear", "🧢", "Oversized silhouettes, graphic details and urban aesthetics."]
    ];
    let currentStyle = AppState.get("style", "Casual");

    function renderStyles() {
        const grid = document.getElementById('style-grid');
        grid.innerHTML = '';
        styles.forEach(([name, icon, desc]) => {
            const isSel = currentStyle === name;
            const card = document.createElement('div');
            card.className = `select-card ${isSel ? 'active' : ''}`;
            card.innerHTML = `
                <div class="card-icon">${icon}</div>
                <div class="card-title">${name} ${isSel ? '✓' : ''}</div>
                <div style="font-size:0.72rem; color:#625b6e; margin-top:0.3rem;">${desc}</div>
                <button class="${isSel ? 'btn-primary' : 'btn-secondary'}" style="margin-top:1rem; width:100%; padding:0.4rem; border-radius:8px;">
                    Choose ${name}
                </button>
            `;
            card.onclick = () => {
                currentStyle = name;
                AppState.set("style", name);
                renderStyles();
            };
            grid.appendChild(card);
        });
    }

    // --- Occasion Setup ---
    const occasions = [
        ["College", "🎓", "Expressive, easy dressing for campus life and lectures."],
        ["Office", "💼", "Professional, workday-ready tailoring and polished layers."],
        ["Interview", "📄", "Formal, confident dressing designed to make a strong impression."],
        ["Party", "🎉", "Statement night-out styling, festive fits and evening flair."],
        ["Casual Outing", "☕", "Weekend brunches, relaxed meetups and coffee runs."],
        ["Traditional Event", "🪔", "Festivals, weddings, family celebrations and ceremonies."],
        ["Special Event", "✨", "Gala dinners, award events and high-fashion moments."]
    ];
    let currentOccasion = AppState.get("occasion", "College");

    function renderOccasions() {
        const grid = document.getElementById('occasion-grid');
        grid.innerHTML = '';
        occasions.forEach(([name, icon, desc]) => {
            const isSel = currentOccasion === name;
            const card = document.createElement('div');
            card.className = `select-card ${isSel ? 'active' : ''}`;
            card.innerHTML = `
                <div class="card-icon">${icon}</div>
                <div class="card-title">${name} ${isSel ? '✓' : ''}</div>
                <div style="font-size:0.72rem; color:#625b6e; margin-top:0.3rem;">${desc}</div>
                <button class="${isSel ? 'btn-primary' : 'btn-secondary'}" style="margin-top:1rem; width:100%; padding:0.4rem; border-radius:8px;">
                    Pick ${name}
                </button>
            `;
            card.onclick = () => {
                currentOccasion = name;
                AppState.set("occasion", name);
                renderOccasions();
            };
            grid.appendChild(card);
        });
    }

    // Init all grids
    renderTones();
    renderColors();
    renderStyles();
    renderOccasions();
});
