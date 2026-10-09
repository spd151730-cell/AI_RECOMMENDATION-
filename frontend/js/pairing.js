document.addEventListener('DOMContentLoaded', () => {
    const options = [
        ["Black Jeans", "Indigo", "₹1,299"],
        ["Beige Trousers", "Sand", "₹1,699"],
        ["White Skirt", "Ivory", "₹1,499"]
    ];

    const list = document.getElementById('pairings-list');
    options.forEach(opt => {
        list.innerHTML += `
            <div class="pairing-row">
                <div style="display:flex; align-items:center; gap:1rem;">
                    <div style="width:70px; height:70px; border-radius:16px; background:linear-gradient(135deg, #ecf1ff, #fef1f6); display:flex; align-items:center; justify-content:center; font-size:2rem;">👖</div>
                    <div>
                        <div style="font-weight:800; color:#1d1528;">${opt[0]}</div>
                        <div style="font-size:0.8rem; color:#666;">${opt[1]} · ${opt[2]}</div>
                    </div>
                </div>
                <div style="display:flex; gap:0.5rem;">
                    <div class="stButton"><button class="btn-secondary">✓ Add</button></div>
                    <div class="stButton"><button class="btn-secondary">↻ Show another</button></div>
                </div>
            </div>
        `;
    });

    const flow = ["Selected Item", "Suggested Pair", "Next Pair", "Complete Outfit"];
    const flowContainer = document.getElementById('pairing-flow');
    flow.forEach((item, idx) => {
        flowContainer.innerHTML += `<div class="chip" style="margin-right:0.4rem; margin-bottom:0.4rem;">${item}</div>`;
        if (idx < flow.length - 1) {
            flowContainer.innerHTML += `<div style="display:inline-block; margin:0 0.3rem 0.6rem 0; color:#8c7ea4;">→</div>`;
        }
    });
});
