# 🐾 4cats Pinas (weather4cast)

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![API](https://img.shields.io/badge/API-Open--Meteo-orange?style=flat-square)
![License](https://img.shields.io/badge/License-ISC-green?style=flat-square)

---

## Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool** | [Vite 8](https://vite.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with Neo-Brutalist cartoon cards |
| **Fonts** | Fredoka (Display) & Plus Jakarta Sans (Body) |
| **Icons & Effects** | Lucide React, Canvas Confetti |
| **Data Provider** | [Open-Meteo API](https://open-meteo.com/) (Geocoding & Forecast) |

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` (or `yarn` / `pnpm`)

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/weather4cast.git
   cd weather4cast
   ```

2. **Install dependencies:**
   ```bash
   # From root directory
   npm install
   npm install --prefix client
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## Project Structure

```text
weather4cast/
├── .gitignore              # Root Git ignore rules
├── package.json            # Root scripts (npm run dev, build, lint)
├── README.md               # Project documentation
└── client/
    ├── package.json        # Frontend dependencies & scripts
    ├── index.html          # HTML entry point with Google Fonts
    ├── vite.config.js      # Vite configuration
    ├── tailwind.config.js  # Custom cat themes, palette, & pop shadows
    └── src/
        ├── App.jsx         # Main dashboard layout & state
        ├── index.css       # Neo-brutalist utility layers & animations
        ├── components/     # Reusable UI widgets
        ├── hooks/          # useWeather & useGeolocation hooks
        ├── services/       # Open-Meteo API client & PH city list
        └── utils/          # Heat index calculator & WMO transformers
```

---

## License & Acknowledgments

- **License**: ISC License
- **Weather Data**: Powered by [Open-Meteo](https://open-meteo.com/) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- **Advisories**: Inspired by PAGASA Heat Index and Storm Warning standards.
# 4cats
