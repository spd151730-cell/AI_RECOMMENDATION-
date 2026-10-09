document.addEventListener('DOMContentLoaded', () => {
    // Fit Radio
    const fitRadios = document.querySelectorAll('input[name="fit"]');
    const currentFit = AppState.get("preferred_fit", "Regular Fit");
    fitRadios.forEach(radio => {
        if (radio.value === currentFit) {
            radio.checked = true;
        }
        radio.addEventListener('change', (e) => {
            if (e.target.checked) {
                AppState.set("preferred_fit", e.target.value);
            }
        });
    });

    // Multi-selects
    function syncSelect(selectId, stateKey, defaults) {
        const select = document.getElementById(selectId);
        const currentVals = AppState.get(stateKey, defaults);
        
        // Select options
        Array.from(select.options).forEach(opt => {
            if (currentVals.includes(opt.value)) {
                opt.selected = true;
            }
        });
        
        // Listen to changes
        select.addEventListener('change', () => {
            const selected = Array.from(select.selectedOptions).map(opt => opt.value);
            AppState.set(stateKey, selected);
        });
    }

    syncSelect('fabrics', 'preferred_fabrics', ["Breathable Linen", "Crisp Cotton Blend"]);
    syncSelect('avoids', 'avoid_colours', ["Neon / Flashy"]);
    syncSelect('brands', 'preferred_brands', ["ZARA", "UNIQLO", "Myntra"]);
});
