/* global $ */
{
  let currentTurn;
  const selectedArray = [];
  const $infoBox = $('#info');
  const $errorMessage = $('.error-message');
  const $startButton = $('#start-button');
  const $revertButton = $('#revert-button');
  const $playField = $('#play-field');
  const $startingCheckbox = $('#starting-checkbox');
  const $modal = $('.ui.modal');
  const $finishImage = $('#finish-image');
  let turnCounter = 0;
  let isStarted = false;
  let turnHistory = [];
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
  const cornerFields = [1, 3, 7, 9];
  const middleFields = [2, 4, 6, 8];

  // semantic UI - instantiating of form + popup message
  $('.ui.select-field').dropdown();
  $('.ui.checkbox').checkbox();
  $errorMessage.find('.close')
    .on('click', () => toggleErrorMessage());
  $startButton.on('click', () => startGame());
  $revertButton.on('click', () => revertMove());

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
    turnHistory = [];

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
   * Reverts the last move. If playing against NPC, revert 2 moves, so it's the players turn again
   */
  function revertMove () {
    if ((turnHistory.length > 0 && difficultyLevel === 0) || (turnHistory.length > 1 && difficultyLevel > 0)) {
      if (!isStarted) isStarted = true;
      let iteration = 1;
      if (difficultyLevel > 0) {
        iteration = 2;
      } else {
        changeTurn();
      }

      for (let i = 0; i < iteration; i++) {
        const lastPosition = turnHistory.pop();
        unmarkField(lastPosition);
        selectedArray[lastPosition] = 0;
      }
      turnCounter -= iteration;
    } else {
      toggleErrorMessage('Derzeit sind noch keine Felder belegt.');
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

  function unmarkField (position) {
    $playField.find(`[data-position='${position}']`).removeClass('x o');
    $playField.find('.winning').removeClass('winning');
    toggleErrorMessage();
  }

  /**
   * Handle someones move
   * @param position
   */
  function makeAMove (position) {
    markField(position);
    turnHistory.push(position);
    turnCounter++;
    selectedArray[position] = currentTurn;

    if (checkForWinner()) {
      endGame(true);
      changeTurn();
    } else if (turnCounter >= 9) {
      endGame(false);
      changeTurn();
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
    let title = '';
    let description = '';
    let searchQuery = '';
    if (!isWinner) { // tie
      title = 'Unentschieden';
      description = 'Unentschieden. Es ist kein Zug mehr möglich.';
      searchQuery = 'whatever';
    } else if (isWinner && difficultyLevel > 0 && currentTurn === -1) { // npc won
      title = 'Verloren';
      description = 'Sie haben leider verloren. Vielleicht versuchen Sie es auf einer einfacheren Stufe nochmal.';
      searchQuery = 'evil laugh';
    } else { // player won, or 2 players fought each other
      title = 'Gewonnen';
      description = 'Gratulation der Spieler ' + getCurrentPlayer() + ' hat das Spiel gewonnen';
      searchQuery = 'congratulations';
    }
    updateGif(searchQuery);

    $infoBox.text(description);
    $modal.find('.header').text(title);
    $modal.find('.description').text(description);
    $modal.modal('show');
  }

  /**
   * Change turn of players
   */
  function changeTurn () {
    currentTurn = -currentTurn;
    if (isStarted) {
      $infoBox.text('Der Spieler ' + getCurrentPlayer() + ' ist an der Reihe');
      if (difficultyLevel > 0 && currentTurn === -1) {
        npcMove();
      }
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
      let fieldToPick = 0;
      // expert mode
      if (difficultyLevel > 2) {
        // odd means NPC started, even means Player started
        switch (turnCounter) {
          case 0: {
            fieldToPick = 1;
            // could be random, but needs to change others case-logic for it to work
            // fieldToPick = cornerFields[randomIntFromInterval(0, 3)];
            break;
          }
          case 2: {
            const opponentMove = turnHistory[turnHistory.length - 1];
            if (opponentMove === 5) {
              fieldToPick = 9;
            } else if (middleFields.includes(opponentMove)) {
              fieldToPick = 5;
            } else if (cornerFields.includes(opponentMove)) {
              // currently return in specific order, could be random
              fieldToPick = assignableFieldFromArray(cornerFields);
            }
            break;
          }
          case 4: {
            if (arraySum([1, 2, 3]) === -1 && fieldIsAssignable(3)) {
              fieldToPick = 3;
            } else if (arraySum([1, 4, 7]) === -1 && fieldIsAssignable(7)) {
              fieldToPick = 7;
            } else {
              fieldToPick = assignableFieldFromArray(cornerFields);
            }

            break;
          }
          case 1: {
            if (selectedArray[5] === 0) {
              fieldToPick = 5;
            } else {
              fieldToPick = cornerFields[randomIntFromInterval(0, 3)];
            }
            break;
          }
          case 3: {
            // checking for edge catch-22
            if (arraySum([2, 4]) === 2) {
              fieldToPick = 1;
            } else if (arraySum([2, 6]) === 2) {
              fieldToPick = 3;
            } else if (arraySum([4, 8]) === 2) {
              fieldToPick = 7;
            } else if (arraySum([6, 8]) === 2) {
              fieldToPick = 9;
            } else if (arraySum(winningPossibilityArray[6]) === 1 || arraySum(winningPossibilityArray[7]) === 1) {
              fieldToPick = assignableFieldFromArray(cornerFields);
            }
            break;
          }
          case 5: {
            break;
          }
        }
        if (fieldToPick > 0) {
          makeAMove(fieldToPick);
        }
      }

      if (fieldToPick === 0) {
        let searchRandomField = true;
        while (searchRandomField === true) {
          fieldToPick = randomIntFromInterval(1, 9);
          if (fieldIsAssignable(fieldToPick)) {
            searchRandomField = false;
            makeAMove(fieldToPick);
          }
        }
      }
    }
  }

  /**
   * Returns a random integer value
   * @param {number} min
   * @param {number} max
   *
   * @returns {number}
   */
  function randomIntFromInterval (min = 1, max = 1) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * @param {array} arrayToCheck
   * @returns {int}
   */
  function assignableFieldFromArray (arrayToCheck) {
    for (let i = 0; i < arrayToCheck.length; i++) {
      if (fieldIsAssignable(arrayToCheck[i])) {
        return arrayToCheck[i];
      }
    }

    return 0;
  }

  /**
   * @param {int} position
   * @returns {boolean}
   */
  function fieldIsAssignable (position) {
    return !turnHistory.includes(position);
  }

  /**
   * @param {array} arrayToCheck
   *
   * @returns {number}
   */
  function arraySum (arrayToCheck = [0, 0, 0]) {
    let counter = 0;
    for (let i = 0; i < arrayToCheck.length; i++) {
      counter += parseInt(selectedArray[arrayToCheck[i]]);
    }
    return counter;
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

  /**
   * fetches and displays a gif for the finishing screen
   * the winner is an int and means 1 = player won; 2 = npc won; 3 = tie
   * @param {string} searchQuery
   */
  function updateGif (searchQuery = "") {
    // Giphy API defaults
    const giphy = {
      baseURL: 'https://api.giphy.com/v1/gifs/',
      apiKey: '0UTRbFtkMxAplrohufYco5IY74U8hOes',
      q: searchQuery,
      type: 'search',
      rating: 'g'
    };
    // Giphy API URL
    const giphyURL = encodeURI(giphy.baseURL + giphy.type + '?api_key=' + giphy.apiKey + '&q=' + giphy.q);

    $.ajax({
      url: giphyURL,
      context: document.body
    })
      .done(function (data) {
        // we get returned 25 images and we pick a random one of them.
        // Instead of pulling urls, we just use the id to build our own link
        const id = data.data[randomIntFromInterval(0, 24)].id;

        $finishImage.css({
          'background-image': 'url("https://media.giphy.com/media/' + id + '/giphy.gif")'
        });
      });
  }
}
