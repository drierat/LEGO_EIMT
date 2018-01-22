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
 //          url: 'http://localhost:8080/public/index.php/usuari/login', // url local
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

$(document).ready(function(){
  // Code to be executed when the page is loaded

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
	      // DEPRECATED Afegim a cada peça el codi del diàleg modal en cas que es faci click
	      //cridaDialeg(idUsuari);
			},
      error: function(xhr, resp, text) {
          console.log(xhr, resp, text)}
  })

  // User clicks on the statistics button
  $("#estadistiques").click(function() {
	alert("TO DO");
  })

  // User clicks on the exit button
  $("#surt").click(function() {
	window.location = ("index.html");
  })

  // User clicks on the retorn button
  $("#retorn").click(function() {
	alert("TO DO");
  })

  // User clicks on the left arrow
  $("#moveLeft").click(function() {
	decAny();
	$.ajax({
		//url: 'http://lego.eimt.uoc.edu/restfullAPI/public/index.php/usuari/llistatPeces',
		url: 'http://localhost/public/index.php/usuari/llistatPeces',
		type: "POST",
        	dataType: 'json',
        	data: {nom:idUsuari,any:anyActual},
            	success: function(result) {
                				console.log(result);
		                        	for(var year=anyActual-1;year<=anyActual+1;year++){
                		        		html_column = "";
               			        		$('#any' + (year-anyActual+2)).html(html_column);
		                        		creaPeces (result, year);
			  			}
			// DEPRECATED Afegim a cada peça el codi del diàleg modal en cas que es faci click
			//cridaDialeg(idUsuari);
			},
            	error: function(xhr, resp, text) {console.log(xhr, resp, text)}
        }) //end ajax
  }); //end click

  // User clicks on the right arrow
  $("#moveRight").click(function() {
	incAny();
	$.ajax({
            	// url: 'http://lego.eimt.uoc.edu/restfullAPI/public/index.php/usuari/llistatPeces',
	        url: 'http://localhost/public/index.php/usuari/llistatPeces',
        	type: "POST",
	        dataType : 'json',
        	data: {nom:idUsuari,any:anyActual},
            	success: function(result) {
                       				console.log(result);
			                        for(var year=anyActual-1;year<=anyActual+1;year++){
                        				html_column = "";
                        				$('#any' + (year-anyActual+2)).html(html_column);
				                        creaPeces (result, year);
			        		}
	        	// DEPRECATED Afegim a cada peça el codi del diàleg modal en cas que es faci click
			//cridaDialeg(idUsuari);
			},
            	error: function(xhr, resp, text) {console.log(xhr, resp, text)}
	}) //end ajax
  }); //end click

  // User clicks on a piece - PIECE EDITION
  $('#qDialeg').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget); // Get the button that triggered the modal
    var pesaActual = button.attr('id'); // Extract id from the button clicked
    console.log(pesaActual);
    //Get piece's number and year
	if (pesaActual.length == 14) {
		var posicioPesaSubs = pesaActual.substring(6, 7);
		var anyPesaSubs = pesaActual.substring(10);
	} else {
		var posicioPesaSubs = pesaActual.substring(6, 8);
		var anyPesaSubs = pesaActual.substring(11);
	}
	var dadesCarregades = $.ajax({
							//url: 'http://lego.eimt.uoc.edu/restfullAPI/public/index.php/usuari/pesa',
    						url: 'http://localhost/public/index.php/usuari/pesa',
							type: "POST",
							dataType : 'json',
							data: {nom:idUsuari,any:anyPesaSubs,posicio:posicioPesaSubs},
							success : function(result) {
									  $("#etiqueta").val(result.etiqueta);
									  $("#tipusP").val(result.tipus);
									  $("#aplicat").val(result.aplicat);
									  $("#compromis").val(result.compromis);
									  $("#acompliment").val(result.acompliment);
									  //$("#validacio").val(result.validacio);
									  //$("#validat").val(result.validat);
									  $("#comments").val(result.comentaris);
									  optionArray = [result.tipusConcat];
									  var iMax = tipusDePesaTots.length;
									  var option = '';
  									  for (var i = 0; i<iMax; i++){
  									  	 option += '<option value="' + tipusDePesaTots[i].idTipus + '">' + tipusDePesaTots[i].idTipus + '</option>';
  									    }
									  $("#tipusP").html(option);
							},
							error: function(xhr, resp, text) {
		  							console.log(xhr, resp, text)
		  					}
  						}) //end ajax

				  	dadesCarregades.done(function(result){
					// Fem servir una Promise/Deferred per assegurar-nos que no es fa cap altra crida AJAX fins que no s'hagin
					// carregat les dades de la prèvia
						$("#okPesa").click(function(){ // Es prem OK
    					console.log('OK. Seguim');
 						var etiqueta = $("#etiqueta").val();
						var tipus = $("#tipusP").val();
						var aplicat = $("#aplicat").val();
						var compromis = $("#compromis").val();
						var acompliment = $("#acompliment").val();
						var validacio = $("#validacio").val();
						var validat = $("#validat").val();
						var comentaris = $("#comments").val();
						if (optionArray=="") { // Check is the piece is new or modified
												var missatge = confirm("Vols crear una peça nova?");
												if (missatge) { //New piece
																console.log("Comencem a crear peça...");
																var currURL = window.location.href;
																var idUsuari = getParameterByName('userId', currURL);
//																TO DO: Incloure crida AJAX de creació de nova peça
																/*$.ajax({
        																url: 'http://localhost/public/index.php/usuari/login', // url local
//		          														url: 'http://localhost:8080/public/index.php/usuari/login', // url local
												        				type : "POST", // type of action: POST
        																dataType : 'json', // tipus de dades del retorn
        																data: {nom:idUsuari,pass:idUsuari},   // alternativa 2: construeixo jo el json
        																success : function(result) {
	        																						console.log(result);
	        																						document.getElementById('pra_actiu').innerHTML = result.nom + " " + result.cognoms;
																		},
        																error: function(xhr, resp, text) {
	        																							console.log(xhr, resp, text);
																		}
																}); //end ajax*/
																console.log("...peça suposadament creada");
												}
												console.log("No s'ha confirmat la creació de la peça");
											} //end new piece created
						else {
//								TO DO: Incloure codi per modificació de peça (primer comprobar si és un canvi menor o major, demnar confirmació, i desprès fer crida AJAX corresponent)
						} //end modify piece
						}) //end okPesa
  					}) //end promise
  	}); //end piece edition

});  // end $(document).ready(function()

/* Functions related to years horizontal moves*/

function mostraAny() {
	document.getElementById('anyAnterior').innerHTML = "Any " + (anyActual-1);
	document.getElementById('anyActual').innerHTML = "Any " + anyActual;
	document.getElementById('anyPosterior').innerHTML = "Any " + (anyActual+1);
}

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

/* Functions to manage the pieces creation*/

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

function formatBotons(result){
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