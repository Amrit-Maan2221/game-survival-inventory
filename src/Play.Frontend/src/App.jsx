import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Inventory from "./pages/Inventory";
import CatalogItem from "./pages/CatalogItem";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:id" element={<CatalogItem />} />
        <Route path="/inventory" element={<Inventory />} />
      </Route>
    </Routes>
  );
}

export default App;
