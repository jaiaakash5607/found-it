import React from 'react';
import './styles/browse.css';
import ItemCard from './ItemCard.jsx';

export default function Browse() {


  return (
    <>


  <main className="page">
 
    <section className="page-header">
      <h1 className="page-title">Browse Lost &amp; Found Items</h1>
      <p className="page-subtitle">Search and filter through all active listings</p>
    </section>

   
    <section className="filter-card">
      <div className="filter-grid">
        <div className="filter-group">
          <label htmlFor="searchInput">Search</label>
          <input
            id="searchInput"
            className="filter-input"
            type="text"
            placeholder="Search items..."
          />
        </div>

        <div className="filter-group">
          <label htmlFor="typeSelect">Type</label>
          <select id="typeSelect" className="filter-select">
            <option value="all">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="categorySelect">Category</label>
          <select id="categorySelect" className="filter-select">
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="documents">Documents</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </section>


    <section className="results-card">
      <div className="results-grid">
     <ItemCard
  image="../assets/react.svg"
  title="Black Leather Wallet"
  category="Wallet"
  location="SRM Kattankulathur Library"
  date="12 Sep 2025"
  description="Found near the first-floor reading area. Contains ID cards."
  status="found"
  onContact={() => alert("Contact clicked")}
/>
     <ItemCard
  image="/uploads/wallet.jpg"
  title="Black Leather Wallet"
  category="Wallet"
  location="SRM Kattankulathur Library"
  date="12 Sep 2025"
  description="Found near the first-floor reading area. Contains ID cards."
  status="found"
  onContact={() => alert("Contact clicked")}
/>
     <ItemCard
  image="/uploads/wallet.jpg"
  title="Black Leather Wallet"
  category="Wallet"
  location="SRM Kattankulathur Library"
  date="12 Sep 2025"
  description="Found near the first-floor reading area. Contains ID cards."
  status="found"
  onContact={() => alert("Contact clicked")}
/>
     <ItemCard
  image="/uploads/wallet.jpg"
  title="Black Leather Wallet"
  category="Wallet"
  location="SRM Kattankulathur Library"
  date="12 Sep 2025"
  description="Found near the first-floor reading area. Contains ID cards."
  status="found"
  onContact={() => alert("Contact clicked")}
/>
     <ItemCard
  image="/uploads/wallet.jpg"
  title="Black Leather Wallet"
  category="Wallet"
  location="SRM Kattankulathur Library"
  date="12 Sep 2025"
  description="Found near the first-floor reading area. Contains ID cards."
  status="found"
  onContact={() => alert("Contact clicked")}
/>
  </div>

      
    </section>
  </main>
  </>
  )}