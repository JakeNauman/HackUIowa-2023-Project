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

import Sunpng from './artwork/Sun1.png';
import Earthpng from './artwork/Earth2.png';
import Mercurypng from './artwork/Mercury1.png';
import Saturnpng from './artwork/Saturn1.png';
import Neptunepng from './artwork/Neptune2.png';
import Venuspng from './artwork/Venus1.png';
import Marspng from './artwork/Mars1.png';
import Uranuspng from './artwork/Uranus1.png';
import Jupiterpng from './artwork/Jupiter1.png';


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
    } while (Math.abs(x - intervalCenter) < intervalWidth / 2 && y<-0);

    result += `${x}vw ${y}vh ${randomNumber(0, 1)}px ${randomNumber(0, 1)}px #fff,`;
  }

  // Remove the trailing comma from the result string
  return result.substring(0, result.length - 1);
}

var planetID = 0;
var educationLevel = 2;
var isTalking = false;
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
  const[currentIndex, setCurrentIndex] = useState(0);
  
  // add introduction text once DOM loads
  useEffect(() => {
    setResponse(getIntro());
  }, []);

  function AnimateText(reply) {
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
        clearInterval(newIntervalId); // Clear the interval when the animation is complete
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
    // Perform actions based on the selected option
    // switch (selectedOption) {
    //   case 0:
    //     planetImageRef.current.src = Sungif;
    //     planetID = 0;
    //     break;
    //   case 1:
    //     planetImageRef.current.src = Mercurygif;
    //     planetID = 1;
    //     break;
    //   case 2:
    //     planetImageRef.current.src = Venusgif;
    //     planetID = 2;
    //     break;
    //   case 3:
    //     planetImageRef.current.src = Earthgif;
    //     planetID = 3;
    //     break;
    //   case 4:
    //     planetImageRef.current.src = Marsgif;
    //     planetID = 4;
    //     break;
    //   case 5:
    //     planetImageRef.current.src = Jupitergif;
    //     planetID = 5;
    //     break;
    //   case 6:
    //     planetImageRef.current.src = Saturngif;
    //     planetID = 6;
    //     break;
    //   case 7:
    //     planetImageRef.current.src = Uranusgif;
    //     planetID = 7;
    //     break;
    //   case 8:
    //     planetImageRef.current.src = Neptunegif;
    //     planetID = 8;
    //     break;
    //   default:
    //     planetImageRef.current.src = Sungif;
    //     break;
    //   }
      clearInterval(intervalId);
      setResponse(getIntro());
  };

  return (

    <div className="App" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="topnav">
        <h1 className='title'>PlaneTalk</h1>
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
              setCurrentIndex(newIndex);
              update(newIndex);
            }}
          >
            <div className="planet-item">
              <img src={Sungif} alt="Sun"/>
            </div>
            <div className="planet-item">
              <img src={Mercurygif} alt="Mercury" />
            </div>
            <div className="planet-item">
              <img src={Venusgif} alt="Venus" />
            </div>
            <div className="planet-item">
              <img src={Earthgif} alt="Earth" />
            </div>
            <div className="planet-item">
              <img src={Marsgif} alt="Mars" />
            </div>
            <div className="planet-item">
              <img src={Jupitergif} alt="Jupiter" />
            </div>
            <div className="planet-item">
              <img src={Saturngif} alt="Saturn" />
            </div>
            <div className="planet-item">
              <img src={Uranusgif} alt="Uranus" />
            </div>
            <div className="planet-item">
              <img src={Neptunegif} alt="Neptune" />
            </div>
          </Carousel>
        </div>
      </div>

      {/* <img id="planetImage" style = {{align: "top", width: "300px", height: "300px"}} //image of planet
        ref={planetImageRef} // Use the imported GIF
        alt="Example GIF"
      /> */}

      <div className="responsebox">{planetResponse}</div>

      <div /* user textbox at the bottom */ style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", bottom: "0", position: "absolute" }}>
        <h1 className="white-text">{data}</h1>
        <textarea className="inputbox white-text" autoFocus onKeyDown={handleKeyDown} style={{ width: "800px", height: "100px", fontSize: "32px", textAlign: "center", lineHeight: "40px" }} rows="3"></textarea>
      </div>

      <div className="main"/*stars*/></div>
  </div>
  );
}

export default App;
