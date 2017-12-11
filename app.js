$(document).ready(function() {

  $.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6', function(data) {
  console.log(data['deck_id']);

  let decks = data['deck_id'];

  $('.deal').click(function(data) {
    let dealCards = $.get('https://deckofcardsapi.com/api/deck/' + decks + '/draw/?count=1')
    console.log(dealCards);

  })


  })
})
