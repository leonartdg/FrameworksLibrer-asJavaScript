//Animacion de titulo
function go(){$(".main-titulo").animate({color:"yellow"}, "slow", function(){ come() } )}
function come(){$(".main-titulo").animate({color:"white"}, "slow", function(){ go() })}
go();


//Tablero
function insertarImg(GameArr, i) {

  var Col1 = $('.col-1').children();
  var Col2 = $('.col-2').children();
  var Col3 = $('.col-3').children();
  var Col4 = $('.col-4').children();
  var Col5 = $('.col-5').children();
  var Col6 = $('.col-6').children();
  var Col7 = $('.col-7').children();

  var cCols = $([Col1, Col2, Col3, Col4, Col5, Col6, Col7]);

  if (typeof i === 'number') {
    var cFila = $([Col1.eq(i), Col2.eq(i), Col3.eq(i), Col4.eq(i), Col5.eq(i), Col6.eq(i),Col7.eq(i)]);
  } else {
    i = '';
  }

  if (GameArr === 'cCols') {
    return cCols;
  } else if (GameArr === 'rows' && i !== '') {
    return cFila;
  }
}

//Crear Filas
function cFilas(i) {
  var cFila = insertarImg('rows', i);
  return cFila;
}

//Crear Columnas
function cCols(i) {
  var Column = insertarImg('cCols');
  return Column[i];
}

//Busqueda de columnas
function ColV() {
  for (var j = 0; j < 7; j++) {
    var counter = 0;
    var cPosition = [];
    var extraPosition = [];
    var Column = cCols(j);
    var comparar = Column.eq(0);
    var grieta = false;
    for (var i = 1; i < Column.length; i++) {
      var srcComparar = comparar.attr('src');
      var srcFigure = Column.eq(i).attr('src');

      if (srcComparar != srcFigure) {
        if (cPosition.length >= 3) {
          grieta = true;
        } else {
          cPosition = [];
        }
        counter = 0;
      } else {
        if (counter == 0) {
          if (!grieta) {
            cPosition.push(i-1);
          } else {
            extraPosition.push(i-1);
          }
        }
        if (!grieta) {
          cPosition.push(i);
        } else {
          extraPosition.push(i);
        }
        counter += 1;
      }
      comparar = Column.eq(i);
    }
    if (extraPosition.length > 2) {
      cPosition = $.merge(cPosition, extraPosition);
    }
    if (cPosition.length <= 2) {
      cPosition = [];
    }
    cPoint = cPosition.length;
    if (cPoint >= 3) {
      eliminarCol(cPosition, Column);
      Point(cPoint);
    }
  }
}

//Añadir clase delete a Columna
function eliminarCol(cPosition, Column) {
  for (var i = 0; i < cPosition.length; i++) {
    Column.eq(cPosition[i]).addClass('delete');
  }
}

//Busqueda de filas
function FilaV() {
  for (var j = 0; j < 6; j++) {
    var counter = 0;
    var cPosition = [];
    var extraPosition = [];
    var cFila = cFilas(j);
    var comparar = cFila[0];
    var grieta = false;
    for (var i = 1; i < cFila.length; i++) {
      var srcComparar = comparar.attr('src');
      var srcFigure = cFila[i].attr('src');

      if (srcComparar != srcFigure) {
        if (cPosition.length >= 3) {
          grieta = true;
        } else {
          cPosition = [];
        }
        counter = 0;
      } else {
        if (counter == 0) {
          if (!grieta) {
            cPosition.push(i-1);
          } else {
            extraPosition.push(i-1);
          }
        }
        if (!grieta) {
          cPosition.push(i);
        } else {
          extraPosition.push(i);
        }
        counter += 1;
      }
      comparar = cFila[i];
    }
    if (extraPosition.length > 2) {
      cPosition = $.merge(cPosition, extraPosition);
    }
    if (cPosition.length <= 2) {
      cPosition = [];
    }
    cPoint = cPosition.length;
    if (cPoint >= 3) {
      eliminarFila(cPosition, cFila);
      Point(cPoint);
    }
  }
}

//Añadir clase delete a Fila
function eliminarFila(cPosition, cFila) {
  for (var i = 0; i < cPosition.length; i++) {
    cFila[cPosition[i]].addClass('delete');
  }
}

//Establece puntos
function Point(cPoint) {
  var score = Number($('#score-text').text());
  switch (cPoint) {
    case 3:
      score += 25;
      break;
    case 4:
      score += 50;
      break;
    case 5:
      score += 75;
      break;
    case 6:
      score += 100;
      break;
    case 7:
      score += 200;
  }
  $('#score-text').text(score);
}

//Llenar tablero
function Btabla() {
    llenar();
}

//arreglo de imagenes
var img=[];
img[0]='image/1.png';
img[1]='image/2.png';
img[2]='image/3.png';
img[3]='image/4.png';

// //Numero aleatorio
function NumeroAleatorio(){
var nImg = Math.floor(Math.random()*4);
return img[nImg];
}

function llenar() {
  var top = 6;
  var column = $('[class^="col-"]');

  column.each(function() {
    var Figure = $(this).children().length;
    var agrega = top - Figure;
    for (var i = 0; i < agrega; i++) {
      var imgAleatoria = NumeroAleatorio();
      if (i == 0 && Figure < 1) {
        $(this).append('<img src="'+imgAleatoria+'" class="element"></img>');
      } else {
        $(this).find('img:eq(0)').before('<img src="'+imgAleatoria+'" class="element"></img>');
      }
    }
  });
  addEvents();
  ColFilaV();
}

//Busqueda de Fila y Columna
function ColFilaV() {
  ColV();
  FilaV();
  if ($('img.delete').length != 0) {
    animacionEliminar();
  }
}

//Añadir eventos
function addEvents() {
  $('img').draggable({
    containment: '.panel-tablero',
    droppable: 'img',
    revert: true,
    revertDuration: 500,
    grid: [100, 100],
    zIndex: 10,
    drag: limitarMovimiento
  });
  $('img').droppable({
    drop: intercambiar
  });
  enableEvents();
}

function disableEvents() {
  $('img').draggable('disable');
  $('img').droppable('disable');
}

function enableEvents() {
  $('img').draggable('enable');
  $('img').droppable('enable');
}

//Limites de movimiento
function limitarMovimiento(event, arrastrar) {
  arrastrar.position.top = Math.min(100, arrastrar.position.top);
  arrastrar.position.bottom = Math.min(100, arrastrar.position.bottom);
  arrastrar.position.left = Math.min(100, arrastrar.position.left);
  arrastrar.position.right = Math.min(100, arrastrar.position.right);
}

//Movimiento y Cambio
function intercambiar(event, arrastrar) {
  var arrastrar = $(arrastrar.draggable);
  var arrastrarSrc = arrastrar.attr('src');
  var soltar = $(this);
  var soltarSrc = soltar.attr('src');
  arrastrar.attr('src', soltarSrc);
  soltar.attr('src', arrastrarSrc);

  setTimeout(function() {
    Btabla();
    if ($('img.delete').length == 0) {
      arrastrar.attr('src', arrastrarSrc);
      soltar.attr('src', soltarSrc);
    } else {
      ActMov();
    }
  }, 500);

}

function BtablaPromise(result) {
  if (result) {
    Btabla();
  }
}

//Actualizar valores de movimineto
function ActMov() {
  var actualValue = Number($('#movimientos-text').text());
  var result = actualValue += 1;
  $('#movimientos-text').text(result);
}

//Animacion siguiente
function animacionEliminar() {
  disableEvents();
  $('img.delete').effect('pulsate', 1000);
  $('img.delete').animate({
    opacity: '0'
  },{
    duration: 800
  }
  )
  .animate({
    opacity: '0'
  }
  ,
  {
    duration: 1000,
    complete: function() {
      eliminarFigure()
        .then(BtablaPromise)
        .catch(ErrorPromise)
    },
    queue: true
  }
  )
}

function ErrorPromise(error) {
  console.log(error);
}

//Eliminar  figura
function eliminarFigure() {
  return new Promise(function (resolve, reject) {
    if($('img.delete').remove()) {
      resolve(true);
    } else {
      reject('No se pueden eliminar');
    }
  })
}

//Terminar Juego
function finalizar() {
  $('div.panel-tablero, div.time').effect('fold');
  $('h1.main-titulo').addClass('titulo-over')
  .text('Juego terminado');
  $('div.score, div.moves, div.panel-score').width('100%');
}

//Comenzar Juego
function iniciarF() {

  $('.btn-reinicio').click(function() {
    if ($(this).text() == 'Reinicio') {
      location.reload(true);
    }
    Btabla();
    $(this).text('Reinicio');
    $('#timer').startTimer({
      onComplete: finalizar
    })
  });
}

//IniciarFuncion
$(function() {
  iniciarF();
});