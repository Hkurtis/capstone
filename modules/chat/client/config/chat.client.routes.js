(function () {
  'use strict';
// var matcher = require('../../lib/matchUsers');
  angular
    .module('chat.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];
  var c = "/room";// need to make this somehow return the correct room
  function routeConfig($stateProvider) {
    $stateProvider
      .state('chat', {
        url: c,
        templateUrl: '/modules/chat/client/views/chat.client.view.html',
        controller: 'ChatController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Chat'
        }
      });
  }
}());
