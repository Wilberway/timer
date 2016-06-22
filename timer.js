(function(){
	//定义Timer
	function Timer(el, options) {
		_this = this;
		this.id = typeof el == 'string' ? document.querySelector(el) : el;
		this.options = {time: 0,stamp: 0,timezone: 0, callback: null};
		var time = 0, now = new Date(), date = {s: 0, m: 0, h: 0, d: 0}, regexp = /\{([smhd])\}/g;
		var text = this.id.innerHTML;
		for ( var i in options ){
			if(options.hasOwnProperty(i)){
				this.options[i] = options[i];
			}
		}
		//判断输入是否为数字
		if((this.options.time && !Number(this.options.time)) || (this.options.stamp && !Number(this.options.stamp)) || (this.options.timezone && !Number(this.options.timezone))){
			console.log('wrong input');
			_this.id.innerHTML = text.replace(/\{([smhd])\}/g,function(rs,$1){return 0});
			return;
		}
		//判断输入毫秒数还是时间戳
		if(!this.options.time || this.options.time == 0){
			time = this.options.stamp * 1000 - (now.getTime());
		}else {
			time = this.options.time;
			this.options.timezone = Math.floor(now.getTimezoneOffset()/60);
		}
		//判断数字是否输入有误
		if(time < 0 || this.options.timezone > 23 || this.options.timezone < -23 || (this.options.stamp && this.options.stamp.toString().length != 10)) {
			console.log('wrong time input');
			_this.id.innerHTML = text.replace(/\{([smhd])\}/g,0);
			return;
		}
		//计算时间
		time = Math.floor((time - (Math.floor(now.getTimezoneOffset()/60) - this.options.timezone) * 3600000)/1000);
		if(time < 0) {
			console.log('wrong time input');
			_this.id.innerHTML = text.replace(/\{([smhd])\}/g,0);
			return;
		}
		calTime(date,time);
		format(this,date,text,regexp);
		start(this,date,time,text,regexp);
	}
	//格式化时间
	function format(_this,date,text,regexp){
		for(var i in date){
			if(date[i].toString().length == 1){
				date[i] = '0' + date[i];
			}
		}
		_this.id.innerHTML = text.replace(regexp,function(rs,$1){return date[$1]});
	}
	//开始倒计时
	function start(_this,date,time,text,regexp){
		_this.t = setInterval(timing,1000);
		function timing(){
			if(time > 0){
				time -= 1;
				update(_this,date,time,text,regexp);
			}else{
				update(_this,date,0,text,regexp);		
			}
		}
	}
	//计算时间
	function calTime(date,time){
		date.s = time % 60;
		date.m = (time - date.s) / 60 % 60;
		date.h = ((time - date.s) /60 - date.m) / 60 % 24;
		date.d = (((time - date.s) /60 - date.m) /60 - date.h) / 24;
	}
	//更新时间数据
	function update(_this,date,time,text,regexp){
		if(time > 0){
			calTime(date,time);
			format(_this,date,text,regexp);
		}
		else{
			date.s = 0;
			format(_this,date,text,regexp);
			window.clearInterval(_this.t);
			if(_this.options.callback && _this.options.callback instanceof Function) {
				_this.options.callback();
			}
		}
	}
	window.Timer = Timer;
})();