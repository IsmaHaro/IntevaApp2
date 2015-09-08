var fn = {

    actividades: null,

    numActividades: data.length,

    numActividad: null,

	init: function(){

        $("div.page").addClass("inactive");
        $("div.page#principal").removeClass("inactive").addClass("active");

		$("#ingresar").tap(fn.login);
        $(".signout").tap(fn.logout);
        $("#verNosotros").tap(fn.nosotros);
        
        // Este es la accion para cuando se compile
        $("#tomarFoto").tap(mc.start);

        //Se sustituye la accion de arriba solo para hacer pruebas
        //$("#tomarFoto").tap(fn.pruebaFoto);

        $("#verificarProceso").tap(fn.verificarProceso);
        $("#cancelarProceso").tap(fn.cancelarProceso);

        //window.addEventListener("touchmove", function(e) {
        //    e.preventDefault();
        //}, false);

	},

	deviceready: function(){
		document.addEventListener("deviceready", fn.init, false);
    },

    login: function(){
    	var password = $("#password").val();

        // Verificar datos existentes en la BD
        if(password == "demo"){
            // cargar los datos del proceso
            // de acuerdo al usuario
            fn.cargarDatos();

            $(".numActividad").html(fn.numActividad);
            fn.cambiarPagina("#proceso");
            $("#password").val("");
        
        }else{
            console.log("Usuario o password incorrecta");
            $("#password").val("");
            $(".usuarioIncorrecto").css("opacity","1");
        }

    }, 

    logout: function(){
        fn.cambiarPagina("#principal");
    }, 

    nosotros: function(){
        fn.cambiarPagina("#nosotros");
    },

    cambiarPagina: function(pagina , numActividad){
        $("div.page").removeClass("active transition")
                     .addClass("inactive");
        $("div"+pagina).addClass("transition active");

        // Si tiene argumento numActividad es porque
        // vamos a agregar el numero de actividad al h2
        if(numActividad){
            $(".numActividad").html(numActividad);
        }
    },

    cargarDatos: function(){
        // cargar los datos de la BD
        // y desplegarlos en la vista de "proceso"
        var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Deciembre"];

        //Cargar fecha
        //Esto debe de ser desde el servidor CAMBIAR
        date = new Date();
        date = date.getDate()+" - "+monthNames[date.getMonth()]+" - "+date.getFullYear();

        //Colocar Datos
        $tableData = $("#datosProceso");
        $tableData.html('');

        for(i = 0; i < data.length ; i++){
            fn.numActividad = data[i].activityNumber;

            // Checar si esta resuelto o no, eso lo
            // se cambiara, pues el servidor nos devolvera
            // la actividad correspondiente
            if(data[i].solved == false){
                for(var prop in data[i]){
                    if (data[i].hasOwnProperty(prop)) {
                        if(data[i][prop] != ''){  
                            element = fn.createActivityElement(prop,data[i][prop]);
                            $tableData.append(element);
                        }
                    }
                }
                break;
            }
        }

        // retornar el numero de proceso
        return fn.numActividad;
    },

    createActivityElement: function(prop,data){
        element = '<tr><td class="icono">';

        icono     = '';
        contenido = data;

        // Colocar icono    
        switch(prop){
            case "workStation":
                icono = 'fa fa-industry';
                break;
            case 'date':
                icono = 'fa fa-calendar';
                break;
            case 'machine':
                icono = 'fa fa-gears';
                break;
            case 'client':
                icono = 'fa fa-building-o';
                break;
            case 'turn':
                icono = 'fa fa-clock-o';
                break;
            case 'operation':
                icono = 'fa fa-list-ol';
                break;
            case 'type':
                icono = 'fa fa-circle-thin';
                break;
            case 'colors':
                icono = 'fa fa-info-circle';
                var divColor = '<select>';
                for(var color in data){
                    if(data.hasOwnProperty(color)){
                        divColor += '<option style="background-color:'+data[color]+';">'+color+'</option>';
                    }
                }
                divColor += '</select>';
                element += '<i class="'+icono+'"></i></td><td class="'+prop+'">'+divColor+'</td></tr>';

                return element;
                break;
            default:
                icono = 'fa fa-square';
        }

        element +=  '<i class="'+icono+'"></i></td><td class="'+prop+'">'+data+'</td></tr>';

        return element;
    },

    verificarProceso: function(){
        // Enviar a la BD la foto y la informacion del proceso
        data[fn.numActividad-1].solved = true;

        // Despues cargar datos del siguiente proceso (si existe)
        // en la pagina proceso y volver a ella.

        if(fn.numActividad == fn.numActividades){
            fn.cargadorAjax("#fin");
            setTimeout(function(){
                fn.cambiarPagina("#principal");
                location.reload();
            },4500);

        }else{
            fn.cargarDatos();
            fn.cargadorAjax("#proceso",fn.numActividad);
        }
    },

    cargadorAjax: function(target, activityName){
        
        if(!activityName){
            activityName = null;
        }

        $(".loader").addClass('mostrar').removeClass('escondido');

        setTimeout(function(){
            $(".loader").addClass('escondido').removeClass('mostrar');
            fn.cambiarPagina(target, activityName);
        }, 2000);
    },

    cancelarProceso: function(){

        // en caso de cancelacion solo volver a la pagina del proceso
        fn.cambiarPagina("#proceso");
    },

    pruebaFoto: function(event){

        // desplegar la foto tomada
        $('#fotoTomada').css('background-image', 'url("img/fotoProceso.jpg")');
        $(".numActividad").html(fn.numActividad);
        fn.cambiarPagina("#fotoProceso");

    }
}

$(fn.deviceready);

//fn.init();