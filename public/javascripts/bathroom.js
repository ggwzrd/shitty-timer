'use strict';

var app = window.app = {};

app.Bathroom = function(){
	// elements
	this._main_e = $('#bathroom');
	this._timer_e = $('.timer');
	this._sel_location_e = $('#location');
	// costants
	this.reloadInterval = 1000 * 0.2;
	this.timer = 15 * 60 * 1000;
	// variables
	this.interval = null;
	this.location = 'bathroom'
	this.state = {
		bathroom:{
			"state": null,
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
	// initialize application
	this._initializer.bind(this)();
};

app.Bathroom.prototype = {

	_initializer: function(){
		// listening for changing in the current state (kind of an homemade Socket IO)
		this._bathroomStatus();
		setInterval(function () {
			this._currentState();
		}.bind(this), this.reloadInterval);
		// change status
		this._main_e.on('click', function(e){
			e.preventDefault();
			var currentLocation = $('#location option:selected').val();
			var newState = {};
			if(currentLocation === 'kitchen') return false;
			this._bathroomStatus();
		}.bind(this));
	},
	_bathroomStatus: function(){
		var newState = {};

		switch(this.state.bathroom.state){
			case 'available':
				newState = Object.assign({}, this.state, {
					bathroom: {
						state: 'busy',
						startAt: Date.now(),
						currentUser: null
					}
				});
				this._updateState(newState);
				break;
			case 'busy':
				newState = Object.assign({}, this.state, {
					bathroom: {
						state: 'available',
						startAt: 0,
						currentUser: null
					}
				});
				this._updateState(newState);
				break;
			case null:
				this._currentState();
				break;
		};
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
		var timerStarted = startAt !== 0 ? startAt : Date.now(), // some mock date
		now = Date.now(),
		delay = now - timerStarted, // calc delay
		currentTimer = ((this.timer - delay)/ 1000) -1, // converting timer in seconds
		min = 0, sec = 0;
		this.interval = setInterval(function () {
			min = ("0" + Math.floor(currentTimer / 60)).slice(-2),
			sec = ("0" + Math.floor(currentTimer % 60)).slice(-2);
			this._timer_e.text(min + ' : ' + sec);
			currentTimer > 0 ? currentTimer -- : this._stopTimer();
		}.bind(this), 1000);
	},

	_stopTimer: function(){
		clearInterval(this.interval);
		this.timer = 15 * 60 * 1000;
		this._timer_e.text('15:00')
	},

	_pauseTimer: function(){
		console.warn('WARNING: function not implemented yet');
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
  	.fail(function(res, type, error) {
	    console.error('update failed: ', error);
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
  	.done(function(res) {
			var state = res;
			if(state.bathroom.state !== this.state.bathroom.state)
				this._updateAppState(state);
  	}.bind(this))
  	.fail(function(res, type, error) {
	    console.error('socket failed: ', type, error);
			console.log('response: ', res);
  	});
	}
}
