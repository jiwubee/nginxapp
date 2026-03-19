import React from 'react';

function Home() {
  return (
    <div className="page-container">
      <div className="hero">
        <h1>Welcome to Product Dashboard</h1>
        <p>Manage and monitor your products efficiently</p>
        <div className="hero-features">
          <div className="feature">
            <span className="icon">📦</span>
            <h3>Browse Products</h3>
            <p>View all products in your catalog</p>
          </div>
          <div className="feature">
            <span className="icon">➕</span>
            <h3>Add Products</h3>
            <p>Quickly add new items to your inventory</p>
          </div>
          <div className="feature">
            <span className="icon">📈</span>
            <h3>View Statistics</h3>
            <p>Monitor key metrics and analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;