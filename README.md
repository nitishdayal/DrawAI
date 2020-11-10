# Doodle Data
 > **Nitish Dayal** - Web and Mobile Applications Developer  
 > **Last commit date:** November 10th, 2020

# About
See if you're the better artist! Take turns against a friend to draw a given prompt; whichever drawing the computer can recognize as the given prompt gets a point. Whoever has the most points after 10 rounds, wins!

# Technologies
* Vanilla JS - No JS libraries or frameworks used
* `HTMLCanvasElement` - The canvas is the core of this application
* [Bulma](bulma.io/) - CSS framework built on `flexbox`
* [Google Vision API](https://cloud.google.com/vision/) - Trained ML model with an exposed API
* [Heroku](https://heroku.com) - Hosting for a single-route Express server
* [Google Fonts](<https://fonts.google.com/>) - Because I like FOUS and horrible user experiences :)

# Directory Structure
```bash
├── README.md
├── css/
│   ├── bulma.min.css <-- MINIFIED BULMA CSS FILE
│   └── style.css <-- CUSTOM STYLES
├── game.html  <-- GAME PAGE
├── index.html <-- LANDING PAGE
├── js/
│   └── app.js <-- JS LOGIC
└── wireframes/
    ├── landing.png
    ├── main-game.png
    └── results.png
```

# Installation
1. Play the deployed project on https://nitishdayal.github.io/doodle-data

## Local Installation
1. `fork` and `clone` the repo
2. The project communicates with APIs that will not allow communication unless the page is being served from a server - the simplest way to do this is to use the [VSCode Live Server extension](<https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer>)
3. Navigate to `127.0.0.1:5500`

# Motivation
As part of the General Assembly SEI Bootcamp, the first project deliverable consists of an in-browser game using HTML/CSS/Vanilla JS. Most of the creations I've seen for this project are reimaginations of existing 2D games (snake, asteroids, tamagotchi, etc.) and rely heavily on CSS animations and 'game loops' - a core set of logic that loops until an endgame condition is reached. I'm more interested in working with user data than with CSS animations, so I thought of a game that was based around working with user input. The functionality is loosely based on Google's [Quick, Draw!](https://quickdraw.withgoogle.com/) game, but uses a different API.

# How It Works
The core functionality of this game comes from a canvas and `mouseevents`. Two local users are given a prompt from a list/array of possible prompts, and attempt to draw it inside an `HTMLCanvasElement` using their mouse. After 60 seconds or once the user submits their drawing, the drawing is sent to the [Google Vision API](https://cloud.google.com/vision/) and analyzed. The API returns a list/array of `labelAnnotations` and includes a string `description` that is the APIs attempt at recognizing the drawing. If the `labelAnnotations` include a `description` that matches the given prompt, the user gets a point. Then the next user attempts to draw the same prompt.

After both users have taken their turn for the given prompt, the next prompt is displayed. After 10 turns (10 prompts) have been completed, the game ends and the points are tallied. Whichever user has the most points wins the game.

The communication with the API is handled by a small server I deployed to Heroku. I originally had the API request on the client side, but this exposed my API key to the client, which is insecure. By moving the request to the server, the API key is protected.

The server has one endpoint `POST /getTags` that looks for a JSON object inside the request body that contains a base64 string representation of the user's canvas drawing. It sends the base64 string to the Google Vision API, and sends the response back to the client.

### Server Code:
```js
const express = require('express')
const cors = require('cors')
const bp = require('body-parser')

const vision = require('@google-cloud/vision')
const client = new vision.ImageAnnotatorClient()

const app = express()

app.use(cors())
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.post('/getTags', async (req, res) => {
  const [result] = await client.labelDetection(req.body)
  const labels = result.labelAnnotations

  return res.send({ labels })
})

app.listen(process.env.PORT || 5000, () => {
  console.log(`Example app listening at ${process.env.PORT || 5000}`)
})
```

# Learnings
- **Converting a canvas to an image:** The `HTMLCanvasElement` has a method `toDataURL()` which converts a canvas drawing to a base64 string representation of an image.
- **Creating a drawable canvas:**
  - Event listeners:
    ```js
      document.addEventListener('mousedown', startPainting)
      document.addEventListener('mouseup', stopPainting)
      document.addEventListener('mousemove', sketch)
    ```
  - Event handlers:
    ```js
    const setCoordinates = (event) => {
      mouseCoordinates.x = event.pageX - $canvas.offsetLeft
      mouseCoordinates.y = event.pageY - $canvas.offsetTop
    }

    const startPainting = (event) => {
      isPainting = true
      setCoordinates(event)
    }

    const stopPainting = () => { isPainting = false }

    const sketch = (event) => {
      if (!isPainting) return;

      ctx.beginPath()
      ctx.lineWidth = 5
      ctx.lineCap = 'round'
      ctx.strokeStyle = '#000'

      // Start drawing at mouse coordinates
      ctx.moveTo(mouseCoordinates.x, mouseCoordinates.y)

      // Update coordinates as mouse moves within canvas
      setCoordinates(event)

      // Set path for line from last recorded coordinates to new coordinates
      ctx.lineTo(mouseCoordinates.x, mouseCoordinates.y)

      // Draw line 
      ctx.stroke()
    }
    ```
- **The Google Vision API is not meant for recognizing drawings.** It can work...sometimes. But it's not particulary efficient or consistent. Google's own `Quick, Draw!` game uses `AutoML Vision` (different from the Vision API) to create and train a model using [hundreds of thousands of drawings](<https://quickdraw.withgoogle.com/data>). It is possible to create my own ML model using this dataset, as it's open source. But I'm not a data scientist and this is beyond my current capabilities.

# Future Project Goals

- [ ] **CODE COMMENTS:** Use comment blocks to explain large chunks of logic.
- [ ] **Code Minification:** Currently serving code with comments and whitespace to client.
- [ ] **General refactoring/cleanup:** Split JS into multiple files, take advantage of ES modules.
- [ ] **Additional styling:** As it stands, it's enough for an MVP. But there's lots of room for improvement.
- [ ] **Results Page re-do:** I want to show the prompt for each turn, as well as which drawings were rewarded a point.
- [ ] **Prompt additions and shuffle:** There are ~20 prompts as it stands, and there should be much more. Currently the prompts are read from an array using the `.pop()` method, meaning the prompts are always the same. The array of prompts should be shuffled before each game.
- [ ] **Disable canvas after send:** Currently, a user can continue to draw on a canvas after hitting 'send' until the server returns a response. This is misleading, as the user might believe their additions to the drawing are also being sent to the API for recognition, when they aren't; only what is drawn up until the point the 'send' button is clicked will be sent to the API. There should be some functionality that disables drawing on the canvas once 'send' is clicked.
- [ ] **Some kind of loading spinner:** I originally had this implemented, but it felt out of place. Find a meaningful way to include a loading spinner to communicate to the user that the response from the server has yet to be received.
- [ ] **More drawing options:** Let users change colors, select different drawing tools (pen/pencil/crayon), erase parts of drawing, etc.
- [ ] **Resolve draw scenario:** In the case of a draw, the users should be able to flip a coin to decide the winner, or have 'rapid fire rounds', or a best of 3...something more than just a draw.
- [ ] **Online multiplayer:** The game is currently only local. Moving to online multiplayer would make more sense.


# MVP Wireframes
The end product doesn't adhere strictly to these wireframes; these are general concepts or guidelines that I used to layout the project.

## Landing Page
![Landing Page Wireframe](./wireframes/landing.png)

## Main Game
![Main Game Wireframe](./wireframes/main-game.png)

## Main Game
![Main Game Wireframe](./wireframes/results.png)
