* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f3f8f3;
  color: #263326;
}

.app {
  max-width: 1100px;
  margin: auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #176b2c;
  color: white;
  padding: 18px 25px;
  border-radius: 12px;
}

.header h2 {
  margin: 0;
}

.hero {
  text-align: center;
  padding: 45px 20px;
}

.hero h1 {
  font-size: 38px;
  margin-bottom: 8px;
}

.hero p {
  color: #666;
}

.card {
  background: white;
  padding: 25px;
  margin: 20px 0;
  border-radius: 15px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
}

.card h2 {
  color: #176b2c;
  margin-top: 0;
}

form {
  display: grid;
  gap: 15px;
}

input {
  width: 100%;
  padding: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
}

button {
  background: #1e8e3e;
  color: white;
  border: none;
  padding: 13px 22px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

button:hover {
  background: #146b2e;
}

.success {
  margin-top: 15px;
  padding: 12px;
  background: #e0f5e5;
  color: #176b2c;
  border-radius: 8px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.status-grid div {
  padding: 20px;
  background: #f4faf4;
  border-radius: 10px;
  text-align: center;
}

.crop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin: 15px 0;
  background: #f7faf7;
  border-radius: 12px;
}

.crop h3 {
  margin-top: 0;
}

.crop p {
  margin: 6px 0;
}

.crop strong {
  color: #1e8e3e;
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 20px 0;
}

.feature {
  background: white;
  padding: 25px;
  text-align: center;
  border-radius: 15px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
}

.feature:first-letter {
  font-size: 30px;
}

@media (max-width: 700px) {
  .header {
    flex-direction: column;
    gap: 10px;
  }

  .status-grid {
    grid-template-columns: 1fr 1fr;
  }

  .features {
    grid-template-columns: 1fr;
  }

  .crop {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
