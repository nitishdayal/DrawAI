import { CREDS } from './creds.js'

const options = {
  method: 'POST',
  body: JSON.stringify({
    "requests": [
      {
        "image": {
          "source": {
            "imageUri":
              "https://phraseandfable.files.wordpress.com/2013/10/tibbles.jpeg"
          }
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

fetch(`https://vision.googleapis.com/v1/images:annotate?key=${CREDS}`, options)
  .then((res) => res.json(), res => console.error(res))
  .then((data) => console.log(data))
  .catch(e => console.error(e))
