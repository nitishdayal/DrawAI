import { CREDS } from './creds.js'

// ============================================================= ELEMENT SELECTORS
const $canvas = document.querySelector('#canvas')
const $clearCanvasButton = document.querySelector('.clear-canvas')
const $sendButton = document.querySelector('.send')
const $resetButton = document.querySelector('.reset')

const $promptSpan = document.querySelector('.prompt')
const $timerElement = document.querySelector('.timer')
const $currentPlayerSpan = document.querySelector('.current-player')
const $currentTurnSpan = document.querySelector('.current-turn')

const $gameStatusHeader = document.querySelector('.game-status')
const $gameOverHeader = document.querySelector('.game-over')
// Canvas context
const ctx = $canvas.getContext('2d')



// ============================================================= VARIABLE DECLARATIONS
// Mouse coordinates
let coord = { x: 0, y: 0 }

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
let isGameOver = false

// Canvas drawing converted to Base64 string
// Options object for FETCH requests to Vision API
let base64Uri, options, timer;

let currentPlayer = 1,
  currentTurn = 1,
  currentPrompt;

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
const updatePlayer = () => {
  if (!currentPlayer) currentPlayer = 1
  else if (currentPlayer === 1) currentPlayer = 2
  else if (currentPlayer === 2) currentPlayer = 1

  return currentPlayer
}

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
  $resetButton.classList.toggle('hidden')
  $gameStatusHeader.classList.toggle('hidden')
  $gameOverHeader.classList.toggle('hidden')
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

  updateTurn()
  updatePrompt()

  Array.from([$gameStatusHeader, $gameOverHeader, $resetButton])
    .forEach(e => e.classList.toggle('hidden'))

  startTimer()
}

// ===================================== CANVAS FUNCTIONS
// Set canvas size
const resize = () => {
  ctx.canvas.width = '500'
  ctx.canvas.height = '500'
  $canvas.setAttribute('style', 'border: 1px solid black; display: block;')
}

// Set mouse coordinates
const setCoordinates = (event) => {
  coord.x = event.clientX - $canvas.offsetLeft
  coord.y = event.clientY - $canvas.offsetTop
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
  ctx.moveTo(coord.x, coord.y)

  // Update coordinates as mouse moves within canvas
  setCoordinates(event)

  // Set path for line from last recorded coordinates to new coordinates
  ctx.lineTo(coord.x, coord.y)

  // Draw line 
  ctx.stroke()
}


// ===================================== TIMER FUNCTIONS
const startTimer = () => {
  if (!isGameOver) {
    const time = 60
    let current = 1
    $timerElement.textContent = `${time} seconds left`
    $currentPlayerSpan.textContent = currentPlayer
    timer = setInterval(() => {
      if (current >= time) {
        submitDrawing(timer)
      }

      $timerElement.textContent = `${time - current} seconds left`
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
      "requests": [
        {
          "image": {
            "content": `${base64Uri.replace('data:image/png;base64,', '')}`
          },
          "features": [
            {
              "type": "LABEL_DETECTION",
              "maxResults": 50
            }]
        }
      ]
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  }
}



// ============================================================= EVENT HANDLERS
const clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const sendImg = () => fetch(
  `https://vision.googleapis.com/v1/images:annotate?key=${CREDS}`, options)
  .then((res) => res.json(), res => console.error(res))
  .then((data) => {
    const formattedData = data
      .responses[0]
      .labelAnnotations
      .map(res => res.description)

    results[`turn_${currentTurn}`][`${currentPlayer}`].results = formattedData

    formattedData.forEach(tag => {
      if (tag.includes(results[`turn_${currentTurn}`].prompt))
        results[`turn_${currentTurn}`][`${currentPlayer}`].points = 1
    })
  })
  .catch(e => console.error(e))

const submitDrawing = () => {
  base64Uri = $canvas.toDataURL()
  results[`turn_${currentTurn}`][`${currentPlayer}`].drawing = base64Uri

  setOptions()

  sendImg()
    .then(() => { results[`turn_${currentTurn}`][`${currentPlayer}`].drawing = base64Uri })
    .then(() => clearCanvas())
    .then(() => stopTimer(timer))
    .then(() => updateTurn())
    .then(() => updatePlayer())
    .then(() => {
      if (!isGameOver) startTimer()
    })
    .catch(e => console.error(e))
}




// ============================================================= EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
  resize()
  updatePrompt()
  document.addEventListener('mousedown', startPainting)
  document.addEventListener('mouseup', stopPainting)
  document.addEventListener('mousemove', sketch)
  window.addEventListener('resize', resize)
  startTimer()
})

$clearCanvasButton.addEventListener('click', clearCanvas)

$sendButton.addEventListener('click', submitDrawing)
$resetButton.addEventListener('click', resetGame)
