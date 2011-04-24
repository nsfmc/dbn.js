/* 
 
 dbn.js
 Copyright (c) 2011 Marcos Ojeda, breakfastsandwich.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 
 */
 
(function($) {
  
  $.fn.dbn = function(code, settings) {
    
    // set dbn canvas defaults and extend if necessary
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
    console.debug(code);
    
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
          // set the iter var in the global scope
          parser("set",[args[0],j]); 
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
    
    
    
    for(var pc=0; pc<code.length; pc+=1){
      var instruction = code[pc][0].toLowerCase();
      var arguments = code[pc].slice(1);

      parser(instruction, arguments);
    }
    
    this.each(function() {
      // do nothing here yet
    });

    return this;

  };

})(jQuery);