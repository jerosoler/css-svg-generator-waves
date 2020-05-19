

    ELEMENT.locale(ELEMENT.lang.en)
    
    new Vue({
      el: '#app',
      data: function() {
        return { 
          dialogVisible: false,
          code: '',
          codesvg: '',
          height: 200,
          documentHeight: 0,
          start_y: 0,
          end_y: 0,
          points: 1,
          colorHeader: '#2f495e',
          colorBackground: 'rgba(90, 155, 203, 1)',
          type: 'curve',
          curveprecision: 0.5,
          optionstypes: [{
            value: 'curve',
            label: 'Curve'
          },
          { 
            value: 'linear',
            label: 'Linear'
          }
          ],
          active: false,
          currentX: 0,
          currentY: 0,
          initialX: 0,
          initialY: 0,
          xOffset: 0,
          yOffset: 0,
          itemSelect: null,
         }
       
      },
      directives: {
        myMountedDirective (el, binding, vnode) {

          console.log("Hey");
          //value = value-1
          //this.setTranslate(parseInt(document.getElementsByClassName("bol")[value].style.left.replace("px","")), parseInt(document.getElementsByClassName("bol")[value].style.top.replace("px","")), document.getElementsByClassName("bol")[value]);
        }
      },
      mounted() {
        var dragItem = document.querySelector(".bol");
        var container = document.querySelector("#container");

        container.addEventListener("touchstart", this.dragStart, false);
        container.addEventListener("touchend", this.dragEnd, false);
        container.addEventListener("touchmove", this.drag, false);
    
        container.addEventListener("mousedown", this.dragStart, false);
        container.addEventListener("mouseup", this.dragEnd, false);
        container.addEventListener("mousemove", this.drag, false);
        this.documentHeight = document.body.clientWidth;
        document.getElementById("svg").children[0].setAttributeNS(null, 'viewBox', '0 0 '+document.body.clientWidth+' 200');
        this.setTranslate(document.body.clientWidth/2, 200, document.querySelector(".bol"));
        
        this.currentX = document.body.clientWidth/2;
        this.currentY = 200;
      },
      methods: {
        changeHeaderLive(value) {
          document.documentElement.style.setProperty('--colorcurve', value);
          this.colorHeader = value;
          this.changeFill();
        },
        changeHeader() {
          document.documentElement.style.setProperty('--colorcurve', this.colorHeader);
          this.changeFill();
        },
        changeBackgroundLive(value) {
          document.documentElement.style.setProperty('--background', value);
          this.colorBackground = value;
        },
        changeBackground() {
          document.documentElement.style.setProperty('--background', this.colorBackground);
        },
        changeFill() {
          var childrensFill = document.querySelectorAll("#svg path");
          for(var i = 0; i < childrensFill.length; i++) {
            childrensFill[i].setAttributeNS(null, 'fill', this.colorHeader);
          }
          //console.log(childrensFill);
        },
        changeheight() {
          document.getElementById("svg").children[0].setAttributeNS(null, 'viewBox', '0 0 '+document.body.clientWidth+' '+ this.height);
          document.getElementById("generator").style.height = this.height + 'px';
          
        }, 
        reversecolors() {
          var color1 = this.colorHeader;
          var color2 = this.colorBackground;
          document.documentElement.style.setProperty('--background', color1);
          document.documentElement.style.setProperty('--colorcurve', color2);
          this.colorBackground = color1;
          this.colorHeader = color2;
        },
        reload() {
          var elements = document.getElementsByClassName("bol");
            for(var i = 0; i < elements.length; i++) {
              this.setTranslate(parseInt(elements[i].style.left.replace("px","")), parseInt(elements[i].style.top.replace("px","")), elements[i]);
            } 
        },
        exportcode() {
          var svgelement = document.getElementById("svg");
          var thecode = svgelement.innerHTML.replace((/  |\r\n|\n|\r/gm),"");
          //thecode = svgelement.innerHTML.replace((/  |\r\n|\n|\r/gm),"");
          
          var code = '.div {\n';
          code += " display: block;\n";
          code += " position: relative;\n";
          code += " top: -2px;\n";
          code += " height: "+this.height+"px;\n";
          code += " background-image: url('data:image/svg+xml;utf8,"+thecode+"');";
          code += "\n background-size: cover;\n";
          code += " background-repeat: no-repeat;\n";
          code += "}\n";
          code += "\n";
          code += "\@media (max-width:"+ (this.documentHeight-1) +"px) {\n";
          code += " .div {\n";
          code += "   background-size: contain;\n";
          code += " }\n";
          code += "}\n";
          
         
          this.code = code;
          this.codesvg = thecode;
          
          //console.log("background-image: url('data:image/svg+xml;utf8,"+svgelement.innerHTML.replace(/(\r\n|\n|\r)/gm, "")+"');");
          //Prism.highlightAll()
        },
        dialogVisibleOpenend() {
          document.getElementById("code").textContent = this.code;
          document.getElementById("codesvg").textContent = this.codesvg;
          Prism.highlightAll()
          
        },
        copied() {
          this.$message({
            message: '👏 Copied! 🎉',
            type: 'success'
          });
        },
        addpoint(){
         // var actualpoints = document.querySelectorAll("#generator .bol");
          this.points++;
          var that = this;
           setTimeout(function() {
            //console.log(that.points);
            

            var x = parseInt(document.getElementsByClassName("bol")[that.points-2].style.left.replace("px","")) + 30;
            var y = parseInt(document.getElementsByClassName("bol")[that.points-2].style.top.replace("px",""));

            document.getElementsByClassName("bol")[that.points-1].style.top = y+"px";
            document.getElementsByClassName("bol")[that.points-1].style.left = x+"px";
            that.reload();
           }, 25)

        },
        removepoint(){
          this.points--;
          var elements = document.getElementsByClassName("bol");
            for(var i = 0; i < elements.length-1; i++) {
              this.setTranslate(parseInt(elements[i].style.left.replace("px","")), parseInt(elements[i].style.top.replace("px","")), elements[i]);
            } 
        },
        dragStart(e) {
          this.xOffset = e.target.offsetLeft;
          this.yOffset = e.target.offsetTop;
          if (e.type === "touchstart") {
            this.initialX = e.touches[0].clientX - this.xOffset;
            this.initialY = e.touches[0].clientY - this.yOffset;
          } else {
            this.initialX = e.clientX - this.xOffset;
            this.initialY = e.clientY - this.yOffset;
          }
    
          
          
          if (e.target.classList[0] === 'bol') {
            this.itemSelect = e.target;
            this.active = true;
          }
        },
        dragEnd(e) {
          this.initialX = 0;
          this.initialY = 0;
          this.itemSelect = null;
          this.active = false;
        },
        drag(e) {
          if (this.active) {
            if (e.type !== "touchmove") {
              e.preventDefault();
            }
          
            if (e.type === "touchmove") {
              this.currentX = e.touches[0].clientX - this.initialX;
              this.currentY = e.touches[0].clientY - this.initialY;
            } else {
              this.currentX = e.clientX - this.initialX;
              this.currentY = e.clientY - this.initialY;
            }
    
            this.xOffset = this.currentX;
            this.yOffset = this.currentY;
    
            this.setTranslate(this.currentX, this.currentY, this.itemSelect);
          }
        },
        setTranslate(xPos, yPos, el) {
          //el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
          if(this.points === 1) {
            el.style.top = yPos + "px";
            el.style.left = xPos + "px";
      
            var path = document.getElementById("svg").children[0].children[0];
            
            var line_x = 0;
            var line_y = this.start_y;
            var y = yPos + 8 + 2 - 100;
            var x = xPos + 8 + 2 +1;
            
            if(this.type == 'linear') {
              path.setAttributeNS(null, 'd', 'M '+ line_x +' '+ line_y +' L '+ x +' '+ y +' L '+ x +' 0 L 0 0 Z'); // SIMPLE LINE
            } else {
              var curvature = this.curveprecision;
              var hx1 = line_x + Math.abs(x - line_x) * curvature;
              var hx2 = x - Math.abs(x - line_x) * curvature;
              path.setAttributeNS(null, 'd', 'M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +' ' + y +' L '+ x +' '+ y +' L '+ x +' 0 L 0 0 Z');
            }
      

            var path2 = document.getElementById("svg").children[0].children[1];
            var line_x = xPos + 8 + 2 ;
            var line_y = yPos + 8 + 2 - 100;
            var y = this.end_y;
            var x = document.body.clientWidth;
          
            
            if(this.type == 'linear') {
              path2.setAttributeNS(null, 'd', 'M '+ line_x +' '+ line_y +' L '+ x +' '+ y +' L '+x+' 0 L '+line_x+' 0 Z'); // SIMPLE LINE
            } else {
              var curvature = this.curveprecision;
              var hx1 = line_x + Math.abs(x - line_x) * curvature;
              var hx2 = x - Math.abs(x - line_x) * curvature;
              path2.setAttributeNS(null, 'd', 'M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +' ' + y +' L '+ x +' '+ y +' L '+x+' 0 L '+line_x+' 0 Z');
            }
          } else {
            // MORE ELEMENTS
            el.style.top = yPos + "px";
            el.style.left = xPos + "px";
            var numelement = el.innerHTML;
            //console.log(numelement);
            
            var path = document.getElementById("svg").children[0].children[numelement-1];
            
            if(numelement == 1) {
              var line_x = 0;
              var line_y = this.start_y;
            } else {
              var line_x = parseInt(document.getElementsByClassName("bol")[numelement-2].style.left.replace("px","")) + 8 + 2;
              var line_y = parseInt(document.getElementsByClassName("bol")[numelement-2].style.top.replace("px","")) - 100 + 8 + 2;
            }
            
            var y = yPos + 8 + 2 - 100;
            var x = xPos + 8 + 2 +1;
            

            if(this.type == 'linear') {
              path.setAttributeNS(null, 'd', 'M '+ line_x +' '+ line_y +' L '+ x +' '+ y +' L '+ x +' 0 L '+line_x+' 0 Z'); // SIMPLE LINE
            } else {
              var curvature = this.curveprecision;
              var hx1 = line_x + Math.abs(x - line_x) * curvature;
              var hx2 = x - Math.abs(x - line_x) * curvature;
              path.setAttributeNS(null, 'd', 'M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +' ' + y +' L '+ x +' '+ y +' L '+ x +' 0 L '+line_x+' 0 Z');
            }

            var path2 = document.getElementById("svg").children[0].children[numelement];
            var line_x = xPos + 8 + 2 ;
            var line_y = yPos + 8 + 2 - 100;

            if(numelement == this.points) {
              var y = this.end_y;
              var x = document.body.clientWidth;
            } else {
              var y = parseInt(document.getElementsByClassName("bol")[numelement].style.top.replace("px","")) + 8 + 2 - 100;
              var x = parseInt(document.getElementsByClassName("bol")[numelement].style.left.replace("px","")) + 8 + 2 +1;
            }
          
            
            if(this.type == 'linear') {
              path2.setAttributeNS(null, 'd', 'M '+ line_x +' '+ line_y +' L '+ x +' '+ y +' L '+x+' 0 L '+line_x+' 0 Z'); // SIMPLE LINE
            } else {
              var curvature = this.curveprecision;
              var hx1 = line_x + Math.abs(x - line_x) * curvature;
              var hx2 = x - Math.abs(x - line_x) * curvature;
              path2.setAttributeNS(null, 'd', 'M '+ line_x +' '+ line_y +' C '+ hx1 +' '+ line_y +' '+ hx2 +' ' + y +' ' + x +' ' + y +' L '+ x +' '+ y +' L '+x+' 0 L '+line_x+' 0 Z');
            }

          }
    
          
        }

      }
    })
  
