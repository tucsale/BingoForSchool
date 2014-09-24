var Game = function(maxNumber_){
	this.numbers = [];
	this.type = 'Line';
	this.maxNumber = maxNumber_;
	this.date = Date.now();
	this.state = 'new';
};

Game.prototype.roll = function(){
	do{
		var number = Math.floor((Math.random() * maxNumber) + 1);
		var found = false;
		for(var i in this.numbers){
			if(this.numbers[i] == number){
				found = true;
				break;
			}
		}
	}while(found);
	this.numbers.push(number);
	return number;
}

Game.prototype.isFinish = function(){
	if(this.numbers.length == this.maxNumber){
		return true;
	}else{
		return false;
	}
}

Game.prototype.save = function(){
	localStorage['BingoGame'] = this.toString();
}

Game.prototype.toString = function(){
	return JSON.stringify({
		numbers: this.numbers.join('#@#'),
		type: this.type,
		maxNumber: this.maxNumber,
		date: this.date,
		state: this.state
	});
}

Game.prototype.finish = function(){
	this.state = 'finish';
}
Game.prototype.load = function(){
	if(localStorage['BingoGame']){
		var tmpJSON = JSON.parse(localStorage['BingoGame']);
		if(tmpJSON.numbers != ''){
			this.numbers = tmpJSON.numbers.split('#@#');
		}
		if(tmpJSON.type != ''){
			this.type = tmpJSON.type;
		}
		if(tmpJSON.maxNumber != ''){
			this.maxNumber = tmpJSON.maxNumber;
		}
		if(tmpJSON.date != ''){
			this.date = tmpJSON.date;
		}
		if(tmpJSON.state != ''){
			this.state = tmpJSON.state;
		}
	}
}
