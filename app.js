$(document).ready(function() {

  let userName = prompt("Please enter your name", "<name goes here>");
  $('.player-name').text(userName)

  $.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6', function(data) {
    // if (data.remaining <= 50) {
    //   return
    // }
  let decks = data['deck_id'];
  let dealer = [];
  let player = [];
  let cardsOnTable = [];
  let count = 0;

  $('.deal').click(function() {
    if (dealer.length === 2) {
      return
    }
    $.get('https://deckofcardsapi.com/api/deck/' + decks + '/draw/?count=4', function(cards) {
      console.log(cards);
        for (let i = 0; i < cards.cards.length; i++) {
          let cardImage = cards.cards[i].images.png;
          if (count === 0) {
            player.push("<img class='card-front' src=" + cardImage + " alt='" + cards.cards[i].code + "'>");
            cardsOnTable.push(cards.cards[i])
            count++;
          }else if (count === 1){
            dealer.push("<img class='card-back' src='images/playing-card.jpg' alt='card-back'>")
            cardsOnTable.push(cards.cards[i])
            count++;
          }else if (count === 2) {
            player.push("<img class='card-front' src=" + cardImage + " alt='" + cards.cards[i].code + "'>");
            cardsOnTable.push(cards.cards[i])
            count++;
          }else if (count === 3){
            dealer.push("<img class='card-front' src=" + cardImage + " alt='" + cards.cards[i].code + "'>")
            cardsOnTable.push(cards.cards[i])
            count++;
            console.log(cardsOnTable);
          }else {
            return
            }
          }
        for (let j = 0; j < 2; j++) {
          console.log(dealer);
          console.log(player);
          $('.dealer .card-spot').append(dealer[j])
          $('.player-one .card-spot').append(player[j])
        }
      })
    })
    $('.hit').click(function() {
      $.get('https://deckofcardsapi.com/api/deck/' + decks + '/draw/?count=1', function(cards) {
        for (let i = 0; i < cards.cards.length ; i++) {
          let cardImage = cards.cards[i].images.png;
          player.push("<img class='card-front' src=" + cardImage + " alt='" + cards.cards[i].code + "'>");
          cardsOnTable.push(cards.cards[i])
        }
      })
    })
  })
})
