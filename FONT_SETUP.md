# Font Setup Instructions

## Phetsarath-OT Font Installation

To complete the Phetsarath-OT font setup, you need to add the font files to your project:

### Steps:

1. **Download Phetsarath-OT font files:**
   - You can download the font from Lao font repositories or font websites
   - You'll need: `Phetsarath-OT.ttf` and `Phetsarath-OT-Bold.ttf` (if available)

2. **Place font files in the fonts folder:**
   ```
   tapheng-shop/
   └── public/
       └── fonts/
           ├── Phetsarath-OT.ttf
           └── Phetsarath-OT-Bold.ttf
   ```

3. **The font is already configured:**
   - ✅ Font CSS file created at `app/assets/css/fonts.css`
   - ✅ Nuxt config updated to load the font CSS
   - ✅ Global font-family set in `app/app.vue`
   - ✅ Fallback fonts included (Noto Sans Lao, Arial)

### Current Configuration:

- **Primary Font:** Phetsarath-OT
- **Fallback Fonts:** Noto Sans Lao (Google Fonts), Arial, sans-serif
- **Applied To:** All pages and components

### Note:
If you don't have the Phetsarath-OT font files, the app will automatically use the fallback font "Noto Sans Lao" which is a similar Lao font loaded from Google Fonts.
