import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import Sungif from './artwork/Sun.gif';
import Earthgif from './artwork/Earth.gif';
import Mercurygif from './artwork/Mercury.gif';
import Saturngif from './artwork/Saturn.gif';
import Neptunegif from './artwork/Neptune.gif';
import Venusgif from './artwork/Venus.gif';
import Marsgif from './artwork/Mars.gif';
import Uranusgif from './artwork/Uranus.gif';
import Jupitergif from './artwork/Jupiter.gif';


import Sunpng from './artwork/Sun.png';
import Earthpng from './artwork/Earth.png';
import Mercurypng from './artwork/Mercury.png';
import Saturnpng from './artwork/Saturn.png';
import Neptunepng from './artwork/Neptune.png';
import Venuspng from './artwork/Venus.png';
import Marspng from './artwork/Mars.png';
import Uranuspng from './artwork/Uranus.png';
import Jupiterpng from './artwork/Jupiter.png';


import axios from 'axios';

function generateStarBoxShadows() {
  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const STAR_COUNT = 400;
  let result = '';
  const intervalWidth = 25; // Adjust the width of the interval without stars in vw units
  const intervalCenter = 0; // Adjust the center of the interval

  for (let i = 0; i < STAR_COUNT; i++) {

    const y = randomNumber(-50, 50); // Stars are generated below the top box
    let x;
    do {
      x = randomNumber(-50, 50);
    } while (Math.abs(x - intervalCenter) < intervalWidth / 2 && y<-0);

    result += `${x}vw ${y}vh ${randomNumber(0, 1)}px ${randomNumber(0, 1)}px #fff,`;
  }

  // Remove the trailing comma from the result string
  return result.substring(0, result.length - 1);
}

var planetID = 0;
var educationLevel = 2;
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
  const[completedText, setCompletedText] = useState(false);
  const[intervalId, setIntervalId] = useState(null);
  
  // add introduction text once DOM loads
  useEffect(() => {
    setResponse(getIntro());
  }, []);

  function changeAnimation(talking){
    if(talking===true){
      console.log("talking");
      switch (planetID) {
        case 0:
          planetImageRef.current.src = Sungif;
          break;
        case 1:
          planetImageRef.current.src = Mercurygif;
          break;
        case 2:
          planetImageRef.current.src = Venusgif;
          break;
        case 3:
          planetImageRef.current.src = Earthgif;
          break;
        case 4:
          planetImageRef.current.src = Marsgif;
          break;
        case 5:
          planetImageRef.current.src = Jupitergif;
          break;
        case 6:
          planetImageRef.current.src = Saturngif;
          break;
        case 7:
          planetImageRef.current.src = Uranusgif;
          break;
        case 8:
          planetImageRef.current.src = Neptunegif;
          break;
        default:
          planetImageRef.current.src = Sungif;
          break;
      }
    } 
    if(talking===false){
      console.log("not talking");
      switch (planetID) {
        case 0:
          planetImageRef.current.src = Sunpng;
          break;
        case 1:
          planetImageRef.current.src = Mercurypng;
          break;
        case 2:
          planetImageRef.current.src = Venuspng;
          break;
        case 3:
          planetImageRef.current.src = Earthpng;
          break;
        case 4:
          planetImageRef.current.src = Marspng;
          break;
        case 5:
          planetImageRef.current.src = Jupiterpng;
          break;
        case 6:
          planetImageRef.current.src = Saturnpng;
          break;
        case 7:
          planetImageRef.current.src = Uranuspng;
          break;
        case 8:
          planetImageRef.current.src = Neptunepng;
          break;
        default:
          planetImageRef.current.src = Sunpng;
          break;
      }
    } 
  }

  function AnimateText(reply) {
    changeAnimation(true);
    console.log(reply);
    // Clear the previous interval if it exists
    if (intervalId) {
      clearInterval(intervalId);
    }

    setCompletedText(false);
    let i = 0;
    const stringResponse = reply;
    const newIntervalId = setInterval(() => {
      setResponse(stringResponse.substring(0, i));
      i++;
      if (i > stringResponse.length) {
        clearInterval(intervalId);
        changeAnimation(false);
        setCompletedText(true);
      }
    }, 50);
    setIntervalId(newIntervalId); // Store the new interval ID
  }

  // input is the user's question, pint GPT api and then set the response to the planetResponse
  function getIntro(){
    axios.post('http://localhost:8000/getintro/', {
      planetIndex: planetID,
    })
    .then((response) => {
      console.log(response);
      AnimateText(response.data.message);
    });
  }


  function getData(val)//Gets data from user input text and sets it
  {
    // set response to loading while waiting for response
    clearInterval(intervalId);
    setResponse("Loading...")
    axios.post('http://localhost:8000/gptresponse/', {
      message: val.target.value,
      planetIndex: planetID,
      educationIndex: educationLevel
    })
    .then((response) => {
      console.log(response);
      // setResponse(response.data.message);
      AnimateText(response.data.message);
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

  const planetImageRef = useRef(null); //initialize planet ref
  //set initial to the sun
  useEffect(() => {
    // Use planetImageRef.current to set the src property
    if (planetImageRef.current) {
      planetImageRef.current.src = Sungif;
    }
  }, []); // Empty dependency array means this runs once on mount

  const handleDropdownChange = (event) => {
    const selectedOption = event.target.value;
    // Perform actions based on the selected option
    switch (selectedOption) {
      case 'Sun':
        planetImageRef.current.src = Sungif;
        planetID = 0;
        break;
      case 'Mercury':
        planetImageRef.current.src = Mercurygif;
        planetID = 1;
        break;
      case 'Venus':
        planetImageRef.current.src = Venusgif;
        planetID = 2;
        break;
      case 'Earth':
        planetImageRef.current.src = Earthgif;
        planetID = 3;
        break;
      case 'Mars':
        planetImageRef.current.src = Marsgif;
        planetID = 4;
        break;
      case 'Jupiter':
        planetImageRef.current.src = Jupitergif;
        planetID = 5;
        break;
      case 'Saturn':
        planetImageRef.current.src = Saturngif;
        planetID = 6;
        break;
      case 'Uranus':
        planetImageRef.current.src = Uranusgif;
        planetID = 7;
        break;
      case 'Neptune':
        planetImageRef.current.src = Neptunegif;
        planetID = 8;
        break;
        default:
          planetImageRef.current.src = Sungif;
          break;
      }
      clearInterval(intervalId);
      setResponse(getIntro());
  };
    
  return (

    <div className="App" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="topnav">
        <h1 className='title'>PlaneTalk</h1>
        <div className='menu'>
        <label for="planets">Choose a planet: </label>
          <select id="planets" onChange={handleDropdownChange} name="planets">
              <option value="Sun">Sun</option>
              <option value="Mercury">Mercury</option>
              <option value="Venus">Venus</option>
              <option value="Earth">Earth</option>
              <option value="Mars">Mars</option>
              <option value="Jupiter">Jupiter</option>
              <option value="Saturn">Saturn</option>
              <option value="Uranus">Uranus</option>
              <option value="Neptune">Neptune</option>
          </select>
          </div>
      </div>

      <img id="planetImage" style = {{align: "top", width: "300px", height: "300px"}} //image of planet
        ref={planetImageRef} // Use the imported GIF
        alt="Example GIF"
      />

      <div /* all text */ style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", bottom: "0", position: "relative" }}>
        <div className="responsebox">{planetResponse}</div>
        <h1 className="white-text">{data}</h1>
        <textarea className="inputbox white-text" autoFocus onKeyDown={handleKeyDown} style={{ width: "800px", height: "100px", fontSize: "32px", textAlign: "center", lineHeight: "40px" }} rows="3"></textarea>
      </div>

      <div className="main"/*stars*/></div>
  </div>
  );
}

export default App;