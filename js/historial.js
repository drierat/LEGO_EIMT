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
            url: 'http://lego.eimt.uoc.edu/restfullAPI/public/index.php/usuari/login', // url definitiva
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
	
$(document).ready(function(){ // Code to be executed when the page is loaded
// Get current date to know the working year and print it 
    calculaData();
// Get the user ID
    var currURL = window.location.href; 
    var idUsuari = getParameterByName('userId', currURL);
// Call the restfull API to get all the tipes of pieces accepted in the system (i.e. Doc1, Doc2,..., Rec1,...)
   $.ajax({
//          url: 'http://lego.eimt.uoc.edu:8080/tipusDePesa', // url to debug
            url: 'http://lego.eimt.uoc.edu/restfullAPI/public/index.php/tipusDePesaTots',
            type : "POST", // Action type: POST - CHANGE TO GET?
            dataType : 'json', // Return data type
            data: {nom:idUsuari}, // POST parameters
            success : function(result) {
                        console.log(result);
                        // Guardar a variable global
			},
            error: function(xhr, resp, text) {
                  console.log(xhr, resp, text)}
    })
// User clicks on the statistics button - REPETIT A SOTA
//	$("#estadistiques").click(function() {			
//		alert("S'ha d'obrir una pàgina d'estadístiques");
//	})

// Call the restfull API to get all the labels for the pieces of current, previous and next year
    $.ajax({
//          url: 'http://lego.eimt.uoc.edu:8080/usuari/llistatPeces', // url to debug
            url: 'http://lego.eimt.uoc.edu/restfullAPI/public/index.php/usuari/llistatPeces',
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
            url: 'http://lego.eimt.uoc.edu/restfullAPI/public/index.php/usuari/llistatPeces',
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
            url: 'http://lego.eimt.uoc.edu/restfullAPI/public/index.php/usuari/llistatPeces',
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
 });
 
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
	quadre += '<div class="camps"><label for="etiqueta">Etiqueta:</label>';
	quadre += '<input type="text" name="etiqueta" id="etiqueta" size="50" value=""/> </div>';
	quadre += '<div class="camps"><label for="tipusP">Tipus:</label>';
	quadre += '<select name="tipusP" id="tipusP"><option value="0" id="option0">Selecció:</option>';
	quadre += '<div id="options"></div>';
	/*		//CODI MOMENTANI - FER CRIDA AJAX
			$connexio = new mysqli(localhost, legobd,hwrcmwo41, lego);
			$dades = "SELECT idTipus, CONCAT(' - ', explicacio) FROM tipuspesa";
			$sqldad = mysqli_query ($connexio, $dades);
	
			while ($llista = mysqli_fetch_array ($sqldad)){
            echo '<option value="'.$llista[0].'">'.$llista[0].$llista[1].'</option>';
			}
		*/
	quadre += '</select></div>';
	quadre += '<div class="camps"><label for="aplicat">Aplicat a:</label>';
	quadre += '<input type="text" name="aplicat" id="aplicat" size="50" value=""/></div>';
	quadre += '<div class="camps"><label for="compromis">Compromis:</label>';
	quadre += '<input type="text" name="compromis" id="compromis" size="50" value=""/></div>';
	quadre += '<div class="camps"><label for="acompliment">Acompliment (%):</label>';
	quadre += '<input type="text" name="acompliment" id="acompliment" value=""/></div>';
	quadre += '<div class="camps"><label for="validacio">Validació:</label>';
	quadre += '<select name="validacio" id="validacio"><option value="PRA">Pra</option><option value="DIR">Dir</option></select>';
	quadre += '<input type="checkbox" name="validat" id="validat" value="1"/></div>';
	quadre += '<div class="camps"><label for="comments">Altres:</label>';
	quadre += '<textarea name="comments" id="comments" cols="25" rows="3"></textarea></div>';
	quadre += '<a id="okPesa"></a>';
	quadre += '<a href="" class="btn btn-primary botoDialeg">Cancel</a>';
	quadre += '<a id="modifica"></a>'; 
	quadre += '</div></div></div></div></div>';
	
	// Crida al servei usuari/pesa per demanar les dades de la peça, si ja existia
	var dadesCarregades = $.ajax({
		url: 'http://lego.eimt.uoc.edu/restfullAPI/public/index.php/usuari/pesa',
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
					$("#validacio").val(result.validacio);
					$("#validat").val(result.validat);
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
	
	dadesCarregades.done(function(result){ // If the dadesCarregades promise is resolved...
		var peçaNova = true; //D
		if (result.id != null) peçaNova = false; //D Variable que indica si la peça ja existia o no
		formatBotons(result);
				
		$("#okPesa").click(function(){
			// AQUÍ VA EL CODI D'ALTA DE NOVA PEÇA
			var etiqueta = $("#etiqueta").val();
			var tipus = $("#tipusP").val();
			var aplicat = $("#aplicat").val();
			var compromis = $("#compromis").val();
			var acompliment = $("#acompliment").val();
			var validacio = $("#validacio").val();
			var validat = $("#validat").val();
			var comentaris = $("#comments").val();
		
			if (peçaNova) { //D
				var missatge = confirm("Vols crear una peça nova?");
				if (missatge) { //Codi si es vol crear la peça
					//D Falta comprobar que tots els camps IMPRESCINDIBLES estan completats
					//D ...
					$.ajax({
							url: 'http://lego.eimt.uoc.edu/restfullAPI/public/index.php/usuari/altaPeces', //D Jo li diria al servei "altaPesa" 
							type : "POST", 
							dataType : 'json', 
							data: {nom:usuari,any:anyPesaSubs,posicio:posicioPesaSubs,etiqueta:etiqueta,tipus:tipus,aplicat:aplicat,compromis:compromis,acompliment:acompliment,validacio:validacio,validat:validat,comentaris:comentaris}, 
							success : function(result) {
								alert('Peça ' + result + 'creada correctament'); //D Més endavant treuria els missatges per evitar massa pop ups. Potser es pot fer un d'aquells que es difumina automàticament
							},
							error: function(xhr, resp, text) {
								//D Aquí sí que s'hauria d'avisar que ha hagut un problema i no s'ha pogut crear la peça
					  			console.log(xhr, resp, text)
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
				/*
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
				}) //end ajax 		*/
				
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
	
