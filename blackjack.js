$(document).ready(function() {

  // let userName = prompt("Please enter your name", "<name goes here>");
  // $('.player-name').text(userName)

  $.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=3', function(data) {

    if (data.remaining <= 40) {
    $.get('https://deckofcardsapi.com/api/deck/' + decks + '/shuffle/?deck_count=3')
    }

  let betAmt;
  let count = 0;
  let dealerHand = [];
  let dealerImages = [];
  let dealerTotal = 0;
  let decks = data['deck_id'];
  let loss;
  let playerHand = [];
  let playerImages = [];
  let playerTotal = 0;
  let pointValue = {1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, 8:8, 9:9, 10:10, "JACK":10, "QUEEN":10, "KING":10, "ACE":11}
  let win = " YOU WIN!";
  let lose = " YOU LOSE!";
  function winAmt(betAmt) {
    Number($('#dollars').text()) + Number(betAmt)
  }
  function loseAmt() {
    Number($('#dollars').text()) - Number(betAmt)
  }

  function reset() {
    $('.card-spot').empty();
    count = 0;
    dealerHand = [];
    dealerImages = [];
    dealerTotal = 0;
    playerImages = [];
    playerHand = [];
    playerTotal = 0;
  }

  $('.bet').click(function() {
    let bet = prompt("How much would you like to bet?", "Enter amount here");
     betAmt = Number(bet)
     console.log(betAmt);
     winAmt()
  })

  $('.deal').click(deal)
  function deal() {
    if (dealerImages.length === 2) {
      return
    }

    $.get('https://deckofcardsapi.com/api/deck/' + decks + '/draw/?count=4', function(cards) {
        for (let i = 0; i < cards.cards.length; i++) {
          let cardImage = cards.cards[i].images.png;
          if (count === 0) {
            playerImages.push("<img class='card-front' src=" + cardImage + " alt='" + cards.cards[i].code + "'>");
            playerHand.push(cards.cards[i]);
            count++;
          }else if (count === 1){
            dealerImages.push("<img class='card-back' src='images/playing-card.jpg' alt='card-back'>");
            dealerHand.push(cards.cards[i]);
            count++;
          }else if (count === 2) {
            playerImages.push("<img class='card-front' src=" + cardImage + " alt='" + cards.cards[i].code + "'>");
            playerHand.push(cards.cards[i]);
            count++;
          }else if (count === 3){
            dealerImages.push("<img class='card-front' src=" + cardImage + " alt='" + cards.cards[i].code + "'>");
            dealerHand.push(cards.cards[i]);
            count++;
          }else {
            return;
          }
        }
        for (let j = 0; j < 2; j++) {
          $('.dealer .card-spot').append(dealerImages[j]);
          $('.player-one .card-spot').append(playerImages[j]);
          dealerTotal += pointValue[dealerHand[j].value];
          playerTotal += pointValue[playerHand[j].value];
        }
      })
      if (dealerTotal === 21) {
        $('.dealer .card-spot').find('img:first-child').after($("<img class='card-front' src='" + dealerHand[0].images.png + "' />")).remove();
        window.setTimeout(function() {
        alert('DEALER HAS ' + dealerTotal + lose);
        loseAmt();
        reset();
      }, 1000)
    }else if(playerTotal === 21) {
      $('.dealer .card-spot').find('img:first-child').after($("<img class='card-front' src='" + dealerHand[0].images.png + "' />")).remove();
      window.setTimeout(function() {
        alert('BLACKJACK!,' + win);
        reset();
        winAmt();
      }, 1000)
    }
  }


    let hit = $('.hit').click(function() {
      let cardImage;
      $.get('https://deckofcardsapi.com/api/deck/' + decks + '/draw/?count=1', function(cards) {
        for (let i = 0; i < cards.cards.length ; i++) {
          cardImage = cards.cards[i].images.png;
          playerImages.push("<img class='card-front' src=" + cardImage + " alt='" + cards.cards[i].code + "'>");
          $('.player-one .card-spot').append(playerImages[playerImages.length -1]);
          playerHand.push(cards.cards[i]);
          playerTotal += pointValue[cards.cards[i].value];
          if (playerTotal === 21) {
            $('.dealer .card-spot').find('img:first-child').after($("<img class='card-front' src='" + dealerHand[0].images.png + "' />")).remove();
            window.setTimeout(function() {
              alert('BLACKJACK!,' + win);
              reset();
              winAmt();
            }, 1000)
          }else if(playerTotal > 21) {
            let containsAce = false
            for (let j = 0; j < playerHand.length; j++) {
            if (playerHand[j].value == "ACE")
            playerTotal -= 10;
            containsAce = true;
            break;
          }
          }else if(playerTotal > 21) {
            $('.dealer .card-spot').find('img:first-child').after($("<img class='card-front' src='" + dealerHand[0].images.png + "' />")).remove();
            window.setTimeout(function() {
              alert(playerTotal + ' YOU BUSTED,' + lose);
              reset();
              loseAmt();
            }, 1000)
            }
          }
        })
      })

  $('.stay').click(function() {
    $('.dealer .card-spot').find('img:first-child').after($(`<img class='card-front' src=${dealerHand[0].images.png} />`)).remove();
    stay()
  })

  function stay() {
    if (dealerTotal <= 16) {
      //GET CARD and add total call stay
      let cardImage;
      $.get('https://deckofcardsapi.com/api/deck/' + decks + '/draw/?count=1', function(cards) {
          for (let i = 0; i < cards.cards.length; i++) {
            cardImage = cards.cards[i].images.png;
              dealerImages.push("<img class='card-front' src='" + cardImage +  "' alt='" + cards.cards[i].code + "'>");
              dealerHand.push(cards.cards[i]);
              $('.dealer .card-spot').append(dealerImages[dealerImages.length -1]);
              dealerTotal += pointValue[cards.cards[i].value];
              stay()
              }
            })
            }else {
              if (dealerTotal === 21) {
                window.setTimeout(function() {
                alert('DEALER HAS ' + dealerTotal + lose);
                loseAmt();
                reset();
              }, 1000)
            }else if(dealerTotal > 21) {
                let containsAce = false
                for (let j = 0; j < dealerHand.length; j++) {
                if (dealerHand[j].value == "ACE")
                dealerTotal -= 10;
                containsAce = true;
                break;
                }
              }else if(dealerTotal > 21) {
                window.setTimeout(function() {
                alert(dealerTotal + ' DEALER BUSTED,' + win);
                winAmt();
                reset();
              }, 1000)
              }else if (dealerTotal >= playerTotal) {
                window.setTimeout(function() {
                  alert("DEALER HAS " + dealerTotal + lose);
                  loseAmt();
                  reset();
                }, 1000)
                }else if (dealerTotal < playerTotal) {
                  window.setTimeout(function() {
                  alert("DEALER HAS " + dealerTotal + win);
                  winAmt();
                  reset();
                }, 1000)
                }
              }
            }
    })
  })
