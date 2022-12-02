const controlElements = {
  bill: document.querySelector("[data-control = 'bill']"),
  tipBtns: document.querySelectorAll("[data-control = 'radio']"),
  custom: document.querySelector("[data-control = 'custom-form']"),
  people: document.querySelector("[data-control = 'people']"),
  resetBtn: document.querySelector("[data-control = 'reset']")
}

const resultElements = {
  tipAmount: document.querySelector("[data-result = 'tipAmount']"),
  totalAmount: document.querySelector("[data-result = 'totalAmount']")
}

const formValues = {
  bill: 0,
  tip: 0,
  people: 0
}

const resultValues = {
  tipAmount: 0,
  totalAmount: 0
}

const dollarUS = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  useGrouping: false,
  maximumFractionDigits: 2
});

const setCharException = (charException, e) => {
  if (!charException.test(e.key)) {
    e.preventDefault();
  }
}

const blockInvalidChar = (e) => {
  const {value} = e.target;

  if (value[0] === "0" && e.key !== "." && value[1] !== ".") {
    e.target.value = value.slice(1);
  }
  if (!value[0] && e.key === ".") {
    e.preventDefault();
  }
  if (value.includes(".") && e.key === ".") {
    e.preventDefault();
  }
}

const setValidChar = (e) => {
  const charException = /[\d.]/g;
  setCharException(charException, e);
  blockInvalidChar(e);
}

const setCaretPosition = (e) => {
  const position = e.target.value.length;

  e.target.setSelectionRange(position, position);
}

const setInvalidKey = (e) => {
  const invalidKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

  if (invalidKeys.includes(e.key)) {
    e.preventDefault();
  }
}

const productBillValue = () => {
  return (formValues.tip / 100) * formValues.bill;
}

const countTotalAmount = () => {
  resultValues.totalAmount = dollarUS.format((productBillValue() + formValues.bill) / formValues.people);
}

const countTipAmount = () => {
  resultValues.tipAmount = dollarUS.format(productBillValue() / formValues.people);
}

const resetResultValues = () => {
  resultValues.tipAmount = dollarUS.format(0);
  resultValues.totalAmount = dollarUS.format(0);
}

const updateResultFields = () => {
  countTotalAmount();
  countTipAmount();
  if (formValues.bill === 0 || formValues.people === 0) {
    resetResultValues();
  }
  changeResetBtnStatus();
  resultElements.tipAmount.innerHTML = resultValues.tipAmount;
  resultElements.totalAmount.innerHTML = resultValues.totalAmount;
}

const changeResetBtnStatus = () => {
  if (formValues.people > 0 || formValues.bill > 0 || formValues.tip > 0) {
    controlElements.resetBtn.disabled = false
  } else {
    controlElements.resetBtn.disabled = true;
  }
}

controlElements.bill.addEventListener("keypress", setValidChar);

controlElements.custom.addEventListener("keypress", setValidChar);

controlElements.people.addEventListener("keypress", (e) => {
  const charException = /[\d]/g;

  setCharException(charException, e);
  
  if (formValues.people === 0 && ["0"].includes(e.key)) {
     e.preventDefault();
  }
});

controlElements.bill.addEventListener("click", setCaretPosition);

controlElements.custom.addEventListener("click", setCaretPosition);

controlElements.people.addEventListener("click", setCaretPosition);

controlElements.bill.addEventListener("keydown", setInvalidKey);

controlElements.custom.addEventListener("keydown", setInvalidKey);

controlElements.people.addEventListener("keydown", setInvalidKey);

controlElements.bill.addEventListener("keyup", (e) => {
  formValues.bill = +e.target.value;
  updateResultFields();
});

controlElements.custom.addEventListener("keyup", (e) => {
  formValues.tip = +e.target.value;
  updateResultFields();
});

controlElements.people.addEventListener("keyup", (e) => {
  formValues.people = +e.target.value;
  updateResultFields();
});

controlElements.tipBtns.forEach((elem) => {
  elem.addEventListener("change", (e) => {
    formValues.tip = +e.target.value;
    if (elem.checked) {
      controlElements.custom.value = "";
    }
    updateResultFields();
  });
});

controlElements.custom.addEventListener("focus", (e) => {
  controlElements.tipBtns.forEach((elem) => {
    elem.checked = false;
    formValues.tip = 0;
    resultElements.tipAmount.innerHTML = dollarUS.format(0);
  });
    changeResetBtnStatus();
});

controlElements.resetBtn.addEventListener("click", () => {
  resultElements.tipAmount.innerHTML = dollarUS.format(0);
  resultElements.totalAmount.innerHTML = dollarUS.format(0);
  formValues.bill = 0;
  formValues.tip = 0;
  formValues.people = 0;
  resultValues.totalAmount = 0;
  resultValues.tipAmount = 0;
  controlElements.bill.value = "";
  controlElements.tipBtns.forEach((elem) => {
    elem.checked = false;
  });
  controlElements.custom.value = "";
  controlElements.people.value = "";
  controlElements.resetBtn.disabled = true;
});
