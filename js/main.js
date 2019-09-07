{
  let currentTurn = 'X';
  let selectedPlayerX = [];
  let selectedPlayerO = [];
  let $infoBox = $('#info');
  let $errorBox = $('#error');
  let $startButton = $('#start-button');
  let $playField = $('#play-field');
  let turnCounter = 0;
  let isStarted = false;
  let winningPossibilityArray = [];
  winningPossibilityArray[0] = [1, 2, 3];
  winningPossibilityArray[1] = [4, 5, 6];
  winningPossibilityArray[2] = [7, 8, 9];
  winningPossibilityArray[3] = [1, 4, 7];
  winningPossibilityArray[4] = [2, 5, 8];
  winningPossibilityArray[5] = [3, 6, 9];
  winningPossibilityArray[6] = [1, 5, 9];
  winningPossibilityArray[7] = [3, 5, 7];

  $startButton.on('click', () => startGame());

  function startGame() {
    $playField.html('');
    selectedPlayerX = [];
    selectedPlayerO = [];
    buildPlayField();
    isStarted = true;
    turnCounter = 0;
    currentTurn = 'X';
  }

  function buildPlayField() {
    for (let position = 1; position < 10; position++) {
      $playField.append('<div class="widget" data-position="' + position + '" data-tagged="false"></div>');
    }
    $playField.find('.widget').on('click', (e) => selectWidget(e));
  }

  function selectWidget(e) {
    let $currentItem = $(e.currentTarget);

    if (isStarted && $currentItem.data('tagged') === false) {
      let currentPosition = $currentItem.data('position');
      $currentItem.addClass(currentTurn.toLowerCase());
      $currentItem.data('tagged', true);
      turnCounter++;
      $errorBox.text('');

      if (currentTurn === 'X') {
        selectedPlayerX.push(currentPosition);
      } else {
        selectedPlayerO.push(currentPosition)
      }

      if (checkForWinner(currentPosition)) {
        endGame(true);
      } else if (turnCounter >= 9) {
        endGame(false);
      } else {
        changeTurn();
      }
    } else {
      if (!isStarted) {
        $errorBox.text('Das Spiel ist vorbei. Bitte ein neues starten.');
      } else {
        $errorBox.text('Dieses Feld kann leider nicht gewählt werden.');
      }
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
          markWinner(e);
          return true;
        }
      }
    }

    return false;
  }

  function endGame(isWinner) {
    isStarted = false;
    if (isWinner) {
      $infoBox.text('Der Spieler ' + currentTurn + ' hat das Spiel gewonnen');
    } else {
      $infoBox.text('Unentschieden. Es ist kein Zug mehr möglich.');
    }
  }

  function changeTurn() {
    currentTurn = currentTurn ==='X' ? 'O' : 'X';
    $infoBox.text('Der Spieler ' + currentTurn + ' ist an der Reihe');
  }

  function markWinner(e) {
    for (let position of e) {
      $playField.find(`[data-position='${position}']`).addClass('winning');
    }
  }
}
