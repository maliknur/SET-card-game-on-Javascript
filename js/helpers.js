
// To create cards variations for SET game
function Card(id, properties) {
	this.id = id;
	this.attr = {
		color: properties.colors[Math.floor(id%81/27)], // color will change every 27 cards
		number: properties.numbers[Math.floor(id%27/9)], // number will change every 9 cards
		shade: properties.shades[Math.floor(id%9/3)], // shade will change every 3 cards
		shape: properties.shapes[Math.floor(id%3)]
	};

}


// to play sounds per game event
function audio(id){
	var audio = document.getElementById(id);
	audio.play();
}

// reset selected cards after Check button
function cleanSelect(array){
	if(array.length > 0){
		$.each(array,function(index, value){
			var el = document.getElementById(value);
			el.classList.remove("selected");

		});
	}
}

// change Hint div with ready solutions of SET game
function show_hide(target_id, button_id) {
	var e = document.getElementById(target_id);
	var btn = document.getElementById(button_id)
	
	if (e.style.display == 'block'){		
  		e.style.display = 'none';
  		btn.value = "Show Solutions"
  	} else{
  		e.style.display = 'block';
    	btn.value = "Hide Solutions"
    }
}


