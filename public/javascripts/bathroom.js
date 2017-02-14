'use strict';

var app = window.app = {};
var database = './src/bathroom.json';

app.Bathroom = function(){
	// costants
	this.reloadInterval = 1000 * 0.2;
	this.timer = 15 * 60 * 1000;
	this.interval = null;
	// values
	this.state = {
		bathroom:{
			"state": "available",
			"startAt": 0,
			"currentUser": null,
		},
		"roommates":[
			{"name": "Giulio"},
			{"name":"Miriam"},
			{"name":"Marine"},
			{"name":"Daniele"},
			{"name":"Romina"},
		]
	};
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
			this._currentState();
		}.bind(this), this.reloadInterval);

		// change status
		this._main_e.on('click', function(e){
			e.preventDefault();
			var newState = {};
			if(this.state.bathroom.state === 'available'){
				newState = Object.assign({}, this.state, {
					bathroom: {
						state: 'busy',
						startAt: Date.now(),
						currentUser: null
					}
				});
				this._updateState(newState);
			}else{
				newState = Object.assign({}, this.state, {
					bathroom: {
						state: 'available',
						startAt: 0,
						currentUser: null
					}
				});
				this._updateState(newState);
			}
		}.bind(this));
	},

	_updateUI: function(bathroom){
		var available = bathroom.state === 'available';
		if(available){
			this._main_e.removeClass('busy');
			this._main_e.addClass('available');
			this._stopTimer();
		}else{
			this._main_e.removeClass('available');
			this._main_e.addClass('busy');
			this._startTimer(bathroom.startAt);
		}
	},

	_startTimer: function(startAt){
		startAt = parseInt(startAt, 10);
		// finding delay
		var timerStarted = startAt !== 0 ? startAt : Date.now(); // some mock date
		var now = Date.now();
		var delay = now - timerStarted // calc delay
		var currentTimer = this.timer - delay;
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

	_updateAppState: function(updatedState){
		this.state = updatedState;
		this._updateUI(this.state.bathroom);
	},

	_updateState: function(state){
		$.ajax({
	    type: "PATCH",
	    url: "/state",
	    data: JSON.stringify({
				data: state,
    	}),
	    processData: false,
	    contentType: "application/json",
	    dataType: "json"
  	})
  	.done(function(state) {
			this._updateAppState(state);
  	}.bind(this))
  	.fail(function(error) {
	    console.log(error);
  	});
	},

	_currentState: function(){
		$.ajax({
	    type: "GET",
	    url: "/current-state",
	    processData: false,
	    contentType: "application/json",
	    dataType: "json"
  	})
  	.done(function(state) {
			if(state.bathroom.state !== this.state.bathroom.state)
				this._updateAppState(state);
  	}.bind(this))
  	.fail(function(error) {
	    console.log(error);
  	});
	}
}
