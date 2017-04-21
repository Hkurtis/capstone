(function () {
  'use strict';

  angular
    .module('core')
    .controller('ConsentFormController', ConsentFormController);

  function ConsentFormController() {
    var vm = this;

    function page(theForm) {
      if (checkCheckBoxes(theForm)) {
        window.location.href="home";
      }
    }

    function checkCheckBoxes(theForm) {
      if (
        theForm.SECTION_1.checked == false &&
        theForm.SECTION_2.checked == false &&
        theForm.SECTION_3.checked == false &&
        theForm.SECTION_4.checked == false &&
        theForm.getElementsByTagName('DATE').hasAttribute == "" &&
        theForm.getElementsByTagName('TYPE_INITIALS').hasAttribute == "")
      {
        alert ('You didn\'t fill out the entire form!');
        return false;
      } else {
        return true;
      }
    }

  }
});
