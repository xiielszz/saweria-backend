require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());

const SAWERIA_COOKIE = process.env.SAWERIA_COOKIE;

let latestDonations = [];
let lastId = null;

async function checkSaweria() {

  try {

    const response = await axios.get(
      "https://saweria.co/api/transactions?streamer=xielszz",
      {
        headers: {
          Cookie: SAWERIA_COOKIE
        }
      }
    );

    const data = response.data.data || [];

    if (data.length > 0) {

      const newest = data[0];

      if (newest.id !== lastId) {

        lastId = newest.id;

        latestDonations.push({
          id: newest.id,
          name: newest.donator_name || "Anonim",
          amount: Number(newest.amount),
          message: newest.message || ""
        });

        console.log("Donasi baru:", newest.donator_name);
      }
    }

  } catch (err) {
    console.log(err.message);
  }
}

setInterval(checkSaweria, 10000);

app.get("/", (req, res) => {
  res.send("Saweria Backend Aktif");
});

app.get("/donations", (req, res) => {

  res.json({
    donations: latestDonations
  });

  latestDonations = [];
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server berjalan");
});
