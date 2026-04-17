import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import FavoritesPage from "./pages/FavoritesPage";
import "./App.css";
import RecipeDetail from "./components/RecipeDetail";
// import Page404 from "./pages/Page404";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe" element={<RecipeDetail />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          {/* <Route path="*" element={<Page404 />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
