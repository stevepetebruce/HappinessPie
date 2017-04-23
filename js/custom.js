(function (window, document) {
  if (!document.querySelector || !window.addEventListener) {
    return;
  }


  // animated Logo
  // node = animateReplace(node, 'animate');
  function animateReplace(node, className) {
    const clone = node.cloneNode(true);
    clone.classList.add(className);
    node.parentNode.replaceChild(clone, node);
    return clone;
  };

  let letters = document.querySelector('.logo');

  letters.addEventListener('mouseover', function handler() {
    letters = animateReplace(letters, 'run-animation');
    letters.addEventListener('mouseover', handler, false);
  }, false);

  const colours = {
    money: '#61BB46',
    projects: '#FDB827',
    friends: '#F5821F',
    learning: '#E03A3E',
    health: '#963D97',
    service: '#009DDC',
    pleasure: '#117DFF'
  };


  const pies = JSON.parse(localStorage.getItem('pies')) || [];
  const slider = document.querySelector('#slider-color');
  const createPies = document.querySelector('.add-pies');
  const piesList = document.querySelector('.card-list');
  const avBut = document.querySelector('.average-but');


  noUiSlider.create(slider, {
    start: [14, 28, 42, 56, 70, 85],
    connect: [true, true, true, true, true, true, true],
    range: {
      min: [0],
      max: [100],
    },
    margin: 4, // Handles must be at least 4 apart
    pips: { // Show a scale with the slider
      mode: 'steps',
      stepped: true,
      density: 5,
    },
  });

  const connect = slider.querySelectorAll('.noUi-connect');
  const classes = ['c-1-color', 'c-2-color', 'c-3-color', 'c-4-color', 'c-5-color', 'c-6-color', 'c-7-color'];

  for (let i = 0; i < connect.length; i++) {
    connect[i].classList.add(classes[i]);
  }


    // slider update values
  slider.noUiSlider.on('update', (values) => {
    const keys = [Math.round(values[0]), Math.round(values[1] - values[0]), Math.round(values[2] - values[1]), Math.round(values[3] - values[2]), Math.round(values[4] - values[3]), Math.round(values[5] - values[4]), Math.round(100 - values[5])];
    const segments = document.querySelectorAll('.keys');
    for (let i = 0; i < segments.length; i++) {
      segments[i].textContent = `${keys[i]}%`;
    }
    const bubbles = document.querySelectorAll('.bubble');
    for (let i = 0; i < bubbles.length; i++) {
      bubbles[i].classList.add(classes[i]);
      const bubbleSize = (keys[i] * 2) + 30;
      bubbles[i].style.maxWidth = `${bubbleSize}px`;
      bubbles[i].style.height = `${bubbleSize}px`;
      bubbles[i].style.paddingTop = `${(bubbleSize / 2) - 15}px`;

      if (bubbleSize > 50) {
        bubbles[i].innerHTML = "<img src='img/happy.svg' width='30px' height='30px'>";
      } else {
        bubbles[i].innerHTML = "<img src='img/sad.svg' width='30px' height='30px'>";
      }
    }
  });

    // Create Pie Chart
  function createPie(e) {
    e.preventDefault();
    const strArray = slider.noUiSlider.get();
    const pieArray = strArray.map(Number);

        // simple date
    const dateObj = new Date();
    const month = dateObj.getMonth() + 1; // months from 1-12
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    const d = `${year}/${month}/${day}`;

        // slider range
    pieArray[6] = Math.round(100 - pieArray[5]);
    pieArray[5] = Math.round(pieArray[5] - pieArray[4]);
    pieArray[4] = Math.round(pieArray[4] - pieArray[3]);
    pieArray[3] = Math.round(pieArray[3] - pieArray[2]);
    pieArray[2] = Math.round(pieArray[2] - pieArray[1]);
    pieArray[1] = Math.round(pieArray[1] - pieArray[0]);
    pieArray[0] = Math.round(100 - (pieArray[1] + pieArray[2] + pieArray[3] + pieArray[4] + pieArray[5] + pieArray[6]));

    const pie = {
      date: d,
      pie: pieArray,
    };

    const lastElement = pies[0] || [];
    const newDate = pie.date.valueOf();
    const lastDate = lastElement.date;

    // Chect if two inputs in one day
    if (newDate !== lastDate) {
      pies.unshift(pie);
    } else {
      const alertMsg = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <strong>Sorry.</strong> You have already made an entry today. Please try again tomorrow.
                        </div>`;

      document.querySelector('.alert').innerHTML = alertMsg;
    }
    localStorage.setItem('pies', JSON.stringify(pies));
    populateList(pies, piesList);
    slider.noUiSlider.reset();
  }


    // Chart.js
  function pieChart() {
    for (let i = 0; i < pies.length; i++) {
      const CHART = document.querySelector(`#pieChart${i}`);

      const data = {
        labels: [
          'Money and finances',
          'Professional projects',
          'Friends and social ties',
          'Learning and growth',
          'Health and fitness',
          'Service and contribution',
          'Pleasure and fun',
        ],
        datasets: [
          {
            data: pies[i].pie,
            backgroundColor: [
              colours.money,
              colours.projects,
              colours.friends,
              colours.learning,
              colours.health,
              colours.service,
              colours.pleasure
            ],
            hoverBackgroundColor: [
              colours.money,
              colours.projects,
              colours.friends,
              colours.learning,
              colours.health,
              colours.service,
              colours.pleasure            ],
          }],
      };


      const pieChart = new Chart(CHART, {
        type: 'pie',
        data,
        options: {
          animation: {
            animateScale: false,
            animateRotate: false,
          },
          legend: {
            display: false,
          },
        },
      });
    }
  }


    // Display pie charts
  function populateList(cards, cardList) {
    cardList.innerHTML = cards.map((pie, i) => `<div class="col-lg-6 col-md-6 col-lg-4 col-xl-3 card">
                           <canvas id="pieChart${i}" width="200" height="200"></canvas>
                           <p class="card-text" id="result">Date Created: ${pie.date}</p>
                           <button type="button" class="btn btn-secondary btn-sm delete-but" data-index="${i}">Delete</button>
                       </div>`).join('');

    cards.length < 2 ? avBut.style.visibility = 'hidden' : avBut.style.visibility = 'visible'; // hide average button if less than 2 pies

    pieChart();
  }

    // Remove pie Chart
  function removePie(e) {
    e.preventDefault();
    if (e.target.className !== 'btn btn-secondary btn-sm delete-but') return; // Event delegation
    const index = e.target.dataset.index;
    pies.splice(index, 1);
    localStorage.setItem('pies', JSON.stringify(pies));

    populateList(pies, piesList);
  }

    // Calculate average of all pie charts
  function averagePie() {
    const average = pies.reduce((acc, obj, a) => {
      const len = pies.length;
      const arraylen = obj.pie.length;
      for (let i = 0; i < arraylen; i++) {
        acc[i] += obj.pie[i];
      }
      if (a === len - 1) {
        for (let i = 0; i < arraylen; i++) {
          acc[i] /= len;
        }
      }
      return acc;
    }, [0, 0, 0, 0, 0, 0, 0]).map(eachElement => Math.round(eachElement));

    // Create average pie chart
    const AVCHART = document.querySelector('#pieAverage');

    const avData = {
      labels: [
        'Money and finances',
        'Professional projects',
        'Friends and social ties',
        'Learning and growth',
        'Health and fitness',
        'Service and contribution',
        'Pleasure and fun',
      ],
      datasets: [
        {
          data: average,
          backgroundColor: [
            colours.money,
            colours.projects,
            colours.friends,
            colours.learning,
            colours.health,
            colours.service,
            colours.pleasure
          ],
          hoverBackgroundColor: [
            colours.money,
            colours.projects,
            colours.friends,
            colours.learning,
            colours.health,
            colours.service,
            colours.pleasure
          ],
        }],
    };

    new Chart(AVCHART, {
      type: 'pie',
      data: avData,
      options: {
        animation: {
          animateScale: false,
          animateRotate: false,
        },
      },
    });
  }

  createPies.addEventListener('submit', createPie);

  piesList.addEventListener('click', removePie);

  avBut.addEventListener('click', averagePie);


  populateList(pies, piesList);

}(this, this.document));
