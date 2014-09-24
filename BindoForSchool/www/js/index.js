/**
 * 
 */
var id = null;
var game = null;
var maxNumber = 75;
var nbAnim = 0;
var iterationPeriode = 100;
var iterationCount = 0;
var iterateTimer;
var iterateRollTimer;
var numberInProgress = null;
$(document).ready(function() {
	$('body').keyup(function(e) {
		if (!game.isFinish()) {
			if (e.keyCode == 32) {
				if (game.state == 'running') {
					$('#btPause').click();
				} else {
					$('#btNewNumber').click();
				}
			}
		}
		
		
	});
	
	
	// Init Default Value
	if (localStorage['BingoConfig']) {
		var tmpJSON = JSON.parse(localStorage['BingoConfig']);
		if(tmpJSON.maxNumber != null && tmpJSON.maxNumber != ''){
			maxNumber = tmpJSON.maxNumber;
		}
		if(tmpJSON.maxNumber != null && tmpJSON.iterationPeriode != ''){
			iterationPeriode = tmpJSON.iterationPeriode;
		}
		
		
	}
	$('#inputMaxNumber').val(maxNumber);
	$('#inputIterationPeriode').val(parseFloat(iterationPeriode /10 ));
	// $('#btNewNumber').hide();
	$('#btPause').hide();
	game = new Game(maxNumber);

	if (localStorage['BingoGame']) {
		game.load();
		/*
		for ( var number in game.numbers) {
			$('.number-grid').append(Mustache.to_html(tplNumberBlock, {
				id : number,
				number : number
			}));
		}
		*/
		for(var i=0; i< game.numbers.length; i++){
			$('.number-grid').append(Mustache.to_html(tplNumberBlock, {
				id : game.numbers[i],
				number : game.numbers[i]
			}));
		}
		if (game.isFinish()) {
			$('#btNewNumber').hide();
		}
	}
	$('#btnSave').click(function(){
		maxNumber = parseInt($('#inputMaxNumber').val());
		$('#inputMaxNumber').val(maxNumber)
		iterationPeriode = parseInt(parseFloat($('#inputIterationPeriode').val()) *10);
		localStorage['BingoConfig'] = JSON.stringify({
			maxNumber: maxNumber,
			iterationPeriode: iterationPeriode
		});
		$('#myModal').modal('hide');
	})
	$('#btNewNumber').click(function() {
		if (!game.isFinish()) {
			game.state = 'running';
			// $(this).prop('disabled', true);
			$(this).hide();
			$('.number-current').removeClass('activNumber');
			// $('#btPause').prop('disabled', false);
			$('#btPause').show();
			
			// animateRoll();
			iterateTimer = setTimeout(function() {
				progress()
			}, iterationPeriode);
		}
	});
	$('#btPause').click(function() {
		if (!game.isFinish()) {
			game.state = 'pause';
			// $(this).prop('disabled', true);
			// $('#btNewNumber').prop('disabled', false);
			$('#btNewNumber').show();
			$(this).hide();
			clearInterval(iterateRollTimer);
			if(numberInProgress == null){
				$('.number-current').html('-');
			}else{
				$('.number-current').html(numberInProgress);
			
			}
			clearInterval(iterateTimer);
		}
	});
	$('#btNew').click(function() {
		if (confirm('Are you sure to want to start a new party? ')) {
			game = new Game(maxNumber);
			$('.number-grid').html('');
			$('.number-current').html('-');
			// $('#btNewNumber').prop('disabled', false);
			// $('#btPause').prop('disabled', true);
			$('#btPause').hide();
			$('#btNewNumber').show();
			iterationCount = 99;
		}
	});

})
var tplNumberBlock = '<div id="number-{{{id}}}" class="number-block">'
		+ '<div data-number="{{{id}}}">{{number}}</div>' + '</li>';

function animateRoll() {
	if (!game.isFinish()) {
		if (nbAnim < 20) {
			$('.number-grid .number-block').removeClass('activNumber');
			$('.number-current').html(
					Math.floor((Math.random() * maxNumber) + 1));
			nbAnim++;
			iterateRollTimer = setTimeout(animateRoll, 50);
		} else {
			clearInterval(iterateRollTimer);
			numberInProgress = game.roll();
			$('.number-current').html(numberInProgress);
			$('.number-current').addClass('activNumber');
			$('#btNewNumber').prop('disabled', false);
			nbAnim = 0;
			$('.number-grid').append(Mustache.to_html(tplNumberBlock, {
				id : numberInProgress,
				number : numberInProgress
			}));
			$('.number-grid .number-block:last-child').addClass('activNumber');
			if (game.isFinish()) {
			// $('#btNewNumber').prop('disabled', true);
				$('#btNewNumber').hide();
				$('#btPause').hide();
				$('.number-grid')
						.prepend(
								'<center style="color: #E14F17;">All numbers have been drawn !</center>');
				clearInterval(iterateTimer);
			}
			if (!game.isFinish()) {
				iterateTimer = setTimeout(function() {
					progress()
				}, iterationPeriode);
			}
			game.save();
		}
	}
}

function progress() {

	var $bar = $('.progress-bar');

	if (iterationCount >= 100) {
		clearInterval(iterateTimer);

		$bar.css('width', "0");
		iterationCount = 0;
		animateRoll();
	} else {
		$bar.css('width', (iterationCount) + "%");
		iterationCount++;
		iterateTimer = setTimeout(function() {
			progress()
		}, iterationPeriode);
		// setTimeout(progress, iterationPeriode);
	}

}