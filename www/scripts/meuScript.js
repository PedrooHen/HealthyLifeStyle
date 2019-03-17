function ativaPagina() {
    $('.paginaAlvo').click(function () {
        var alvo = $(this).attr('dt-page');
        $('.page').addClass('hidden');
        $(alvo).removeClass('hidden');
        fecharMenuLateral();
    });
}
ativaPagina();
function abrirMenuLateral() {
    document.getElementById("meuMenuLateral").style.width = "80%";
}
function fecharMenuLateral() {
    document.getElementById("meuMenuLateral").style.width = "0";
}

//Microfone
// Test browser support
window.SpeechRecognition = window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    null;
//caso não suporte esta API DE VOZ
if (window.SpeechRecognition === null) {
    document.getElementById('unsupported').classList.remove('hidden');
} else {
    //......
}
var recognizer = new window.SpeechRecognition();
var transcription = document.getElementById("inptMic");
//Para o reconhecedor de voz, parar de ouvir, quando ocorrer pausas no usuario
recognizer.continuous = false;
recognizer.onresult = function (event) {
    for (var i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
            transcription.value = event.results[i][0].transcript;
        } else {
            transcription.value += event.results[i][0].transcript;
        }       
    }    
    var table = document.getElementById("tblDispositivos");
    var tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(transcription.value.toUpperCase())>-1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
document.querySelector("#rect").addEventListener("click", function () {
    try {
        recognizer.start();
    } catch (ex) {
        alert("error: " + ex.message);
    }
});

//Buscar na Tabela     
function buscarTabela() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("inptMic");
    filter = input.value.toUpperCase();
    table = document.getElementById("tblDispositivos");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

//Login
function loginPOST() {
    $('#telaCarregamento').removeClass('hidden');
    var email = document.getElementById("inptEmail").value;
    var senha = document.getElementById("inptSenha").value;
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://131.221.240.23:18090/dashboard-api/dashboard",
        "method": "POST",
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
            "cache-control": "no-cache"
        },
        "data": {
            "username": email,
            "password": senha
        }
    }
    $.ajax(settings).done(function (HttpResponse) {
        //console.log(HttpResponse);

        $('#telaCarregamento,#telaLogin').addClass('hidden');
        $('#telaInicial').removeClass('hidden');
    });
    $.ajax(settings).fail(function (response) {
        $('#telaCarregamento').addClass('hidden');
        alert("Email ou senha incorretos.");
    });
}

//Logout
function deslogarPOST() {
    $('#telaCarregamento').removeClass('hidden');
    fecharMenuLateral();
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://131.221.240.23:18090/dashboard-api/signoff",
        "method": "GET",
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache"
        },
        "data": {}
    }
    $.ajax(settings).done(function (response) {
        $('.page').addClass('hidden');
        $('#telaCarregamento').addClass('hidden');
        $('#telaLogin').removeClass('hidden');
    });
    $.ajax(settings).fail(function (response) {
        $('#telaCarregamento').addClass('hidden');
        alert("Erro.");
    });
}

//Novo Usuario
function novaContaPOST() {
    $('#telaCarregamento').removeClass('hidden');
    var nome = document.getElementById("nomeNovoUser").value;
    var email = document.getElementById("emailNovoUser").value;
    var senha = document.getElementById("senhaNovoUser").value;
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://131.221.240.23:18090/dashboard-api/signupUser",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache",
        },
        "data": "{\n\t\"fullname\": \"" + nome + "\",\n\t\"email\": \"" + email + "\",\n\t\"password\": \"" + senha + "\"\n}"
    }
    $.ajax(settings).done(function (response) {
        alert("OK");
        $('#telaCarregamento,#telaNovoUsuario').addClass('hidden');
        $('#telaInicial').removeClass('hidden');
    });
    $.ajax(settings).fail(function (response) {
        alert("ERROR");
        $('#telaCarregamento').addClass('hidden');
    });
}

//Criar novo dispositivo
function novoDispositivoPOST() {
    $('#telaCarregamento').removeClass('hidden');
    var devicePublic = $("#slctDevicePublic option:selected").val();
    var nome = document.getElementById("nomeNovoDispositivo").value;
    var tipo = document.getElementById("tipoNovoDispositivo").value;
    var mac = document.getElementById("macNovoDispositivo").value;
    var ip = document.getElementById("ipNovoDispositivo").value;
    var funcao = document.getElementById("funcaoNovoDispositivo").value;
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://131.221.240.23:18090/dashboard-api/newDevicesREST",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache"
        },
        "data": {
            "devicePublic": devicePublic,
            "name": nome,
            "type": tipo,
            "mac": mac,
            "ip": ip,
            "description": funcao
        }
    }
    $.ajax(settings).done(function (response) {
        console.log(response);
        alert("Registered Device");
        $('#telaNovoDispositivo').addClass('hidden');
        $('#telaDispositivos').removeClass('hidden');
        atualizarTabela();
    });
    $.ajax(settings).fail(function (response) {
        alert("ERROR");
        $('#telaCarregamento').addClass('hidden');
    });
}

//Novo Dashboard
function novoDashboardPOST() {
    $('#telaCarregamento').removeClass('hidden');
    var nome = document.getElementById("nomeDashboard").value;
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "-     -http://131.221.240.23:18090/dashboard-api/newDashboard",
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache"
        },
        "data": {
            "dashboard": nome
        }
    }
    $.ajax(settings).done(function (response) {
        console.log(response);
        var nomeDashboard = document.getElementById("nomeDashboard").value;
        var newcontent = document.createElement('a');
        newcontent.setAttribute("class", "paginaAlvo");
        newcontent.setAttribute("dt-page", "#tela" + nomeDashboard);
        newcontent.innerHTML = nomeDashboard;
        var menuLateral = document.getElementById("meuMenuLateral");
        menuLateral.appendChild(newcontent);
        alert("Dashboard adicionado!");
        $('#telaCarregamento').addClass('hidden');
        $('#telaInicial').removeClass('hidden');
    });
    $.ajax(settings).fail(function (response) {
        $('#telaCarregamento').addClass('hidden');
        alert("Dados incorretos.");
    });
}

//Gráfico
function plotarGrafico(ctx) {    
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["1", "2", "3"],
            datasets: [{
                label: 'temperatura',
                data: [5, 2, 4],
                backgroundColor: [
                    '#3CBC8D'
                ],
                borderColor: [
                    '#3CBC8D'
                ],
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

//Mapa
function criarMapa(ctx, response) {
    var map = L.map(ctx).setView([-22.256, -45.695], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([response[0].events.latitude, response[0].events.longitude]).addTo(map)
        .bindPopup('Temperature: ' + response[0].events.temperature +
        '<br>Moisture: ' + response[0].events.moisture +
        '<br>Filling: ' + response[0].events.filling +
        '<br>Weight: ' + response[0].events.weight +
        '<br>')
        .openPopup();
}               

//Criação Tela Device
function criarTelaDevice(response,username) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://131.221.240.23:18090/dashboard-api/listDeviceEvents/" + username,
        "method": "GET",
        "headers": {
            "cache-control": "no-cache"
        },
        "data": {
            "username": "root@root.com",
            "password": "root@root.com"
        }
    }
    $.ajax(settings).done(function (response2) {
        $('#telaCarregamento').removeClass('hidden');
        console.log(response2, response);

        var numDispositivos = response.length;
        for (var i = 0; i < numDispositivos; i++) {
            if (response[i].username == username) {
                var j = i;
            }
        }
        var divP = document.createElement("div");
        divP.setAttribute("id", response[j].id);
        divP.setAttribute("class", "page hidden");

        //barraTopo
        var divTopo = document.createElement("div");
        divTopo.setAttribute("class", "barraTopo");
        var span_1 = document.createElement("span");
        span_1.setAttribute("class", "iconeVoltar icone");
        span_1.addEventListener("click", function () {
            $('.page').addClass('hidden');
            $("#telaDispositivos").removeClass('hidden');
        });
        var span_2 = document.createElement("span");
        span_2.innerHTML = "Device";

        //barraBaixa
        var divBaixa = document.createElement("div");
        divBaixa.setAttribute("class", "barraBaixa");
        var img_1 = document.createElement("img");
        img_1.setAttribute("id", "iconeIOT");
        img_1.setAttribute("src", "images/logoLabIOT.png");
        var img_2 = document.createElement("img");
        img_2.setAttribute("id", "iconeINATEL");
        img_2.setAttribute("src", "images/logoInatelB.png");

        //Conteudo
        var painel = document.createElement("div");
        painel.setAttribute("class", "painelDispositivo");
        var nomeDevice = document.createElement("h1");
        nomeDevice.innerHTML = response[j].name;
        var criador = document.createElement("h3");
        criador.innerHTML = "Create by: " + response[j].createBy;
        var dataCriacao = document.createElement("h3");
        dataCriacao.innerHTML = "Create at: ";
        var tipo = document.createElement("h3");
        tipo.innerHTML = "Type: " + response[j].type;

        console.log(document.body);
        document.body.appendChild(divP);

        divP.appendChild(divTopo);
        divTopo.appendChild(span_1);
        divTopo.appendChild(span_2);

        divP.appendChild(divBaixa);
        divBaixa.appendChild(img_1);
        divBaixa.appendChild(img_2);

        divP.appendChild(painel);
        painel.appendChild(nomeDevice);
        painel.appendChild(criador);
        painel.appendChild(dataCriacao);
        painel.appendChild(tipo);

        if (response[j].type == "sensor") {
            var graficoDevice = document.createElement("canvas");
            graficoDevice.setAttribute("id", "id" + response[j].id);
            graficoDevice.setAttribute("width", "300");
            graficoDevice.setAttribute("height", "300"); 
            painel.appendChild(graficoDevice);

            var ctx = document.getElementById(graficoDevice.id);         
            plotarGrafico(ctx);
        }
        else if (response[j].type == "lixeira") {

            var mapaDevice = document.createElement("div");
            mapaDevice.setAttribute("id", "id" + response[j].id);
            mapaDevice.style.height = "300px";
            mapaDevice.style.marginTop = "10px";
            painel.appendChild(mapaDevice); 

            var ctxx = mapaDevice.id;
            criarMapa(ctxx, response2); 
        }

        $("#telaDispositivos").addClass("hidden");
        $('#telaCarregamento').addClass('hidden');
        $("#" + response[j].id).removeClass("hidden");

    });
    $.ajax(settings).fail(function (response) {
        $('#telaCarregamento').addClass('hidden');
        alert("Dados incorretos.");
    });
}
//Preencher e atualizar tabela
function preencherTabela() {
    fecharMenuLateral();
    $('#telaCarregamento').removeClass('hidden');
    document.getElementById("tblDispositivos").innerHTML = "";

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://131.221.240.23:18090/dashboard-api/listDevices",
        "method": "GET",
        "headers": {
            "cache-control": "no-cache"
        },
        "data": {
        }
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        var numDispositivos = response.length;
        var tblDispositivos = document.getElementById("tblDispositivos");

        tblDispositivos.innerHTML = "";
        var linhaPrincipal = document.createElement('tr');
        var coluna_1_principal = document.createElement('th');
        coluna_1_principal.innerHTML = "Device Name";
        var coluna_2_principal = document.createElement('th');
        coluna_2_principal.innerHTML = "Delete";
        tblDispositivos.appendChild(linhaPrincipal);
        linhaPrincipal.appendChild(coluna_1_principal);
        linhaPrincipal.appendChild(coluna_2_principal);
        tblDispositivos.innerHTML += "";

        for (var i = 0; i < numDispositivos; i++) {
            var nomeDevice = response[i].name;
            var newcontent1 = document.createElement('tr');
            var newcontent2 = document.createElement('td');            
            var newcontent3 = document.createElement('span');
            newcontent3.setAttribute("id", response[i].username);
            newcontent3.addEventListener("click", function () {
                criarTelaDevice(response,this.id);
            });
            newcontent3.innerHTML = nomeDevice;
            var newcontent4 = document.createElement('td');
            var newcontent5 = document.createElement('span');
            newcontent5.setAttribute("class", "trash-solid icon");
            newcontent5.addEventListener("click", function () {
                $(this).parents('tr').remove();
            });
            tblDispositivos.appendChild(newcontent1);
            newcontent1.appendChild(newcontent2);
            newcontent2.appendChild(newcontent3);
            newcontent1.appendChild(newcontent4);
            newcontent4.appendChild(newcontent5);
        }
        $('.page').addClass('hidden');
        $('#telaCarregamento').addClass('hidden');
        $('#telaDispositivos').removeClass('hidden');
    });
    $.ajax(settings).fail(function (response) {
        $('#telaCarregamento').addClass('hidden');
        alert("Erro");
    });
}