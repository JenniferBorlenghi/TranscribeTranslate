import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import InitialPage from "./pages/InitialPage";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<InitialPage />} />
      </Routes>
    </div>
  );
}

export default App;
