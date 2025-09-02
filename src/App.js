import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./comps/Layout.jsx";
import './App.css';
import { ThemeProvider } from "./comps/ThemeProvider.jsx"

function App() {
  return (
      <ThemeProvider>
          <Router>
              <Layout />
          </Router>
      </ThemeProvider>
  );
}

export default App;
