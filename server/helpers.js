var caller = function(callsArray, context) {
  var series = function(callback) {
    var i = 0;
    (function next() {
      i += 1;
      if (callsArray[i-1]) {
        var nextCallArray = callsArray[i-1];
        var nextCall = nextCallArray[0];
        // console.log('nextCallArray', nextCallArray);
        // console.log('nextCallArray', typeof(nextCall));
        nextCall.apply(context || nextCall, nextCallArray.splice(1).concat(next));
      } else {
        callback(context);
      }
    })();
  };
  var parallel = function(callback) {
    var callsMade = 0
      , totalCalls = callsArray.length;
    var next = function() {
      callsMade += 1;
      if (callsMade === totalCalls) {
        callback(context);
      }
    };
    callsArray.forEach(function(callArray) {
      var nextCall = callArray[0];
      // console.log('crash!', typeof nextCall);
      // console.log(callsArray);
      nextCall.apply(context || nextCall, callArray.slice(1).concat(next));
    });
  };

  return {
    series: series,
    parallel: parallel
  };
};

module.exports = {
  createCaller: caller
}
