// ============================================================= ELEMENT SELECTORS
/**
 * @type {HTMLCanvasElement} Canvas
 */
const $canvas = document.querySelector('#canvas')
const $clearCanvasButton = document.querySelector('.clear-canvas')
const $sendButton = document.querySelector('.send')
const $resetButton = document.querySelector('.reset')

const $promptSpan = document.querySelector('.prompt')
const $currentPlayerSpan = document.querySelector('.current-player')
const $currentTurnSpan = document.querySelector('.current-turn')

const $timerHeader = document.querySelector('.timer')
const $promptHeader = document.querySelector('.prompt-header')
const $gameStatusHeader = document.querySelector('.game-status')
const $gameOverHeader = document.querySelector('.game-over')

const $gameSection = document.querySelector('.game-display')

const $winnerSection = document.querySelector('.winner-display')
const $drawingsDiv = $winnerSection.querySelector('.drawings')
const $playerOneDrawingsDiv = $drawingsDiv.querySelector('.player-1-drawings')
const $playerTwoDrawingsDiv = $drawingsDiv.querySelector('.player-2-drawings')
const $winnerNameSpan = $winnerSection.querySelector('.winner-name')
const $playerOnePointsSpan = $winnerSection.querySelector('.player-1-points')
const $playerTwoPointsSpan = $winnerSection.querySelector('.player-2-points')

/**
 * @type {CanvasRenderingContext2D} Canvas context
 */
const ctx = $canvas.getContext('2d')



// ============================================================= VARIABLE DECLARATIONS
// Mouse coordinates
let mouseCoordinates = { x: 0, y: 0 }

// Array of prompts given to user to draw
let prompt = [
  'House',
  'Tree',
  'Apple',
  'Whiskers',
  'Smile',
  'Table',
  'Lip',
  'Bird',
  'Hat',
  'Fish',
  'Nose',
  'Leaf',
  'Shoe',
  'Ball',
  'Headphones',
  'Phone',
  'Hand',
  'T-shirt',
  'Spiral',
  'Eye'
]

// Boolean to determine if mouse is down and within bounds of canvas
let isPainting = false

// Boolean to determine if 10 rounds have been played
let isGameOver = false

// Canvas drawing converted to Base64 string
// Options object for FETCH requests to Vision API
// 60 second timer
let base64Uri, options, timer;

let currentPlayer = 1,
  currentTurn = 1,
  currentPrompt;

// Results object to keep track of prompt for a given turn, user drawing (base64 string), results 
// from API, and if a point was awarded
let results = {
  turn_1: {
    prompt: '',
    1: {
      drawing: '',
      results: [],
      points: 0
    },
    2: {
      drawing: '',
      results: [],
      points: 0
    }
  },
  turn_2: {
    1: {
      drawing: '',
      results: [],
      points: 0
    },
    2: {
      drawing: '',
      results: [],
      points: 0
    }
  },
  turn_3: {
    1: {
      drawing: '',
      results: [],
      points: 0
    },
    2: {
      drawing: '',
      results: [],
      points: 0
    }
  },
  turn_4: {
    1: {
      drawing: '',
      results: [],
      points: 0
    },
    2: {
      drawing: '',
      results: [],
      points: 0
    }
  },
  turn_5: {
    1: {
      drawing: '',
      results: [],
      points: 0
    },
    2: {
      drawing: '',
      results: [],
      points: 0
    }
  },
  turn_6: {
    1: {
      drawing: '',
      results: [],
      points: 0
    },
    2: {
      drawing: '',
      results: [],
      points: 0
    }
  },
  turn_7: {
    1: {
      drawing: '',
      results: [],
      points: 0
    },
    2: {
      drawing: '',
      results: [],
      points: 0
    }
  },
  turn_8: {
    1: {
      drawing: '',
      results: [],
      points: 0
    },
    2: {
      drawing: '',
      results: [],
      points: 0
    }
  },
  turn_9: {
    1: {
      drawing: '',
      results: [],
      points: 0
    },
    2: {
      drawing: '',
      results: [],
      points: 0
    }
  },
  turn_10: {
    1: {
      drawing: '',
      results: [],
      points: 0
    },
    2: {
      drawing: '',
      results: [],
      points: 0
    }
  },
}



// ============================================================= HELPER FUNCTIONS
/**
 * Remove all chidren elements from a given parent element
 * @param {HTMLElement} parent - The parent element
 */
const removeChildren = (parent) => {
  while (parent.lastChild) parent.removeChild(parent.lastChild)
}

/**
 * Rotate between player one and player two - default to one if undefined
 */
const updatePlayer = () => {
  if (!currentPlayer) currentPlayer = 1
  else if (currentPlayer === 1) currentPlayer = 2
  else if (currentPlayer === 2) currentPlayer = 1

  return currentPlayer
}

/**
 * Determines if both players have drawings recorded for a given turn; if so,
 * increments turn by one.
 */
const updateTurn = () => {
  if (
    results[`turn_${currentTurn}`][`1`].drawing.length > 0 &&
    results[`turn_${currentTurn}`][`2`].drawing.length > 0
  ) {
    ++currentTurn
    if (currentTurn > 10) gameOver()
    if (currentTurn <= 10) updatePrompt()
  }

  $currentTurnSpan.textContent = currentTurn
}

const updatePrompt = () => {
  currentPrompt = prompt.pop()
  results[`turn_${currentTurn}`].prompt = currentPrompt
  $promptSpan.textContent = currentPrompt
}

const gameOver = () => {
  stopTimer(timer)

  isGameOver = true
  $sendButton.disabled = true

  Array.from([$gameStatusHeader, $gameOverHeader, $resetButton, $promptHeader, $timerHeader])
    .forEach(e => e.classList.toggle('hidden'))

  displayWinners()
}

const resetGame = () => {
  results = {
    turn_1: {
      prompt: '',
      1: {
        drawing: '',
        results: [],
        points: 0
      },
      2: {
        drawing: '',
        results: [],
        points: 0
      }
    },
    turn_2: {
      1: {
        drawing: '',
        results: [],
        points: 0
      },
      2: {
        drawing: '',
        results: [],
        points: 0
      }
    },
    turn_3: {
      1: {
        drawing: '',
        results: [],
        points: 0
      },
      2: {
        drawing: '',
        results: [],
        points: 0
      }
    },
    turn_4: {
      1: {
        drawing: '',
        results: [],
        points: 0
      },
      2: {
        drawing: '',
        results: [],
        points: 0
      }
    },
    turn_5: {
      1: {
        drawing: '',
        results: [],
        points: 0
      },
      2: {
        drawing: '',
        results: [],
        points: 0
      }
    },
    turn_6: {
      1: {
        drawing: '',
        results: [],
        points: 0
      },
      2: {
        drawing: '',
        results: [],
        points: 0
      }
    },
    turn_7: {
      1: {
        drawing: '',
        results: [],
        points: 0
      },
      2: {
        drawing: '',
        results: [],
        points: 0
      }
    },
    turn_8: {
      1: {
        drawing: '',
        results: [],
        points: 0
      },
      2: {
        drawing: '',
        results: [],
        points: 0
      }
    },
    turn_9: {
      1: {
        drawing: '',
        results: [],
        points: 0
      },
      2: {
        drawing: '',
        results: [],
        points: 0
      }
    },
    turn_10: {
      1: {
        drawing: '',
        results: [],
        points: 0
      },
      2: {
        drawing: '',
        results: [],
        points: 0
      }
    },
  }

  prompt = [
    'House',
    'Tree',
    'Apple',
    'Whiskers',
    'Smile',
    'Table',
    'Lip',
    'Bird',
    'Hat',
    'Fish',
    'Nose',
    'Leaf',
    'Shoe',
    'Ball',
    'Headphones',
    'Phone',
    'Hand',
    'T-shirt',
    'Spiral',
    'Eye'
  ]

  isGameOver = false
  $sendButton.disabled = false
  currentTurn = 1

  Array.from([
    $gameStatusHeader,
    $gameOverHeader,
    $resetButton,
    $promptHeader,
    $timerHeader,
    $winnerSection,
    $gameSection
  ]).forEach(e => e.classList.toggle('hidden'))

  removeChildren($playerOneDrawingsDiv)
  removeChildren($playerTwoDrawingsDiv)
  clearCanvas()
  updateTurn()
  updatePrompt()
  startTimer()
}

const calculatePoints = () => {
  const points = {
    1: 0,
    2: 0
  }

  for (const turn in results) {
    if (results.hasOwnProperty(turn)) {
      const element = results[turn];
      if (element['1']['points']) points['1']++
      if (element['2']['points']) points['2']++
    }
  }

  return points
}

/**
 * Turns a base64 string of an image into an <img> element
 * 
 * @param {string} base64
 * @param {string} player
 * @param {string} prompt
 */
const convertBase64ToImage = (base64, player, prompt) => {
  const $img = document.createElement('img')
  $img.src = base64
  $img.alt = `Drawing by ${player} of ${prompt}`
  $img.title = `Drawing by ${player} of ${prompt}`
  $img.width = 250
  $img.height = 250
  $img.style.border = `1px solid black`

  return $img
}

const displayWinners = () => {
  $winnerSection.classList.toggle('hidden')
  $gameSection.classList.toggle('hidden')

  const points = calculatePoints()
  let winner;
  if (points[1] > points[2]) {
    winner = 'Player 1'
  } else if (points[1] < points[2]) {
    winner = 'Player 2'
  } else if (points[1] === points[2]) {
    winner = 'Draw!'
  }

  $winnerNameSpan.textContent = winner
  $playerOnePointsSpan.textContent = points[1]
  $playerTwoPointsSpan.textContent = points[2]

  const drawings = {
    player_1: [],
    player_2: []
  }

  const createElement = (type, text) => {
    const el = document.createElement(type)
    el.textContent = text

    return el
  }

  for (const turn in results) {
    if (results.hasOwnProperty(turn)) {
      const currentTurn = results[turn]
      const prompt = currentTurn.prompt
      const playerOneImg = convertBase64ToImage(currentTurn['1']['drawing'], `Player 1`, prompt)
      const playerTwoImg = convertBase64ToImage(currentTurn['2']['drawing'], `Player 2`, prompt)

      drawings.player_1.push(playerOneImg)
      drawings.player_2.push(playerTwoImg)
    }
  }

  const { player_1, player_2 } = drawings

  const playerOneDrawingsHeader = createElement('h1', 'Player One')
  const playerTwoDrawingsHeader = createElement('h1', 'Player Two')

  $playerOneDrawingsDiv.appendChild(playerOneDrawingsHeader)
  $playerTwoDrawingsDiv.appendChild(playerTwoDrawingsHeader)
  player_1.forEach(drawing => { $playerOneDrawingsDiv.appendChild(drawing) })
  player_2.forEach(drawing => { $playerTwoDrawingsDiv.appendChild(drawing) })
}



// ===================================== CANVAS FUNCTIONS
const clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

// Set canvas size
const resize = () => {
  ctx.canvas.width = '500'
  ctx.canvas.height = '500'
  $canvas.setAttribute('style', 'border: 1px solid black; display: block; margin: 0 auto;')
}

// Set mouse coordinates
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



// ===================================== TIMER FUNCTIONS
const startTimer = () => {
  if (!isGameOver) {
    const time = 60
    let current = 1

    $timerHeader.textContent = `${time} seconds left`
    $currentPlayerSpan.textContent = currentPlayer

    timer = setInterval(() => {
      if (current >= time) submitDrawing(timer)

      $timerHeader.textContent = `${time - current} seconds left`
      ++current
    }, 1000)
  }
}

const stopTimer = (timer) => clearInterval(timer)



// ===================================== FETCH FUNCTIONS
const setOptions = () => {
  options = {
    method: 'POST',
    body: JSON.stringify({
      image: {
        content: `${base64Uri.replace('data:image/png;base64,', '')}`
      }
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
}



// ============================================================= EVENT HANDLERS
const sendImg = () => fetch(`https://drawai-server.herokuapp.com/getTags`, options)
  .then(res => res.json(), res => console.error(res))
  .then((data) => {
    /**
     * @type {Array<string>} Array of tags returned from API after analyzing image
    */
    const formattedData = data.labels.map(res => res.description)

    results[`turn_${currentTurn}`][`${currentPlayer}`].results = formattedData

    formattedData.forEach(tag => {
      if (tag.includes(results[`turn_${currentTurn}`].prompt))
        results[`turn_${currentTurn}`][`${currentPlayer}`].points = 1
    })
    return formattedData
  })
  .catch(e => console.error(e))

const submitDrawing = () => {
  $sendButton.disabled = true
  base64Uri = $canvas.toDataURL()
  results[`turn_${currentTurn}`][`${currentPlayer}`].drawing = base64Uri

  setOptions()
  const timerPromise = () => new Promise(() => stopTimer(timer))

  timerPromise()
    .then(
      sendImg()
        .then(() => { results[`turn_${currentTurn}`][`${currentPlayer}`].drawing = base64Uri })
        .then(() => clearCanvas())
        .then(() => updateTurn())
        .then(() => updatePlayer())
        .then(() => {
          if (!isGameOver) {
            startTimer()
            setTimeout(() => { $sendButton.disabled = false }, 500)
          }
        })
        .catch(e => console.error(e))
    )
}



// ============================================================= EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
  resize()
  updatePrompt()

  document.addEventListener('mousedown', startPainting)
  document.addEventListener('mouseup', stopPainting)
  document.addEventListener('mousemove', sketch)

  $clearCanvasButton.addEventListener('click', clearCanvas)

  $sendButton.addEventListener('click', submitDrawing)
  $resetButton.addEventListener('click', resetGame)

  startTimer()
})
