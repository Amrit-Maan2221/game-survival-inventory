import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Inventory from "./pages/Inventory";
import CatalogItem from "./pages/CatalogItem";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/catalog/:id" element={<CatalogItem />} />
      <Route path="/inventory" element={<Inventory />} />
    </Routes>
  );
}

export default App;
