d3.Timeseries = function(){
	
	//Internal veriables
	var w = 800,
		h = 600,
		m = {t:50, r:25, b:50, l:25},
		chartW = w - m.l - m.r,
		chartH = h - h.t - h.b,
		timeRange = [new Date(), new Date()],
		binSize = d3.time.day,		
		valueAccessor = function(d){
			return d.startTime;},
		maxY = 1000,
		layout = d3.layout.histogram()
		.value(valueAccessor)
		.range(timeRange)
		.bins(binSize.range(timeRange[0],timeRange[1]));
	
	var scaleX = d3.time.scale().range([0,chartW]).domain(timeRange),
		scaleY = d3.scale.linear().range([chartH,0]).domain([0,maxY]);	
	
	var DataArray = [];
	var MaxYNO = 0;
	
	//exports
	function exports(_selection){
		
//		console.log(_selection.x);
		
//		console.log(_selection);
		
		layout = d3.layout.histogram()
		.value(valueAccessor)
		.range(timeRange)
		.bins(binSize.range(timeRange[0],timeRange[1]));		
		
		chartW = w - m.l - m.r;
		chartH = h - m.t - m.b;
		
		valueAccessor = function(d){

			return d.startTime;}
		
		_selection.each(function(_d){
			
			var data = layout(_d)
			var Maxdata = [layout(_d)];
			//console.log(Maxdata);
//			console.log(Maxdata[0][1].y);
			
			for(var i=0;i<Maxdata[0].length;i++)
				{
					DataArray[i] = Maxdata[0][i].y;
				}
			
			MaxYNO = d3.max(DataArray);
			console.log(MaxYNO);
		
			maxY = MaxYNO;
			
			scaleX.range([0,chartW]).domain(timeRange),
			scaleY.range([chartH,0]).domain([0,maxY]);			
			
			var line = d3.svg.line()
				.x(function(d){ return scaleX(d.x.getTime() + d.dx/2)})
				.y(function(d){ return scaleY(d.y)})
				.interpolate('basis');
			var area = d3.svg.area()
				.x(function(d){ return scaleX(d.x.getTime() + d.dx/2)})
				.y0(chartH)
				.y1(function(d){ return scaleY(d.y)})
				.interpolate('basis');
			var axisX = d3.svg.axis()
				.orient('bottom')
				.scale(scaleX)
				.ticks(d3.time.year);			
//					console.log(area);
//			var svg = d3.select(this)
//			.append('svg')
//			.data([_d]);
			
			var svg = d3.select(this)
			.selectAll('svg')
			.data([_d]);
			
			var svgEnter = svg.enter()
				.append('svg');
			
			svgEnter
				.append('g')
				.attr('class','area')
				.attr('transform','translate('+m.l+','+m.t+')')
				.append('path');
			
			svgEnter
				.append('g')
				.attr('class','line')
				.attr('transform','translate('+m.l+','+m.t+')')
				.append('path');
			
			svgEnter
				.append('g')
				.attr('class','axis')
				.attr('transform','translate('+m.l+','+(m.t+chartH)+')');	
			
			svg
			.attr('width',w)
			.attr('height',h)
			
			svg.select('.area')
			   .select('path')
			   .datum(data)
			   .attr('d',area);
			
			svg.select('.line')
			   .select('path')
			   .datum(data)
			   .attr('d',line);
			
			svg.select('.axis')
			.call(axisX);
			
		});
		
	}
	
	//Getter and setter funcation
	exports.width = function(_x){
		if(!arguments.length)
			{
				return w;
			}
		w = _x;
		return this;
	}
	exports.height = function(_x)
	{
		if(!arguments.length)
			{
				return h;
			}
		h = _x;
		return this;
	}
	
	exports.timeRange = function(_r){
		if(!arguments.length)
			{
				return timeRange;
			}
		timeRange = _r;
		return this;
	}
	
	exports.binSize = function(interval)
	{
		if(!arguments.length)
			{
				return binSize;
			}
		binSize = interval;
		return this;
	}
	
	exports.valueAccessor = function(access){
		if(!arguments.length)
			{
				return valueAccessor;
			}
		valueAccessor = access;
		return this;
	}
	exports.value = function(_v){
		if(!arguments.length) return layout.value();
		valueAccessor = _v;
		layout.value(_v);
		return this;
	}
	exports.maxY = function(_y){
		if(!arguments.length)
		{
			return maxY;
		}
		else {
			maxY = _y;
			return this;
		}
	}
	
	return exports;
}