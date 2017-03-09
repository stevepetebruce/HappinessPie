(function (win, doc) {

    'use strict';

    if (!doc.querySelector || !win.addEventListener) {
        return;
    }

    const pies = [];
    const slider = document.querySelector('#slider-color');
    const createPies = document.querySelector('.add-pies');
    const piesList = document.querySelector('.pies-list');

    noUiSlider.create(slider, {
        start: [ 20, 40, 60, 80 ],
        connect: [true, true, true, true, true],
        range: {
            'min': [ 0 ],
            'max': [ 100 ]
        },
        margin: 10, // Handles must be at least 10 apart
        pips: { // Show a scale with the slider
            mode: 'steps',
            stepped: true,
            density: 5
        }
    });

    const connect = slider.querySelectorAll('.noUi-connect');
    const classes = ['c-1-color', 'c-2-color', 'c-3-color', 'c-4-color', 'c-5-color'];

    for ( var i = 0; i < connect.length; i++ ) {
        connect[i].classList.add(classes[i]);
    }

    populateList(pies, piesList);



    // slider update values
    slider.noUiSlider.on('update', function( values ) {
        const keys = [ Math.round(values[0]), Math.round(values[1] - values[0]), Math.round(values[2] - values[1]), Math.round(values[3] - values[2]), Math.round(100 - values[3]) ];

        const segments = document.querySelectorAll('.keys');
        for (i = 0; i < segments.length; i++) {
            segments[i].textContent = keys[i] + "%";
        }
        const bubbles = document.querySelectorAll('.bubble');
        for (i = 0; i < bubbles.length; i++) {
            bubbles[i].classList.add(classes[i]);
            const bubbleSize = (keys[i] * 2) + 30;
            bubbles[i].style.maxWidth = bubbleSize + "px";
            bubbles[i].style.height = bubbleSize + "px";
            bubbles[i].style.paddingTop = (bubbleSize / 2) -15 + "px";

            if(bubbleSize > 65) {
                bubbles[i].innerHTML = "<img src='http://simpleicon.com/wp-content/uploads/smile.svg' width='30px' height='30px'>";
            } else {
                bubbles[i].innerHTML = "<img src='http://simpleicon.com/wp-content/uploads/sad.svg' width='30px' height='30px'>";
            }
        }
    });


    function createPie(e) {
        e.preventDefault();
        const strArray = slider.noUiSlider.get();
        const pieArray = strArray.map(Number);

        // simple date
        const dateObj = new Date();
        const month = dateObj.getMonth() + 1; //months from 1-12
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();
        const d = `${year}/${month}/${day}`;

        // slider range
        pieArray[4] = Math.round(100 - pieArray[3]);
        pieArray[3] = Math.round(pieArray[3] - pieArray[2]);
        pieArray[2] = Math.round(pieArray[2] - pieArray[1]);
        pieArray[1] = Math.round(pieArray[1] - pieArray[0]);
        pieArray[0] = Math.round(100 - (pieArray[1] + pieArray[2] + pieArray[3] + pieArray[4]));

        const pie = {
            date: d,
            pie: pieArray
        };

        const lastElement = pies[pies.length - 1] || [];
        const newDate = pie.date.valueOf();
        const lastDate = lastElement.date;


        if(newDate !== lastDate) {
            pies.push(pie);
        } else {
            alert('Already entered today');
        }
        localStorage.setItem("pies", JSON.stringify(pies));
        populateList(pies, piesList);
        slider.noUiSlider.reset();
    }

    createPies.addEventListener('submit', createPie);



    function populateList(pies = [], piesList){
        piesList.innerHTML =  pies.map((pie, i) => {
            return`<div class="card">
                       <img data-src="holder.js/100px280/thumb" alt="Card image cap">
                       <p class="card-text" id="result">Date Created: ${pie.date}</p>
                   </div>`;
        });
    }


}(this, this.document));