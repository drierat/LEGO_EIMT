
//header("Content-Type: text/html;charset=utf-8");
function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function mostraNom() {
	var currURL = window.location.href;
	var idUsuari = getParameterByName('userId', currURL);

    $.ajax({
 //          url: 'http://lego.eimt.uoc.edu:8080/usuari/login', // url per debugar
 //            url: 'http://lego.eimt.uoc.edu/restfullAPI/public/index.php/usuari/login', // url definitiva
            url: 'http://localhost/public/index.php/usuari/login', // url local
            type : "POST", // type of action: POST
            dataType : 'json', // tipus de dades del retorn
            data: {nom:idUsuari,pass:idUsuari},   // alternativa 2: construeixo jo el json
            success : function(result) {
                  console.log(result);
                  document.getElementById('pra_actiu').innerHTML = result.nom + " " + result.cognoms;
			},
            error: function(xhr, resp, text) {
                  console.log(xhr, resp, text)}
            })
}

//var sel = null;

$(document).ready(function(){
// Code to execute when the page is loaded

// Get current date to know the working year and print it
  calculaData();
// Get the user ID
  var currURL = window.location.href;
  var idUsuari = getParameterByName('userId', currURL);
  var idPesa = "";

    // Call the restfull API to get all the labels for the pieces of current, previous and next year
  $.ajax({
              //url: 'http://lego.eimt.uoc.edu:8080/usuari/llistatPeces', // url to debug
              //url: 'http://lego.eimt.uoc.edu/restfullAPI/public/index.php/usuari/llistatPeces',
      url: 'http://localhost/public/index.php/usuari/llistatPeces',
      type : "POST", // Action type: POST - CHANGE?
      dataType : 'json', // Return data type
      data: {nom:idUsuari,any:anyActual}, // POST parameters
      success : function(result) {
          console.log(result);
          for(var year=anyActual-1;year<=anyActual+1;year++){
              html_column = "";
						  creaPeces (result, year);
			    }
			    // Afegim a cada peça el codi del diàleg modal en cas que es faci click
					cridaDialeg(idUsuari);
			},
      error: function(xhr, resp, text) {
          console.log(xhr, resp, text)}
  })

  //function to load different types of pices

  /*$.ajax({

      //url: 'http://lego.eimt.uoc.edu/restfullAPI/public/index.php/tipusDePesaTots',   //url maquina
      url: 'http://localhost/public/index.php/tipusDePesaTots',   //url local
      type : "POST",
      dataType : 'json',
    	//data: {nom:idUsuari,tipusP: idPesa},
      success: function(result){
        console.log(result);
        tipusDePesaTots = result;
        //alert(sel.toSource());
      },
      error: function(result){
        alert("noo");
      }

  })*/



	// User clicks on the statistics button
	$("#estadistiques").click(function() {
		alert("S'ha d'obrir una pàgina d'estadístiques");
	})

	// User clicks on the exit button
	$("#surt").click(function() {
		window.location = ("index.html");
	})


	// User clicks on the retorn button
	$("#retorn").click(function() {
		alert("S'ha d'obrir un document de text o un mail");
	})


 // User clicks on the left arrow
    $("#moveLeft").click(function() {
		decAny();
		$.ajax({
            //url: 'http://lego.eimt.uoc.edu/restfullAPI/public/index.php/usuari/llistatPeces',
            url: 'http://localhost/public/index.php/usuari/llistatPeces',
            type : "POST",
            dataType : 'json',
            data: {nom:idUsuari,any:anyActual},
            success : function(result) {
                        console.log(result);
                        for(var year=anyActual-1;year<=anyActual+1;year++){
                        html_column = "";
                        $('#any' + (year-anyActual+2)).html(html_column);
                        creaPeces (result, year);
			            }
			        	// Afegim a cada peça el codi del diàleg modal en cas que es faci click
						cridaDialeg(idUsuari);
			},
            error: function(xhr, resp, text) {
                  console.log(xhr, resp, text)}
            }) //end ajax
	}); //end click

 // User clicks on the right arrow
    $("#moveRight").click(function() {
		incAny();
		$.ajax({
            // url: 'http://lego.eimt.uoc.edu/restfullAPI/public/index.php/usuari/llistatPeces',
            url: 'http://localhost/public/index.php/usuari/llistatPeces',
            type : "POST",
            dataType : 'json',
            data: {nom:idUsuari,any:anyActual},
            success : function(result) {
                        console.log(result);
                        for(var year=anyActual-1;year<=anyActual+1;year++){
                        html_column = "";
                        $('#any' + (year-anyActual+2)).html(html_column);
                        creaPeces (result, year);
			            }
			        	// Afegim a cada peça el codi del diàleg modal en cas que es faci click
						cridaDialeg(idUsuari);
			},
            error: function(xhr, resp, text) {
                  console.log(xhr, resp, text)}
            }) //end ajax
	}); //end click

  //return sel;

});  // end $(document).ready(function()
		/* Funcions moviment columna anys*/

function calculaData(){
	avui = new Date();
	anyActual = avui.getFullYear();

	mostraAny();
}

function decAny(){
	anyActual--;

	mostraAny();
}

function incAny(){
	anyActual++;

	mostraAny();
}

function mostraAny() {
	document.getElementById('anyAnterior').innerHTML = "Any " + (anyActual-1);
	document.getElementById('anyActual').innerHTML = "Any " + anyActual;
	document.getElementById('anyPosterior').innerHTML = "Any " + (anyActual+1);
}

    //FUNCIONS INTERNES DEL LLISTAT DE PECES
function creaPeces (result, year) {
	for(var i=1; i<=10; i++){
		var pesaActual = 'idPesa' + i + 'any' + year;
			if (result[pesaActual].etiqueta==""){
				html_to_add='<a href="#qDialeg" id=' + pesaActual + ' class="list-group-item botoPeça PeçaBuida" data-toggle="modal">' + 'Per definir' + '</a>';
			} else {
				var tipusP = result[pesaActual].tipus;
				var tipusPSubs = tipusP.substring(0, 3);
				html_to_add='<a href="#qDialeg" id=' + pesaActual + ' class="list-group-item botoPeça Peça' + tipusPSubs + '" data-toggle="modal">' + result[pesaActual].etiqueta + '</a>';
			}

		html_column = html_column + html_to_add;

	}
	$('#any' + (year-anyActual+2)).html(html_column);
}


function cridaDialeg (idUsuari) {
	$("a[id^='idPesa']").click(function(){
		console.log(this); // Per saber quina informació tenim de l'objecte actiu del DOM
		//$("#dialeg").html(creaDialeg(this.id, idUsuari));
		mostraDialeg(this.id, idUsuari);
	});
}

function mostraDialeg(pesaActual, usuari){

	//Get piece's number and year
	if (pesaActual.length == 14) {
		var posicioPesaSubs = pesaActual.substring(6, 7);
		var anyPesaSubs = pesaActual.substring(10);
	} else {
		var posicioPesaSubs = pesaActual.substring(6, 8);
		var anyPesaSubs = pesaActual.substring(11);
	}
		//Comprobació
		//console.log('Peça: ' + posicioPesaSubs + ' Any: ' + anyPesaSubs + ' Usuari: ' + usuari);

	quadre = '<div id="qDialeg" class="modal fade">';
	quadre += '<div class="modal-dialog">';
	quadre += '<div class="modal-content">';
	quadre += '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
	quadre += '<div class="modal-body">';
	quadre += '<form class="form-horizontal">';
	quadre += '<div class="camps"><label for="etiqueta">Etiqueta*:</label>';
	quadre += '<input type="text" name="etiqueta" id="etiqueta" size="50" value="" title="Permet diferenciar les peces. Indica a qué es dedica aquell 10% de temps. És el text que es mostra en la pàgina d´historial (visió general de les peces per anys). Per exemple, Creació assignatura XXX pel semestre SSS o Direcció projecte d´innovació III, etc. "/> </div>';
  quadre += '<div class="camps"><label for="tipusP">Tipus*:</label>';
  quadre += '<select name="tipusP" id="tipusP" title="Tipus de peça seleccionada (entre les definides als Estudis). Defineix el color de la peça en la visió general. Per exemple, Doc1, Inn4, Varis, etc.">';
  	iMax = tipusDePesaTots.length;
  	for (var i = 0; i<iMax; i++){
	     quadre += '<option value="' + tipusDePesaTots[i].idTipus + '">' + tipusDePesaTots[i].idTipus + '</option>';
  	}
	quadre += '</select></div>';
	quadre += '<div class="camps"><label for="aplicat">Aplicat a:</label>';
	quadre += '<input type="text" name="aplicat" id="aplicat" size="50" value="" title="Especifica (si cal) si s´aplica concretament a una assignatura AAA, un programa PPP, un projecte XXX, etc."/></div>';
	quadre += '<div class="camps"><label for="compromis">Compromís:</label>';
	quadre += '<input type="text" name="compromis" id="compromis" size="50" value="" title="Inclou (si el té) un objectiu concret que sortirà reflexat al POP, com Enviament d´un JCR, Desplegament del nou MUXXX, Reducció de l´abandonament a l´assignatura AAA, Direcció del projecte de recerca RRR, etc."/></div>';
	quadre += '<div class="camps"><label for="acompliment">Acompliment (%):</label>';
	quadre += '<input type="text" name="acompliment" id="acompliment" value="" title="Percentatge d´acompliment assolit. Inicialment és zero i pot anar canviant al llarg de l´any i fins i tot desprès."/></div>';
  /* Ara per ara no incloem la validació de les peces
  	quadre += '<div class="camps"><label for="validacio">Validació:</label>';
  	quadre += '<select name="validacio" id="validacio" title="Responsable de validar "><option value="PRA">Pra</option><option value="DIR">Dir</option></select>';
  	quadre += '<input type="checkbox" name="validat" id="validat" value="1"/></div>';
  */
	quadre += '<div class="camps"><label for="comments">Altres:</label>';
	quadre += '<textarea name="comments" id="comments" cols="100" rows="5" title="Comentaris addicionals; llista de varis, assigantures, articles, etc. corresponents a la peça; indicacions a la direcció; notes pròpies; seguiment, etc."></textarea></div>';
	quadre += '<a id="okPesa"></a>';
	quadre += '<a href="" class="btn btn-primary botoDialeg">Cancel</a>';
	quadre += '<a id="modifica"></a>';
	quadre += '</form></div></div></div></div></div>';



	// Crida al servei usuari/pesa per demanar les dades de la peça, si ja existia
	var dadesCarregades = $.ajax({
		//url: 'http://lego.eimt.uoc.edu/restfullAPI/public/index.php/usuari/pesa',
    url: 'http://localhost/public/index.php/usuari/pesa',
		type : "POST",
		dataType : 'json',
		data: {nom:usuari,any:anyPesaSubs,posicio:posicioPesaSubs},
		success : function(result) {
					console.log(result);
					$("#etiqueta").val(result.etiqueta);
					$("#tipusP").val(result.tipus);
					$("#aplicat").val(result.aplicat);
					$("#compromis").val(result.compromis);
					$("#acompliment").val(result.acompliment);
					//$("#validacio").val(result.validacio);
					//$("#validat").val(result.validat);
					$("#comments").val(result.comentaris);

					var optionArray = [result.tipusConcat];
					//console.log(optionArray.length);
					console.log(optionArray);
					for(var i=1; i<=optionArray.length; i++){
						var option = '<option value="' + [i] + ' id="option' + [i] + '">' + result.tipus[i] + ' - ' + result.tipusConcat[i] + '</option>';
						//console.log(optionArray[i]);
						$("#options").html(option);
					};
		},
		error: function(xhr, resp, text) {
			  console.log(xhr, resp, text)}
		}) //end ajax

	$("#dialeg").html(quadre);
	//return quadre;

	dadesCarregades.done(function(result){
		var peçaNova = true; //D
		if (result.id != null) peçaNova = false; //D Variable que indica si la peça ja existia o no
		formatBotons(result);

		$("#okPesa").click(function(){
      var etiqueta=document.getElementById("etiqueta").value;
      if (etiqueta == ''){
        alert("El campo etiqueta está vacio y es OBLIGATORIO");
        return false;
      }
				// AQUÍ VA EL CODI D'ALTA DE NOVA PEÇA
			//var etiqueta = $("#etiqueta").val();
      var tipus = document.getElementById("tipusP").value;
      if (tipus == ''){
        alert("El campo tipus está vacio y es OBLIGATORIO");
        return false;
      }
			var aplicat = document.getElementById("aplicat").value;
			var compromis = document.getElementById("compromis").value;
			var acompliment = document.getElementById("acompliment").value;
			//var validacio = $("#validacio").val();
			//var validat = $("#validat").val();
			var comentaris = document.getElementById("comments").value;

			if (peçaNova) { //D
				var missatge = confirm("Vols crear una peça nova?");
        //comprovem que es pasen els valors adequats
        //alert(usuari + ' ' + anyPesaSubs + ' ' +  posicioPesaSubs + ' ' +  etiqueta + ' ' + tipus + ' ' + aplicat + ' ' + compromis + ' ' + acompliment + ' ' + comentaris);

				if (missatge) { //Codi si es vol crear la peça
					$.ajax({
              //url: 'http://lego.eimt.uoc.edu/restfullAPI/public/index.php/usuari/altaPeces', //D Jo li diria al servei "altaPesa"
              url: 'http://localhost/public/index.php/usuari/altaPeces',
							type : "POST",
							dataType : 'json',
							data: {nom:usuari,any:anyPesaSubs,posicio:posicioPesaSubs,etiqueta:etiqueta,tipus:tipus,aplicat:aplicat,compromis:compromis,acompliment:acompliment,comentaris:comentaris},
							success : function(result) {
                alert(result);
								alert('Peça ' + result + 'creada correctament'); //D Més endavant treuria els missatges per evitar massa pop ups. Potser es pot fer un d'aquells que es difumina automàticament
							},
							error: function(xhr, resp, text) {
								//D Aquí sí que s'hauria d'avisar que ha hagut un problema i no s'ha pogut crear la peça
                //alert('problema al insertar a la BD')
					  		console.log(xhr, resp, text)
                alert(retorn);
					  	}
					}) //end ajax
				}
				else {
					alert("Peça no creada");
					//Codi si NO es crea la peça? Necessari??
				}
			} //D
			else{ //D
				//D CODI DE MODIFICACIÓ (MENOR) D'UNA PEÇA JA EXISTENT
			} //D

		}); //end click crea

	}); //end done 1

	dadesCarregades.done(function(result){ // Un cop s'han carregat les dades, ja es pot modificar la peça
		formatBotons(result);
		$("#modifica").click(function(){
				// AQUÍ VA EL CODI DE MODIFICACIÓ DE LA PEÇA
			//console.log("Ja podem modificar la peça");

			var missatge = confirm('Vols modificar la peça '+ result.etiqueta + ' ?' );
			if (missatge) {
				//Codi si es modifica

				$.ajax ({
					url: 'http://lego.eimt.uoc.edu/restfullAPI/public/index.php/usuari/modificaPesa',
					type : "POST",
					dataType : 'json',
//CAPTAR DADES INTRODUIDES PER FICAR A "data". No reenviar les que hi ha
					data: {idPesa:result.id,etiqueta:result.etiqueta,tipusP:result.tipus,aplicat:result.aplicat,compromis:result.compromis,acompliment:result.acompliment,validacio:result.validacio,validat:result.validat,comentaris:result.comentaris},
					success : function(result) {
						alert(result);
					},
					error: function(xhr, resp, text) {
					  console.log(xhr, resp, text)}
				}) //end ajax

				//CANVIAR ID PEÇA ON APUNTA QUADRE AQUI??
				//INHABILITAR BOTO MODIFICACIO SI ESTÀ BUIDA LA PEÇA
				alert("Peça modificada");
			}
			else {
			alert("Peça no modificada");
				//Codi si NO es modifica
			}
		}); //end click modifica
	}); //end done 2


} //end MostraDialeg()


function formatBotons (result){
	if (result.id == null){
			var botoOk = '<a href="" class="btn btn-primary botoDialeg">Ok</a>';
			var botoMod = '<a href="" class="btn btn-primary botoDisabled pull-right">Modificacio</a>';
			$("#okPesa").html(botoOk);
			$("#modifica").html(botoMod);
	} else {
		botoOk = '<a href="" class="btn btn-primary botoDisabled">Ok</a>';
		botoMod = '<a href="" class="btn btn-primary botoDialeg pull-right">Modificacio</a>';
		$("#okPesa").html(botoOk);
		$("#modifica").html(botoMod);
	}
}

/*
function modificarPesa(res){
	$("#modifica").click(function(){
		//alert('Vols guardar les dades modificades de la peça ' + res.etiqueta + ' ?'); //Confirm amb dos opcions??
		//alert ('dades guardades ' + res.id);
		$.ajax ({
			url: 'http://lego.eimt.uoc.edu/restfullAPI/public/index.php/usuari/modificaPesa',
			type : "POST",
			dataType : 'json',
			data: {idPesa:res.id}, //Pasar també dades modificades
			success : function(result) {
				alert(result);
			},
			error: function(xhr, resp, text) {
				console.log(xhr, resp, text)}
		})
	});
}
*/
