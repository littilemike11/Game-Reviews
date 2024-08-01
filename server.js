const express = require("express");
const axios = require("axios");
const { LocalStorage } = require("node-localstorage");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const PORT = 3002;
import router from "./routes/v1.js";

// load environment variables from .env files
dotenv.config();

const localStorage = new LocalStorage("./games");

app.use(cors());
app.use(express.json());
//ideas - game reviews/ratings

// GET ROUTE
// get game game + rating from specific game
app.get("/games/:title", (req, res) => {
  try {
    let title = req.params.title;
    console.log(title);

    // retrieve game from localStorage
    let game = localStorage.getItem(title);
    console.log(game);
    if (game) {
      res.send(game);
    } else {
      res.send("Review doesn't exist");
      console.log("Review doesn't exist");
    }
  } catch (err) {
    res.send(err);
  }
});
//get cover art
app.get("/covers/:coverId", async (req, res) => {
  try {
    let coverId = req.params.coverId;
    console.log(coverId);
    let body = `fields url; where id = ${coverId};`;
    const response = await axios.post("https://api.igdb.com/v4/covers", body, {
      headers: {
        "Client-ID": "f6dlyr5pr2re46e6wr69prd253d74n",
        Authorization: "Bearer 6neool7t4emy1cuk04uha8smykxqgg",
      },
    });
    res.send(response.data[0].url);
  } catch (err) {
    res.send(err);
  }
});

// POST ROUTE
// post review /rating to game
app.post("/reviews", async (req, res) => {
  try {
    // get api data
    let { title, review } = req.body;

    let body = `fields id, cover, name,storyline, summary,total_rating; search "${title}" ;`;
    // let body = " fields *; where id =987;";
    const response = await axios.post("https://api.igdb.com/v4/games", body, {
      headers: {
        "Client-ID": "f6dlyr5pr2re46e6wr69prd253d74n",
        Authorization: "Bearer 6neool7t4emy1cuk04uha8smykxqgg",
      },
    });

    console.log(title);
    console.log(review);
    //if game doesn't exist in api return err
    if (response.data.length == 0) {
      res.send("Game Doesn't Exist. Review Rejected. Please Try Again");
      return;
    }

    //we store the review +api response local storage- > into the array of game objects
    //get existing item from key
    let game = localStorage.getItem(title);
    if (game) {
      //get current value of game from local storage
      let currVal = JSON.parse(game);
      // console.log(currVal);
      //adds a new review to reviews array
      currVal.reviews.push(review);
      // console.log(currVal.review);
      //store new version into local storage
      localStorage.setItem(title, JSON.stringify(currVal));
    } else {
      //if game review doesnt exist
      //merge review + api response
      //order by id
      response.data.sort((a, b) => a.id - b.id);

      response.data[0].reviews = [review];
      localStorage.setItem(title, JSON.stringify(response.data[0]));
    }
    if (response.status === 200) {
      console.log("Item stored successfully.");
    } else {
      console.log("Error storing item.");
    }
    res.send("Review Submitted");
  } catch (err) {
    res.send(err);
  }
});

app.use("/api/v1", router);

// Connect to MongoDB Atlas Database

const uri = process.env.MONGODB_URI;
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

async function connectDb() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
    console.log("error: " + error);
  }
}

app.listen(PORT, async () => {
  await connectDb().catch(console.dir);
  console.log(`Express Api: localhost: ${PORT}`);
});
