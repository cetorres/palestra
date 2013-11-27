// Inicialização Lungo
Lungo.init({
	name: 'Palestra Móvel',
	version: 1.0
});

// Dados de configuração gerais
var config = {
	palestra: {nome: "Mobilidade - computação móvel, dispositivos e aplicativos"},
	palestrante: {nome: "Carlos Eugênio Torres"},
	twitter: {via: "cetorres", hashtag_basic: "palestra"}	
}

// Variáveis globais
var showLoading = true;
var hashtag = "";
var localSelecionado = {id:null,nome:null};

// Ao carregar a tela Palestra
Lungo.dom('#section-palestra').on('load', function(event){
    $$("#palestra_nome").html(config.palestra.nome);
	$$("#local").html(localSelecionado.nome);
	$$("#palestrante").html(config.palestrante.nome);
});

// Ao carregar a tela Twitter
Lungo.dom('#section-twitter').on('load', function(event) {
	showLoading = true;
    loadTWeets(config.twitter.hashtag_basic + localSelecionado.id);
});

// Botões da tela de entrada
Lungo.dom('#button1').tap(function(event) {
    localSelecionado = {id: 'fa7', nome: 'FA7'};
	Lungo.Router.section("section-palestra");
});
Lungo.dom('#button2').tap(function(event) {
    localSelecionado = {id: 'fametro', nome: 'FAMETRO'};
	Lungo.Router.section("section-palestra");
});
Lungo.dom('#button3').tap(function(event) {
    localSelecionado = {id: 'fate', nome: 'Ateneu - FATE'};
	Lungo.Router.section("section-palestra");
});
Lungo.dom('#button4').tap(function(event) {
    localSelecionado = {id: 'unifor', nome: 'Universidade de Fortaleza'};
	Lungo.Router.section("section-palestra");
});
Lungo.dom('#button5').tap(function(event) {
    localSelecionado = {id: 'infobrasil', nome: 'InfoBrasil'};
	Lungo.Router.section("section-palestra");
});

// Botões da tela de twitter
Lungo.dom('#button-compose').tap(function(event) {
    window.open("https://twitter.com/intent/tweet?text=Estou assistindo à palestra do "+config.palestrante.nome+" na "+localSelecionado.nome+"&hashtags="+hashtag+"&via="+config.twitter.via+"&url=","twitter","");
});

// Ao carregar a tela Avaliação
Lungo.dom('#section-avaliacao').on('load', function(event) {
	// Configura estrelas de avalição
	$('#conteudo-stars').rating('rating.php', 'conteudo', localSelecionado.id, {maxvalue:5, curvalue: getCookie('palestra_' + localSelecionado.id + '_conteudo')});
	$('#palestrante-stars').rating('rating.php', 'palestrante', localSelecionado.id, {maxvalue:5, curvalue: getCookie('palestra_' + localSelecionado.id + '_palestrante')});
	$('#relevancia-stars').rating('rating.php', 'relevancia', localSelecionado.id, {maxvalue:5, curvalue: getCookie('palestra_' + localSelecionado.id + '_relevancia')});
	$('#aplicativo-stars').rating('rating.php', 'aplicativo', localSelecionado.id, {maxvalue:5, curvalue: getCookie('palestra_' + localSelecionado.id + '_aplicativo')});	
});
// Ao carregar a tela de Avaliação Resultado
Lungo.dom('#article-avaliacao-resultado').on('load', function(event) {
	loadRating('conteudo', localSelecionado.id);
	loadRating('palestrante', localSelecionado.id);
	loadRating('relevancia', localSelecionado.id);
	loadRating('aplicativo', localSelecionado.id);
});

// Carrega ratings
var loadRating = function(t,l) {
	$$.ajax({
	    type: 'GET',
	    url: 'rating.php',
	    data: {tipo: t, local:l},
	    dataType: 'json',
	    async: true,
	    success: function(response) {
			if (response && response.length > 0) {							
				$$.each(response, function(index, item) {
					$('#' + t + '-stars-resultado').rating('', t, l, {maxvalue:5, curvalue:item.media});			
				});
			}
	    },
	    error: function(xhr, type) {
    		alert("Erro ao carregar avaliação.");
	    }
	});
}

// Carrega tweets
var loadTWeets = function(ht) {
	hashtag = ht;
	
	console.log("hashtag: " + hashtag);

	if (showLoading)
		Lungo.Notification.show();		
	
	$$.ajax({
	    type: 'GET',
	    url: 'tweets.php',
	    data: {hashtag: ht},
	    dataType: 'json',
	    async: true,
	    success: function(response) {
			$$("#article-twitter").empty();
		
			if (response && response.length > 0) {				
				var items = [];

				$$.each(response, function(index, item) {
					console.log("item: " + item.user_name);
					var tweet = item.text;
					tweet = tweet.linkify();
				    items.push('<li class="thumb"><img src="'+item.user_image+'" /><div><div class="on-right text tiny">'+parseTwitterDate(item.created_at)+'</div><span class="text tiny opacity">'+item.user_name+' (@'+item.user_screenname+')</span><br/><span class="text tiny">'+tweet+'</div></li>');
				});
		
				var list = "<ul>";
				list += items.join('');
				list += "</ul>";
		
				$$("#article-twitter").append(list);
			}		
			else {
				$$("#article-twitter").html('<div class="empty"><span class="icon twitter"></span><strong>Sem tweets</strong> <small>Não existe discussão sobre esta palestra ainda.<br/>Seja o primeiro a comentar.</small><a href="#" class="button anchor" data-label="Tuitar"></a></div>');
			}			
			
			if (showLoading)
				Lungo.Notification.hide();		    	
	    },
	    error: function(xhr, type) {
    		alert("Erro ao carregar tweets.");
	    }
	});
}

// Implementa o pull to refresh na lista de tweets
var pull_twitter = new Lungo.Element.Pull('#article-twitter', {
    onPull: "Puxe para recarregar",      //Text on pulling
    onRelease: "Solte para ver novos resultados",//Text on releasing
    onRefresh: "Recarregando...",          //Text on refreshing
    callback: function() {               //Action on refresh
		showLoading = false;
        loadTWeets(config.twitter.hashtag_basic + localSelecionado.id);
        pull_twitter.hide();
    }
});

// Retorna a data no formato do Twitter
function parseTwitterDate(tdate) {
    var system_date = new Date(Date.parse(tdate));
    var user_date = new Date();
	var day = system_date.getDate();
	if (day<10) day='0'+day;
	var month = system_date.getMonth();
	month += 1;
	if (month<10) month='0'+month;
	var hour = system_date.getHours();
	if (hour<10) hour='0'+hour;
	var min = system_date.getMinutes();
	if (min<10) min='0'+min;

    var diff = Math.floor((user_date - system_date) / 1000);
    if (diff <= 1) {return "agora";}
    if (diff < 60) {return diff + " s";}
    if (diff <= 3540) {return Math.round(diff / 60) + " m";}
    if (diff <= 86400) {return Math.round(diff / 3600) + " h";}
    //if (diff < 604800) {return Math.round(diff / 86400) + " d";}
    return day + "/" + month + "<br/>" + hour + ":" + min;
}

// Identifica links dentro de uma string e os torna clicáveis
if(!String.linkify) {
    String.prototype.linkify = function() {

        // http://, https://, ftp://
        var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

        // www. sans http:// or https://
        var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

        // Email addresses *** here I've changed the expression ***
        var emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim;
    
		// Twitter username
		var twitterUsernamesPattern = /(^|\s)@(\w+)/g;
		
		// Twitter hashtags
		var twitterHashtags = /(^|\s)#(\w+)/g;
	
        return this
            .replace(urlPattern, '<a target="_blank" class="tweet-link" href="$&">$&</a>')
            .replace(pseudoUrlPattern, '$1<a target="_blank" class="tweet-link" href="$2">$2</a>')
            .replace(emailAddressPattern, '<a class="tweet-link" href="mailto:$&">$&</a>')
			.replace(twitterUsernamesPattern, '$1<a target="_blank" class="tweet-link" href="http://www.twitter.com/$2">@$2</a>')
			.replace(twitterHashtags, '$1<a target="_blank" class="tweet-link" href="http://twitter.com/search?q=%23$2">#$2</a>');
    };
}