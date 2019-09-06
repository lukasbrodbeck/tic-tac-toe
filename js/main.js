{
  let currentTurn = 'X';
  let selectedPlayerX = [];
  let selectedPlayerO = [];
  let winningPossibilityArray = [];
  winningPossibilityArray[0] = [1, 2, 3];
  winningPossibilityArray[1] = [4, 5, 6];
  winningPossibilityArray[2] = [7, 8, 9];
  winningPossibilityArray[3] = [1, 4, 7];
  winningPossibilityArray[4] = [2, 5, 8];
  winningPossibilityArray[5] = [3, 6, 9];
  winningPossibilityArray[6] = [1, 5, 9];
  winningPossibilityArray[7] = [3, 5, 7];

  buildPlayField();

  function buildPlayField() {
    for (let position = 1; position < 10; position++) {
      $('#play-field').append('<div class="widget" data-position="' + position + '">' + position + '</div>');
    }

    let widgets = $('.widget');
    widgets.on('click', (e) => selectWidget(e));
  }

  function selectWidget(e) {
    let currentItem = $(e.currentTarget);

    if (currentItem.data('tagged') === undefined) {
      let currentPosition = currentItem.data('position');
      currentItem.text(currentTurn);
      e.currentTarget.setAttribute('data-tagged', currentTurn);

      if (currentTurn === 'X') {
        selectedPlayerX.push(currentPosition);
      } else {
        selectedPlayerO.push(currentPosition)
      }

      if (checkForWinner(currentPosition)) {
        endGame();
      }

      changeTurn();
    } else {
      //TODO display invalid turn
    }
  }

  function checkForWinner(currentPosition) {
    let currentArray = [];
    if (currentTurn === 'X') {
      currentArray = selectedPlayerX;
    } else {
      currentArray = selectedPlayerO;
    }
    for (let e of winningPossibilityArray) {
      if (e.includes(currentPosition)) {
        let counter = 0;

        for (let element of e) {
          if (currentArray.includes(element)) {
            counter++;
          }
        }

        if (counter === 3) {
          return true;
        }
      }
    }

    return false;
  }

  function endGame() {
    console.log(currentTurn + ' has won the game.');
    //TODO build a sequence to end the game
  }

  function changeTurn() {
    currentTurn = currentTurn ==='X' ? 'O' : 'X';
  }
}
