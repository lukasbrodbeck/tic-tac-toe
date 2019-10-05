/* global $ */
{
  let currentTurn;
  const selectedArray = [];
  const $infoBox = $('#info');
  const $errorMessage = $('.error-message');
  const $startButton = $('#start-button');
  const $playField = $('#play-field');
  const $startingCheckbox = $('#starting-checkbox');
  let turnCounter = 0;
  let isStarted = false;
  // there are 3 difficulty levels, 1: total random movement, 2: tries to win/prevent if possible, 3: makes you cry
  let difficultyLevel;
  const winningPossibilityArray = [];
  winningPossibilityArray[0] = [1, 2, 3];
  winningPossibilityArray[1] = [4, 5, 6];
  winningPossibilityArray[2] = [7, 8, 9];
  winningPossibilityArray[3] = [1, 4, 7];
  winningPossibilityArray[4] = [2, 5, 8];
  winningPossibilityArray[5] = [3, 6, 9];
  winningPossibilityArray[6] = [1, 5, 9];
  winningPossibilityArray[7] = [3, 5, 7];

  // semantic UI - instantiating of form + popup message
  $('.ui.select-field').dropdown();
  $('.ui.checkbox').checkbox();
  $errorMessage.find('.close')
    .on('click', () => toggleErrorMessage());

  $startButton.on('click', () => startGame());

  /**
   * Start a new game
   */
  function startGame () {
    $playField.html('');
    currentTurn = $startingCheckbox.hasClass('checked') ? -1 : 1;
    isStarted = true;
    buildPlayField();
    $infoBox.html('Neues Spiel gestartet ' + getCurrentPlayer() + ' ist an der Reihe.');
    toggleErrorMessage();
    turnCounter = 0;
    difficultyLevel = $('#difficulty-selection').find('.selected').data('value');

    if (currentTurn === -1 && difficultyLevel > 0) {
      npcMove();
    }
  }

  /**
   * Build the playfield
   */
  function buildPlayField () {
    for (let position = 1; position < 10; position++) {
      $playField.append('<div class="field-box" data-position="' + position + '"></div>');
      selectedArray[position] = 0;
    }
    $playField.find('.field-box').on('click', (e) => selectField(e));
  }

  /**
   * Player clicks on a field
   * @param e
   */
  function selectField (e) {
    const currentPosition = $(e.currentTarget).data('position');

    if (isStarted && selectedArray[currentPosition] === 0) {
      makeAMove(currentPosition);
    } else {
      if (!isStarted) {
        toggleErrorMessage('Das Spiel ist vorbei. Bitte starten Sie ein neues.');
      } else {
        toggleErrorMessage('Dieses Feld ist bereits gewählt, wählen Sie ein anders aus.');
      }
    }
  }

  /**
   * Apply styling to the chosen field
   * @param position
   */
  function markField (position) {
    $playField.find(`[data-position='${position}']`).addClass(getCurrentPlayer().toLowerCase());
    toggleErrorMessage();
  }

  /**
   * Handle someones move
   * @param position
   */
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

  /**
   * Check whether someone won and the game is over
   * @returns {boolean}
   */
  function checkForWinner () {
    for (const winningPossibility of winningPossibilityArray) {
      const counter = arraySum(winningPossibility);
      if (counter === 3 || counter === -3) {
        markWinner(winningPossibility);

        return true;
      }
    }

    return false;
  }

  /**
   * Manage the end of the game
   * @param isWinner
   */
  function endGame (isWinner) {
    isStarted = false;
    if (isWinner) {
      $infoBox.text('Der Spieler ' + getCurrentPlayer() + ' hat das Spiel gewonnen');
    } else {
      $infoBox.text('Unentschieden. Es ist kein Zug mehr möglich.');
    }
  }

  /**
   * Change the player
   */
  function changeTurn () {
    currentTurn = -currentTurn;
    $infoBox.text('Der Spieler ' + getCurrentPlayer() + ' ist an der Reihe');
    if (difficultyLevel > 0 && currentTurn === -1) {
      npcMove();
    }
  }

  /**
   * @returns {string}
   */
  function getCurrentPlayer () {
    return currentTurn === 1 ? 'X' : 'O';
  }

  /**
   * Highlights the winning fields
   * @param winningArray
   */
  function markWinner (winningArray) {
    for (const position of winningArray) {
      $playField.find(`[data-position='${position}']`).addClass('winning');
    }
  }

  /**
   * Let the AI do his thing
   * Depending on the difficulty level there are multiple calculations
   */
  function npcMove () {
    let necessaryAction = [];
    if (difficultyLevel >= 2) {
      // we run for each condition, so we can prioritize winning over prevention
      for (const condition of [-2, 2]) {
        for (const winningPossibility of winningPossibilityArray) {
          const counter = arraySum(winningPossibility);

          if (counter === condition) {
            necessaryAction = winningPossibility;

            break;
          }
        }

        if (necessaryAction.length > 0) {
          break;
        }
      }
    }

    if (necessaryAction.length > 0) {
      for (const field of necessaryAction) {
        if (selectedArray[field] === 0) {
          makeAMove(field);
          break;
        }
      }
    } else {
      let searchRandomField = true;
      while (searchRandomField === true) {
        const randomField = randomIntFromInterval(1, 9);
        if (selectedArray[randomField] === 0) {
          makeAMove(randomField);
          searchRandomField = false;
        }
      }
    }
  }

  /**
   * Returns a random integer value
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  function randomIntFromInterval (min = 1, max = 1) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * @param array
   * @returns {number}
   */
  function arraySum (array = [0, 0, 0]) {
    return selectedArray[array[0]] + selectedArray[array[1]] + selectedArray[array[2]];
  }

  /**
   * If empty string is provided as errorMessage, hide the message
   * @param {string} errorMessage
   */
  function toggleErrorMessage (errorMessage = '') {
    // .transition() already toggles the message, so we need to check whether we really want to trigger it or not
    if ((errorMessage !== '' && !$errorMessage.hasClass('visible')) || (errorMessage === '' && $errorMessage.hasClass('visible') && !$errorMessage.hasClass('zoom'))) {
      $errorMessage.transition('zoom', 200);
      $errorMessage.find('#error-text').text(errorMessage);
    }
  }
}
