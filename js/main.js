{
  let currentTurn;
  let selectedArray = [];
  let $infoBox = $('#info');
  let $errorBox = $('#error');
  let $startButton = $('#start-button');
  let $playField = $('#play-field');
  let turnCounter = 0;
  let isStarted = false;
  // there are 3 difficulty levels, 1: total random movement, 2: tries to win/prevent if possible, 3: makes you cry
  let difficultyLevel = 1;
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
    currentTurn = 1;
    isStarted = true;
    buildPlayField();
    $infoBox.html('Neues Spiel gestartet ' + getCurrentPlayer() + ' ist an der Reihe.');
    $errorBox.html('');
    turnCounter = 0;
  }

  function buildPlayField() {
    for (let position = 1; position < 10; position++) {
      $playField.append('<div class="field" data-position="' + position + '"></div>');
      selectedArray[position] = 0;
    }
    $playField.find('.field').on('click', (e) => selectField(e));
  }

  function selectField(e) {
    let currentPosition = $(e.currentTarget).data('position');

    if (isStarted && selectedArray[currentPosition] === 0) {
      makeAMove(currentPosition);
    } else {
      if (!isStarted) {
        $errorBox.text('Das Spiel ist vorbei. Bitte starten Sie ein neues.');
      } else {
        $errorBox.text('Dieses Feld ist bereits gewählt, wählen Sie ein anders aus.');
      }
    }
  }

  function markField(position) {
    $playField.find(`[data-position='${position}']`).addClass(getCurrentPlayer().toLowerCase());
    $errorBox.text('');
  }

  function makeAMove (position) {
    markField(position);
    turnCounter++;
    selectedArray[position] = currentTurn;

    if (checkForWinner()) {
      endGame(true);
    } else if (turnCounter >= 9) {
      endGame(false);
    } else {
      changeTurn();
    }
  }

  function checkForWinner() {
    for (let winningPossibility of winningPossibilityArray) {
      let counter = arraySum(winningPossibility);
      if (counter === 3 || counter === -3) {
        markWinner(winningPossibility);

        return true;
      }
    }

    return false;
  }

  function endGame(isWinner) {
    isStarted = false;
    if (isWinner) {
      $infoBox.text('Der Spieler ' + getCurrentPlayer() + ' hat das Spiel gewonnen');
    } else {
      $infoBox.text('Unentschieden. Es ist kein Zug mehr möglich.');
    }
  }

  function changeTurn() {
    currentTurn = -currentTurn;
    $infoBox.text('Der Spieler ' + getCurrentPlayer() + ' ist an der Reihe');
    if (currentTurn === -1) {
      npcMove();
    }
  }

  function getCurrentPlayer() {
    return currentTurn === 1 ? 'X' : 'O';
  }

  function markWinner(e) {
    for (let position of e) {
      $playField.find(`[data-position='${position}']`).addClass('winning');
    }
  }

  function npcMove() {
    let necessaryAction = [];
    if (difficultyLevel >= 2) {
      // we run for each condition, so we can prioritize winning over prevention
      condition:
      for (let condition of [-2, 2]) {
        for (let winningPossibility of winningPossibilityArray) {
          let counter = arraySum(winningPossibility);

          if (counter === condition) {
            necessaryAction = winningPossibility;

            break condition;
          }
        }
      }
    }

    if (necessaryAction.length > 0) {
      for (let field of necessaryAction) {
        if (selectedArray[field] === 0) {
          makeAMove(field);
          break;
        }
      }
    } else {
      let searchRandomField = true;
      while (searchRandomField === true) {
        let randomField = randomIntFromInterval(1, 9);
        if (selectedArray[randomField] === 0) {
          makeAMove(randomField);
          searchRandomField = false;
        }
      }
    }
  }

  function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function arraySum(array) {
    return selectedArray[array[0]] + selectedArray[array[1]] + selectedArray[array[2]];
  }
}
