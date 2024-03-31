// forms
validaForm = function (f) {
  campos = f.querySelectorAll('[data-obrigatorio="1"]');

  for (i = 0; i < campos.length; i++) {
    funcoes = campos[i].getAttribute("data-funcoes").split("|");
    msgs = campos[i].getAttribute("data-erros").split("|");

    for (j = 0; j < funcoes.length; j++) {
      if (!window[funcoes[j]](campos[i], msgs[j])) return false;
    }
  }

  return true;
};

// formulários por ajax
var form1;

$("form[data-ajax]").on("submit", function () {
  if ($(this).hasClass("form_sending")) {
    return false;
  }

  form1 = this;
  if (!validaForm($(this)[0])) return false;

  if ($(this).attr("data-ajax") != "1") return true;

  bs = $(this).attr("data-beforeSend");
  if (typeof bs != "undefined" && typeof window[bs] != "undefined")
    window[bs](this);

  //adiciona isso para saber que foi envio via ajax
  $(this).append(
    '<input id="ajax_send_to_action" type="hidden" name="ajax" value="1">'
  );

  $(this).addClass("form_sending");

  if ($(this).attr("enctype") == "multipart/form-data") {
    fdata = new FormData(this);
    processData = false;
    contentType = false;
  } else {
    fdata = $(this).serialize();
    processData = true;
    contentType = "application/x-www-form-urlencoded; charset=UTF-8";
  }

  $.ajax({
    type: $(this).attr("method"),
    url: $(this).attr("action"),
    data: fdata,
    processData: processData,
    contentType: contentType,
  }).done(function (data) {
    id_msg = $(form1).attr("data-msg");
    if (typeof id_msg != "undefined" && id_msg != false) {
      $("#" + id_msg).css("color", data.cor);
      $("#" + id_msg).html(data.msg);
    }

    if (typeof data.eventos == "string") {
      send_event(data.eventos);
    } else if (typeof data.eventos == "object") {
      for (var j = 0; j < data.eventos.length; j++) {
        send_event(data.eventos[j]);
      }
    }

    if (data.erro == 0) {
      //segue um link, caso exista
      if (typeof data.location == "string") {
        if (data.location == "reload" || data.location == "refresh") {
          window.location.reload(true);
        } else {
          window.location.href = data.location;
        }
        return;
      }

      if (
        $(form1).attr("data-no-reset") != "1" &&
        $(form1).attr("data-no-reset") != "true"
      )
        form1.reset();

      //recarrega o captcha, caso exista
      recarregar_captcha = $(form1).find('[data-reload-form="1"]');
      if (recarregar_captcha.length) {
        recarregar_captcha[0].click();
      }
    }

    cmpl = $(form1).attr("data-oncomplete");
    if (typeof cmpl != "undefined" && typeof window[cmpl] != "undefined")
      window[cmpl](form1, data);

    if (data.reload_captcha && typeof grecaptcha == "object") {
      // grecaptcha.reset();
      var captcha_id = $(form1)
        .find("[data-grecaptcha]")
        .attr("data-grecaptcha");
      if (captcha_id.length > 0) {
        grecaptcha.reset(captcha_id);
      }
    }

    $(form1).removeClass("form_sending");
  });

  $("#ajax_send_to_action").remove();

  return false;
});

putSpinner = function (f) {
  if (f != false) {
    btn = $(f).find('[type="submit"]');
    if (btn.length) {
      $(btn)[0].disabled = true;
      if ($(btn).prop("nodeName").toLowerCase() == "button") {
        $(btn)[0].originalText = $(btn).html();
        $(btn).html($(btn).attr("data-sending"));
      } else {
        $(btn)[0].originalText = $(btn).val();
        $(btn).val($(btn).attr("data-sending"));
      }
    }
  }
};

removeSpinner = function (f, data) {
  if (f != false) {
    btn = $(f).find('[type="submit"]');
    if (btn.length) {
      $(btn)[0].disabled = false;
      if ($(btn).prop("nodeName").toLowerCase() == "button") {
        $(btn).html($(btn)[0].originalText);
      } else {
        $(btn).val($(btn)[0].originalText);
      }
    }
  }
};

// ga
// envia um evento do google analytics
send_event = function (label, category, action, callback) {
  if (
    typeof ENVIAR_EVENTOS_ANALYTICS != "boolean" ||
    !ENVIAR_EVENTOS_ANALYTICS
  ) {
    return;
  }

  category = category || label;
  action = action || "click";
  callback = callback || function () {};

  /* if(typeof gtag !== 'function'){
		console.log("Debug > Evento enviado: " + label);
		return;
	} */

  // gtag('event', action, {
  // 	event_category: category,
  // 	event_label: category,
  // 	event_callback: callback
  // });

  /* if(typeof ga != 'function'){
		console.log("Debug > Evento enviado: " + label);
		return;
	}
	ga('send', 'event', {
		eventCategory: category,
		eventAction: action,
		eventLabel: label,
		transport: 'beacon'
	}); */
};

set_event_session = function (evento) {
  var eventos_array = window.sessionStorage.getItem("eventos");

  if (eventos_array == null) {
    eventos_array = [];
  } else {
    eventos_array = JSON.parse(eventos_array);
  }

  eventos_array.push(evento);

  eventos_array = JSON.stringify(eventos_array);

  window.sessionStorage.setItem("eventos", eventos_array);

  return true;
};

//
$("[data-select-link-categoria]").on("change", function () {
  console.log("aaa");
  var link = $(this).find("option:selected").attr("data-url");
  window.location = link;
});

send_events_session = function () {
  var eventos_array = window.sessionStorage.getItem("eventos");

  if (eventos_array == null) {
    return;
  }

  eventos_array = JSON.parse(eventos_array);

  for (var ei = 0; ei < eventos_array.length; ei++) {
    send_event(eventos_array[ei]);
  }

  window.sessionStorage.setItem("eventos", "[]");
};

$("#select-categoria-peca").on("change", function () {
  var url = $(this).find("option:selected").attr("data-link");
  if (url.length == 0) {
    return;
  }
  window.location = url;
});

(function () {
  "use strict";

  var $bt = document.getElementById("bt-disparador");
  var $alvo = document.getElementById("modal-whatsapp");
  // $alvo.addEventListener('blur',function(){
  //  $bt.classList.remove('blur');

  // });

  // $bt.addEventListener('click', function (){
  //   if($bt.classList.contains('blur')){
  //     $alvo.blur();
  //     $bt.classList.remove('blur')
  //   }else {
  //     $alvo.focus();
  //     $bt.classList.add('blur')
  //   };
  // });
})();
