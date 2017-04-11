(function() {
	'use strict';

	angular
		.module('chat')
		.controller('PartnerController', PartnerController);


	PartnerController.$inject = ['$scope', '$state', '$window', 'partnerResolve', 'Authentication', 'Notification'];


	function PartnerController($scope, $state, $window, partner, Authentication, Notification){
		var vm = this;

		vm.partner = partner;
		vm.authentication = Authentication;
		vm.save = save;
		vm.remove = remove;

		// remove a partner pairing
		function remove() {
			if(vm.partner.find( { chatting: false } )){
				vm.partner.$remove(function() {
					Notification.success({ message: 'You now can ge ta new chat partner!'});
				});
			}

		}

		// save a new partner pairing 
		function save(isValid) {
			// if its not the partner pairing we want
			if(!isValid){
				return false;
			}
			vm.partner.createOrUpdate()
				.then(successCallback)
				.catch(errorCallbacks);

			function successCallback(res) {
				Notification.success({ message: 'partner saved successfully' });
			}

			function errorCallback(res) { 
				Notification.error({ message: 'error saving partner' });
			}
		}
	}
}());