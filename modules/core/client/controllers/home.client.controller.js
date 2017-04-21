(function () {
   'use strict';

   angular
     .module('core')
     .controller('HomeController', HomeController);

     HomeController.$inject = ['Authentication'];

   function HomeController(Authentication) {
     var vm = this;
     vm.authentication = Authentication;
   }
 })();
