function Game(){
			this.deck = "empty";
			this.activeCards = "none";
			this.solutions = "none";
			this.possibleSets = 0;

			//constructor of all cards
			this.createDeck = function(){

				var cards = _.range(1,82);
				cards = _.shuffle(cards);

				var properties = {
					colors: ["green", "purple", "red"],
					numbers: [1, 2, 3],
					shades: ['clear', 'shaded', 'solid'],
					shapes: ['diamond', 'oval', 'squiggle']
				};
				this.deck = _.map(cards, function(id)
					{return new Card(id, properties);
				});
			};

			// select 12 cards from the deck and display them on gameboard
			this.deal = function(){

				this.activeCards = this.deck.splice(0,12);
				var gameboard = document.getElementById("gameboard");
				gameboard.innerHTML = ""; 
				var cardDiv, 
					iconDiv;
				for(var i = 0; i < this.activeCards.length; i++){
					
					cardDiv = document.createElement("div");
					cardDiv.id = this.activeCards[i].id;
					cardDiv.className = "card th";
					gameboard.appendChild(cardDiv);

					for(var j = 0; j < this.activeCards[i].attr.number; j++){
						iconDiv = document.createElement("div");
						iconDiv.className = "cardImage "+this.activeCards[i].attr.shade+"-"+this.activeCards[i].attr.shape+" "+this.activeCards[i].attr.color+"Card"; // producing class names that describe the card image
						cardDiv.appendChild(iconDiv);
					}
				}
			};

			// display card on gameboard
			this.displayCards = function(){

				for(var i = 0; i < this.activeCards.length; i++){					
					cardDiv = document.createElement("div");
					cardDiv.id = this.activeCards[i].id;
					cardDiv.className = "card th";
					gameboard.appendChild(cardDiv);

					for(var j = 0; j < this.activeCards[i].attr.number; j++){
						iconDiv = document.createElement("div");
						iconDiv.className = "cardImage "+this.activeCards[i].attr.shade+"-"+this.activeCards[i].attr.shape+" "+this.activeCards[i].attr.color+"Card"; // producing class names that describe the card image
						cardDiv.appendChild(iconDiv);
					}
				}
			};


			// Find all possible solutions for selected 12 cards
			this.solve = function(){

				var threeCardSet = [],
					attributes,
					matchCounter,
					solutions = [];

				var counter = 0;
				var numCards = this.activeCards.length;
				for(var card1 = 0; card1 < numCards - 2; card1++){

					for(var card2 = card1+1; card2 < numCards- 1; card2++){


						for(var card3 = card2+1; card3 < numCards; card3++){ 
							

							threeCardSet = [this.activeCards[card1], this.activeCards[card2], this.activeCards[card3]];
							
							matchCounter = 0;
							// iterate through atteributes of each card
							for(attribute in threeCardSet[0].attr){
								attributes = [];
								for(card in threeCardSet){	
									
									attributes.push(threeCardSet[card].attr[attribute]); 
									counter++;

								}
								// check for same or different attributes between 3 cards
								if(!(((attributes[0] == attributes[1]) && (attributes[1] == attributes[2])) || 
									((attributes[0] != attributes[1]) && (attributes[1] != attributes[2]) && (attributes[0] != attributes[2]))
									)){
									
									break;	
								} else{
									matchCounter++;
								}
								
							}
							if (matchCounter == 4){
								solutions.push(threeCardSet);
								break;
							}
						}
					}	
				}
			
				this.solutions = solutions;
				this.possibleSets = solutions.length;
			};


			// display hint solutions with ready SETs
			this.showSolutions = function(){

				var solutionsDiv = document.getElementById("solutions");
				for(solution in this.solutions){  
					console.log((this.solutions[solution]).sort(function(obj1,obj2){
						return obj1.attr.number - obj2.attr.number;
					}));

					var set = document.createElement('div');
					set.className = "set";
					solutionsDiv.appendChild(set);
					var solutionLength = this.solutions[solution].length;
					for(var i = 0; i < solutionLength; i++){ 
		
						cardDiv = document.createElement("div");
						cardDiv.className = "cardSolution";
						set.appendChild(cardDiv);


						for(var j = 0; j < this.solutions[solution][i].attr.number; j++){
							imageDiv = document.createElement("div");
							imageDiv.className = "cardImage "+this.solutions[solution][i].attr.shade+"-"+this.solutions[solution][i].attr.shape+" "+this.solutions[solution][i].attr.color+"Card"; // producing class names that describe the card image
							cardDiv.appendChild(imageDiv);
						}	
					}
				}
		

			}


			// check if selected cards are in one of solution sets
			this.checkSet=function(arrayOfCards){

				for(var j = 0; j < this.solutions.length; j++) {

						var solutionSet = _.pluck(this.solutions[j], 'id');

						var result = _.isEqual(_.sortBy(arrayOfCards), _.sortBy(solutionSet));
						if(result){
							this.solutions.splice(j,1); 
							this.removeCards(arrayOfCards);
							this.addCards();
							this.showCardsInDeck();
							this.displayCards();
							this.solve();
							return this.applause();
						}													
					}
				return this.failure();						
			};


			// add three new cards to gameboard
			this.addCards = function(){

				if(this.deck.length >= 3){			
					for(i=0; i<3; ++i){
						this.activeCards.push(this.deck.splice(0,1)[0]);				
					}
				}
			};

			// remove three selected cards if SET complete
			this.removeCards = function(arr){
				for(var i = 0; i < arr.length; ++i){
					var id = arr[i];	
					for(var j = 0; j < this.activeCards.length; j++) {    					
    					var obj = this.activeCards[j];
	    				if(obj.id == id) {
	        				this.activeCards.splice(j, 1);
	        				j = this.activeCards.length; // to skip unnecessary iterations
	    				}
					}
				}

				$('.card').remove();
			};

			// sets of procedures when selected cards made SET
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
			};


			// sets of procedures when selected cards didn't made SET
			this.failure = function(){
				audio('failure');
				alert("Sorry, this is not a Set!");
				return false;
			};

			// display possible solutions after each deck release
			this.counterPossibleSets = function(){
				$('#availableSets').html("<p><strong>Possible sets: " + this.solutions.length +"</strong></p>");

			};
			
			// disolay counter of cards left in deck
			this.showCardsInDeck = function(){

				$('#cardsInDeck').html('<b>Cards in Deck left: </b>' + this.deck.length);
			}

		
		this.createDeck();

}



