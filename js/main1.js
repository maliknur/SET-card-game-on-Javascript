
		function Card(id, properties) {
			this.id = id;
			this.attr = {
				color: properties.colors[Math.floor(id%81/27)], // color will change every 27 cards
				number: properties.numbers[Math.floor(id%27/9)], // number will change every 9 cards
				shade: properties.shades[Math.floor(id%9/3)], // shade will change every 3 cards
				shape: properties.shapes[Math.floor(id%3)]
			};

		}

		function Game(){
			this.deck = "empty deck";
			this.activeCards = "none";
			this.solutions = "none";
			this.possibleSets = 0;
			this.progressSteps = 0;

			this.makeDeck = function(){

				var properties = {
					colors: ["green", "purple", "red"],
					numbers: [1, 2, 3],
					shades: ['clear', 'shaded', 'solid'],
					shapes: ['diamond', 'oval', 'squiggle']
				};


				var cards = _.range(1,82);
				cards = _.shuffle(cards);
				this.deck = _.map(cards, function(id){return new Card(id, properties);});
			};

			this.deal = function(){

				this.activeCards = this.deck.splice(0,12); // pick out 12 cards
				var gameboard = document.getElementById("gameboard");
				gameboard.innerHTML = ""; // resets the game
				var cardDiv, // the div that will represent a playing card
					imageDiv; // the class name that will be given for the card's picture

				for(var i = 0; i < this.activeCards.length; i++){
					// create a blank card and attach it to the gameboard
					cardDiv = document.createElement("div");
					cardDiv.id = this.activeCards[i].id;
					cardDiv.className = "card th";
					gameboard.appendChild(cardDiv);

					// add the images to the card
					for(var j = 0; j < this.activeCards[i].attr.number; j++){
						imageDiv = document.createElement("div");
						imageDiv.className = "cardImage "+this.activeCards[i].attr.shade+"-"+this.activeCards[i].attr.shape+" "+this.activeCards[i].attr.color+"Card"; // producing class names that describe the card image
						cardDiv.appendChild(imageDiv);
					}
				}
			};


			this.displayCards = function(){

				for(var i = 0; i < this.activeCards.length; i++){
					// create a blank card and attach it to the gameboard
					cardDiv = document.createElement("div");
					cardDiv.id = this.activeCards[i].id;
					cardDiv.className = "card th";
					gameboard.appendChild(cardDiv);

					// add the images to the card
					for(var j = 0; j < this.activeCards[i].attr.number; j++){
						imageDiv = document.createElement("div");
						imageDiv.className = "cardImage "+this.activeCards[i].attr.shade+"-"+this.activeCards[i].attr.shape+" "+this.activeCards[i].attr.color+"Card"; // producing class names that describe the card image
						cardDiv.appendChild(imageDiv);
					}
				}
			}

			this.solve = function(){
				// var start = new Date();
				// console.log(start.getTime());

				var threeCardSet = [],
					attributes,
					vaconditionsMet = 0,
					solutions = [];

				// console.log(this.activeCards);
				// I NEED TO FIX THIS DISASTROUS 5 NESTED LOOP SEQUENCE!!!
				var counter = 0;
				var numCards = this.activeCards.length;
				for(var card1 = 0; card1 < numCards - 2; card1++){

					for(var card2 = card1+1; card2 < numCards- 1; card2++){


						for(var card3 = card2+1; card3 < numCards; card3++){ // looping through the 3rd card
							

							threeCardSet = [this.activeCards[card1], this.activeCards[card2], this.activeCards[card3]];
							
							conditionsMet = 0;

							for(attribute in threeCardSet[0].attr){ // for each attribute (color, shape, etc.)
								attributes = []; // empty out attributes
								for(card in threeCardSet){			// for each card in the 3 card set
									
									attributes.push(threeCardSet[card].attr[attribute]); 
									counter++;

								}
								// if neither "all attributes are equal" nor are they "all distinct" then break and try to find another 3rd card
								if(!(((attributes[0] == attributes[1]) && (attributes[1] == attributes[2])) || 
									((attributes[0] != attributes[1]) && (attributes[1] != attributes[2]) && (attributes[0] != attributes[2]))
									)){
									
									break;	
								} else{
									conditionsMet++;
								}
								
							}
							if (conditionsMet == 4){
								// console.log(threeCardSet);;
								solutions.push(threeCardSet);
								break;
							}
						}
					}	
				}
				console.log(counter);
				
				// var end = new Date();
				// console.log(end.getTime());
				// console.log("time = "+(end.getTime() - start.getTime()+"ms"));

				this.solutions = solutions;
				this.possibleSets = solutions.length;
				this.progressSteps = 100/solutions.length;

			}



			this.checkSet=function(arrayOfCards){

				for(var j = 0; j < this.solutions.length; j++) {

						var solutionSet = _.pluck(this.solutions[j], 'id');

						var result = _.isEqual(_.sortBy(arrayOfCards), _.sortBy(solutionSet));
						if(result){
							this.solutions.splice(j,1); // remove solution set from possible sets
							this.addCards(); // add 3 cards from deck
							this.removeCards(arrayOfCards);
							this.showCardsInDeck();
							this.displayCards();
							this.solve();

							return this.applause();
						}													
				}
					return this.failure();						
			}

			this.addCards = function(){

				if(this.activeCards.length >= 3){			
					for(i=0; i<3; ++i){
						this.activeCards.push(this.deck.splice(0,1)[0]);				
					}
				}
			}

			this.removeCards = function(arr){

				for(var i = 0; i < arr.length; ++i){
					var id = arr[i];
				

					for(var j = 0; j < this.activeCards.length; j++) {
    					var obj = this.activeCards[j];

    				if(obj.id == id) {
        				this.activeCards.splice(j, 1);
    					}
					}

				}

				$('.card').remove(); // remove cards from playground
			}

			this.applause = function(){
				
				if(this.possibleSets>0) {
					
					audio('applause');
					this.possibleSets--;
					this.counterPossibleSets();

				} else if(this.possibleSets === 0 && this.deck.length === 0) {
					audio('end');
					alert("All possible Sets already found!");

				}

				return true;
				
			}


			this.failure = function(){

				audio('failure');
				alert("Sorry, this is not a Set!");
				return false;
			}



			this.counterPossibleSets = function(){
				$('#availableSets').html("<p><strong>Possible sets: " + game.solutions.length +"</strong></p>");

			}
			

			this.showCardsInDeck = function(){

				$('#cardsInDeck').html('<b>Cards in Deck left: </b>' + this.deck.length);
			}


			this.makeDeck();
		}

		

		Game.prototype.showSolutions = function(){

			var solutionsDiv = document.getElementById("solutions");
			for(solution in this.solutions){  // for each set of solutions create a div row called set

				console.log((this.solutions[solution]).sort(function(obj1,obj2){
					return obj1.attr.number - obj2.attr.number;
				}));

				// this.solutions.sort(function(a,b){return a.attr})
				var set = document.createElement('div');
				set.className = "set";
				solutionsDiv.appendChild(set);
				var solutionLength = this.solutions[solution].length;
				for(var i = 0; i < solutionLength; i++){ 
					// create a blank card and attach it to the gameboard 
					cardDiv = document.createElement("div");
					cardDiv.className = "cardSolution";
					set.appendChild(cardDiv);

					// console.log(this.solutions[solution][i]);
				// add the images to the card
					for(var j = 0; j < this.solutions[solution][i].attr.number; j++){
						imageDiv = document.createElement("div");
						imageDiv.className = "cardImage "+this.solutions[solution][i].attr.shade+"-"+this.solutions[solution][i].attr.shape+" "+this.solutions[solution][i].attr.color+"Card"; // producing class names that describe the card image
						cardDiv.appendChild(imageDiv);
					}	
				}
			}
		

		}


		function audio(id){

			var audio = document.getElementById(id);
			audio.play();
		}

		function cleanSelect(array){
			if(array.length > 0){
				$.each(array,function(index, value){
					var el = document.getElementById(value);
					el.classList.remove("selected");

				});

			}

		}

		function show_hide(target_id, button_id) {
       		var e = document.getElementById(target_id);
       		var btn = document.getElementById(button_id)
       		if(e.style.display == 'block'){
          	e.style.display = 'none';
          	btn.value = "Show Solutions"
          	} else{
          	e.style.display = 'block';
	        btn.value = "Hide Solutions"
	        }
    	}



    	var game = new Game();

	

		$(document).ready(function(){

			

			audio('shuffle_cards');

		
			game.deal();
			game.solve();
			game.counterPossibleSets();
			game.showCardsInDeck();
			game.showSolutions();

			var attempCounts=0, errorCounts = 0;

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



			var selectedCards = [];
			var found = -1;
			
			
			
			$('div').on('click', '.card', function(event){

				event.stopPropagation();
				
				audio('click');

				$(this).toggleClass("selected");


				found = jQuery.inArray(parseInt(this.id), selectedCards);
				var id = this.id;
				if (found >= 0 && selectedCards.length > 0) {
	    			// Card already selected, remove it.
	    			//$(this).toggleClass("selected");
	    			//$(this).classList.remove("selected");
	    			$("#"+id).removeClass("selected");
	    			selectedCards.splice(found, 1);
				} else {
						if(selectedCards.length < 3){ 
							// Card was not selected before, add it.
					    	selectedCards.push(parseInt(this.id));
					    	console.log('Card selected -> '+ selectedCards);	
							} else {
									//console.log(this);
									//$(this).classList.remove("selected");
									$(this).toggleClass("selected");
									alert('Three cards already selected!');
								
								}
	    			
				}	
					
				
			});

	

			$('#reset').click(function(){

						location.reload();

			})


			$('#checkSet').click(function(){

				
				
				if(game.solutions.length==0){
					audio('end');
					alert("No Sets left to find!");
					
					
				} else if (selectedCards.length !== 3){
					alert("To check Sets, please select 3 cards");
					//cleanSelect(selectedCards);

				}
					else 
				{

					 var result = game.checkSet(selectedCards);
					 
					 if(result){
					 	console.log('result from checking -> ' + result);
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


		});
