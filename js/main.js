$(document).ready(function(){

			// iniate game on load
			var game = new Game();

			audio('shuffle_cards');

			//call game's some functions
			game.deal();
			game.solve();
			game.counterPossibleSets();
			game.showCardsInDeck();
			game.showSolutions();

			var attempCounts=0, 
				errorCounts = 0;

			var selectedCards = [];
			var found = -1;
						
			
			// function to handle on click of cards
			$('div').on('click', '.card', function(event){

				event.stopPropagation();
				
				audio('click');

				$(this).toggleClass("selected");

				found = jQuery.inArray(parseInt(this.id), selectedCards);
				var id = this.id;

				//selected card already clicked
				if (found >= 0 && selectedCards.length > 0) {
	    			$("#"+id).removeClass("selected");
	    			selectedCards.splice(found, 1);
				
				} else {
						// Card was not selected before, add it.
						if(selectedCards.length < 3){ 							
					    	selectedCards.push(parseInt(this.id));
							} else {
								$(this).toggleClass("selected");
								alert('Three cards already selected!');
								}
	    			
						}					
			});

	
			// new game session
			$('#reset').click(function(){
				location.reload();
			})

			// handle Check Set button	
			$('#checkSet').click(function(){				
				if(game.solutions.length==0){
					audio('end');
					alert("No Sets left to find!");
									
				} else if (selectedCards.length !== 3){
					alert("To check Sets, please select 3 cards");

				} else {

					 var result = game.checkSet(selectedCards);
					 
					 if(result){
					 	$('#solutions').html("");
					 	game.showSolutions();
					 	game.counterPossibleSets();
					 	selectedCards = [];
					 	attempCounts++;
						attemptsCircle.update(attempCounts, 100);

					 }  else {	
					 	errorCounts++;
					 	errorsCircle.update(errorCounts, 100);

					 }
				}

				cleanSelect(selectedCards);
				selectedCards = [];
				
				cardsCircle.update(game.deck.length, 100);				

			})


			// initiate Progress Circles with Circles.js library
			var cardsCircle = Circles.create({
				  id:                  'cardsCircle',
				  radius:              40,
				  value:               game.deck.length,
				  maxValue:            69,
				  width:               10,
				  text:                function(value){return value;},
				  colors:              ['#BFBFBF', '#05BADE'],
				  duration:            50,
				  wrpClass:            'circles-wrp',
				  textClass:           'circles-text',
				  valueStrokeClass:    'circles-valueStroke',
				  maxValueStrokeClass: 'circles-maxValueStroke',
				  styleWrapper:        true,
				  styleText:           true
				});

			var attemptsCircle = Circles.create({
				  id:                  'attemptsCircle',
				  radius:              40,
				  value:               attempCounts,
				  maxValue:            100,
				  width:               10,
				  text:                function(value){return value;},
				  colors:              ['#BFBFBF', '#079B12'],
				  duration:            50,
				  wrpClass:            'circles-wrp',
				  textClass:           'circles-text',
				  valueStrokeClass:    'circles-valueStroke',
				  maxValueStrokeClass: 'circles-maxValueStroke',
				  styleWrapper:        true,
				  styleText:           true
				});
			var errorsCircle = Circles.create({
				  id:                  'errorsCircle',
				  radius:              40,
				  value:               errorCounts,
				  maxValue:            100,
				  width:               10,
				  text:                function(value){return value;},
				  colors:              ['#BFBFBF', '#BF3921'],
				  duration:            50,
				  wrpClass:            'circles-wrp',
				  textClass:           'circles-text',
				  valueStrokeClass:    'circles-valueStroke',
				  maxValueStrokeClass: 'circles-maxValueStroke',
				  styleWrapper:        true,
				  styleText:           true
				});



		});