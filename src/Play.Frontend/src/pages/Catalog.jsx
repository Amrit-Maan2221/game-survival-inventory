import { Link, useSearchParams } from "react-router-dom";

function Catalog() {
  const items = [1, 2, 3, 4];
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = searchParams.get("sort") || "asc";

  const sortedItems =
    sort === "asc" ? items : [...items].reverse();

  return (
    <div>
      <h2>Catalog</h2>

      <button onClick={() => setSearchParams({ sort: "asc" })}>
        Sort Asc
      </button>

      <button onClick={() => setSearchParams({ sort: "desc" })}>
        Sort Desc
      </button>

      <ul>
        {sortedItems.map((id) => (
          <li key={id}>
            <Link to={`/catalog/${id}`}>
              View Item {id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Catalog;
