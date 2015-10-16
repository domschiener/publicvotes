Template.main.rendered = function() {

  Session.set('pagenum', 0);
  $(function() {

    $("#vote_limit").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) ||
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    $("[type='checkbox']").bootstrapSwitch();
    $('input.getName').keyup("keyup", function() {
      $('.cName').html($('.getName').val());
    });
    $('.help').popover();

    var img_cnt = $('li.activate').index() + 1;

    var img_amt = $('li.form-group').length;
    $('.img_cnt').html(img_cnt);
    $('.img_amt').html(img_amt);
    var progress = ($('.img_cnt').text() / $('.img_amt').text()) * 100;
    $('.progress-bar').css("width", progress + "%");
    $('.make_btn_appear').keyup(function() {
      $('#nxt').removeClass("hide fadeOutDown").addClass("fadeInUp");
    })
    $('.popup_success').keyup(function() {
      $('#submit').removeClass("hide fadeOutDown").addClass("fadeInUp");
    })

    $('#nxt').click(function() {
      $('#nxt').removeClass("fadeInUp").addClass('fadeOutDown');

      if ($('.progress-form li').hasClass('activate')) {

        $('p.alerted').removeClass('fadeInLeft').addClass('fadeOutUp');

        var $activate = $('li.activate');
        var $inactive = $('li.inactive');
        $activate.removeClass("fadeInRightBig activate").addClass('fadeOutLeftBig hidden');
        $inactive.removeClass("hide inactive").addClass("activate fadeInRightBig").next().addClass('inactive');

        var img_cnt = $('li.activate').index() + 1;

        var img_amt = $('li.form-group').length;
        $('.img_cnt').html(img_cnt);
        $('.img_amt').html(img_amt);
        var progress = ($('.img_cnt').text() / $('.img_amt').text()) * 100;
        $('.progress-bar').css("width", progress + "%");
        Session.set('pagenum',img_cnt);
        if (Session.get('pagenum') == 2) {
          $('#nxt').removeClass("hide fadeOutDown").addClass("fadeInUp");
        }
      }
    });
  });
}
