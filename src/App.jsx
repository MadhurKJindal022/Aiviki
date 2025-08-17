import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AIDirectory from "./pages/AIDirectory";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AIDirectory />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;