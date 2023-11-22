import RoutesApp from "./Routes/Routes";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "./contexts/AuthContext";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <ToastContainer autoClose={3000} theme="colored" />
          <RoutesApp />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
