var Interface = function(name, methods) {
    if(arguments.length != 2) {
        throw new Error("Interface constructor called with " + arguments.length
          + "arguments, but expected exactly 2.");
    }
    
    this.name = name;
    this.methods = [];
    for(var i = 0, len = methods.length; i < len; i++) {
        if(typeof methods[i] !== 'string') {
            throw new Error("Interface constructor expects method names to be " 
              + "passed in as a string.");
        }
        this.methods.push(methods[i]);        
    }    
};    

// Static class method.

Interface.ensureImplements = function(object) {
    if(arguments.length < 2) {
        throw new Error("Function Interface.ensureImplements called with " + 
          arguments.length  + "arguments, but expected at least 2.");
    }

    for(var i = 1, len = arguments.length; i < len; i++) {
        var interface = arguments[i];
        if(interface.constructor !== Interface) {
            throw new Error("Function Interface.ensureImplements expects arguments "   
              + "two and above to be instances of Interface.");
        }
        
        for(var j = 0, methodsLen = interface.methods.length; j < methodsLen; j++) {
            var method = interface.methods[j];
            if(!object[method] || typeof object[method] !== 'function') {
                throw new Error("Function Interface.ensureImplements: object " 
                  + "does not implement the " + interface.name 
                  + " interface. Method " + method + " was not found.");
            }
        }
    } 
};


// ResultSet Interface.
var ResultSet = new Interface('ResultSet', ['getDate', 'getResults']);

//此种方法并不能保证 TestResult 中有getData方法
// var ResultFormatter = function(resultsObject) {
//   if(!(resultsObject instanceOf TestResult)) {
//     throw new Error('ResultsFormatter: constructor requires an instance '
//       + 'of TestResult as an argument.');
//   } 
//   this.resultsObject = resultsObject;
// };


// ResultFormatter class, after adding Interface checking. 
var ResultFormatter = function(resultsObject) {
  Interface.ensureImplements(resultsObject, ResultSet);
  this.resultsObject = resultsObject;
};

ResultFormatter.prototype.renderResults = function() {
  var dateOfTest = this.resultsObject.getDate();
  var resultsArray = this.resultsObject.getResults();
  
  var resultsContainer = document.createElement('div');

  var resultsHeader = document.createElement('h3');
  resultsHeader.innerHTML = 'Test Results from ' + dateOfTest.toUTCString();
  resultsContainer.appendChild(resultsHeader);
  
  var resultsList = document.createElement('ul');
  resultsContainer.appendChild(resultsList);
  
  for(var i = 0, len = resultsArray.length; i < len; i++) {
    var listItem = document.createElement('li');
    listItem.innerHTML = resultsArray[i];
    resultsList.appendChild(listItem);
  }
  
  return resultsContainer;
}; 


var ResultsObject=function(){

	this.getDate=function(){
		return new Date();
	}

	this.getResults=function(){
		return ["我是一个数组","我是一个数组"];
	}

}

//调用
var ResultFormatterFn=new ResultFormatter(new ResultsObject());
var contain= ResultFormatterFn.renderResults();
document.body.appendChild(contain);
 