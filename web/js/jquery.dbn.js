(function($) {
  $.fn.dbn = function(code, settings) {
    
    var config = {width:100, height:100};
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
    
    for(var i=0; i<code.length; i+=1){
      var instr = code[i][0].toLowerCase();
      var args = code[i].slice(1);
      
      if(instr == "paper"){
        paper.fillStyle = "rgb("+args[0]+"%,"+args[0]+"%,"+args[0]+"%)";
        paper.fillRect(0,0,100,100);
      }
      if(instr == "pen"){
        paper.strokeStyle = "rgb("+args[0]+"%,"+args[0]+"%,"+args[0]+"%)";
      }
      if(instr == "line"){
        paper.beginPath();
        paper.moveTo(args[0],100-args[1]);
        paper.lineTo(args[2],100-args[3]);
        paper.closePath();
        paper.stroke();
      }
    }

    this.each(function() {
      // do nothing here yet
    });

    return this;

  };

})(jQuery);