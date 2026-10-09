document.addEventListener('DOMContentLoaded', () => {
    // Load from state
    const nameEl = document.getElementById('name');
    const ageEl = document.getElementById('age');
    const genderEl = document.getElementById('gender');
    const heightEl = document.getElementById('height');
    const weightEl = document.getElementById('weight');
    const budgetEl = document.getElementById('budget');

    nameEl.value = AppState.get('user_name', 'Alex');
    ageEl.value = AppState.get('age', 22);
    genderEl.value = AppState.get('gender', 'Female');
    heightEl.value = AppState.get('height', 168);
    weightEl.value = AppState.get('weight', 58);
    budgetEl.value = AppState.get('budget', 3500);

    const elements = [nameEl, ageEl, genderEl, heightEl, weightEl, budgetEl];

    function updateSummary() {
        // Save to state
        AppState.set('user_name', nameEl.value);
        AppState.set('age', parseInt(ageEl.value));
        AppState.set('gender', genderEl.value);
        AppState.set('height', parseInt(heightEl.value));
        AppState.set('weight', parseInt(weightEl.value));
        AppState.set('budget', parseFloat(budgetEl.value));

        // Update UI
        document.getElementById('height-val').innerText = heightEl.value;
        document.getElementById('weight-val').innerText = weightEl.value;
        
        const b = parseFloat(budgetEl.value);
        const formattedBudget = money(b);
        document.getElementById('budget-val-label').innerText = formattedBudget;
        document.getElementById('budget-display-value').innerText = formattedBudget;
        
        const pct = Math.max(0, Math.min(100, ((b - 500) / (10000 - 500)) * 100));
        document.getElementById('budget-fill').style.width = pct + '%';

        const summary = document.getElementById('profile-summary');
        summary.innerHTML = `
            • <strong>Name</strong>: ${nameEl.value}<br>
            • <strong>Gender</strong>: ${genderEl.value} (${ageEl.value} yrs)<br>
            • <strong>Height & Weight</strong>: ${heightEl.value} cm · ${weightEl.value} kg<br>
            • <strong>Budget</strong>: ${formattedBudget}
        `;
    }

    elements.forEach(el => {
        el.addEventListener('input', updateSummary);
        el.addEventListener('change', updateSummary);
    });

    // Initial run
    updateSummary();
});

function saveAndContinue() {
    // Already saved to state continuously
    // In a real flow, you might POST to /api/profile here
    const profileData = {
        name: AppState.get('user_name'),
        age: AppState.get('age'),
        gender: AppState.get('gender'),
        height: AppState.get('height'),
        weight: AppState.get('weight'),
        budget: AppState.get('budget'),
        skin_tone: AppState.get('skin_tone'),
        style: AppState.get('style'),
        occasion: AppState.get('occasion'),
        favorite_colours: AppState.get('favorite_colours', []),
        avoid_colours: AppState.get('avoid_colours', []),
        preferred_fit: AppState.get('preferred_fit', "Regular Fit")
    };

    fetch('http://127.0.0.1:8000/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
    }).then(r => r.json()).then(data => {
        window.location.href = 'appearance.html';
    }).catch(e => {
        console.error("Failed to save profile via API", e);
        // Fallback to local
        window.location.href = 'appearance.html';
    });
}
