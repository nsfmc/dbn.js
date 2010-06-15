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
    
    var parser = function(instr, args){
      console.log(args)
      args = args.map(function(e,i,a){
        console.log("in lookup:", e,lookup)
        if(lookup.hasOwnProperty(e)){
          console.log(lookup[e])
          return lookup[e];
        }else{
          return e;
        }
      });
      console.log(args)
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
        paper.moveTo((pts[0]+0.5),100-(pts[1]+0.5));
        paper.lineTo((pts[2]+0.5),100-(pts[3]+0.5));
        paper.closePath();
        paper.stroke();
        paper.save();
      }
      if(instr === "set"){
        console.log("lookup",lookup)
        lookup[args[0]] = parseInt(args[1],10);
        console.log("lookup",lookup)
      }
    };
    
    for(var i=0; i<code.length; i+=1){
      var instruction = code[i][0].toLowerCase();
      var arguments = code[i].slice(1);
      
      parser(instruction, arguments, lookup);
    }
    
    this.each(function() {
      // do nothing here yet
    });

    return this;

  };

})(jQuery);