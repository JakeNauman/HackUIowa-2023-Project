import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import the carousel styles

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

var SunImageRef = Sunpng;
var MercuryImageRef = Mercurypng;
var VenusImageRef = Venuspng;
var EarthImageRef = Earthpng;
var MarsImageRef = Marspng;
var JupiterImageRef = Jupiterpng;
var SaturnImageRef = Saturnpng;
var UranusImageRef = Uranuspng;
var NeptuneImageRef = Neptunepng;
var planetNames = ["Sun", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];

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
  const[intervalId, setIntervalId] = useState(null);
  
  // add introduction text once DOM loads
  // useEffect(() => {
  //   setResponse(getIntro());
  // }, []);

  function changeAnimation(talking){
    if(talking===true){
      console.log("talking");
      switch (planetID) {
        case 0:
          SunImageRef = Sungif;
          break;
        case 1:
          MercuryImageRef = Mercurygif;
          break;
        case 2:
          VenusImageRef = Venusgif;
          break;
        case 3:
          EarthImageRef = Earthgif;
          break;
        case 4:
          MarsImageRef= Marsgif;
          break;
        case 5:
          JupiterImageRef= Jupitergif;
          break;
        case 6:
          SaturnImageRef = Saturngif;
          break;
        case 7:
          UranusImageRef = Uranusgif;
          break;
        case 8:
          NeptuneImageRef = Neptunegif;
          break;
        default:
          SunImageRef = Sungif;
          break;
      }
    } 
    if(talking===false){
      // console.log("not talking");
      switch (planetID) {
        case 0:
          SunImageRef = Sunpng;
          break;
        case 1:
          MercuryImageRef = Mercurypng;
          break;
        case 2:
          VenusImageRef = Venuspng;
          break;
        case 3:
          EarthImageRef = Earthpng;
          break;
        case 4:
          MarsImageRef = Marspng;
          break;
        case 5:
          JupiterImageRef = Jupiterpng;
          break;
        case 6:
          SaturnImageRef = Saturnpng;
          break;
        case 7:
          UranusImageRef = Uranuspng;
          break;
        case 8:
          NeptuneImageRef = Neptunepng;
          break;
        default:
          SunImageRef = Sunpng;
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

    let i = 0;
    const stringResponse = reply;
    const newIntervalId = setInterval(() => {
      setResponse(stringResponse.substring(0, i));
      i++;
      if (i > stringResponse.length) {
        clearInterval(intervalId);
        changeAnimation(false);
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

  function update(index) {
    console.log(index);
    // const selectedOption = index;
    planetID = index;
    clearInterval(intervalId);
    getIntro();
  };

  const handleOptionClick = (option) => {
    educationLevel = option;
    document.getElementById("overlay").style.display = "none";
    console.log(educationLevel)
    update(planetID);
  };

  return (

    <div className="App" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="topnav">
        <h1 className='title'>PlaneTalk</h1>
      </div>
      <p className='white-text'>{planetNames[planetID]}: {planetID}/8</p> 

      <div id="overlay" class="overlay">
        <div class="popup">
        <h2>Education Level</h2>
          <ul className="menu-list">
            <li><button className='menuButton' id="option1" onClick={() => handleOptionClick(1)}>Elementary</button></li>
            <li><button className='menuButton' id="option2" onClick={() => handleOptionClick(2)}>Middle School</button></li>
            <li><button className='menuButton' id="option3" onClick={() => handleOptionClick(3)}>High School</button></li>
            <li><button className='menuButton' id="option4" onClick={() => handleOptionClick(4)}>College</button></li>
            <li><button className='menuButton' id="option5" onClick={() => handleOptionClick(5)}>Gradute</button></li>
            <li><button className='menuButton' id="option6" onClick={() => handleOptionClick(6)}>Researcher</button></li>
          </ul>
        </div>
      </div>

      <div className='container'>
        <div className="planet-carousel">
          <Carousel
            infiniteLoop={true}
            centerMode={true}
            showThumbs={false}
            showIndicators={false}
            showStatus={false}
            showArrows={true}
            onChange={(newIndex) => {
              update(newIndex);
            }}
          >
            <div className="planet-item">
              <img src={SunImageRef} alt="Sun"/>
            </div>
            <div className="planet-item">
              <img src={MercuryImageRef} alt="Mercury" />
            </div>
            <div className="planet-item">
              <img src={VenusImageRef} alt="Venus" />
            </div>
            <div className="planet-item">
              <img src={EarthImageRef} alt="Earth" />
            </div>
            <div className="planet-item">
              <img src={MarsImageRef} alt="Mars" />
            </div>
            <div className="planet-item">
              <img src={JupiterImageRef} alt="Jupiter" />
            </div>
            <div className="planet-item">
              <img src={SaturnImageRef} alt="Saturn" />
            </div>
            <div className="planet-item">
              <img src={UranusImageRef} alt="Uranus" />
            </div>
            <div className="planet-item">
              <img src={NeptuneImageRef} alt="Neptune" />
            </div>
          </Carousel>
        </div>
      </div>

      <div /* all text */ style={{ height: "350px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", bottom: "0", position: "relative" }}>
        <div className="responsebox">{planetResponse}</div>
        <h1 className="white-text">{data}</h1>
        <textarea className="inputbox white-text" autoFocus onKeyDown={handleKeyDown} style={{ width: "800px", height: "100px", fontSize: "32px", textAlign: "center", lineHeight: "40px" }} rows="3"></textarea>
      </div>

      <div className="main"/*stars*/></div>
  </div>
  );
}

export default App;
