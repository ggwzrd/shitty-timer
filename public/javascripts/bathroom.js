
debugger
var app = window.app = {};
var database = './src/bathroom.json';

app.Bathroom = function(jsonfile){
	// costants
	this.jsonfile = jsonfile;
	this.reloadInterval = 1000 * 10;
	this.timer = 15 * 60 * 1000;
	this.interval = null;
	// values
	this.startAt = $('#start-at').val();
	this.status = $('#status').val() === 'available';
	this.location = $('#location').val();
	// elements
	this._main_e = $('#bathroom');
	this._timer_e = $('.timer');
	this._startAt_e = $('#start-at');
	this._status_e = $('#status');
	this._location_e = $('#location');
	this._initializer.bind(this)();
};

app.Bathroom.prototype = {

	_initializer: function(){
		// reload the page
		setInterval(function () {
			console.log(this.jsonfile.readFileSync(database));
		}, this.reloadInterval);
		this._main_e.on('click', function(e){
			e.preventDefault();
			this.status = !this.status;
			this._changeStatus(this.status);
		}.bind(this));
	},

	_changeStatus: function(statusType){
		if(statusType){
			this._main_e.removeClass('busy');
			this._main_e.addClass('available');
			this._stopTimer();
		}else{
			this._main_e.removeClass('available');
			this._main_e.addClass('busy');
			this._startTimer();
		}
	},

	_startTimer: function(){
		var currentTimer = this.timer;
		// converting timer in seconds
		currentTimer = (currentTimer / 1000) -1;
		this.interval = setInterval(function () {
			this._timer_e.text(Math.floor(currentTimer / 60) + ' : ' + Math.floor(currentTimer % 60));
			currentTimer --;
		}.bind(this), 1000);
	},

	_stopTimer: function(){
		clearInterval(this.interval);
		this.timer = 15 * 60 * 1000;
		this._timer_e.text('15:00')
	},

	_pauseTimer: function(){

	},
}
