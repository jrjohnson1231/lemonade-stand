$( document ).ready(function() {

  // Global variables needed for game
  var day;
  var assets;
  var weather;
  var costToMake;
  var weatherReport;
  var specialDesc;
  var explanation;
  var special;
  var thirsty;

  // Called at beginning of each game
  function constructor() {
    day = 0;
    assets = 2.00;

    getNextRound();

    // Shows intro screen
    $('#intro').show();
    $('#canvas').hide();
    $('#questions').hide();
    $('#results').hide();
    $('#loser').hide();
  }

  // When lose screen is clicked, start new game
  $('#loser').click(function() {
    constructor();
  })

  // When intro screen is clicked, move to first day's weather
  $('#intro').click(function() {
    $('#intro').hide();
    $('#canvas').show();

    drawCanvas();

    setTimeout(function() {
      showQuestons();
    }, 3000);
  })

  // When results are clicked go to next day's weather
  $('#results').click(function() {
    $('#results').hide();
    $('#canvas').show();

    drawCanvas();

    setTimeout(function() {
      showQuestons();
    }, 3000);
  })

  // When input is submited call backend to compute profit
  $('#form').submit(function(event) {
    event.preventDefault();
    var raw_data = $(this).serializeArray();
    var input = { };

    // puts form data into object
    $.map(raw_data, function(n) {
      input[n['name']] = parseInt(n['value']);
    });

    // all validations, must satisfy all of these conditions
    if (isNaN(input.cups) || isNaN(input.signs) || isNaN(input.price)) {
      changeError('Invalid input!');
      return;
    } else if (input.cups < 0) {
      changeError("Can't make negative cups of lemonade!");
      return;
    } else if (input.cups > 1000) {
      changeError("You can't make that many cups in one morning!");
      return;
    } else if (input.signs < 0) {
      changeError("You can't make negative signs!");
      return;
    } else if (input.signs > 50) {
      changeError("The sign store doesn't have enough materials for that many signs!");
      return;
    } else if (input.price < 0) {
      changeError("You can't charge negative cents per cup!");
      return;
    } else if ( input.price > 100) {
      changeError("You can't charge that much, nobody will buy it");
      return;
    } else if (input.cups*costToMake + input.signs*.15 > assets) {
      changeError("You don't have enough money to make that!");
      return;
    } else {
      changeError('');
    }

    // add necessary data to body to calculate profit
    input['day'] = day;
    input['assets'] = assets;
    input['weather'] = weather;
    input['thirsty'] = thirsty;

    $.post( "/submitted", JSON.stringify(input), function(res){
      var data = res.data;
      assets = data.assets;

      // out of money
      if (assets <= 0) {
        $('#questions').hide();
        $('#loser').show();
        return;
      }

      // prepare results
      var income = data.income;
      var profit = data.profit;
      var expenses = data.expenses;
      var glassesSold = data.glassesSold;
      var perGlass = parseFloat(input.price) / parseFloat(100);
      var glassesMade = input.cups;
      var signsMade = input.signs;

      if (data.specialResultIndicator) {
        special = data.specialResult; 
      } else {
        special = '';
      }

      $('#day').text('Day ' + day);
      $('#special').text(special);
      $('#glasses-sold').text(glassesSold + ' glasses sold');
      $('#per-glass').text('$' + perGlass + ' per glass');
      $('#total-in').text('$' + parseFloat(income).toFixed(2) + ' total income');
      $('#glasses-made').text(glassesMade + ' glasses made');
      $('#signs-made').text(signsMade + ' signs made');
      $('#total-exp').text('$' + parseFloat(expenses).toFixed(2) + ' total expenses');
      $('#profit').text('$' + parseFloat(profit).toFixed(2) + ' total profit');
      $('#assets').text('$' + parseFloat(assets).toFixed(2) + ' total assets');

      $('#results').show();
      $('#questions').hide();
      getNextRound()

    });
  });

  // Determines which weather picture to draw
  function drawCanvas() {
    $('#event').text(specialDesc);

    switch (weather) {
      case 'sunny':
        drawSunny();
        weatherMessage('Today is sunny');
        break;
      case 'cloudy':
        drawCloudy();
        weatherMessage('Today is cloudy');
        break;
      case 'hot':
        drawHot();
        weatherMessage('Today is hot and dry');
        break;
      case 'stormy':
        drawCloudy();
        weatherMessage('There will be thunderstorms today');
        break
    }
  }

  // Draws sunny day
  function drawSunny() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0349ba";
    ctx.fillRect(0,0,500,300);
    ctx.fillStyle= "#3fff00";
    ctx.fillRect(0,180,500,150);
    ctx.fillStyle="#5e2e04";
    ctx.fillRect(175,160,150,75);
    ctx.fillStyle="#fff44f";
    ctx.fillRect(195,138,20,22);
    ctx.fillRect(225,138,20,22);
    ctx.fillRect(255,138,20,22);
    ctx.fillRect(285,138,20,22);
    ctx.beginPath();
    ctx.arc(50, 50, 40, 0, 2 * Math.PI, false);
    ctx.fillStyle = "yellow";
    ctx.fill();

    drawSign(ctx);

  }

  // Draws hot day
  function drawHot() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0349ba";
    ctx.fillRect(0,0,500,300);
    ctx.fillStyle= "#3fff00";
    ctx.fillRect(0,180,500,150);
    ctx.fillStyle="#5e2e04";
    ctx.fillRect(175,160,150,75);
    ctx.fillStyle="#fff44f";
    ctx.fillRect(195,138,20,22);
    ctx.fillRect(225,138,20,22);
    ctx.fillRect(255,138,20,22);
    ctx.fillRect(285,138,20,22);
    ctx.beginPath();
    ctx.arc(50, 50, 40, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#ff7700";
    ctx.fill();

    drawSign(ctx);

  }

  // Draws cloudy day
  function drawCloudy() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#494e60";
    ctx.fillRect(0,0,500,300);
    ctx.fillStyle= "#3fff00";
    ctx.fillRect(0,180,500,150);
    ctx.fillStyle="#5e2e04";
    ctx.fillRect(175,160,150,75);
    ctx.fillStyle="#fff44f";
    ctx.fillRect(195,138,20,22);
    ctx.fillRect(225,138,20,22);
    ctx.fillRect(255,138,20,22);
    ctx.fillRect(285,138,20,22);

    drawCloud(ctx, 70, 60);
    drawCloud(ctx, 170, 40);
    drawCloud(ctx, 270, 60);
    drawCloud(ctx, 370, 40);

    drawSign(ctx);

  }

  // Draws clouds when it is a rainy day
  function drawCloud(ctx, centerX, centerY) {
    var radius = 20;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#bcbcbc';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX+10, centerY+20, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#bcbcbc';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX+25, centerY+0, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#bcbcbc';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX+30, centerY+20, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#bcbcbc';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX+45, centerY+5, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#bcbcbc';
    ctx.fill();
  }

  // Draws sign on lemonade stand, same for all weather types
  function drawSign(ctx) {
    ctx.fillStyle = "#af6300";
    ctx.fillRect(175,90,5,70);
    ctx.fillRect(320,90,5,70);
    ctx.fillStyle="#fff44f";
    ctx.fillRect(180,90,140,30);
    ctx.font = "25px Arial";
    ctx.fillStyle="black";
    ctx.fillText("Lemonade",190, 115);
  }

  // Set error message when input is invalid
  function changeError(msg) {
    $('#error').text(msg);
  }

  // Sets message above weather canvas
  function weatherMessage() {
    $('#wthr-msg').text(weatherReport);
  }

  // Displays questions for day
  function showQuestons() {
    if (assets < costToMake) { // if you can't make 1 cup, you lose
      explanation = "You don't have enough money to make any more lemonade, you lose!";
      setTimeout(function() {
        $('#questions').hide();
        $('#loser').show();
      }, 3000)
    }
    $('#explain').text(explanation);
    $('#canvas').hide();
    $('#questions').show();

    $('#q-assets').text('On day ' + day + ' you have $' + parseFloat(assets).toFixed(2) + ' in assets.');
    $('#q-cost').text('The cost to make lemonade is $' + parseFloat(costToMake).toFixed(2) + ' per cup.');
  }

  // Get weather and price to make a cup for the next round, also increments day
  function getNextRound() {
    day += 1;
    $.post('/initialize', JSON.stringify({day}), function(res) {
      weather = res.data.weather;
      weatherReport = res.data.weatherReport;
      thirsty = res.data.thirsty;
      if (res.data.specialDescIndicator) {
        specialDesc = res.data.specialDesc;
      } else {
        specialDesc = '';
      }

      if (res.data.explanationIndicator) {
        explanation = res.data.explanation;
      } else {
        explanation = '';
      }
      costToMake = res.data.currentPricePerGlass;
    })
  }

  // Starts game by calling constructor
  constructor();

});
