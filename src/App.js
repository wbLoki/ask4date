import { useRef, useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState(""); // This is your date's name, don't change it manually.
  let ref = useRef(null);
  const myName = "Wail"; // Change your name here.
  const pages = {
    welcome: {
      title: "Hey there cutiepie! What's your name?",
      img: "https://media.giphy.com/media/W6o3MfP1ldc0K8sb38/giphy.gif",
      input: false,
      button: "Hii!",
      button2: "none",
    },
    date: {
      title: `${myName} told me a lot about you. And wanted me to ask you if you want to go out for some coffee?`,
      img: "https://media.giphy.com/media/QvvFkKfqwq82NniaIW/giphy.gif",
      input: true,
      button: "Yes",
    },
    goodbye: {
      title: `I hope you two have some great time together.`,
      img: "https://media.giphy.com/media/W3fbjOoLVKHGYHlJ4z/giphy.gif",
      input: true,
      button: "Goodbye",
      button2: "none",
    },
    end: {
      title: `Was nice meeting you, ${name}.`,
      img: "https://media.giphy.com/media/cLS1cfxvGOPVpf9g3y/giphy.gif",
      input: true,
      button: "Goodbye",
      button2: "none",
    },
  };
  const [page, setPage] = useState("welcome");
  const handleChange = (e) => {
    setName(e.target.value);
    ref.current = e.target.value;
  };
  const handleClick = (e) => {
    if (page === "welcome") {
      setPage("date");
    } else if (page === "date") {
      setPage("goodbye");
    } else {
      setPage("end");
      e.target.style.display = "none";
    }
  };
  const moveButton = () => {
    var x =
      Math.random() *
        (window.innerWidth - document.getElementById("noButton").offsetWidth) -
      85;
    var y =
      Math.random() *
        (window.innerHeight -
          document.getElementById("noButton").offsetHeight) -
      48;
    document.getElementById("noButton").style.position = "absolute";
    document.getElementById("noButton").style.left = `${x}px`;
    document.getElementById("noButton").style.top = `${y}px`;
  };
  return (
    <div className="App">
      <header className="App-header">
        <div className="gif-container">
          <img src={pages[page].img} alt="Cute animated illustration" />
        </div>
        <div className="text-space">
          <p>{pages[page].title}</p>
          <input
            type="text"
            placeholder="type your name"
            value={name}
            spellCheck="false"
            onChange={handleChange}
            hidden={pages[page].input}
          />
          <div className="buttons">
            <button
              id="yesButton"
              className="btn"
              hidden={false}
              onClick={handleClick}
            >
              {pages[page].button}
            </button>
            <button
              id="noButton"
              className="btn"
              style={{ display: pages[page].button2 }}
              onClick={moveButton}
              onMouseOver={moveButton}
            >
              No
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
