import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { GlobalStateProvider } from "./GlobalStateProvider.tsx";

ReactDOM.createRoot(document.getElementById("app")!).render(
    <React.StrictMode>
        <GlobalStateProvider>
            <App />
        </GlobalStateProvider>
    </React.StrictMode>
);
