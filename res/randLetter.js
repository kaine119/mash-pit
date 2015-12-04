function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

var randomLetter = function(){
  var keyCode = getRandomArbitrary(65, 90);
  return {"keyCode": keyCode+32, "string": String.fromCharCode(keyCode)}
};
