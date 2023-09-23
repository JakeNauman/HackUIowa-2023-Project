import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import Earthgif from './artwork/Earth.gif';

function generateStarBoxShadows() {
  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const STAR_COUNT = 400;
  let result = '';
  for (let i = 0; i < STAR_COUNT; i++) {
    result += `${randomNumber(-50, 50)}vw ${randomNumber(-50, 50)}vh ${randomNumber(0, 1)}px ${randomNumber(0, 1)}px #fff,`;
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
  function getData(val)
  {
    setdata(val.target.value)
    console.warn(val.target.value)
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
      <div className="main"></div>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", minHeight: "100vh" }}>
      <h1 className="white-text">{data}</h1>
      <img style = {{width: "300px", height: "300px"}}
        src={Earthgif} // Use the imported GIF
        alt="Example GIF"
      />
      <textarea className="inputbox white-text" autoFocus onKeyDown={handleKeyDown} style={{ width: "800px", height: "100px", fontSize: "32px", textAlign: "center", lineHeight: "40px" }} rows="3"></textarea>
    </div>
  </div>
  );
}

export default App;