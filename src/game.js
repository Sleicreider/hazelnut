Game = {
	// Initialize and start our game
	start: function() {
		// Start crafty and set a background color
		Crafty.init(480,320);
		Crafty.background('red');
		
		Crafty.e('2D, DOM, Color, Fourway')
			.attr({x: 0, y: 0, w: 100, h: 100})
			.color('#F00')
			.fourway(4);
	}
}