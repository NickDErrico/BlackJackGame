$(document).ready(function() {

  // $('.modal1').modal('open');

  // let userName = prompt("Please enter your name", "<name goes here>");
  // $('.player-name').text(userName)

  $.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6', function(data) {
    // if (data.remaining <= 50) {
    //   return
    // }

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
  let win;

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




  let bet = $('.bet').click(function() {
     betAmt = prompt("How much would you like to bet?", "Enter amount here");
     // *********** let whatever = Number(betAmt) + Number($('#dollars').text()) ***************************
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
    }

    let hit = $('.hit').click(function() {
      let cardImage;
      $.get('https://deckofcardsapi.com/api/deck/' + decks + '/draw/?count=1', function(cards) {
        for (let i = 0; i < cards.cards.length ; i++) {
          cardImage = cards.cards[i].images.png;
          playerImages.push("<img class='card-front' src=" + cardImage + " alt='" + cards.cards[i].code + "'>");
          $('.player-one .card-spot').append(playerImages[playerImages.length -1]);
          playerHand.push(cards.cards[i]);
          playerTotal += pointValue[cards.cards[i].value]
          if (playerTotal === 21) {
            window.setTimeout(function() {
              $('.dealer .card-spot').find('img:first-child').after($("<img class='card-front' src='" + dealerHand[0].images.png + "' />")).remove();
              alert('BLACKJACK!, YOU WIN!')
              reset();
            }, 2000)
          // }else if(playerTotal > 21 && playerHand.includes(playerHand.value === "ACE") {
          //     playerTotal -= 10
            }else if(playerTotal > 21) {
              $('.dealer .card-spot').find('img:first-child').after($("<img class='card-front' src='" + dealerHand[0].images.png + "' />")).remove();
              //$('.dealer .card-spot')[0].attr('src', dealerHand[0].images.png);
              window.setTimeout(function() {
              alert(playerTotal + ' You busted')
              reset();
            }, 2000)
          }
        }
        // for (let j = 0; j < playerHand.length; j++) {
        //   console.log(playerTotal);
        //   if(playerTotal > 21 && playerHand[j].value == "ACE") {
        //     playerTotal -= 10
        //   }else if(playerTotal > 21) {
        //     alert(playerTotal + ' You busted');
        //     return;
        //     }
        //   }
      })
    })
    // **********************UNDER CONSTRUCTION*********************
    // let split = $('.split').click(function() {
    //   $('.card-spot img').removeClass('.card-front')
    //   $('.card-spot img').addClass('.split-cards')
    //   let cardsForSplit = 0;
    //   $.get('https://deckofcardsapi.com/api/deck/' + decks + '/draw/?count=1', function(cards) {
    //     if (cardsOnTable[0].code.length-1 === cardsOnTable[2].code.length-1) {
    //       for (let i = 0; i < cards.cards.length ; i++) {
    //         let cardImage = cards.cards[i].images.png;
    //         player.push("<img class='card-front' src=" + cardImage + " alt='" + cards.cards[i].code + "'>");
    //         cardsOnTable.push(cards.cards[i]);
    //         cardsForSplit++;
    //       }
    //       for (let j = 1; j < 2; j++) {
    //         if (cardsForSplit === 1) {
    //           cardsOnTable.unshift(cards.cards[j]);
    //           $('.player-one .card-spot').append(player[player.length -1]);
    //           cardsForSplit++;
    //         }else if(cardsForSplit === 2){
    //           cardsOnTable.unshift(cards.cards[j]);
    //           $('.player-one .card-spot').prepend(player[player.length -1]);
    //         }else {
    //           return;
    //         }
    //       }
    //     }
    //   })
    // })
  let stay = $('.stay').click(function() {
    window.setTimeout(function() {
      $('.dealer .card-spot').find('img:first-child').after($("<img class='card-front' src='" + dealerHand[0].images.png + "' />")).remove();
    }, 1000)
    let cardImage;
    // while (dealerTotal <= 16) {
    $.get('https://deckofcardsapi.com/api/deck/' + decks + '/draw/?count=1', function(cards) {
        for (let i = 0; i < cards.cards.length; i++) {
          cardImage = cards.cards[i].images.png;
          dealerImages.push("<img class='card-front' src='" + cardImage +  "' alt='" + cards.cards[i].code + "'>");
          dealerHand.push(cards.cards[i]);
          $('.dealer .card-spot').append(dealerImages[dealerImages.length -1]);
          dealerTotal += pointValue[cards.cards[i].value];
              }
            })
          } if (dealerTotal === 21) {
            window.setTimeout(function() {
            alert('DEALER HAS ' + dealerTotal + ' YOU LOSE!')
            reset();
          }, 2000)
          }else if(dealerTotal > 21) {
            window.setTimeout(function() {
            alert(dealerTotal + ' DEALER BUSTED, YOU WIN!')
            reset();
          }, 2000)
          }else if (dealerTotal >= playerTotal) {
            window.setTimeout(function() {
              alert("DEALER HAS " + dealerTotal + " YOU LOSE!")
              reset();
            }, 2000)
            }else if (dealerTotal < playerTotal) {
              window.setTimeout(function() {
              alert("DEALER HAS " + dealerTotal + " YOU WIN!")
              reset();
            }, 2000)
          }else {
            return;
          }
        })

    })


  })
