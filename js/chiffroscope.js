/* Paper scene */
// Global variables
var nbcolumn = 3
var columnHeight = paper.view.bounds.height/6  // (fixed in css : 1000px/6)
var marginNavbar = 60
var fontSize = 40

var gridColor = '#91A8D0'
var pinkColorCard = '#F0DEE4'
var pinkStrokeColor = '#D8A9B9'
var greenColorCard = '#DCECD3'
var greenStrokeColor = '#88BE69'
var strokeWidth = 3

// when view is resized...
paper.view.onResize = function() { drawApp(paper.view.bounds, nbcolumn) }

/* Html scene */
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

/* Interaction html <-> canvas */
var minusButton = document.getElementById('minusButton')
var plusButton = document.getElementById('plusButton')
var unityButton = document.getElementById('unityButton')
var numberButton = document.getElementById('numberButton')
var numberInput = document.getElementById('numberInput')
var showNumberSwitch = document.getElementById('showNumberSwitch')

minusButton.onclick = function() {
    nbcolumn--
    nbcolumn = Math.max(2, nbcolumn)
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
        path.strokeColor = gridColor
        path.strokeWidth = strokeWidth
    }
    var from = new Point(0, columnHeight + marginNavbar)
    var to = new Point(parperSize.width, columnHeight + marginNavbar)
    var path = new Path.Line(from, to)
    path.strokeColor = gridColor
    path.strokeWidth = strokeWidth

    // testing
    new Card(50, 100, "Dizaines de milliers", columnWitdh)
    new Card(250, 300, "1", columnWitdh)
    new Card(550, 300, "unité", columnWitdh)
    new Card(550, 500, "123", columnWitdh)
}

/* Card */
var Card = Base.extend({

    initialize: function(x, y, value, columnWitdh) {

        var cardWidth = columnWitdh*0.7
        var cardHeight = columnHeight*0.7
        this.value = value
        this.fillColor = pinkColorCard
        this.strokeColor = pinkStrokeColor
        if(isNaN(value)) { 
            this.fillColor = greenColorCard
            this.strokeColor = greenStrokeColor
         }
        
        this.path = new Path.Rectangle({
            topLeft: [x, y],
               bottomRight: [x + cardWidth, y + cardHeight],
               radius: 10,
               strokeWidth: strokeWidth,
               fillColor: this.fillColor,
               strokeColor: this.strokeColor
           })

        this.text = new PointText(new Point(x + cardWidth/2,y + cardHeight/1.6));
        this.text.justification = 'center';
        this.text.fillColor = 'black';
        this.text.fontSize = fontSize
        this.text.content = value

        //scaling the text if too long
        var textWidth = this.text.bounds.width
        var textNumberOfCharacters = value.toString().length
        this.scale = 1
        if(textNumberOfCharacters > cardWidth/(fontSize*0.69)) { this.scale = cardWidth*0.9/textWidth }
        this.text.scale(this.scale)

        this.cardGroup = new Group();
        this.cardGroup.addChild(this.path)
        this.cardGroup.addChild(this.text)
        this.cardGroup.bringToFront()

        var that = this
        var wasMoving = false

        this.cardGroup.onMouseDown = function(event) {
            that.cardGroup.bringToFront()
            wasMoving = false
        }

        this.cardGroup.onMouseUp = function(event) {
            if(!wasMoving) { 
                if (that.text.content == '?') { 
                    that.text.content = value
                    that.text.scale(that.scale)
                 } else { 
                     that.text.content = '?'
                     that.text.scale(1/that.scale)
                    }
             }
             that.cardGroup.shadowColor = null;
        }

        this.cardGroup.onMouseDrag = function(event) { 
            that.cardGroup.shadowColor = new Color(0, 0, 0);
            that.cardGroup.shadowBlur = 12;
            that.cardGroup.shadowOffset = new Point(5, 5);
            that.cardGroup.bringToFront()
            that.cardGroup.position += event.delta;
            wasMoving = true
        }

        return this.cardGroup
    }})