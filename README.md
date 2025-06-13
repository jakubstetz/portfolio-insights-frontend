# 🔹 Portfolio Insights Frontend

A sleek and responsive React app that powers the Portfolio Insights user interface. It handles user authentication, stock chart visualization, and price alert management with a clean, minimal UI and intuitive UX.

## ⚙️ Features

* Vite-powered React SPA
* Secure JWT-based login and registration flow
* Historical stock price chart (powered by Recharts)
* Create, search, and delete price alerts
* Real-time feedback with `react-hot-toast`
* Custom-built CSS theme with glowing accents

## 🚀 User Flow

1. **Login/Register:** Authenticated via JWT and connected to the backend
2. **Dashboard:** Displays stock chart and alert panel after login
3. **Search + Alerts:** User can visualize data, create alerts, and search existing alerts
4. **Notifications:** Toasts appear for all key user actions (e.g. alert creation, login success)

## 📆 Technologies Used

* **React** (with `StrictMode` and `useContext` for global auth state)
* **Vite** (lightning-fast bundling)
* **Recharts** (for historical price visualization)
* **react-hot-toast** (for in-app notifications)
* **Custom CSS** (including `jakub-baseline.css` and responsive layouts)

## 💪 Developer Experience

* Custom CSS reset and layout styling
* Linting via ESLint and `lint-staged`
* Formatting via Prettier
* Built-in Husky hooks for pre-commit enforcement

## 🚜 API Integration

* Connects to the FastAPI backend via `VITE_API_URL`
* Leverages REST endpoints to:

  * Authenticate user
  * Fetch historical price data
  * Manage alert creation, deletion, and searching

## 🚧 Local Development

```bash
npm install         # Install dependencies
npm run dev         # Launches local dev server (usually on :5173)
```

Ensure the backend is running at the host defined in your `.env` file (`VITE_API_URL`).

## 🚨 Linting + Formatting

```bash
npm run lint        # Run ESLint
npm run format      # Run Prettier
```

Pre-commit hooks are set via Husky and `lint-staged` to run these commands automatically.

## ✈️ Deployment

Hosted via AWS Amplify. Each push to `main` triggers an automatic deployment pipeline. Environment variables are managed via the Amplify dashboard.

## 🔐 Authentication Notes

User state is managed globally using `AuthContext`. Token validation happens on load, with unauthenticated users automatically redirected to the login page. The MVP uses plaintext password transport; hashing/salting should be added for production.

## 📍 Live Demo

[https://portfolio-insights.jakubstetz.dev](https://portfolio-insights.jakubstetz.dev)

## 📄 License

MIT License
