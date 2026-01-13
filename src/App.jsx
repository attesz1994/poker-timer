import { BrowserRouter, Routes, Route } from "react-router-dom";
import Controller from "./pages/Controller";
import Display from "./pages/Display"; // Import the real Display page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/controller" element={<Controller />} />
        <Route path="/display" element={<Display />} />
        {/* Default to controller for mobile ease */}
        <Route path="/" element={<Controller />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
