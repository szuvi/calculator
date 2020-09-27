// Calculator module
(function () {
  const calculator = {
    add(a, b) {
      return a + b;
    },
    substract(a, b) {
      return a - b;
    },
    multiply(a, b) {
      return a * b;
    },
    divide(a, b) {
      if (b === 0) return "Error";
      else return a / b;
    },
  };
  function operate(a, b, operator) {
    return calculator[operator](+a, +b).toString();
  }
  window.operate = operate;
})();

// Display module
(function () {
  const displayNumber = document.querySelector(".display-number");
  const minus = document.querySelector(".minus");

  function show(text) {
    clear(); // Resets display each time
    if (isWrong(text)) {
      // Output check to limit displayed numbers to 9
      displayNumber.innerText = "Error";
    } else {
      if (+text < 0) {
        showMinus(); // Calculator style minus floated to the left of the display
        text = text.slice(1);
      }
      displayNumber.innerText = text;
    }
  }

  function isWrong(text) {
    if (isNaN(text)) {
      return true;
    }
    if (+text < 0 && text.length > 11) {
      return true;
    }
    if (+text > 0 && text.length > 10) {
      return true;
    }
  }

  function clear() {
    hideMinus();
    displayNumber.innerText = "";
  }

  function showMinus() {
    minus.classList.remove("hidden");
  }

  function hideMinus() {
    minus.classList.add("hidden");
  }

  const display = {
    show,
    clear,
  };

  window.display = display;
})();

// Memory module
(function () {
  let currentNumber = "";
  let previousNumber = "";
  let currentOperator = "";
  let lastKey = "";

  function setCurrentNumber(number) {
    currentNumber = number.toString();
  }

  function getCurrentNumber() {
    return currentNumber;
  }

  function moveCurrToPrev() {
    previousNumber = currentNumber;
  }

  function getPreviousNumber() {
    return previousNumber;
  }

  function setOperator(operator) {
    currentOperator = operator.toString();
  }

  function getOperator() {
    return currentOperator;
  }

  function setLastKey(key) {
    lastKey = key;
  }

  function getLastKey() {
    return lastKey;
  }

  function clear() {
    currentNumber = "";
    previousNumber = "";
    currentOperator = "";
    lastKey = "";
  }

  const memory = {
    setCurrentNumber,
    getCurrentNumber,
    moveCurrToPrev,
    getPreviousNumber,
    setOperator,
    getOperator,
    setLastKey,
    getLastKey,
    clear,
  };

  window.memory = memory;
})();

// Keys and functionality module
(function () {
  const keys = document.querySelectorAll(".key");

  //////////////// TODO clean up selectors and functions down here
  //////////////// TODO chain calculations
  //////////////// TODO round decimals
  //////////////// TODO add backspace
  //////////////// TODO add . support
  //////////////// TODO keyboard support

  keys.forEach((key) => {
    if (key.classList.contains("clear")) {
      key.addEventListener("click", setLastKey);
      key.addEventListener("click", clearAll);
    }
    if (key.classList.contains("sign")) {
      key.addEventListener("click", performOperator);
    }
    if (key.classList.contains("number")) {
      key.addEventListener("click", setLastKey);
      key.addEventListener("click", addNumber);
    }
  });

  function clearAll() {
    memory.clear();
    display.clear();
  }

  function setLastKey(event) {
    memory.setLastKey(event.target.id);
  }

  function addNumber(event) {
    let currNum = memory.getCurrentNumber();
    currNum += event.target.dataset.key;
    if (currNum.length < 10) {
      memory.setCurrentNumber(currNum);
      display.show(currNum);
    }
  }

  function performOperator(event) {
    if (event.target.id == "equals") {
      calculate();
    } else {
      memory.setOperator(event.target.id);
      if (memory.getLastKey !== "equals") {
        memory.moveCurrToPrev();
      }
      memory.setCurrentNumber("");
    }
  }

  function calculate() {
    let currNum = memory.getCurrentNumber();
    let prevNum = memory.getPreviousNumber();
    const currOperator = memory.getOperator();
    let result = null;

    if (prevNum.length == 0) {
      prevNum = currNum;
      memory.moveCurrToPrev();
    }

    if (memory.getLastKey() == "equals") {
      result = operate(currNum, prevNum, currOperator);
    } else {
      result = operate(prevNum, currNum, currOperator);
      memory.moveCurrToPrev();
    }

    display.show(result);
    memory.setCurrentNumber(result);
    memory.setLastKey("equals");
  }
})();
