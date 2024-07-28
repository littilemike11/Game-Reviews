// Function to store an item in localStorage
async function createReview() {
  const title = document.getElementById("title").value;
  const review = document.getElementById("review").value;

  if (!title || !review) {
    alert("Please enter both title and review.");
    return;
  }

  const response = await axios.post(`http://localhost:3002/reviews`, {
    title: title,
    review: review,
  });

  if (response.status === 200) {
    alert("Item stored successfully.");
  } else {
    alert("Error storing item.");
  }
}

// Function to retrieve an item from localStorage
async function retrieveGame() {
  const title = document.getElementById("getTitle").value;
  const gameTitle = document.getElementById("gameTitle");
  const rating = document.getElementById("rating");
  const summary = document.getElementById("summary");
  const reviews = document.getElementById("reviews");

  if (!title) {
    alert("Please enter a title to retrieve.");
    return;
  }

  const response = await axios.get(`http://localhost:3002/games/${title}`);
  await retrieveCover(response.data.cover);
  if (response.status === 200) {
    let result = response.data;

    // Math.round(num * 100) / 100;
    gameTitle.textContent = result.name;
    rating.textContent = Math.round(result.total_rating * 100) / 100 + "%";
    summary.textContent = result.summary;
    reviews.textContent = `Reviews : ${result.reviews}`;

    console.log(response.data);
  } else if (response.status === 404) {
    document.getElementById("result").textContent = "Item not found.";
  } else {
    document.getElementById("result").textContent = "Error retrieving item.";
  }
}

async function retrieveCover(coverId) {
  const img = document.getElementById("cover");
  if (!coverId) {
    alert("No cover img available");
    return;
  }

  const response = await axios.get(`http://localhost:3002/covers/${coverId}`);

  if (response.status === 200) {
    img.src = response.data;
    console.log(response.data);
  } else if (response.status === 404) {
    document.getElementById("result").textContent = "Item not found.";
  } else {
    document.getElementById("result").textContent = "Error retrieving item.";
  }
}
