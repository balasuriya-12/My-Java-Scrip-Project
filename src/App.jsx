import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000";

function App() {
  const [page, setPage] = useState("home");

  const [mobile, setMobile] = useState("");
  const [crop, setCrop] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [serverStatus, setServerStatus] = useState("Checking...");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(API)
      .then(() => setServerStatus("Connected"))
      .catch(() => setServerStatus("Not Connected"));
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Location is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        setLocation(`${lat}, ${lon}`);
        alert("Location detected successfully!");
      },
      () => {
        alert("Unable to get location. Please allow location permission.");
      }
    );
  };

  const sendOTP = () => {
    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    alert("OTP sent successfully!");
    setPage("farmer");
  };

  const listCrop = async () => {
    if (!crop || !quantity || !price) {
      alert("Please fill all crop details.");
      return;
    }

    const cropData = {
      crop,
      quantity: Number(quantity),
      price: Number(price),
      location: location || "Location not provided",
    };

    try {
      const response = await fetch(`${API}/api/crops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cropData),
      });

      if (response.ok) {
        alert("Crop listed successfully!");
      } else {
        alert("Crop saved in demo mode.");
      }
    } catch {
      alert("Crop listed successfully in demo mode.");
    }

    setMessage(`${crop} - ${quantity} kg - ₹${price}/kg`);
  };

  const contactFarmer = async (cropName) => {
    const requestData = {
      crop: cropName,
      buyer: "Buyer",
      status: "Pending",
    };

    try {
      await fetch(`${API}/api/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
    } catch {
      // Demo mode
    }

    alert(`Request sent for ${cropName}!`);
  };

  if (page === "home") {
    return (
      <div className="app">
        <header className="navbar">
          <div className="logo">🌱 Kisan Setu</div>

          <div className="nav-links">
            <span onClick={() => setPage("home")}>Home</span>

            <span
              onClick={() =>
                alert(
                  "Kisan Setu connects farmers directly with buyers and procurement opportunities."
                )
              }
            >
              About
            </span>

            <span
              onClick={() =>
                alert("Contact: support@kisansetu.com")
              }
            >
              Contact
            </span>
          </div>
        </header>

        <main className="hero">
          <div className="hero-content">
            <p className="badge">
              🌾 Smart Farmer Procurement Platform
            </p>

            <h1>Kisan Setu</h1>

            <h2>Farmer–Procurement Bridge</h2>

            <p>
              Connecting farmers directly with buyers, markets and
              procurement opportunities through a simple digital platform.
            </p>

            <div className="buttons">
              <button
                className="primary-btn"
                onClick={() => setPage("farmer")}
              >
                👨‍🌾 I'm a Farmer
              </button>

              <button
                className="secondary-btn"
                onClick={() => setPage("buyer")}
              >
                🛒 I'm a Buyer
              </button>
            </div>
          </div>

          <div className="login-card">
            <div className="plant-icon">🌱</div>

            <h2>Grow Better. Sell Better.</h2>

            <p>
              A digital bridge between farmers and procurement networks.
            </p>

            <label>Mobile Number</label>

            <div className="mobile-input">
              <span>+91</span>

              <input
                type="text"
                maxLength="10"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) =>
                  setMobile(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>

            <button className="otp-btn" onClick={sendOTP}>
              Send OTP
            </button>
          </div>
        </main>

        <section className="features">
          <div>
            <span>🌾</span>
            <h3>Direct Selling</h3>
            <p>
              Connect farmers directly with procurement opportunities.
            </p>
          </div>

          <div>
            <span>💰</span>
            <h3>Better Prices</h3>
            <p>
              Help farmers discover competitive market prices.
            </p>
          </div>

          <div>
            <span>📍</span>
            <h3>Location Based</h3>
            <p>
              Find nearby procurement opportunities.
            </p>
          </div>
        </section>
      </div>
    );
  }

  if (page === "farmer") {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <h2>🌱 Kisan Setu</h2>

          <button onClick={() => setPage("home")}>
            Logout
          </button>
        </header>

        <div className="dashboard-container">
          <h1>👨‍🌾 Farmer Dashboard</h1>

          <p>Add your crops and connect with buyers.</p>

          <div className="dashboard-card">
            <h2>🖥️ Server Status</h2>

            <p>
              Backend:
              <strong> {serverStatus}</strong>
            </p>

            <p>
              Server URL:
              <strong> http://localhost:5000</strong>
            </p>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h2>📦 Add Your Crop</h2>

              <label>Crop Name</label>

              <input
                type="text"
                placeholder="Example: Tomato"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
              />

              <label>Quantity (kg)</label>

              <input
                type="number"
                placeholder="Example: 500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <label>Expected Price (₹/kg)</label>

              <input
                type="number"
                placeholder="Example: 30"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <label>📍 Location</label>

              <div className="location-row">
                <input
                  type="text"
                  placeholder="Detect your location"
                  value={location}
                  readOnly
                />

                <button
                  className="secondary-btn"
                  onClick={getLocation}
                >
                  📍 Get Location
                </button>
              </div>

              <button
                className="primary-btn full"
                onClick={listCrop}
              >
                + List Crop
              </button>

              {message && (
                <p className="success-message">
                  ✅ {message}
                </p>
              )}
            </div>

            <div className="dashboard-card">
              <h2>📊 Quick Information</h2>

              <div className="info-box">
                <strong>Crop</strong>
                <span>{crop || "Not added"}</span>
              </div>

              <div className="info-box">
                <strong>Quantity</strong>
                <span>
                  {quantity ? `${quantity} kg` : "Not added"}
                </span>
              </div>

              <div className="info-box">
                <strong>Expected Price</strong>
                <span>
                  {price ? `₹${price}/kg` : "Not added"}
                </span>
              </div>

              <div className="info-box">
                <strong>Location</strong>
                <span>
                  {location || "Not detected"}
                </span>
              </div>

              <button
                className="secondary-btn full"
                onClick={() =>
                  alert("Nearby buyers will appear here.")
                }
              >
                🔎 Find Nearby Buyers
              </button>
            </div>
          </div>

          <div className="dashboard-card market-card">
            <h2>📈 Market Information</h2>

            <div className="market-grid">
              <div>
                <h3>🍅 Tomato</h3>
                <p>₹25 – ₹35 / kg</p>
              </div>

              <div>
                <h3>🧅 Onion</h3>
                <p>₹20 – ₹30 / kg</p>
              </div>

              <div>
                <h3>🥔 Potato</h3>
                <p>₹18 – ₹28 / kg</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>🌱 Kisan Setu</h2>

        <button onClick={() => setPage("home")}>
          Logout
        </button>
      </header>

      <div className="dashboard-container">
        <h1>🛒 Buyer Dashboard</h1>

        <p>Find crops directly from farmers.</p>

        <div className="dashboard-card">
          <h2>📍 Find Farmers Near You</h2>

          <button
            className="primary-btn"
            onClick={getLocation}
          >
            📍 Detect My Location
          </button>

          {location && (
            <p>
              Your location:
              <strong> {location}</strong>
            </p>
          )}
        </div>

        <div className="dashboard-card">
          <h2>🌾 Available Crops</h2>

          <div className="crop-list">
            <div className="crop-item">
              <div>
                <h3>🍅 Tomato</h3>
                <p>Quantity: 500 kg</p>
                <p>Expected price: ₹30/kg</p>
                <p>📍 Coimbatore</p>
              </div>

              <button
                className="primary-btn"
                onClick={() => contactFarmer("Tomato")}
              >
                Contact Farmer
              </button>
            </div>

            <div className="crop-item">
              <div>
                <h3>🧅 Onion</h3>
                <p>Quantity: 800 kg</p>
                <p>Expected price: ₹25/kg</p>
                <p>📍 Erode</p>
              </div>

              <button
                className="primary-btn"
                onClick={() => contactFarmer("Onion")}
              >
                Contact Farmer
              </button>
            </div>

            <div className="crop-item">
              <div>
                <h3>🥔 Potato</h3>
                <p>Quantity: 600 kg</p>
                <p>Expected price: ₹22/kg</p>
                <p>📍 Ooty</p>
              </div>

              <button
                className="primary-btn"
                onClick={() => contactFarmer("Potato")}
              >
                Contact Farmer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;