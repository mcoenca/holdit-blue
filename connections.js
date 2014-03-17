//Fichiers dépendant des repositories, car les url de requetes et les headers dépendent de si on est sur l'app/ en local/vers heroku...


//Var connection
var Connect=function($deja_connect) {

	//On met à jour la géoloc
//alert("je met à jour la géoloc");
navigator.geolocation.getCurrentPosition(onSuccess, onError);
	//On prend la variable username dans l'input "Connect" si on est pas déja connecté et on le met dans localStorage
	//alert("Apres"+la);
	//alert("Apres"+lon);
	//alert('je suis dans connect');
//alert(la);
//alert(lon);
//alert('Je tente le vibreur');
	//navigator.notification.vibrate(2500);
	//navigator.notification.beep(2);

/*alert("je tente la notification");

	navigator.notification.confirm(
    		"This smoke wasn't in your objectives", // message
    		function (index) {
			alert('button'+index);
		},            // callback to invoke with index of button pressed
    		'Smoke Request detected?',           // title
    		["Ok, Hold'it !",'Fuck off you stupid app']     // buttonLabels
	);

alert("je lance le bluetooth");

bluetoothSerial.isEnabled(
    function() { 
        alert("Bluetooth is enabled");
    },
    function() { 
        alert("Bluetooth is *not* enabled");
    }
);    */

	if($deja_connect==false){
		username=$('#username_connect').val();
	}

	//on fait la requete GET correspondante
	$.ajax({
			url: "http://holdit.herokuapp.com/users/name/"+username+".json",
			dataType: "json",
			type: "get",
			headers: { 
        			Accept : "application/json"
   				 },
		success: function(donnees){
			//alert('connection réussie');
		Connection_success(donnees);
				},
		error: function(xhr,textStatus,errorThrown){
			//alert('je suis dans error');
			//alert('erreur de connection');
			Connection_failure(textStatus,errorThrown,false);
		}
	});
};

//Connection création
var Create = function() {
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
	//On prend la variable username dans l'input de texte "Nouvel util"
	username=$('#username_create').val();
	//on fait la requete POST correspondante
	$.ajax({
			url: "http://holdit.herokuapp.com/users",
			type: "post",
			dataType: "json",
			headers: { 
        			Accept : "application/json"
   				 },
			data: {"authenticity_token":"WE9L/lhK8otgTy/+UZd8jOjGYBnRMs2I37JUL3v3tjQ=", "user[name]":username},
		success: function(donnees){
		localStorage.setItem('username',username);
			Connection_success(donnees);
		},
		error: function(xhr,textStatus,errorThrown){
			Connection_failure(textStatus, errorThrown, true)
		}
	});
};

//Connection Stats
var Stats = function() {
	//Remet à zéro les stats et affiche l'écran
	$(".smoke_list").remove();
	$(".connected").hide();
	$(".stats").show();
	$("#title_stats").text("Tes stats, "+username+" !");
	//requete ajax pour  remplir le tableau joli !
	$.ajax({
		url: "http://holdit.herokuapp.com/users/name/"+username+".json",
		dataType: "json",
		headers: { 
        		Accept : "application/json"
   			 },
		type: "get",
	success: function(donnees){
		Stats_success(donnees);
	},
	error: function(xhr,textStatus,errorThrown){
		Stats_failure(textStatus, errorThrown);
	}
	});

};

//Création de Smoke
var Smoke = function() {
	//On prend la variable username la où elle est ! C'est à dire déja bien réglée
	//on fait la requete POST correspondante

	//alert("Smoke"+la);
	//alert('Smoke'+lon);
	$.ajax({
			url: "http://holdit.herokuapp.com/newsmoke",
			type: "post",
			dataType: "json",
   			headers: { 
        			Accept : "application/json"
   				 },
			data: {"authenticity_token":"WE9L/lhK8otgTy/+UZd8jOjGYBnRMs2I37JUL3v3tjQ=",
 				"user[name]":username,
				"smoke[smoke_latitude]": la,
				"smoke[smoke_longitude]": lon,
				"smoke[smoke_date]":new Date()},
		success: function(donnees){
			//alert('je suis dans success');
			Smoke_success(donnees);
		},
		error: function(xhr,textStatus,errorThrown){
			alert('je suis dans erreur');
			Smoke_failure(textStatus,errorThrown);
		}
	});			

};

//Connection au bluetooth
var Connect_bluetooth = function() {
	alert('appel à bluetoothserial.isenabled');
	console.log('appel à bluetoothserial.isenabled');
navigator.notification.vibrate(2500);
	//Test si bluetooth  est activé, sinon message d'erreur
	bluetoothSerial.isEnabled(
   	function() { 
		//Success on fait rien, on appelle la suite
        	alert("Bluetooth is enabled");
		console.log('Bluetooth is enabled');
		bluetoothSerial.connect(
		macAddress,
		function() {
			//Connection réussie ! Il faudrait afficher un voyant sur l'appli dans la page connection, qui indique si la connection est effective
			alert('Connexion Success');
			//On écoute le paquet, le délimiteur est \n the receive_data callback is called whenever data is received
			bluetoothSerial.subscribe("D",
			function(data){
				//On a reçu un message, on envoie ça à la réponse de l'app
				Answer(data);
			},
			function(){
				alert('Subscription failed');
			});
		},
		function() {
			//Connection ratée
			alert(' Connexion failed');
		});
	},
	function() {
		//Sinon on alert qu'il faut activer le bluetooth
		alert("Bluetooth is not enabled");
	}

    	);   

};

//Fonction qui gère la réponse à la demande du paquet : ici alert et on doit cliquer sur ok
var Answer = function (data) {
	
	
if (canSmoke()==false) {
	//Si on est hors des objectifs
	
	//On fait vibrer le portable et beep beep (youpi) !
	navigator.notification.vibrate(2500);
	navigator.notification.beep(2);

	//Callback du formulaire de demande avec les connections pour déverouiller le paquet
	function onConfirm(buttonIndex) {
    		alert('You selected button ' + buttonIndex);
		if(buttonIndex==1) {
			//On accepte de pas fumer c'est cool on affiche une recompense
			alert('Well held');
		}
		else {
			//On veut fumer quand même, on affiche le chargement du déverouillage
			alert('Unlocking paquet...');
			//On envoie le message de déverouillage au paquet
			bluetoothSerial.write('oD',
			function() {
				//En cas de succès
				alert('Déverouillage réussi');
			},
			function(error) {
				//En cas d'échec
				alert('Erreur de déverouillage : '+error);
			});
		}
	}

	//On affiche le formulaire de confirmation
	navigator.notification.confirm(
    		"This smoke wasn't in your objectives", // message
    		onConfirm,            // callback to invoke with index of button pressed
    		'Smoke Request detected?',           // title
    		["Ok, Hold'it !",'Fuck off you stupid app']     // buttonLabels
	);
}
else {
	//Si on dans les objectifs On fait rien
}		
};

//Fonction des objectifs, pour l'instant vide
var canSmoke = function() {
	return false;
};
