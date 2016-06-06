(function ($) {
  $(document).ready(function(){

    // Fade in age gate. Add class when shown for css transitions.
    $('#stone-age-gate').delay(100).fadeIn(900, function(){
      $(this).addClass('visible');
    });
    // Disable body scrolling while age gate open
    $('body').css('overflow', 'hidden');

    // Check if the date entered is valid. Add class to submit button if so.
    $('#stone-age-gate input[type="text"]').keyup(function(){
      var month = $('#stone-age-gate input.month').val();
      var monthInt = parseInt(month);
      var year = $('#stone-age-gate input.year').val();
      var yearInt = parseInt(year);
      var errors = false;

      // Validate that
      if (!isNumeric(month) || monthInt < 1 || monthInt > 12){
        errors = true;
      }
      if (!isNumeric(year) || yearInt < 1800) {
        errors = true;
      }

      if (!errors) {
        var drinking_age = moment().subtract(21, 'years');
        var user_age = moment().set({'year': year, 'month': month});
        if (user_age.isValid()) {
          if (user_age.isAfter(drinking_age)) {
            $('#stone-age-gate').addClass('invalid-date').removeClass('valid-date');
          } else {
            $('#stone-age-gate').addClass('valid-date').removeClass('invalid-date');
            $('#stone-age-gate .errors-container').empty();
          }
        } else {
          $('#stone-age-gate').removeClass('valid-date').removeClass('invalid-date');
        }

      }
    });

    //Safari Fix - Doesn't apply focus on button when clicked
    $('#stone-age-gate form .mobile').click(function(){
      $(this).focus();
    })

    // Handle age gate form submission & validaton
    $('#stone-age-gate form').submit(function(e){
      var clicked_btn = $(this).find("input[type=submit]:focus").val();
      var remember = $(this).find('input#remember_me').is(':checked');
      var errors = [];
      var errors_container = $('#stone-age-gate .errors-container').empty();

      // Mobile users only have to click yes.
      if (clicked_btn == 'yes') {
        close_age_gate(remember);
      }

      if (clicked_btn == 'no') {
        errors.push('Sorry, you need to be of legal dringing age to access this site.');
      }

      // Desktop users age must be over 21
      if (clicked_btn != 'yes' && clicked_btn != 'no') {
        var month = $(this).find('input.month').val();
        var monthInt = parseInt(month);
        var year = $(this).find('input.year').val();
        var yearInt = parseInt(year);

        // Validate that
        if (!isNumeric(month)){
          errors.push('Please enter your birth month.');
        } else if (monthInt < 1 || monthInt > 12) {
          errors.push('Please enter your birth month as a number between 1 and 12');
        }
        if (!isNumeric(year)){
          errors.push('Please enter your birth year.');
        } else if (yearInt < 1800) {
          errors.push('Please enter your full birth year as a four digit number.');
        }

        if (!errors.length) {
          var drinking_age = moment().subtract(21, 'years');
          var user_age = moment().set({'year': year, 'month': month});
          if (user_age.isAfter(drinking_age)) {
            errors.push('Sorry, you need to be of legal dringing age to access this site.');
          }
        }
      }

      if (errors.length) {
        for (var i = 0; i < errors.length; i++) {
          errors_container.append('<p>'+ errors[i] +'</p>');
        };
      } else {
        close_age_gate(remember);
      }

      // prevent normal form submission
      e.preventDefault();
      return false;
    });


    // Toggle class for mobile slide out copy
    $('.age-gate-link-toggle').click(function(e){
      e.preventDefault();
      $('#stone-age-gate').toggleClass('slideRight');
    })

    function close_age_gate(remember) {
      window.location.hash = 'ageGatePassed';
      if (remember) {
        $.cookie('Drupal.visitor.age_gate_passed', 1, {expires: 30, path: '/'});
      } else {
        $.cookie('Drupal.visitor.age_gate_passed', 1, {path: '/'});
      }

      $.event.trigger({type: 'ageGateClosing'});
      $('#stone-age-gate').addClass('hiding').delay(600).fadeOut(600, function(){
        $.event.trigger({type: 'ageGateClosed'});
      });
      $('body').css('overflow', 'auto');
      $('html, body').scrollTop(0);
    }

    function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }


  });
})(jQuery);
