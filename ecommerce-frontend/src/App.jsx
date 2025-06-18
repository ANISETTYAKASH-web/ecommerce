import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ProductsList from "./components/productsList";

function App() {
  return (
    <div className="App">
      <header className="header">
        <h1>Welcome to Ecommerce Store</h1>
        <nav>
          <ul className="nav-list">
            <li className="nav-items">
              <a href="#" className="nav-link">
                Products
              </a>
            </li>

            <li className="nav-items">
              <a href="#" className="nav-link">
                Orders
              </a>
            </li>

            <li className="nav-items">
              <a href="#" className="nav-link">
                Users
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main className="main">
        <h2>Please browse through our collection</h2>
        <ProductsList />
      </main>
      <footer className="footer">
        <p>&copy; All rights reserved</p>
      </footer>
    </div>
  );
}

export default App;
