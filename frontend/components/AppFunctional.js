import React, { useState } from 'react'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [currentIndex, setCurrentIndex] = useState(4)
  const [moveCount, setMoveCount] = useState(0)
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');

  function getXY(index) {
    const x = index % 3; //column coordinate
    const y = Math.floor(index / 3); //row coordinate
    return {x, y}; //return as an object
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    const { x, y } = getXY(currentIndex); 
    // returns the fully constructed string.
    return `Coordinates (${x + 1}, ${y + 1})`;

  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setCurrentIndex(4)
    setMoveCount(0)
    setEmail('');
    setErrorMessage('');
  }

  function getNextIndex(currentIndex, direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    const gridSize = 3
    let nextIndex= currentIndex
    let errorMessage = '';
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    switch (direction) {
      case "left":
        if (currentIndex % gridSize !== 0) {
          nextIndex -= 1;
        } else {
          errorMessage = "You can't go left";
      }
        break;
      case "right":
        if ((currentIndex + 1) % gridSize !== 0) {
          nextIndex += 1;
        } else {
          errorMessage = "You can't go right";
      }
        break;
      case "up":
        if (currentIndex >= gridSize) {
          nextIndex -= gridSize;
        } else {
          errorMessage = "You can't go up";
      }
        break;
      case "down":
        if(currentIndex + gridSize < gridSize * gridSize) {
          nextIndex += gridSize;
        } else {
          errorMessage = "You can't go down";
      }
        break;
        default:
        break;
    }
    // this helper should return the current index unchanged.
    setErrorMessage(errorMessage);
    return nextIndex
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    const direction = evt.target.id;
    const nextIndex = getNextIndex(currentIndex, direction);
    // and change any states accordingly.
    if (nextIndex === currentIndex) {
      setErrorMessage(`You can't go ${direction}`);
      return;
  }

  // Clear error message if there was one
    setErrorMessage('');
    setCurrentIndex(nextIndex)
    setMoveCount(moveCount + 1)
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    const { value } = evt.target
    setEmail(value);
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();

    if (!email.trim()) {
      setErrorMessage('Ouch: email is required');
      return; // Stop further execution
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setErrorMessage('Ouch: email must be a valid email');
      return;
  }

    const { x, y } = getXY(currentIndex);
    
    const payload = {
      email: email,
      steps: moveCount,
      x: x + 1,
      y: y + 1,
      
    };
  
    // Send a POST request to the server
    fetch('http://localhost:9000/api/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(response => {
      // Check if the response is ok
      // if (!response.ok) {
      //   // Throw an error if the response is not ok
      //   throw new Error(response.statusText);
      // }
      // If response is ok, return the JSON data
      return response.json();
    })
    .then(data => {
      if (data.message) {
        // Update the error message state with the server response
        setErrorMessage(data.message);
        setEmail('');
      }
    })
    .catch(error => {
      // Handle any errors that occur during the fetch request
      console.error('Error:', error);
      // You can update the state or display an error message here if needed
      if (error.message) {
        setErrorMessage(error.message);
      }
    });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage(currentIndex)}</h3>
        <h3 id="steps">You moved {moveCount} {moveCount === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${currentIndex === idx ? ' active' : ''}`}>
              {currentIndex === idx ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{errorMessage}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input 
        id="email" 
        type="email" 
        placeholder="type email"
        value={email}
        onChange={onChange}
        />
        <button id="submit" type="submit">Submit</button>
      </form>
    </div>
  )
}
