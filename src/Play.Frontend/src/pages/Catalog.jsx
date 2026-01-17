import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCatalogItems } from "../api/catalogApi";

function Catalog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getCatalogItems()
      .then(data => {
        if (isMounted) {
          setItems(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <p>Loading catalog...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Catalog</h1>

      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id} style={{ marginBottom: "1rem" }}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <strong>${item.price}</strong>
              <br />
              <Link to={`/catalog/${item.id}`}>View details</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Catalog;
