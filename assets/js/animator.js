function reloadChart(data2, data1, labels) {
  var heighest = 0;
  if (Math.max(...data1) > heighest) heighest = Math.max(...data1);
  if (Math.max(...data2) > heighest) heighest = Math.max(...data2);
  var steps = heighest / data2.length;

  try {
    // ARO RECENT REPORT
    const aroIn = 'rgba(28,191,255,0.8)'
    const aroOut = 'rgba(255, 99, 132,1)'

    var elements = 10
    var data3 = [52, 60, 55, 50, 65, 80, 57, 70, 105, 115]
    var data4 = [102, 70, 80, 100, 56, 53, 80, 75, 65, 90]
    var ctx = document.getElementById("recent-rep-chart");
    if (ctx) {
      ctx.height = 300;
      ctx.style.height = "";
      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Inbound',
            backgroundColor: aroIn,
            borderColor: 'transparent',
            pointHoverBackgroundColor: aroIn,
            borderWidth: 0,
            data: data2

          }, {
            label: 'Outbound',
            backgroundColor: aroOut,
            borderColor: 'transparent',
            pointHoverBackgroundColor: aroOut,
            borderWidth: 0,
            data: data1

          }]
        },
        options: {
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          responsive: true,
          scales: {
            xAxes: [{
              gridLines: {
                drawOnChartArea: true,
                color: "rgba(0, 0, 0, 0)"
              },
              ticks: {
                fontFamily: "Poppins",
                fontSize: 12
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                maxTicksLimit: 5,
                stepSize: steps,
                max: heighest,
                fontFamily: "Poppins",
                fontSize: 12
              },
              gridLines: {
                display: true,
                color: "rgba(0, 0, 0, 0)"

              }
            }]
          },
          elements: {
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4,
              hoverBorderWidth: 3
            }
          },
          tooltips: {
            backgroundColor: '#FFF',
            titleFontSize: 16,
            titleFontColor: '#0066ff',
            bodyFontColor: '#000',
            bodyFontSize: 14,
            displayColors: false
          }


        }
      });




    }
    ctx.style.height = "";
  } catch (error) {}
}


window.chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: '#1cbfff',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};

var config = {
  type: 'pie',
  data: {
    datasets: [{
      data: [
        0,
        0,
      ],
      backgroundColor: [
        window.chartColors.red,
        window.chartColors.blue,
      ],
      label: 'Block Info'
    }],
    labels: [
      'Wallets',
      'Height'
    ]
  },
  circumference: 3 * Math.PI,
  animation: {
    animateRotate: true,
    animateScale: true
  },
  options: {
    legend: {
      display: false
    },
    responsive: true,
    tooltips: {
      callbacks: {
        title: function(tooltipItem, data) {
          return data['labels'][tooltipItem[0]['index']];
        },
        label: function(tooltipItem, data) {
          return data['datasets'][0]['data'][tooltipItem['index']];
        }
      },
      backgroundColor: '#FFF',
      titleFontSize: 16,
      titleFontColor: '#0066ff',
      bodyFontColor: '#000',
      bodyFontSize: 14,
      displayColors: false
    }
  }
};


function updateFirst(data) {

  try {
    var ctsx = document.getElementById('chart-area').getContext('2d');
    var ctx = document.getElementById("chart-area");

    if (ctx) {
      ctx.height = $(".recent-report .au-card-inner .recent-report__chart").height();
      ctx.style.height = $(".recent-report .au-card-inner .recent-report__chart").height();
    }


    config.data.datasets[0].data[1] = data.data.height;

    window.myPie = new Chart(ctsx, config);


  } catch (e) {

  } finally {

  }

}

function updateSecond(data, data1) {

  config.data.datasets[0].data[1] = data.data.height;
  config.data.datasets[0].data[0] = data1.data.accounts;

  try {

    var ctsx = document.getElementById('chart-area').getContext('2d');
    window.myPie.update();
  } catch (e) {

  }
}

function updateSecondValue(data, data1) {
  updateSecond(data, data1);
}





//DROPDOWN FOR LOGOUT
(function($) {
  // USE STRICT
  "use strict";

  try {
    var menu = $('.js-item-menu');
    var sub_menu_is_showed = -1;

    for (var i = 0; i < menu.length; i++) {
      $(menu[i]).on('click', function(e) {
        e.preventDefault();
        $('.js-right-sidebar').removeClass("show-sidebar");
        if (jQuery.inArray(this, menu) == sub_menu_is_showed) {
          $(this).toggleClass('show-dropdown');
          sub_menu_is_showed = -1;
        } else {
          for (var i = 0; i < menu.length; i++) {
            $(menu[i]).removeClass("show-dropdown");
          }
          $(this).toggleClass('show-dropdown');
          sub_menu_is_showed = jQuery.inArray(this, menu);
        }
      });
    }
    $(".js-item-menu, .js-dropdown").click(function(event) {
      event.stopPropagation();
    });

    $("body,html").on("click", function() {
      for (var i = 0; i < menu.length; i++) {
        menu[i].classList.remove("show-dropdown");
      }
      sub_menu_is_showed = -1;
    });

  } catch (error) {}

  var wW = $(window).width();
  // DESKTOP SIDEBAR
  var right_sidebar = $('.js-right-sidebar');
  var sidebar_btn = $('.js-sidebar-btn');

  sidebar_btn.on('click', function(e) {
    e.preventDefault();
    for (var i = 0; i < menu.length; i++) {
      menu[i].classList.remove("show-dropdown");
    }
    sub_menu_is_showed = -1;
    right_sidebar.toggleClass("show-sidebar");
  });

  $(".js-right-sidebar, .js-sidebar-btn").click(function(event) {
    event.stopPropagation();
  });

  $("body,html").on("click", function() {
    right_sidebar.removeClass("show-sidebar");

  });


  try {
    // PHONE HAMBURGER MENU
    $('.hamburger').on('click', function() {
      $(this).toggleClass('is-active');
      $('.navbar-mobile').slideToggle('500');
    });
    $('.navbar-mobile__list li.has-dropdown > a').on('click', function() {
      var dropdown = $(this).siblings('ul.navbar-mobile__dropdown');
      $(this).toggleClass('active');
      $(dropdown).slideToggle('500');
      return false;
    });
  } catch (error) {}
})(jQuery);



function generateRecentReportsChart(data) {


  var positiveMap = new Object();
  var negativeMap = new Object();

  var labels = [];
  var data1 = [];
  var data2 = [];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var lastMongthPositiveSpike = new Object();
  var lastMongthNegativeSpike = new Object();

  for (var i = 0; i < data.data.length; i++) {
    var t = data.data[i];
    if (t.type !== "credit") continue;
    var date_cal = new Date(t.date * 1000);
    var o = 0.0;
    var g = 0.0;
    try {
      if (positiveMap[monthNames[date_cal.getMonth()]] != null) {
        o = positiveMap[monthNames[date_cal.getMonth()]];
      }

      if (lastMongthPositiveSpike[monthNames[date_cal.getDate() + "." + (date_cal.getMonth() + 1) + "." + date_cal.getFullYear()]] != null) {
        g = lastMongthPositiveSpike[monthNames[date_cal.getDate() + "." + (date_cal.getMonth() + 1) + "." + date_cal.getFullYear()]];
      }
    } catch (e) {}
    lastMongthPositiveSpike[date_cal.getDate() + "." + (date_cal.getMonth() + 1) + "." + date_cal.getFullYear()] = g + parseFloat(t.val);
    positiveMap[monthNames[date_cal.getMonth()]] = (o + parseFloat(t.val));
  }

  for (var i = 0; i < data.data.length; i++) {
    var t = data.data[i];
    if (t.type == "credit") continue;
    var date_cal = new Date(t.date * 1000);
    var o = 0.0;
    var g = 0.0;
    try {
      if (negativeMap[monthNames[date_cal.getMonth()]] != null) {
        o = negativeMap[monthNames[date_cal.getMonth()]];
      }
      if (lastMongthNegativeSpike[date_cal.getDate() + "." + (date_cal.getMonth() + 1) + "." + date_cal.getFullYear()]) {
        g = lastMongthNegativeSpike[date_cal.getDate() + "." + (date_cal.getMonth() + 1) + "." + date_cal.getFullYear()];
      }
    } catch (e) {}

    lastMongthNegativeSpike[date_cal.getDate() + "." + (date_cal.getMonth() + 1) + "." + date_cal.getFullYear()] =
      g + ((t.type === "debit") ? parseFloat(t.val) : parseFloat(t.fee));
    negativeMap[monthNames[date_cal.getMonth()]] = o + ((t.type === "debit") ? parseFloat(t.val) : parseFloat(t.fee));
  }


  Object.size = function(obj) {
    var size = 0,
      key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };


  if (Object.size(negativeMap) <= 1 && Object.size(positiveMap) <= 1) {


    lastMongthPositiveSpike = reverseObject(lastMongthPositiveSpike);



    for (var key in lastMongthPositiveSpike) {
      if (arrayContains(key, labels))
        continue;
      if (Object.size(lastMongthPositiveSpike) <= 1)
        labels.push(key + " ");
      labels.push(key);
    }
    lastMongthNegativeSpike = reverseObject(lastMongthNegativeSpike);
    for (var key in lastMongthNegativeSpike) {
      if (arrayContains(key, labels))
        continue;

      if (Object.size(lastMongthNegativeSpike) <= 1)
        labels.push(key + " ");
      labels.push(key);
    }
    labels.sort(function(a, b) {

      var a1 = a.split(".")[0];
      var b1 = b.split(".")[0];

      return a1 - b1;
    });

    for (var key in lastMongthNegativeSpike) {
      data2[labels.indexOf(key)] = (lastMongthNegativeSpike[key]);
      data2[labels.indexOf(key + " ")] = 0;

      if (!(key in lastMongthPositiveSpike)) {
        data1[labels.indexOf(key)] = 0;
        data1[labels.indexOf(key + " ")] = 0;
      }
    }
    for (var key in lastMongthPositiveSpike) {
      data1[labels.indexOf(key)] = (lastMongthPositiveSpike[key]);
      data1[labels.indexOf(key + " ")] = 0;

      if (!(key in lastMongthNegativeSpike)) {
        data2[labels.indexOf(key)] = 0;
        data2[labels.indexOf(key + " ")] = 0;
      }
    }


  } else {
    positiveMap = reverseObject(positiveMap);
    for (var key in positiveMap) {
      if (arrayContains(key, labels))
        continue;
      labels.push(key);
    }

    negativeMap = reverseObject(negativeMap);
    for (var key in negativeMap) {
      if (arrayContains(key, labels))
        continue;
      labels.push(key);
    }

    labels.sort(function(a, b) {
      return monthNames.indexOf(a) > monthNames.indexOf(b);
    });

    for (var d = 0; d < labels.length; d++) {
      data1.push(0);
      data2.push(0);
    }
    for (var key in negativeMap) {
      data2[labels.indexOf(key)] = (negativeMap[key]);
    }
    for (var key in positiveMap) {
      data1[labels.indexOf(key)] = (positiveMap[key]);
    }
  }
  reloadChart(data1, data2, labels);
}