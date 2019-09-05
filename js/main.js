{
  let field = 0;
  let currentTurn = 'X';
  let selectedPlayerX = [];
  let selectedPlayerO = [];

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
      checkForWinner();
      changeTurn();

    } else {
    }
    console.log(selectedWidgets);
  }

  function checkForWinner() {
    if (currentTurn === 'X') {
      selectedPlayerX.push(currentPosition);
    } else {
      selectedPlayerO.push(currentPosition)
    }
  }

  function changeTurn() {
    currentTurn = currentTurn ==='X' ? 'O' : 'X';
  }
}
