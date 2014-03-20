$(document).ready(function(){

	$('.phone.divider .icon').on('click', bringUpPhoneMenu);

});

function bringUpPhoneMenu() {
	
	$(".ui.modal").modal("show", function() {
		$('.ui.dimmer').on('click', function(){console.log('asd')});
	});
	$('body').css('overflow','hidden');

}