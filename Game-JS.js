window.addEventListener("load", loadAll);

function loadAll() {
  var width = 10;
  var isGameOver = false;
  var numberOfSquares = width * width;
  var squares = [];
  var bombSquaresAmount = 20;
  var flags = bombSquaresAmount;
  var safeSquaresAmount = numberOfSquares - bombSquaresAmount;
  var checkedMatches = 0;

  var bombSquareArray = new Array(bombSquaresAmount).fill("bomb");
  var safeSquareArray = new Array(safeSquaresAmount).fill("safe");
  var gameArray = new Array(bombSquaresAmount + safeSquaresAmount);

  gameArray = safeSquareArray.concat(bombSquareArray);
  var shuffledArray = new Array(gameArray.length);
  //Randomizer
  for (var i = 0; i < numberOfSquares; i++) {
    var randomNumber = Math.floor(Math.random() * (numberOfSquares - i));
    shuffledArray[i] = gameArray[randomNumber];
    gameArray[randomNumber] = gameArray[numberOfSquares - i - 1];
  }

  var grid = document.querySelector(".grid");

  function createSquares() {
    for (var i = 0; i < numberOfSquares; i++) {
      var square = document.createElement("div");
      square.setAttribute("id", i);
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      square.addEventListener("click", function () {
        clickSquare(this);
      });
      square.addEventListener("contextmenu", function (e) {
        flagSquare(e, this);
      });
    }
  }
  createSquares();

  for (var i = 0; i < numberOfSquares; i++) {
    let isTopEdge = false;
    let isBottomEdge = false;
    let isLeftEdge = false;
    let isRightEdge = false;
    let numberOfNeighbouringBombs = 0;

    if (i < 10) {
      isTopEdge = true;
    } else if (i > 89) {
      isBottomEdge = true;
    }
    if (i % 10 == 0) {
      isLeftEdge = true;
    } else if ((i + 1) % 10 == 0) {
      isRightEdge = true;
    }

    if (squares[i].classList.contains("safe")) {
      if (!isLeftEdge && squares[i - 1].classList == "bomb") {
        numberOfNeighbouringBombs++;
      }
      if (!isRightEdge && squares[i + 1].classList == "bomb") {
        numberOfNeighbouringBombs++;
      }
      if (!isTopEdge && squares[i - 10].classList == "bomb") {
        numberOfNeighbouringBombs++;
      }
      if (!isBottomEdge && squares[i + 10].classList == "bomb") {
        numberOfNeighbouringBombs++;
      }
      if (
        !isLeftEdge &&
        !isTopEdge &&
        squares[i - 1 - 10].classList == "bomb"
      ) {
        numberOfNeighbouringBombs++;
      }
      if (
        !isRightEdge &&
        !isTopEdge &&
        squares[i + 1 - 10].classList == "bomb"
      ) {
        numberOfNeighbouringBombs++;
      }
      if (
        !isLeftEdge &&
        !isBottomEdge &&
        squares[i - 1 + 10].classList == "bomb"
      ) {
        numberOfNeighbouringBombs++;
      }
      if (
        !isRightEdge &&
        !isBottomEdge &&
        squares[i + 1 + 10].classList == "bomb"
      ) {
        numberOfNeighbouringBombs++;
      }
      squares[i].setAttribute("data", numberOfNeighbouringBombs);

      //Coloring numbers
      if (numberOfNeighbouringBombs == 1) {
        squares[i].classList.add("one");
      } else if (numberOfNeighbouringBombs == 2) {
        squares[i].classList.add("two");
      } else if (numberOfNeighbouringBombs == 3) {
        squares[i].classList.add("three");
      } else if (numberOfNeighbouringBombs == 4) {
        squares[i].classList.add("four");
      } else if (numberOfNeighbouringBombs == 5) {
        squares[i].classList.add("five");
      } else if (numberOfNeighbouringBombs == 6) {
        squares[i].classList.add("six");
      } else {
        squares[i].classList.add("seven");
      }
    }
  }

  function clickSquare(s) {
    if (
      isGameOver ||
      s.classList.contains("checked") ||
      s.classList.contains("flagged")
    ) {
      return;
    }
    if (s.classList.contains("bomb")) {
      for (var i = 0; i < numberOfSquares; i++) {
        var square = document.getElementById(i);
        if (square.classList.contains("bomb")) {
          square.style.backgroundColor = "red";
          square.style.backgroundImage = "url('bomb.png')";
          square.style.backgroundSize = "contain";
          square.style.backgroundPosition = "center";
          square.style.backgroundRepeat = "no-repeat";
        }
      }
      GameOver();
      return;
    } else {
      var bombs = s.getAttribute("data");
      if (bombs > 0) {
        s.innerHTML = bombs;
      } else {
        checkSquares(s);
      }
    }
    checkedMatches++;
    s.classList.add("checked");
    checkForWin();
  }

  function flagSquare(e, square) {
    e.preventDefault();
    let index = parseInt(square.getAttribute("id"));
    if (!square.classList.contains("flagged") && flags > 0) {
      square.style.backgroundImage = "url('flag.png')";
      square.style.backgroundSize = "cover";
      square.style.backgroundPosition = "center";
      square.style.backgroundRepeat = "no-repeat";
      square.classList.toggle("flagged");
      flags--;
    } else {
      if (square.classList.contains("flagged")) {
        square.style.backgroundImage = "";
        square.classList.toggle("flagged");
        flags++;
      }
    }

    checkForWin();
  }

  function GameOver() {
    isGameOver = true;
    document.getElementById("gameOver").innerHTML = "You Lost";
  }

  function checkSquares(ss) {
    var id = parseInt(ss.getAttribute("id"));
    let isLeftEdge = id % 10 == 0;
    let isRightEdge = (id + 1) % 10 == 0;
    let isTopEdge = id < 10;
    let isBottomEdge = id > 89;
    setTimeout(function () {
      if (!isLeftEdge) {
        let newSquare = squares[id - 1];
        clickSquare(newSquare);
      }
      if (!isRightEdge) {
        let newSquare = squares[id + 1];
        clickSquare(newSquare);
      }
      if (!isTopEdge) {
        let newSquare = squares[id - 10];
        clickSquare(newSquare);
      }
      if (!isBottomEdge) {
        let newSquare = squares[id + 10];
        clickSquare(newSquare);
      }
    }, 50);
  }

  // Check for win status
  function checkForWin() {
    var flagMatches = 0;
    for (var i = 0; i < numberOfSquares; i++) {
      if (
        squares[i].classList.contains("flagged") &&
        squares[i].classList.contains("bomb")
      ) {
        flagMatches++;
      }
      if (
        flagMatches == bombSquaresAmount ||
        checkedMatches == safeSquaresAmount
      ) {
        document.getElementById("gameOver").innerHTML = "You Won, good job";
        isGameOver = true;
      }
    }
  }

  const toggleBombs = () => {
    const bombElements = document.querySelectorAll(".bomb");
    [...bombElements].forEach((bomb) => {
      bomb.classList.toggle("bomb-help");
    });
  };

  document.querySelector(".help-btn").addEventListener("click", toggleBombs);
}
