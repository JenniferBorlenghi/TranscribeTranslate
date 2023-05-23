import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import InitialPage from "./pages/InitialPage";
import Form from "./components/Form";

function App() {
  return (
    <div>
      <Header />
      {/* <Form /> */}
      <Routes>
        <Route path="/" element={<InitialPage />} />
      </Routes>
    </div>
  );
}

export default App;
