/* paper scene */
var nbcolumn = 3
var columnHeight = paper.view.bounds.height/6  // (fixed in css : 1000px/6)

// when view is resized...
paper.view.onResize = function() { drawApp(paper.view.bounds, nbcolumn) }

/* html scene */
var html =  '<nav class="navbar fixed-top navbar-light bg-light">' +
                '<div class="container-fluid">' +
                    '<a class="navbar-brand" href="#">Chiffroscope</a>' +

                    '<div class="btn-group">' +
                        '<button class="btn btn-outline-info" data-toggle="tooltip" data-placement="bottom" title="Moins de colonnes" id="minusButton">' +
                            '<i class="fa-solid fa-minus"></i>' +
                        '</button>' +
                        '<button class="btn btn-outline-success" data-toggle="tooltip" data-placement="bottom" title="Tirage au hasard d\'une unité de numération" id="unityButton">' +
                            '<i class="fa-solid fa-coins"></i>' +
                        '</button>' +
                        '<button class="btn btn-outline-success" data-toggle="tooltip" data-placement="bottom" title="Tirage au hasard d\'un nombre" id="numberButton">' +
                            '<i class="fa-solid fa-hand-sparkles"></i>' +
                        '</button>' +
                        '<button class="btn btn-outline-danger" data-toggle="tooltip" data-placement="bottom" title="Plus de colonnes" id="plusButton">' +
                            '<i class="fa-solid fa-plus"></i>' +
                        '</button>' +
                    '</div>' +

                    '<div class="d-flex">' +
                        '<input id="numberInput" class="form-control me-2" type="search" data-toggle="tooltip" data-placement="left" title="Entrez un nombre ou une unité de numération (u, 10u, 1000u)" >' +
                    '</div>' +
                    
                    '<div class="form-check form-switch">' +
                        '<input id="showNumberSwitch" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckCheckedDisabled" style="transform: scale(1.8);" >' +
                        '<label class="form-check-label" for="flexSwitchCheckCheckedDisabled" style="padding-left: 10px;">Voir la réponse</label>' +
                    '</div>' +
                '</div>' +
            '</nav>'

var div = document.createElement('div')
div.innerHTML = html
document.body.insertBefore(div, document.body.firstChild);

/* interaction html <-> canvas */

var minusButton = document.getElementById('minusButton')
var plusButton = document.getElementById('plusButton')
var unityButton = document.getElementById('unityButton')
var numberButton = document.getElementById('numberButton')
var numberInput = document.getElementById('numberInput')
var showNumberSwitch = document.getElementById('showNumberSwitch')

minusButton.onclick = function() {
    nbcolumn--
    drawApp(paper.view.bounds, nbcolumn)
}
plusButton.onclick = function() {
    nbcolumn++
    drawApp(paper.view.bounds, nbcolumn)
}
unityButton.onclick = function() { console.log('unityButton')}
numberButton.onclick = function() { console.log('numberButton')}
numberInput.addEventListener('keyup', function(event) {
    if(event.key == 'Enter') {
        console.log(numberInput.value)
        numberInput.value = ''
    }
})
showNumberSwitch.addEventListener('change', function() { console.log('showNumberSwitch') })

//function keyup(event) { window.dispatchEvent(new Event('keyup')); }
//function change(event) { window.dispatchEvent(new Event('change')); }

function drawApp(parperSize, nbcolumn) {

    project.clear()

    var columnWitdh = parperSize.width/(nbcolumn +1)
    for(var j=0; j<nbcolumn +1;j++) {
        var from = new Point(columnWitdh/2 + columnWitdh*j, 0)
        var to = new Point(columnWitdh/2 + columnWitdh*j, parperSize.height*1.5)
        var path = new Path.Line(from, to)
        path.strokeColor = '#91A8D0'
        path.strokeWidth = 3
    }
    var from = new Point(0, columnHeight)
    var to = new Point(parperSize.width, columnHeight)
    var path = new Path.Line(from, to)
    path.strokeColor = '#91A8D0'
    path.strokeWidth = 3
}