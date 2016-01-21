var calculatorHtml = `
		Input: <input id="input" type="text" value="0"><br/>
		Result: <input id="result" type="text" value="0" readonly><br/>
		<button class="btn btn-default" onclick="add(this);">+</button>
		<button class="btn btn-default" onclick="sub(this);">-</button>
		<button class="btn btn-default" onclick="mul(this);">*</button>
		<button class="btn btn-default" onclick="div(this);">/</button>
		<button class="btn btn-default" onclick="clr(this);">C</button>
	`;

function Calc() {
	var currentValue = 0;
	var calcDiv = document.createElement("div");
	$(calcDiv)
		.html(calculatorHtml)
		.addClass("calculator")
		.data("object", this);

	this.add = function(x) {
		currentValue += x;
		return currentValue;
	}

	this.sub = function(x) {
		return this.add(-x);
	}

	this.mul = function(x) {
		currentValue *= x;
		return currentValue;
	}

	this.div = function(x) {
		if (x === 0) {
			alert("Error. division by zero");
			return currentValue;
		}
		return this.mul(1/x);
	}

	this.clr = function() {
		currentValue = 0;
		return currentValue;
	}

	$(".page#calculator").append(calcDiv);
}

function getCalc(that) {
	var calcDiv = that.parentNode;
	var calc = $(calcDiv).data("object");

	return calc;
}

function getValue(that) {
	var calcDiv = that.parentNode;
	var input = $(calcDiv).find("#input");

	return parseFloat($(input).val());
}

function update(that, value) {
	var result = $(that.parentNode).find("#result");

	result.val(value);
}

function add(that) {
	var calc = getCalc(that);
	var value = getValue(that);

	update(that, calc.add(value));
}

function sub(that) {
	var calc = getCalc(that);
	var value = getValue(that);

	update(that, calc.sub(value));
}

function mul(that) {
	var calc = getCalc(that);
	var value = getValue(that);

	update(that, calc.mul(value));
}

function div(that) {
	var calc = getCalc(that);
	var value = getValue(that);

	update(that, calc.div(value));
}

function clr(that) {
	var calc = getCalc(that);

	update(that, calc.clr());
}

