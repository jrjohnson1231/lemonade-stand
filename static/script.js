$( document ).ready(function() {

  //valid:
  // glass 0-1000
  // signs 0-50
  // price 0-100
  // 
  const stateEnum = {
    INTRO: 0,
    PICTURE: 1,
    FORM: 2,
    ENDING: 3
  }

  var state;
  var day;
  var assets;

  constructor() {
    state = stateEnum.INTRO;
    day = 1;
    assets = 2.00;

    $('#canvas').hide();
    $('#questions').hide();
  }

  $('#intro').click(function() {
    var state = stateEnum.FORM;
    $('#intro').hide();
    $('#canvas').show();
    drawSunny();

    setTimeout(function() {
      console.log('hello');
      $('#canvas').hide();
      $('#questions').show();
    }, 2000);
  })

  $('#form').submit(function(event) {
    event.preventDefault();
    var raw_data = $(this).serializeArray();
    var data = { };

    $.map(raw_data, function(n) {
      data[n['name']] = parseInt(n['value']);
    });

    if (!data.cups || !data.signs || !data.price) {
      changeError('Invalid input!');
      return;
    } else if (data.cups < 0) {
      changeError("Can't make negative cups of lemonade!");
      return;
    } else if (data.cups > 1000) {
      changeError("You can't make that many cups in one morning!");
      return;
    } else if (data.signs < 0) {
      changeError("You can't make negative signs!");
      return;
    } else if (data.signs > 50) {
      changeError("The sign store doesn't have enough materials for that many signs!");
      return;
    } else if (data.price < 0) {
      changeError("You can't charge negative cents per cup!");
      return;
    } else if ( data.price > 100) {
      changeError("You can't charge that much, nobody will buy it");
      return;
    } else {
      changeError('');
    }
    console.log(day)
      data['day'] = day;
    data['assets'] = assets;
    console.log('sending', data)
      $.post( "/submitted", JSON.stringify(data), function(res){
        var data = res.data;
        console.log('returned', data);
        day += 1;
      });
  });

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

  function changeError(msg) {
    console.log('changing error');
    $('#error').text(msg);
  }

  constructor();

});
