(function($) {
  $.fn.dbn = function(code, settings) {
    
    var config = {width:101, height:101};
    if (settings) $.extend(config, settings);
    
    var paperProps = {height:config.height, width:config.width};
    
    // create / check for canvas
    var paper = ( this.attr("tagName").toLowerCase() === "canvas" ) ? 
      this : $("<canvas />",paperProps).appendTo(this);
    // from now on, paper is the canvas element
    paper = paper[0].getContext("2d");
    
    code = code.split("\n").
      filter(function(e,i,a){return $.trim(e) !== "";}).
      map($.trim).
      map(function(e,i,a){return e.split(/\s+/);}); // split on all stretches of white space " "
    // code is now an array of split values
    // console.debug(code);
    var lookup = {};
    var lookupVars = function(e,i,a){ // look up variables
      if(lookup.hasOwnProperty(e)){
        return lookup[e];
      }else{
        return e;
      }
    };
    var parser = function(instr, args){      
      
      if(instr === "repeat"){
        var start = parseInt(args[1],10);
        var stop = parseInt(args[2],10);
        for(var j=start; j<=stop; j+=1){
          parser("set",[args[0],j]); // ohhhh snap!!
          // parse the argument here
          var loop_instruction = ""; // for now
          var k = i+1; // the next line in the dbn code
          while(loop_instruction != "}"){ // end while at curly brace
            loop_instruction = code[k][0].toLowerCase();
            var loop_arguments = code[k].slice(1);
            parser(loop_instruction, loop_arguments); //parse instruction
            k+=1; // increment line of code
          }
        }
        return;
      }
      if(instr === "set"){
        lookup[args[0]] = parseInt(args[1],10);
      }
      
      args = args.map(lookupVars); //look up any necessary variables
      
      if(instr === "paper"){
        var papercolor = 100 - parseInt(args[0],10);
        
        paper.fillStyle = "rgb("+papercolor+"%,"+papercolor+"%,"+papercolor+"%)";
        paper.fillRect(0,0,101,101); //TODO this assumes a traditional 100x100 canvas
      }
      if(instr === "pen"){
        var pencolor = 100 - parseInt(args[0],10);
        paper.strokeStyle = "rgb("+pencolor+"%,"+pencolor+"%,"+pencolor+"%)";
      }
      if(instr === "line"){
        var pts = args.map(function(e,i,a){return parseInt(e,10);});
        paper.lineWidth = 1;
        paper.beginPath();
        paper.moveTo((pts[0]+0.5),100-(pts[1]-0.5));
        paper.lineTo((pts[2]+0.5),100-(pts[3]-0.5));
        paper.closePath();
        paper.stroke();
        paper.save();
      }
    };
    
    for(var i=0; i<code.length; i+=1){
      var instruction = code[i][0].toLowerCase();
      var arguments = code[i].slice(1);

      parser(instruction, arguments);
    }
    
    this.each(function() {
      // do nothing here yet
    });

    return this;

  };

})(jQuery);