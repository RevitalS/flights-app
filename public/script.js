let cardsMap = new Map();

const openedCardsId = {
  card1: null,
  card2: null,
};

const BACK_CARD = 'CARD';
const numberOfRows = 4;
const numberOfCardsInRow = 4;
const cardsNumber = numberOfRows * numberOfCardsInRow;
const CARD_ID = 'card';
const OPENED_CARD_TIMEOUT_IN_MILLIS = 1000;
let resetButton = document.querySelector('.reset');

function createBoard() {
  const container = document.querySelector('.container');

  randomCardsAndAddToMap();

  container.appendChild(CrateCardsAndAddToBoard());
  container.appendChild(createResetButton());
  resetButton = document.querySelector('.reset')
}

function createNewCard(index) {
  const card = document.createElement('div');
  initCardAttribute(card, index);
  card.onclick = () => {
    move(card.id);
  };
  return card;
}

function initCardAttribute(card, index) {
  card.id = CARD_ID + index;
  card.textContent = BACK_CARD;
  card.className = 'card';
}

function CrateCardsAndAddToBoard() {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < numberOfRows; i++) {
    const wrapperRowDiv = document.createElement('div');
    wrapperRowDiv.className = 'row';
    for (let j = 0; j < numberOfCardsInRow; j++) {
      const index = i * numberOfCardsInRow + j;
      wrapperRowDiv.appendChild(createNewCard(index));
    }
    fragment.appendChild(wrapperRowDiv);
  }
  return fragment;
}

function createResetButton() {
  const reset = document.createElement('button');
  reset.className = 'reset';
  reset.textContent = 'reset';
  reset.onclick = resetGame;
  return reset;
}

function randomCardsAndAddToMap() {
  const cards = randomCards();
  cards.map((card, i) => (cardsMap[CARD_ID + i] = card));
}

function randomCards() {
  let arr = [];

  for (let i = 0; i < cardsNumber / 2; i++) {
    arr.push(i);
    arr.push(i);
  }
  return shuffle(arr);
}

function shuffle(cardsValArr) {
  let currentIndex = cardsValArr.length;
  let randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    let temp = cardsValArr[currentIndex];
    cardsValArr[currentIndex] = cardsValArr[randomIndex];
    cardsValArr[randomIndex] = temp;
  }

  return cardsValArr;
}

function cardDisplay(card) {
  card.textContent = cards[card.id];
}

function move(id) {
  if (openedCardsId.card1 === null) {
    setOpenCards(id, 'card1');
  } else if (openedCardsId.card2 === null) {
    if (id === openedCardsId.card1) {
      return;
    }
    setOpenCards(id, 'card2');

    resetButtonStatus(true, 'not-allowed');

    setTimeoutWhen2CardsAreOpen();
  }
}

function setOpenCards(id, specificCardId) {
  openedCardsId[specificCardId] = id;
  addTextContantToElement(
    document.querySelector(`[id=${id}]`),
    cardsMap[id]
  );
}

function addTextContantToElement(element, contant) {
  element.textContent = contant;
}

function resetButtonStatus(disabled, cursor) {
  resetButton.disabled = disabled;
  resetButton.style.cursor = cursor;
}

function setCardState(card, state) {
  card.style.visibility = state;
}

function resetOpenedCardObject() {
  openedCardsId.card1 = null;
  openedCardsId.card2 = null;
}

function setTimeoutWhen2CardsAreOpen() {
  setTimeout(() => {
    if (comparisonTheOpenCards()) {
      hideOpenCards();
    } else {
      closeOpenCards();
    }
    resetOpenedCardObject();
    resetButtonStatus(false, 'pointer');
  }, OPENED_CARD_TIMEOUT_IN_MILLIS);
}

function hideOpenCards() {
  setCardState(document.querySelector(`[id=${openedCardsId.card1}]`), 'hidden');
  setCardState(document.querySelector(`[id=${openedCardsId.card2}]`), 'hidden');
}

function closeOpenCards() {
  addTextContantToElement(
    document.querySelector(`[id=${openedCardsId.card1}]`),
    BACK_CARD
  );
  addTextContantToElement(
    document.querySelector(`[id=${openedCardsId.card2}]`),
    BACK_CARD
  );
}

function comparisonTheOpenCards() {
  if (cardsMap[openedCardsId.card1] === cardsMap[openedCardsId.card2]) {
    return true;
  }
  return false;
}

function resetGame() {
  randomCardsAndAddToMap();
  if (openedCardsId.card1 !== null) {
    addTextContantToElement(
      document.querySelector(`[id=${openedCardsId.card1}]`),
      BACK_CARD
    );
  }
  resetOpenedCardObject();
  resetCards();
}

function resetCards() {
  for (const [id, value] of Object.entries(cardsMap)) {
    resetOneCard(id);
  }
}

function resetOneCard(id) {
  const elementCard = document.querySelector(`[id=${id}]`);
  setCardState(elementCard, 'visible');
  addTextContantToElement(elementCard, BACK_CARD);
}

onload = createBoard;
