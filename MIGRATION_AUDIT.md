# STYLEAI Migration Audit

## Phase 0 - Complete Project Audit

### Python Modules (Backend/Core)
| File | Purpose | Current dependencies | Real functionality | Demo/static functionality | Migration destination |
|---|---|---|---|---|---|
| `app.py` | Entry point for Streamlit | Streamlit | - | Streamlit navigation | `frontend/index.html` (entry point) |
| `avatar_engine.py` | Renders SVG avatar | Streamlit | Real SVG generation, customizable properties | None | `backend/avatar_engine.py` |
| `recommender.py` | Recommends outfits based on preferences | Pandas, Scikit-learn (if used) | Real scoring/filtering logic | Dummy dataset parsing | `backend/recommender.py` |
| `skin_tone.py` | Analyzes image for skin tone | Pillow, Numpy | Color extraction logic | Streamlit file uploader | `backend/skin_tone.py` |
| `demo_data.py` | Provides mock data | None | Product definitions, mock datasets | Hardcoded data arrays | Keep in `backend` until fully DB-backed |
| `ui_theme.py` | Streamlit custom CSS / UI elements | Streamlit | - | `st.markdown` CSS injections | `frontend/css/style.css` |
| `shopping/*` | Shopping API integrations | Requests | E-commerce linking (Amazon, Flipkart, etc) | - | `backend/services/shopping_service.py` |

### Streamlit Pages (Frontend UI)
| File | Purpose | Streamlit-specific Code | Migration destination |
|---|---|---|---|
| `00_Home.py` | Landing dashboard | `st.columns`, `st.button` | `frontend/pages/home.html` |
| `01_My_Profile.py` | User basic inputs | `st.session_state`, `st.number_input` | `frontend/pages/profile.html` |
| `01_Avatar.py` | Interactive Avatar UI | `st.session_state`, `st.slider` | `frontend/pages/avatar.html` |
| `02_Appearance___Colour.py` | Skin tone upload & colors | `st.file_uploader`, `st.session_state` | `frontend/pages/appearance.html` |
| `03_My_Preferences.py` | Style & Occasion | `st.selectbox`, `st.session_state` | `frontend/pages/preferences.html` |
| `04_AI_Outfit_Recommendations.py` | Core outfit grid | `st.columns`, `st.container` | `frontend/pages/recommendations.html` |
| `05_Outfit_Details.py` | Swiggy-style breakdown | `st.markdown`, `st.columns` | `frontend/pages/outfit-details.html` |
| `06_Customize_My_Outfit.py` | Lock & Replace UI | `st.button`, `st.session_state` | `frontend/pages/customize.html` |
| `07_Budget_Stylist.py` | Budget constraints & cheaper opts | `st.metric`, `st.session_state` | `frontend/pages/budget.html` |
| `08_Interactive_Pairing.py` | NLP-style queries | `st.text_input` | `frontend/pages/pairing.html` |
| `09_Why_This_Outfit.py` | Explainability metrics | `st.progress`, `st.markdown` | `frontend/pages/explanation.html` |
| `10_Virtual_Styling___Preview.py`| Outfit + Avatar preview | `st.image`, `st.columns` | `frontend/pages/virtual-styling.html` |
| `11_Multi_Identity.py` | Occasion contexts | `st.tabs` | `frontend/pages/multi-identity.html` |
| `12_Final_Look.py` | Final summary & download | `st.download_button` | `frontend/pages/final-look.html` |

### Streamlit Components to Refactor
- `st.session_state` -> JavaScript `localStorage` / Browser memory
- `st.button` -> `<button class="...">`
- `st.markdown` -> HTML structure with matching CSS classes from `ui_theme.py`
- `st.file_uploader` -> `<input type="file">` + Fetch API POST
- `st.columns` -> CSS Grid / Flexbox
- `st.tabs` -> Vanilla JS tab switching
- `st.sidebar` -> CSS fixed sidebar

### Datasets
- `data/fashion_dataset.csv`: Actual product data. Remains at `data/fashion_dataset.csv`.

---

**Audit Complete. Ready to proceed to PHASE 1.**
