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

/* The Bicycle interface. */

var Bicycle = new Interface('Bicycle', ['assemble', 'wash', 'ride', 'repair', 
    'getPrice']);

/* The AcmeComfortCruiser class. */

var AcmeComfortCruiser = function() { // implements Bicycle
  console.log("AcmeComfortCruiser constructor");
};
AcmeComfortCruiser.prototype = {
  assemble: function() {
     return "assemble";
  },
  wash: function() {
     console.log("wash");
  },
  ride: function() {
    console.log("ride");
  },
  repair: function() {
    console.log("repair");
  },
  getPrice: function() {
    return 399.00;
  }
};

/* The BicycleDecorator abstract decorator class. */

// var BicycleDecorator = function(bicycle) { // implements Bicycle
//   Interface.ensureImplements(bicycle, Bicycle);
//   this.bicycle = bicycle;
// }

var BicycleDecorator = function(bicycle) { // implements Bicycle
  this.bicycle = bicycle;
  this.interface = Bicycle;
  
  // Loop through all of the attributes of this.bicycle and create pass-through
  // methods for any methods that aren't currently implemented.
  outerloop: for(var key in this.bicycle) {
    // Ensure that the property is a function.
    if(typeof this.bicycle[key] !== 'function') {
      continue outerloop;
    }
    
    // Ensure that the method isn't in the interface.
    for(var i = 0, len = this.interface.methods.length; i < len; i++) {
      if(key === this.interface.methods[i]) {
        continue outerloop;
      }
    }
    
    // Add the new method.
    var that = this;
    (function(methodName) {
      that[methodName] = function() {
        return that.bicycle[methodName]();
      };
    })(key); 
  }
}

BicycleDecorator.prototype = {
  assemble: function() {
    return this.bicycle.assemble();
  },
  wash: function() {
    return this.bicycle.wash();
  },
  ride: function() {
    return this.bicycle.ride();
  },
  repair: function() {
    return this.bicycle.repair();
  },
  getPrice: function() {
    return this.bicycle.getPrice();
  }
};

 var HeadlightDecorator = function(bicycle){
    HeadlightDecorator.superclass.constructor.call(this, bicycle);
};
extend(HeadlightDecorator, BicycleDecorator);
HeadlightDecorator.prototype.getPrice = function(){
    return this.bicycle.getPrice() + 15.00;
}

var TaillightDecorator = function(bicycle){
  TaillightDecorator.superclass.constructor.call(this, bicycle);
};
extend(TaillightDecorator, BicycleDecorator);
TaillightDecorator.prototype.getPrice = function(){
  return this.bicycle.getPrice() + 9.00;
}

/* Usage. */

var myBicycle = new AcmeComfortCruiser(); // Instantiate the bicycle.
console.log(myBicycle.getPrice()); // Returns 399.00

myBicycle = new TaillightDecorator(myBicycle); // Decorate the bicycle object
                                               // with a taillight.
console.log(myBicycle.getPrice()); // Now returns 408.00

myBicycle = new HeadlightDecorator(myBicycle); // Decorate the bicycle object
                                               // again, now with a headlight.
console.log(myBicycle.getPrice()); // Now returns 423.00

/* FrameColorDecorator class. */

var FrameColorDecorator = function(bicycle, frameColor) { // implements Bicycle
  FrameColorDecorator.superclass.constructor.call(this,bicycle); // Call the superclass's constructor.
  this.frameColor = frameColor;
}
extend(FrameColorDecorator, BicycleDecorator); // Extend the superclass.
FrameColorDecorator.prototype.assemble = function() {
  return 'Paint the frame ' + this.frameColor + ' and allow it to dry. ' + 
      this.bicycle.assemble();
};
FrameColorDecorator.prototype.getPrice = function() {
  return this.bicycle.getPrice() + 30.00;
}; 

var myBicycle2 = new AcmeComfortCruiser(); // Instantiate the bicycle.
myBicycle2 = new FrameColorDecorator(myBicycle2, 'red'); // Decorate the bicycle
                                               // object with the frame color.
myBicycle2 = new HeadlightDecorator(myBicycle2); // Decorate the bicycle object
                                               // with the first headlight.
myBicycle2 = new HeadlightDecorator(myBicycle2); // Decorate the bicycle object
                                               // with the second headlight.
myBicycle2 = new TaillightDecorator(myBicycle2); // Decorate the bicycle object
                                               // with a taillight.
console.log(myBicycle2.assemble()); 




/* LifetimeWarrantyDecorator class. */

var LifetimeWarrantyDecorator = function(bicycle) { // implements Bicycle
   LifetimeWarrantyDecorator.superclass.constructor.call(this,bicycle); // Call the superclass's constructor.
   this.frameColor = frameColor;
}
extend(LifetimeWarrantyDecorator, BicycleDecorator); // Extend the superclass.
LifetimeWarrantyDecorator.prototype.repair = function() {
  return 'This bicycle is covered by a lifetime warranty. Please take it to ' +
      'an authorized Acme Repair Center.';
};
LifetimeWarrantyDecorator.prototype.getPrice = function() {
  return this.bicycle.getPrice() + 199.00;
};

/* TimedWarrantyDecorator class. */

var TimedWarrantyDecorator = function(bicycle, coverageLengthInYears) { 
    // implements Bicycle
  TimedWarrantyDecorator.superclass.constructor.call(this,bicycle); // Call the superclass's constructor.
  this.coverageLength = coverageLengthInYears;
  this.expDate = new Date();
  var coverageLengthInMs = this.coverageLength * 365 * 24 * 60 * 60 * 1000;
  expDate.setTime(expDate.getTime() + coverageLengthInMs);
}
extend(TimedWarrantyDecorator, BicycleDecorator); // Extend the superclass.
TimedWarrantyDecorator.prototype.repair = function() {
  var repairInstructions;
  var currentDate = new Date();
  if(currentDate < expDate) {
    repairInstructions = 'This bicycle is currently covered by a warranty. ' +
        'Please take it to an authorized Acme Repair Center.';
  }
  else {
    repairInstructions = this.bicycle.repair();
  }
  return repairInstructions;
};
TimedWarrantyDecorator.prototype.getPrice = function() {
  return this.bicycle.getPrice() + (40.00 * this.coverageLength);
};



/* BellDecorator class. */

var BellDecorator = function(bicycle) { // implements Bicycle
    BellDecorator.superclass.constructor.call(this,bicycle); // Call the superclass's constructor.
}
extend(BellDecorator, BicycleDecorator); // Extend the superclass.
BellDecorator.prototype.assemble = function() {
  return this.bicycle.assemble() + ' Attach bell to handlebars.';
};
BellDecorator.prototype.getPrice = function() {
  return this.bicycle.getPrice() + 6.00;
};
BellDecorator.prototype.ringBell = function() {
  return 'Bell rung.';
}; 


var myBicycle3 = new AcmeComfortCruiser(); // Instantiate the bicycle.
myBicycle3 = new BellDecorator(myBicycle3); // Decorate the bicycle object 
                                          // with a bell.
console.log(myBicycle3.ringBell()); // Returns 'Bell rung.'

var myBicycle3 = new AcmeComfortCruiser(); // Instantiate the bicycle.
myBicycle3 = new BellDecorator(myBicycle3); // Decorate the bicycle object 
                                          // with a bell.
myBicycle3 = new HeadlightDecorator(myBicycle3); // Decorate the bicycle object
                                               // with a headlight.                                          
console.log(myBicycle3.ringBell()); // Method not found.




/* ListBuilder class. */

var ListBuilder = function(parent, listLength) {
  this.parentEl = document.getElementById(parent);
  this.listLength = listLength;
};
ListBuilder.prototype = {
  buildList: function() {
    var list = document.createElement('ol');
    this.parentEl.appendChild(list);
    
    for(var i = 0; i < this.listLength; i++) {
      var item = document.createElement('li');
      list.appendChild(item);
    }
  },
  removeLists:function(){
      var childLength= this.list.childNodes.length;
      for(var j=0;j<childLength;j++){
        this.list.childNodes[j].remove();
      }
  }
};

/* SimpleProfiler class. */

var SimpleProfiler = function(component) {
  this.component = component;
};
SimpleProfiler.prototype = {
  buildList: function() {
    var startTime = new Date();
    this.component.buildList();
    var elapsedTime = (new Date()).getTime() - startTime.getTime();
    console.log('buildList: ' + elapsedTime + ' ms');
  },
  removeLists:function(){
    var startTime = new Date();
    this.component.removeLists();
    var elapsedTime = (new Date()).getTime() - startTime.getTime();
    console.log('buildList: ' + elapsedTime + ' ms');

  }
};

/* Usage. */

// var list = new ListBuilder('list-container', 5000); // Instantiate the object.
// list = new SimpleProfiler(list); // Wrap the object in the decorator.
// list.buildList(); // Creates the list and displays "buildList: 298 ms".



/* MethodProfiler class. */

var MethodProfiler = function(component) {
  this.component = component;
  this.timers = {};

  for(var key in this.component) {
    // Ensure that the property is a function.
    if(typeof this.component[key] !== 'function') {
      continue;
    }

    // Add the method.
    var that = this;
    (function(methodName) {
      that[methodName] = function() {
        that.startTimer(methodName);
        var returnValue = that.component[methodName].apply(that.component, 
          arguments);
        that.displayTime(methodName, that.getElapsedTime(methodName));
        return returnValue;
      };
    })(key); }
};
MethodProfiler.prototype = {
  startTimer: function(methodName) {
    this.timers[methodName] = (new Date()).getTime();
  },
  getElapsedTime: function(methodName) {
    return (new Date()).getTime() - this.timers[methodName];
  },
  displayTime: function(methodName, time) {
    console.log(methodName + ': ' + time + ' ms');
  }
};

/* Usage. */

var list = new ListBuilder('list-container', 5000);
list = new MethodProfiler(list);
list.buildList('ol'); // Displays "buildList: 301 ms".
list.buildList('ul'); // Displays "buildList: 287 ms".

