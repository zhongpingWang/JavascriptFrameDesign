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

/* Extend function, improved. */

function extend(subClass, superClass) {
  var F = function() {};
  F.prototype = superClass.prototype;
  subClass.prototype = new F();
  subClass.prototype.constructor = subClass;

  subClass.superclass = superClass.prototype; 
  if(superClass.prototype.constructor == Object.prototype.constructor) {
    superClass.prototype.constructor = superClass;
  }
}


 /* CalendarItem interface. */

var CalendarItem = new Interface('CalendarItem', ['display']);

/* CalendarYear class, a composite. */

var CalendarYear = function(year, parent) { // implements CalendarItem
  this.year = year;
  this.element = document.createElement('div');
  this.element.style.display = 'none';
  parent.appendChild(this.element);

  function isLeapYear(y) {
    return (y > 0) && !(y % 4) && ((y % 100) || !(y % 400));
  }

  this.months = [];
  // The number of days in each month.
  this.numDays = [31, isLeapYear(this.year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 
    31, 30, 31]; 
  for(var i = 0, len = 12; i < len; i++) {
    this.months[i] = new CalendarMonth(i, this.numDays[i], this.element);
  }
);
CalendarYear.prototype = {
  display: function() {
    for(var i = 0, len = this.months.length; i < len; i++) {
      this.months[i].display(); // Pass the call down to the next level.
    }
    this.element.style.display = 'block';
  }
};

/* CalendarMonth class, a composite (optimized). */
var calendarDay=new CalendarDay();

var CalendarMonth = function(monthNum, numDays, parent) { // implements CalendarItem
  this.monthNum = monthNum;
  this.element = document.createElement('div');
  this.element.style.display = 'none';
  parent.appendChild(this.element);

  this.days = [];
  for(var i = 0, len = numDays; i < len; i++) {
    this.days[i] = calendarDay;
  }
);

CalendarMonth.prototype = {

  display: function() {
    for(var i = 0, len = this.days.length; i < len; i++) {
      this.days[i].display(i+1, this.element); 
    }
    this.element.style.display = 'block';
  }
  
};


/* CalendarDay class, a flyweight leaf (optimized). */

var CalendarDay = function() {}; // implements CalendarItem
CalendarDay.prototype = {
  display: function(date, parent) {
    var element = document.createElement('div');
    parent.appendChild(element);
    element.innerHTML = date;
  }  
};



 
 var cc= new  CalendarYear(2015,document.body)
 cc.display()