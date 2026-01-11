import { useParams } from "react-router-dom";

function CatalogItem() {
  const { id } = useParams();

  return (
    <div>
      <h1>Catalog Item Details</h1>
      <p>Item ID: {id}</p>
    </div>
  );
}

export default CatalogItem;
