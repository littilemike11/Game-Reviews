# Game-Reviews

A demo game review site that will be later integrated into My-Games-List

## Installation

1. clone repository

```
git clone https://github.com/littilemike11/Game-Reviews.git
```

2. install modules

```
npm install
```

3. start localhost server

```
npm run dev
```

## How it Works

### Summary

This project uses express to create a custom api for the user. Given a game title and title, the app does an api call through a local host server and uses axios to get access igdb's api. It gathers the user's review and game info and combines them and store it in local storage. Then when retrieving a game, given a title, reviews the game information (reviews included) from local storage and display it on a card.

### UI

1. User enters in a game title and a custom review.
2. User enters name of game that they have reviewed to get their reviews and other info on the game

### Api Routes

#### GET

- /games/:title - given a game title, retrieve it from local storage. returns an object with game id, name, summary, cover#,total_rating, and reviews

- /covers/:cover - given a cover id make an axios call to igdb to get cover image of game

#### POST

- /reviews - given the title and review from the req.body, make an axios call to igdb to get info on a game, merge result with reviews. Then store on local storage with key of game title.

### functions

- createReview() - reads user input to get title and review, makes an axios call to localhost server with premade api /reviews. Passes the title and review into body

- retrieveGame() - reads user input to get title and uses axios to make localhost call to api /games:title . Also calls retrieveCover(coverId) to get the game's cover img. Last displays the results on the card text.

- retrieveCover(coverID)- given a coverId, gotten as result of createReview's call, set the img of card to cover img.
