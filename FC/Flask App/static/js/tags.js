var tags = [];
d3.json("/getkeys", function(keys){
    console.log(keys);
    tags  = keys;
});

var tags2 = [{"key": "Cat", "value": 26}, 
{"key": "fish", "value": 19}, 
{"key": "things", "value": 18}, 
 {"key": "look", "value": 16}, {"key": "two", "value": 15},
  {"key": "like", "value": 14}, {"key": "hat", "value": 14}]; 