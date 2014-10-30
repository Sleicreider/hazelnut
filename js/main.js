require.config({
	paths: {
		'game': 'game',
        'fpsmeter': 'fpsmeter',
		'pixi': 'libs/pixi'
	},
	shim: {
		'pixi': {
			exports: 'PIXI'
		}
	}
});

require(['pixi','game','fpsmeter'], function(pixi, game, fpsmeter){ 
	console.log('ready?', game);
	game.startGame();
});