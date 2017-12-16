$(document).ready(function() {

  $('.modal').modal();
  $('#modal1').modal('open');

  let userName = prompt("Please enter your name", "<name goes here>");
  $('.player-name').text(userName)




  $.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=3', function(data) {

    let makeBet;
    let betAmt = 0;
    let count = 0;
    let dealerHand = [];
    let dealerImages = [];
    let dealerTotal = 0;
    let decks = data['deck_id'];
    let lose;
    let playerHand = [];
    let playerImages = [];
    let playerTotal = 0;
    let pointValue = {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      10: 10,
      "JACK": 10,
      "QUEEN": 10,
      "KING": 10,
      "ACE": 11
    }
    let lastAceIdx = -1

    // function win() {
    //   Number(betAmt) + Number($('#dollars').text())
    // }
    //
    // function loss() {
    //   Number(betAmt) - Number($('#dollars').text())
    // }

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

    // function colorSwitch() {
    //   $('.button-div a').removeClass('red');
    //   $('.button-div a').addClass('grey');
    // }
    //
    // if (betAmt === 0) {
    //   colorSwitch();
    //   $('.button-div .bet').removeClass('grey');
    //   $('.button-div .bet').addClass('red')
    // }
    // if (betAmt !== 0 && count === 0) {
    //   colorSwitch();
    //   $('.button-div .deal').removeClass('grey');
    //   $('.button-div .deal').addClass('red');
    // }

    // $('.bet').click(bet)
    //
    // function bet() {
    //   makeBet = prompt("How much would you like to bet?", "Enter amount here");
    //   betAmt += Number(makeBet)
    // }

    $('.deal').click(deal)

    function deal() {
      if (dealerImages.length === 2) {
        return
      }
      $.get(`https://deckofcardsapi.com/api/deck/${decks}/draw/?count=4`, function(cards) {
        for (let i = 0; i < cards.cards.length; i++) {
          let cardImage = cards.cards[i].images.png;
          if (count === 0) {
            playerImages.push(`<img class=card-front src=${cardImage} alt=${cards.cards[i].code}>`);
            playerHand.push(cards.cards[i]);
            count++;
          } else if (count === 1) {
            dealerImages.push(`<img class='card-back' src='images/playing-card.jpg' alt='card-back'>`);
            dealerHand.push(cards.cards[i]);
            count++;
          } else if (count === 2) {
            playerImages.push(`<img class=card-front src=${cardImage} alt=${cards.cards[i].code}>`);
            playerHand.push(cards.cards[i]);
            count++;
          } else if (count === 3) {
            dealerImages.push(`<img class=card-front src=${cardImage} alt=${cards.cards[i].code}>`);
            dealerHand.push(cards.cards[i]);
            count++;
          } else {
            return;
          }
        }
        for (let j = 0; j < 2; j++) {
          $('.dealer .card-spot').append(dealerImages[j]);
          $('.player-one .card-spot').append(playerImages[j]);
          dealerTotal += pointValue[dealerHand[j].value];
          playerTotal += pointValue[playerHand[j].value];
        }
        if (dealerTotal === 21) {
          $('.dealer .card-spot').find('img:first-child').after($(`<img class=card-front src=${dealerHand[0].images.png}>`)).remove();
          window.setTimeout(function() {
            alert(`DEALER HAS BLACKJACK, YOU LOSE!`)
            reset();
            loss();
          }, 500)

        } else if (playerTotal === 21) {
          $('.dealer .card-spot').find('img:first-child').after($(`<img class=card-front src=${dealerHand[0].images.png}>`)).remove();
          window.setTimeout(function() {
            dealerHit();
          }, 500)
        }
      })
    }

    $('.hit').click(function() {
      let cardImage;
      $.get(`https://deckofcardsapi.com/api/deck/${decks}/draw/?count=1`, function(cards) {
        for (let i = 0; i < cards.cards.length; i++) {
          cardImage = cards.cards[i].images.png;
          playerImages.push(`<img class=card-front src=${cardImage} alt=${cards.cards[i].code}>`);
          $('.player-one .card-spot').append(playerImages[playerImages.length - 1]);
          playerHand.push(cards.cards[i]);
          playerTotal += pointValue[cards.cards[i].value]
          let idx = 0
          while (playerTotal > 21 && idx < playerHand.length) {
            if (playerHand[idx].value == "ACE") {
              playerTotal -= 10;
            }
            idx++
          }
          if (playerTotal === 21) {
            $('.dealer .card-spot').find('img:first-child').after($(`<img class=card-front src=${dealerHand[0].images.png}>`)).remove();
            dealerHit();
          } else if (playerTotal > 21) {
            $('.dealer .card-spot').find('img:first-child').after($(`<img class=card-front src=${dealerHand[0].images.png}>`)).remove();
            window.setTimeout(function() {
              alert(`${playerTotal} YOU BUSTED!`)
              reset();
              loss();
            }, 500)
          }
        }

      })
    })

    function checkDealerTotal() {
      let idx = 0
      while (dealerTotal > 21 && idx < dealerHand.length) {
        if (dealerHand[idx].value == "ACE" && lastAceIdx < idx) {
          dealerTotal -= 10;
          lastAceIdx = idx
        }
        idx++
      }
      if (dealerTotal < 17) {
        underSeventeen();
      } else {
        overSeventeen();
      }
    }

    $('.stay').click(function() {
      $('.dealer .card-spot').find('img:first-child').after($(`<img class=card-front src=${dealerHand[0].images.png} alt=${dealerHand[0].code}>`)).remove();
      window.setTimeout(function() {
        checkDealerTotal();
      }, 300)
    })


    function dealerHit() {
      let cardImage;
      $.get(`https://deckofcardsapi.com/api/deck/${decks}/draw/?count=1`, function(cards) {
        for (let i = 0; i < cards.cards.length; i++) {
          cardImage = cards.cards[i].images.png;
          dealerImages.push(`<img class=card-front src=${cardImage} alt=${cards.cards[i].code}>`);
          dealerHand.push(cards.cards[i]);
          $('.dealer .card-spot').append(dealerImages[dealerImages.length - 1]);
          dealerTotal += pointValue[cards.cards[i].value];
          window.setTimeout(function() {
            checkDealerTotal();
          }, 300)
        }
      })
    }

    function underSeventeen() {
      dealerHit();
    }

    function overSeventeen() {
      if (dealerTotal === 21) {
        alert(`DEALER HAS ${dealerTotal} YOU LOSE!`)
        reset();
        loss();
      } else if (dealerTotal > 21) {
        alert(`DEALER HAS ${dealerTotal}, DEALER BUSTED, YOU WIN!`)
        reset();
        win();
      } else if (dealerTotal > playerTotal && dealerTotal < 21) {
        alert(`DEALER HAS ${dealerTotal} YOU LOSE!`)
        reset();
        loss();
      } else if (dealerTotal < playerTotal) {
        alert(`DEALER HAS ${dealerTotal} YOU WIN!`)
        reset();
        win();
      } else {
        return;
      }
    }



  })
})