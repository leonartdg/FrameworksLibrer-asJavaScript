//Variables
var col= 7;
var fil= 7;
var arr= [];
var mov= 0;
var poi= 0;
var val= 0;

function game(f,c,obj,src) {
return {
f: f,
c: c, 
src:src, 
locked:false, 
isInCombo:false, 
o:obj 
}
}

//Animacion de titulo
function go(){$(".main-titulo").animate({color:"yellow"}, "slow", function(){ come() } )}
function come(){$(".main-titulo").animate({color:"white"}, "slow", function(){ go() })}

go();

//arreglo de imagenes
var img=[];
img[0]='image/1.png';
img[1]='image/2.png';
img[2]='image/3.png';
img[3]='image/4.png';

//Numero aleatorio
function NumeroAleatorio(){
	var nImg = Math.floor(Math.random()*4);
	return img[nImg];
}

//Tablero
for (var f = 0; f < fil; f++) {
	arr[f]=[];
	for (var c =0; c< col; c++) {
		arr[f][c]= new game(f,c,null,NumeroAleatorio());
	}
}

//Coordenadas:
var w = $('.panel-tablero').width();
var h = $('.panel-tablero').height(); 
var cw = w / 7;
var ch= h/ 7;
var mw = cw/7;
var mh = ch/7;

//Insertar imagenes
for (var f = 0; f < fil; f++) {
for (var c =0; c< col; c++) {
  var ob = $("<img class='candy' id='candy_"+f+"_"+c+"' r='"+f+"' c='"+c+
    "'ondrop='_onDrop(event)' ondragover='_onDragOverEnabled(event)'src='"+
    arr[f][c].src+"' style='height:"+ch+"px'/>");
  ob.attr("ondragstart","_ondragstart(event)");
  $(".col-"+(c+1)).append(ob);
  arr[f][c].o = ob;
}
}



var timer = new Timer({tick : 1,ontick : function (ms) {
	function addZ(n){return (n<10? '0':'') + n;}
			var s = Math.trunc((ms/1000)%60);
			var m = Math.trunc(ms/60000);
	$("#timer").text(addZ(m) + ':' + addZ(s))
    },
    onstart : function() {
    	$("#timer").text('01:59');
		$('button.btn-reinicio').html("REINICIAR");},
    onend : function() {
    	$("#timer").text('00:00');
    	alert('Time up!');
    	clearInterval(timer);
    }	
});

$('button.btn-reinicio').on('click',function(){
i=0;
poi=0;
mov=0;
$(".panel-score").css("width","25%");
$("#score-text").html("0");
$("#movimientos-text").html("0");
timer.start(120);
});

//-------------------------------------------------------------------------------------------------

function _ondragstart(a){
a.dataTransfer.setData("text/plain", a.target.id);
}

// cuando se mueve una gema por encima de otra sin soltarla 
function _onDragOverEnabled(e){
 e.preventDefault();
 console.log("pasando sobre caramelo " + e.target.id);
}
       
// cuando soltas una gema sobre otra
function _onDrop(e){
  // solo para firefox
  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  if (isFirefox) {
    console.log("firefox compatibility");
    e.preventDefault();
  }

 // obtener origen del candy
 var src = e.dataTransfer.getData("text");
 var sr = src.split("_")[1];
 var sc = src.split("_")[2];

 // obtener destino del candy
 var dst = e.target.id;
 var dr = dst.split("_")[1];
 var dc = dst.split("_")[2];

 // si la distancia es mayor a 1, no permitir el movimiento y alertar
 var ddx = Math.abs(parseInt(sr)-parseInt(dr));
 var ddy = Math.abs(parseInt(sc)-parseInt(dc));
 if (ddx > 1 || ddy > 1)
 {
   alert("Los movimientos no pueden tener una distancia mayor a 1");
   return;
 }
 else{
    console.log("intercambio " + sr + "," + sc+ " to " + dr + "," + dc);
    // intercambio de gemas
    var tmp = arr[sr][sc].src;
    arr[sr][sc].src = arr[dr][dc].src;
    arr[sr][sc].o.attr("src",arr[sr][sc].src);
    arr[dr][dc].src = tmp;
    arr[dr][dc].o.attr("src",arr[dr][dc].src);

    // sumar un movimiento a mi cantidad
    mov+=1;
    $("#movimientos-text").html(mov);

    //buscar combinaciones
    eliminar(); 
    
 }


}

//-----------------------------------------

      function eliminar()
      {    
      
       // busqueda horizontal
      
      
        for (var f = 0; f < fil; f++)
        {           
        
        
          var prevCell = null;
          var figureLen = 0;
          var figureStart = null;
          var figureStop = null;
          
          for (var c=0; c< col; c++)
          {
          
            // saltear candys locked o que estan en combo.    
            if (arr[f][c].locked || arr[f][c].isInCombo)
            {
              figureStart = null;
              figureStop = null;
              prevCell = null;  
              figureLen = 1;
              continue;
            }
            
            // primer objeto del combo
            if (prevCell==null) 
            {
              prevCell = arr[f][c].src;
              figureStart = c;
              figureLen = 1;
              figureStop = null;
              continue;
            }
            else
            {
              // segundo o posterior objeto del combo
              var curCell = arr[f][c].src;
              if (!(prevCell==curCell))
              {
                prevCell = arr[f][c].src;
                figureStart = c;
                figureStop=null;
                figureLen = 1;
                continue;
              }
              else
              {
                // incrementar combo
                figureLen+=1;
                if (figureLen==3)
                {
                  val+=1;
                  poi+=10;
                  $("#score-text").html(poi);
                  figureStop = c;
                  console.log("Combo de columna " + figureStart + " a columna " + figureStop);
                  for (var ci=figureStart;ci<=figureStop;ci++)
                  {
                     
                    arr[f][ci].isInCombo=true;
                    arr[f][ci].src=null;                     
                  }
                  prevCell=null;
                  figureStart = null;
                  figureStop = null;
                  figureLen = 1;
                  continue;
                }
              }
            }
                  
          }
        }
        
       // busqueda vertical
      
      
        for (var c=0; c< col; c++)
        {              
          var prevCell = null;
          var figureLen = 0;
          var figureStart = null;
          var figureStop = null;
          
          for (var f = 0; f < fil; f++)
          {
            
            if (arr[f][c].locked || arr[f][c].isInCombo)
            {
              figureStart = null;
              figureStop = null;
              prevCell = null;  
              figureLen = 1;
              continue;
            }
            
            if (prevCell==null) 
            {
              prevCell = arr[f][c].src;
              figureStart = f;
              figureLen = 1;
              figureStop = null;
              continue;
            }
            else
            {
              var curCell = arr[f][c].src;
              if (!(prevCell==curCell))
              {
                prevCell = arr[f][c].src;
                figureStart = f;
                figureStop=null;
                figureLen = 1;
                continue;
              }
              else
              {
                figureLen+=1;
                if (figureLen==3)
                {
                  val+=1;
                  poi+=10;
                  $("#score-text").html(poi);
                  figureStop = f;
                  console.log("Combo de fila " + figureStart + " a fila " + figureStop );
                  for (var ci=figureStart;ci<=figureStop;ci++)
                  {
                     
                    arr[ci][c].isInCombo=true;
                    arr[ci][c].src=null;         
                  }
                  prevCell=null;
                  figureStart = null;
                  figureStop = null;
                  figureLen = 1;
                  continue;
                }
              }
            }
                  
          }
        }
        
        
        // destruir combos
        
         var isCombo=false;
         for (var f = 0;f<fil;f++)
          for (var c=0;c<col;c++)
            if (arr[f][c].isInCombo)
            { 
              console.log("Combo disponible");
              isCombo=true; 
              // ACÁ FALTA LA ANIMACIÓN NADA MÁS, Y ESTARIA BIEN
               reponer() // aca funciona bien 
            }
            
        if (isCombo)  // Acá no entra nunca, el metodo lo termina llamando al final del reponer
          desaparecerCombos();
        else 
        console.log("No más combos automáticos");
        
                          
        
      }
    
      //desaparecer candys borrados
      function desaparecerCombos()
      {
         for (var r=0;f<fil;f++)  { 
          for (var c=0;c<col;c++){
            if (arr[f][c].isInCombo)  // celda vacia
            {
              arr[f][c].o.animate({
                opacity:0
              },slow);
            } 
          }   
        } 

        // ACÁ ES DONDE DEBERIA IR EL REPONER() PERO NO ES LLAMADO NUNCA
     //   $("[style*='opacity: 0']").promise().done(function() {
      //       reponer();
      //  });     
      
      }
      
   
      
      function reponer() {
          // mover celdas vacias hacia arriba
         for (var f=0;f<fil;f++)
         {           
          for (var c=0;c<col;c++)
          {  
            if (arr[f][c].isInCombo)  // celda vacia
            {
              arr[f][c].o.attr("src","");
                // deshabilitar cerlda del combo               
              arr[f][c].isInCombo=false;
               
              for (var sr=f;sr>=0;sr--)
              {
                if (sr==0) break; 
                if (arr[sr-1][c].locked) break;       
                var tmp = arr[sr][c].src;
                arr[sr][c].src=arr[sr-1][c].src;
                arr[sr-1][c].src=tmp;
              }
            } 
          }  
        }   
                          
          // reordenando y reponiendo celdas
          for (var f=0;f<fil;f++)
          { for (var c = 0;c<col;c++)
            {
              arr[f][c].o.attr("src",arr[f][c].src);
              arr[f][c].o.css("opacity","1"); // acá podria meter animate
              arr[f][c].isInCombo=false;
              if (arr[f][c].src==null) 
                arr[f][c].respawn=true;
              if (arr[f][c].respawn==true)
              {  
                arr[f][c].o.off("ondragover");
                arr[f][c].o.off("ondrop");
                arr[f][c].o.off("ondragstart"); 
                arr[f][c].respawn=false; // repuesto!
                console.log("Reponiendo fila " + f+ " , columna " + c);
                arr[f][c].src=NumeroAleatorio();
                arr[f][c].locked=false;
                arr[f][c].o.attr("src",arr[f][c].src);
                arr[f][c].o.attr("ondragstart","_ondragstart(event)");
                arr[f][c].o.attr("ondrop","_onDrop(event)");
                arr[f][c].o.attr("ondragover","_onDragOverEnabled(event)");
              }
            }
          }
              
           
              
          console.log("celdas repuestas");
          
          // revisar si hay combos pendientes despues de reordenar
          eliminar();
         
      } 