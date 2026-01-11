import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import { lazy, Suspense } from "react";
import PageLoader from "./pages/PageLoader";
const Home = lazy(() => import("./pages/Home"));
const Catalog = lazy(() => import("./pages/Catalog"));
const CatalogItem = lazy(() => import("./pages/CatalogItem"));
const Inventory = lazy(() => import("./pages/Inventory"));

function App() {
  return (
    <Suspense fallback={<PageLoader/>}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:id" element={<CatalogItem />} />
          <Route path="/inventory" element={<Inventory />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
