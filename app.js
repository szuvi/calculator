//////////////// TODO add backspace
//////////////// TODO add . support

// Calculator + Memory module version 3
(function () {
  const lastExpression = {
    number: null,
    operator: null,
    empty: true,
    performOn: function (inputNumber) {
      return operate(inputNumber, this.number, this.operator);
    },
    save: function (inputNumber, inputOperator) {
      this.number = inputNumber;
      this.operator = inputOperator;
      this.empty = false;
    },
    clear: function () {
      this.number = null;
      this.operator = null;
      this.empty = true;
    },
  };

  let lastKey = null;
  let currNum = null;
  let prevNum = null;
  let currOp = null;

  function clearCalculator() {
    lastExpression.clear();
    lastKey = null;
    currNum = null;
    prevNum = null;
    currOp = null;
  }

  function calculate(input, dataType) {
    let currentOutput;
    switch (dataType) {
      case "number":
        currentOutput = calculateNumber(input);
        break;
      case "operator":
        currentOutput = calculateOperator(input);
        break;
      case "equals":
        currentOutput = calculateEquals();
        break;
    }
    lastKey = dataType;
    return currentOutput;
  }

  function calculateNumber(number) {
    if (lastKey === "number") {
      if (currNum.toString().length < 9) currNum = +(currNum.toString() + number.toString());
    } else {
      currNum = number;
    }
    return currNum;
  }

  function calculateEquals() {
    if (currNum === null || !currOp) return +currNum; // Initial = press without any previous input
    let result;
    switch (lastKey) {
      case "equals":
        // Chained equals - repeats previous operation on result of previous
        result = lastExpression.performOn(currNum);
        break;
      case "operator":
        // Equals after any other operator returns the operation on the same numbers
        result = operate(currNum, currNum, currOp);
        lastExpression.save(currNum, currOp);
        break;
      case "number":
        result = operate(prevNum, currNum, currOp);
        lastExpression.save(currNum, currOp);
        break;
    }
    currNum = result;
    currOp = "equals";
    return result;
  }

  function calculateOperator(input) {
    if (currNum === null) {
      // Initial operator keypress allowing to operate on initial 0
      prevNum = +currNum;
    }

    if (lastKey === "number") {
      if (currOp === null || currOp === "equals") {
        // On initial number input or number input after expression result
        prevNum = +currNum;
        lastExpression.clear();
      } else {
        let result = operate(prevNum, currNum, currOp);
        lastExpression.save(currNum, currOp);
        prevNum = result;
        currNum = result;
      }
    }

    currOp = input;
    prevNum = +currNum;
    return +currNum;
  }

  function operate(num1, num2, operator) {
    let a = +num1;
    let b = +num2;
    switch (operator) {
      case "add":
        return a + b;
      case "substract":
        return a - b;
      case "multiply":
        return a * b;
      case "divide":
        if (b === 0) return "Error";
        return a / b;
    }
  }

  window.clearCalculator = clearCalculator;
  window.calculate = calculate;
})();

// Display module
(function () {
  const displayNumber = document.querySelector(".display-number");
  const minus = document.querySelector(".minus");

  function show(text) {
    clear(); // Resets display each time
    let currText = text;

    if (currText.length > 9) {
      currText = handleLongNum(text);
    }

    if (+currText < 0) {
      showMinus();
      currText = currText.slice(1);
    }

    displayNumber.innerText = currText;
  }

  function handleLongNum(num) {
    let currNum = +num;
    let limit = currNum < 0 ? 8 : 7; // Minus doesn't influence number of digits displayed

    // Handle long decimal
    if (num.indexOf(".") !== -1 && num.indexOf(".") < limit) {
      currNum = currNum.toPrecision(7 - num.indexOf("."));
    }
    if (num.length > limit + 2) {
      return "Error";
    }
    return currNum.toString();
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

// UI module
(function () {
  const keys = document.querySelectorAll(".key");

  keys.forEach(key => {
    key.addEventListener("click", executeKeyPress);
  });

  window.addEventListener("keypress", activateKey);

  function activateKey(event) {
    let key = document.querySelector(`.key[data-key="${event.key}"]`);
    if (key) {
      key.click();
    }
  }

  function executeKeyPress(e) {
    let keyType = e.target.dataset.type;
    let key = e.target.id;
    if (keyType === "clear") {
      clearCalculator();
      display.clear();
    } else {
      let output = calculate(key, keyType).toString();
      display.show(output);
    }
  }
})();
