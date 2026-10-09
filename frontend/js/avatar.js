let builder = AppState.get("avatar_builder", {
    gender: AppState.get("gender", "Female"),
    model_preset: "Model A",
    body_shape: "Balanced",
    height: AppState.get("height", 168),
    weight: AppState.get("weight", 58),
    skin_tone: AppState.get("skin_tone", "Medium"),
    hair_style: "Long Straight",
    hair_colour: "Dark Brown",
    occasion: AppState.get("occasion", "College"),
    accessory: "Minimal Watch"
});

function setMode(mode) {
    AppState.set('visual_mode', mode);
    
    document.getElementById('mode-photo').classList.remove('active');
    document.getElementById('mode-avatar').classList.remove('active');
    document.getElementById('mode-' + mode).classList.add('active');
    
    document.getElementById('photo-section').classList.remove('active');
    document.getElementById('avatar-section').classList.remove('active');
    
    document.getElementById(mode + '-section').classList.add('active');
    
    const isAvatar = mode === 'avatar';
    document.getElementById('btn-reset').style.display = isAvatar ? 'block' : 'none';
    document.getElementById('btn-save').style.display = isAvatar ? 'block' : 'none';
    
    if (mode === 'photo') {
        const fileInput = document.getElementById('photo-input');
        if (fileInput) fileInput.click();
    }
    
    if (isAvatar) {
        refreshAvatar();
    }
}

function showTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.substep-panel').forEach(p => p.classList.remove('active'));
    
    document.getElementById('tab-' + tabId).classList.add('active');
    document.getElementById('panel-' + tabId).classList.add('active');
}

function refreshAvatar() {
    AppState.set("avatar_builder", builder);
    
    // Fetch SVG from backend
    fetch('http://127.0.0.1:8000/api/avatar/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(builder)
    })
    .then(r => r.json())
    .then(data => {
        document.getElementById('avatar-preview').innerHTML = data.svg_html;
    })
    .catch(e => {
        console.error("Failed to render avatar", e);
        document.getElementById('avatar-preview').innerHTML = "Failed to render avatar. Is the backend running?";
    });
}

function createGrid(containerId, options, builderKey) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    options.forEach(opt => {
        const btn = document.createElement('button');
        const isActive = builder[builderKey] === opt.val;
        btn.className = `select-btn ${isActive ? 'active' : ''}`;
        btn.innerText = (isActive ? '✓ ' : '') + opt.label;
        btn.onclick = () => {
            builder[builderKey] = opt.val;
            renderControls();
            refreshAvatar();
        };
        container.appendChild(btn);
    });
}

function renderControls() {
    createGrid('grid-preset', [
        {label: 'Model A', val: 'Model A'},
        {label: 'Model B', val: 'Model B'}
    ], 'model_preset');
    
    createGrid('grid-hairstyle', [
        {label: 'Long Straight', val: 'Long Straight'}, {label: 'Wavy', val: 'Wavy'}, {label: 'Curly', val: 'Curly'},
        {label: 'Bob', val: 'Bob'}, {label: 'Ponytail', val: 'Ponytail'}, {label: 'Bun', val: 'Bun'}
    ], 'hair_style');

    createGrid('grid-haircolor', [
        {label: 'Black', val: 'Black'}, {label: 'Dark Brown', val: 'Dark Brown'}, {label: 'Brown', val: 'Brown'},
        {label: 'Light Brown', val: 'Light Brown'}, {label: 'Blonde', val: 'Blonde'}, {label: 'Auburn', val: 'Auburn'}, {label: 'Red', val: 'Red'}
    ], 'hair_colour');

    createGrid('grid-shape', [
        {label: 'Balanced', val: 'Balanced'}, {label: 'Slim', val: 'Slim'}, 
        {label: 'Athletic', val: 'Athletic'}, {label: 'Curvy', val: 'Curvy'}
    ], 'body_shape');

    createGrid('grid-skin', [
        {label: 'Porcelain', val: 'Porcelain'}, {label: 'Light Beige', val: 'Light Beige'}, {label: 'Warm Almond', val: 'Warm Almond'},
        {label: 'Golden Tan', val: 'Golden Tan'}, {label: 'Deep Cocoa', val: 'Deep Cocoa'}, {label: 'Espresso', val: 'Espresso'}
    ], 'skin_tone');

    createGrid('grid-acc', [
        {label: 'Minimal Watch', val: 'Minimal Watch'}, {label: 'Glasses', val: 'Glasses'}, {label: 'Sunglasses', val: 'Sunglasses'},
        {label: 'Earrings', val: 'Earrings'}, {label: 'Canvas Tote', val: 'Canvas Tote'}
    ], 'accessory');
}

function resetAvatar() {
    builder = {
        gender: AppState.get("gender", "Female"),
        model_preset: "Model A",
        body_shape: "Balanced",
        height: AppState.get("height", 168),
        weight: AppState.get("weight", 58),
        skin_tone: AppState.get("skin_tone", "Medium"),
        hair_style: "Long Straight",
        hair_colour: "Dark Brown",
        occasion: AppState.get("occasion", "College"),
        accessory: "Minimal Watch"
    };
    renderControls();
    refreshAvatar();
}

function saveAvatar() {
    const occ = builder.occasion;
    let avatars = AppState.get("avatars", {});
    avatars[occ] = {...builder};
    AppState.set("avatars", avatars);
    AppState.set("selected_avatar_key", occ);
    alert(`Avatar saved to your '${occ}' style collection!`);
}

document.addEventListener('DOMContentLoaded', () => {
    // Sync profile values
    builder.gender = AppState.get("gender", "Female");
    builder.height = AppState.get("height", 168);
    builder.weight = AppState.get("weight", 58);
    builder.skin_tone = AppState.get("skin_tone", "Medium");
    builder.occasion = AppState.get("occasion", "College");
    
    const mode = AppState.get('visual_mode', 'avatar');
    setMode(mode);
    renderControls();
    
    // Photo upload mock logic
    document.getElementById('photo-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            document.getElementById('photo-status').innerText = "Photo uploaded successfully! Your styling engine will use this photo.";
        }
    });
});
