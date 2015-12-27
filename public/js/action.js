module.exports = function createAction(actionType) {
  var type = actionType;
  var id = createId();
  var next;

  var getType = function() {
    return type;
  };

  var getId = function() {
    return id;
  };

  var setNext = function(next_) {
    next = next_;
  };

  var getNext = function() {
    return next;
  };

  var getRenderData = function() {
    return "placeholder"
  };

  return {
    getType: getType,
    getId: getId,
    setNext: setNext,
    getNext: getNext,
    getRenderData: getRenderData
  };
};

var createId = (function(start) {
  return function() {
    start += 1;
    return start - 1;
  }
}(0));
