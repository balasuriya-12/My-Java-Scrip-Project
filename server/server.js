const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

// ==========================
// MIDDLEWARE
// ==========================

app.use(cors());
app.use(express.json());

// ==========================
// TEMPORARY DATA
// ==========================

let crops = [
  {
    id: 1,
    crop: "Tomato",
    quantity: 500,
    price: 30,
    location: "Coimbatore, Tamil Nadu",
  },
  {
    id: 2,
    crop: "Onion",
    quantity: 800,
    price: 25,
    location: "Erode, Tamil Nadu",
  },
  {
    id: 3,
    crop: "Potato",
    quantity: 600,
    price: 22,
    location: "Ooty, Tamil Nadu",
  },
];

let requests = [];

// ==========================
// HOME
// ==========================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🌱 Kisan Setu Backend is Running!",
  });
});

// ==========================
// GET CROPS
// ==========================

app.get("/api/crops", (req, res) => {
  res.json({
    success: true,
    crops: crops,
  });
});

// ==========================
// ADD CROP
// ==========================

app.post("/api/crops", (req, res) => {
  const {
    crop,
    quantity,
    price,
    location,
  } = req.body;

  if (!crop || !quantity || !price) {
    return res.status(400).json({
      success: false,
      message: "Crop, quantity and price are required.",
    });
  }

  const newCrop = {
    id: Date.now(),
    crop: crop,
    quantity: Number(quantity),
    price: Number(price),
    location: location || "Location not provided",
  };

  crops.push(newCrop);

  res.status(201).json({
    success: true,
    message: "🌾 Crop added successfully!",
    crop: newCrop,
  });
});

// ==========================
// DELETE CROP
// ==========================

app.delete("/api/crops/:id", (req, res) => {
  const id = Number(req.params.id);

  const crop = crops.find(
    (item) => item.id === id
  );

  if (!crop) {
    return res.status(404).json({
      success: false,
      message: "Crop not found.",
    });
  }

  crops = crops.filter(
    (item) => item.id !== id
  );

  res.json({
    success: true,
    message: "Crop deleted successfully.",
  });
});

// ==========================
// CREATE BUYER REQUEST
// ==========================

app.post("/api/requests", (req, res) => {
  const {
    cropId,
    crop,
    buyer,
    requestedQuantity,
    price,
    location,
  } = req.body;

  if (
    !cropId ||
    !crop ||
    !buyer ||
    !requestedQuantity
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required details.",
    });
  }

  const newRequest = {
    id: Date.now(),
    cropId: cropId,
    crop: crop,
    buyer: buyer,
    requestedQuantity: Number(requestedQuantity),
    price: Number(price),
    location: location || "Unknown",
    status: "Pending",
  };

  requests.push(newRequest);

  res.status(201).json({
    success: true,
    message: "🤝 Buyer request sent successfully!",
    request: newRequest,
  });
});

// ==========================
// GET BUYER REQUESTS
// ==========================

app.get("/api/requests", (req, res) => {
  res.json({
    success: true,
    requests: requests,
  });
});

// ==========================
// ACCEPT REQUEST
// ==========================

app.put("/api/requests/:id/accept", (req, res) => {
  const id = Number(req.params.id);

  const request = requests.find(
    (item) => item.id === id
  );

  if (!request) {
    return res.status(404).json({
      success: false,
      message: "Request not found.",
    });
  }

  request.status = "Accepted";

  res.json({
    success: true,
    message: "Request accepted successfully.",
    request: request,
  });
});

// ==========================
// REJECT REQUEST
// ==========================

app.put("/api/requests/:id/reject", (req, res) => {
  const id = Number(req.params.id);

  const request = requests.find(
    (item) => item.id === id
  );

  if (!request) {
    return res.status(404).json({
      success: false,
      message: "Request not found.",
    });
  }

  request.status = "Rejected";

  res.json({
    success: true,
    message: "Request rejected successfully.",
    request: request,
  });
});

// ==========================
// START SERVER
// ==========================

app.listen(PORT, () => {
  console.log("");
  console.log("================================");
  console.log("🌱 KISAN SETU BACKEND");
  console.log("================================");
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log("================================");
});