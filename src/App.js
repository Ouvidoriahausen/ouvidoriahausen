import RoutesApp from "./routes/Routes";
import { BrowserRouter } from "react-router-dom";

// Global Context (Provider)
import GlobalProvider from "./contexts/GlobalContext";

// React Toastify
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

// Theme
import { ThemeProvider } from "@mui/material";
import { theme } from "./utils/Theme";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <GlobalProvider>
          <ThemeProvider theme={theme}>
            <ToastContainer autoClose={3000} theme="colored" />
            <RoutesApp />
          </ThemeProvider>
        </GlobalProvider>
      </BrowserRouter>
    </div>
  );
}