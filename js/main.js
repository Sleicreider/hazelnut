require.config({
	paths: {
		'game': 'game',
		'pixi': 'libs/pixi'
	},
	shim: {
		'pixi': {
			exports: 'PIXI'
		}
	}
});

require(['pixi','game'], function(pixi, game){ 
	console.log('ready?', game);
	game.startGame();
});