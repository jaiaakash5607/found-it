import { useState, useEffect } from 'react';
import Logo from "./logo.jsx"
import "./styles/index.css"

export default  function Home() {

  // useEffect()
      
  return (
    <>
  

  <section className="hero">
    <h1 className="hero-title">
      Find What You Lost, <span className="accent">Return What You Found</span>
    </h1>

    <p className="hero-subtitle">
      A secure platform exclusively for SRMIST students to report and reclaim lost items on campus.
    </p>

    <div className="hero-buttons">
      <a href="/register"><button className="btn-primary" id="getStartedBtn">Get Started</button></a>
       <a href="/browse"><button className="btn-outline" id="browseBtn">Browse Items</button></a> 
    </div>

   
  </section>


  <section className="features">
    <div className="feature-card">
      <div className="feature-icon">🛡️</div>
      <div className="feature-title">Verified Access</div>
      <div className="feature-text">Only SRMIST students can log in to ensure campus-exclusive access.</div>
    </div>

    <div className="feature-card">
      <div className="feature-icon">📦</div>
      <div className="feature-title">Easy Posting</div>
      <div className="feature-text">Upload lost and found items quickly with simple forms and image uploads.</div>
    </div>

    <div className="feature-card">
      <div className="feature-icon">🔍</div>
      <div className="feature-title">Smart Search</div>
      <div className="feature-text">Search items by category, location, color, and date missing.</div>
    </div>

    <div className="feature-card">
      <div className="feature-icon">💬</div>
      <div className="feature-title">Private Messaging</div>
      <div className="feature-text">Secure chat between item owners and finders for safe item returns.</div>
    </div>
  </section>
    </>

  )}
