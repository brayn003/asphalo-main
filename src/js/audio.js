function Audio(obj){
	_this = this;
	this.obj = obj;
	this.audioControl = document.getElementById('audioControl');
	this.audioSource = document.getElementById('audioSource');

	this.play = function(key){
		_this.audioSource.src = obj.source[key];
		_this.audioControl.load();
		_this.audioControl.play();
		// console.log("Hello");
	}

}

var audio = new Audio({
	source : {
		'click' : 'assets/sound/click1.mp3',
		'click2' : 'assets/sound/click2.mp3'
	}
})

// audio.play('click');