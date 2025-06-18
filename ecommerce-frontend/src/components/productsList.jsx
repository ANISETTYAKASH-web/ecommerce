import { useState, useEffect } from "react";

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) {
          throw new Error("http connection failed to fetch", response.status);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("error:", err);
        setError("failed to load products please try again later");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  if (loading) {
    return <p>loading</p>;
  }
  if (Error) {
    return <p>{Error}</p>;
  }
  return (
    <div>
      {products.length === 0 ? (
        <h2>please add more products from backend</h2>
      ) : (
        products.map((data) => (
          <div>
            <h3>{data.name}</h3>
            <h3>{data.description}</h3>
            <h3>{data.price}</h3>
          </div>
        ))
      )}
    </div>
  );
}

export default ProductsList;
