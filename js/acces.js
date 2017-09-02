
//header("Content-Type: text/html;charset=utf-8");
		
 $(document).ready(function(){
 // Code to execute when the page is loaded
 
 });

		/* Funcions moviment columna anys*/

/* Funció per validar un usuari */
function validarUsuari() {
    			$.ajax({
//              url: 'http://lego.eimt.uoc.edu:8080/usuari/login', // url per debugar restfullAPI
                url: 'http://lego.eimt.uoc.edu/restfullAPI/public/index.php/usuari/login', // url definitiva
                type : "POST", // type of action: POST
                dataType : 'json', // tipus de dades del retorn
//              data : $("#form").serialize(), 							// alternativa 1: Si les dades estan dintre d'un form
                data: {nom:$("#nomUser").val(),pass:$("#passUser").val()},   // alternativa 2: construeixo jo el json
                success : function(result) {
                    console.log(result);
					idUsuari = $('#nomUser').val().replace("nom=","");      // Agafem només l'id de l'usuari
					rolUsuari = result.rol; 
						
						//Comprova si l'usuari existeix i si les dades son correctes
					if (rolUsuari == "D") {
						window.location="./rol.html?userId=" + idUsuari;	// Usuari correctament validat. Seguim!		
					} else if (rolUsuari == "PRA") {
						window.location="./historial.html?userId=" + idUsuari;
					} else {
						alert("Usuari i/o contrasenya incorrecta");
						window.location="./acces.html";
					}
				},	//end success
                error: function(xhr, resp, text) {
                    console.log(xhr, resp, text)}
            }) //end ajax
} //end validar usuari

/* Funció per dirigir un usuari PRA des de ROL*/

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

function dirigirUsuari() {
		var currURL = window.location.href; 
		var idUsuari = getParameterByName('userId', currURL);
    	window.location="./historial.html?userId=" + idUsuari;	
}

