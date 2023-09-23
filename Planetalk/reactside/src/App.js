import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import Earthgif from './artwork/Earth.gif';
import axios from 'axios';

function generateStarBoxShadows() {
  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const STAR_COUNT = 400;
  let result = '';

  const topBoxHeight = -10; // Adjust the height of the empty box at the top in vh units
  const intervalWidth = 25; // Adjust the width of the interval without stars in vw units
  const intervalCenter = 0; // Adjust the center of the interval

  for (let i = 0; i < STAR_COUNT; i++) {

    const y = randomNumber(-50, 50); // Stars are generated below the top box
    let x;
    do {
      x = randomNumber(-50, 50);
    } while (Math.abs(x - intervalCenter) < intervalWidth / 2 && y<-10);

    result += `${x}vw ${y}vh ${randomNumber(0, 1)}px ${randomNumber(0, 1)}px #fff,`;
  }

  // Remove the trailing comma from the result string
  return result.substring(0, result.length - 1);
}

function App() {

  //SPACE BACKGROUND
  useEffect(() => {
    // Generate the starry background box shadows
    const boxShadows = generateStarBoxShadows();

    // Apply the generated box shadow to the .main div
    const mainDiv = document.querySelector('.main');
    mainDiv.style.boxShadow = boxShadows;
  }, []); // Empty dependency array means this effect runs once on component mount

  
  //USER INPUT FOR TEXT BOX
  const[data,setdata] = useState(null)
  const[planetResponse, setResponse] = useState("Loading...")
  
  // add introduction text once DOM loads
  useEffect(() => {
    setResponse(getIntro());
  }, []);

  // input is the user's question, pint GPT api and then set the response to the planetResponse
  function getIntro(){
    axios.post('http://localhost:8000/getintro/', {
      planetIndex: 2,
    })
    .then((response) => {
      console.log(response);
      setResponse(response.data.message);
    });
  }

  function getData(val)
  {
    // set response to loading while waiting for response
    setResponse("Loading...")
    axios.post('http://localhost:8000/gptresponse/', {
      message: val.target.value,
      planetIndex: 2,
      educationIndex: 3
    })
    .then((response) => {
      console.log(response);
      setResponse(response.data.message)
    });
    setdata(val.target.value)
  }


  //INPUT SUBMITS ONLY WITH ENTER KEY
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default behavior of the Enter key
      getData(event); // Call the getData function
      event.target.value = ""; // Clear the <textarea>
    }
  }

  return (
    //HTML FOR THE TEXTBOX PORTION
    <div className="App" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1 className="white-text">{planetResponse}</h1>
      <img style = {{align: "top", width: "300px", height: "300px"}}
        src={Earthgif} // Use the imported GIF
        alt="Example GIF"
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", bottom: "0", position: "absolute" }}>
        <h1 className="white-text">{data}</h1>
        <textarea className="inputbox white-text" autoFocus onKeyDown={handleKeyDown} style={{ width: "800px", height: "100px", fontSize: "32px", textAlign: "center", lineHeight: "40px" }} rows="3"></textarea>
      </div>
      <div className="main">
      </div>
  </div>
  );
}

export default App;