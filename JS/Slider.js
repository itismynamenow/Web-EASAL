/*
 This file is part of EASAL. 

 EASAL is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 EASAL is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*
 *  Created on: 2017-2018
 *      Author: Chkhaidze Giorgio
 */
class Slider
{
	//each new slider with higher sequence number will be added on top of previous slider with smaller sequence number
	constructor(canvasName,sequenceNumber)
	{
		//Timer 		
		this.timer = setInterval(this.update.bind(this), 30);
		//Mouse
		this.mouseWasPressed = false;
		this.mousePosition = {x:0,y:0};
		//Vars
		this.values = [];
		this.currentValueID = -1;
		//Rendering vars
		this.xBarOffset = 5;
		this.markHight = 6;
		this.currentValueHight = 8;
		this.currentValueWidth = 3;
		//HTML creation
		this.canvas3D = document.getElementById(canvasName);
		this.divParent = this.canvas3D.parentNode;	
		
		this.div = document.createElement('div');
		this.canvas2D = document.createElement('canvas');
		this.context = this.canvas2D.getContext('2d');
		this.canvas2D.addEventListener('mousedown', this.mousePressEvent.bind(this),false);
		
		this.minP = document.createElement('p');
		this.maxP = document.createElement('p');
		this.currentP = document.createElement('p');
		
		this.minP.innerHTML = "Min";
		this.currentP.innerHTML = "Current";
		this.maxP.innerHTML = "Max";
		
		
		this.minP.setAttribute("style","left:calc(0%);top:2px;width:33%;height:20px;position:relative;text-align: center;");
		this.currentP.setAttribute("style","left:calc(33%);top:-20px;width:33%;height:20px;position:relative;text-align: center;");
		this.maxP.setAttribute("style","left:calc(66%);top:-40px;width:33%;height:20px;position:relative;text-align: center;");
		
		this.canvas2D.setAttribute("style","background-color: yellow;top:-40px;height:30px;position:relative;");
		
		this.div.appendChild(this.minP);		
		this.div.appendChild(this.currentP);
		this.div.appendChild(this.maxP);
		this.div.appendChild(this.canvas2D);
		
		this.div.setAttribute("style","width:calc(100% / 2.5);height:50px;top:calc(-55px * "+(sequenceNumber+1)+");left:calc(-100%/2.5 *" + sequenceNumber + ");position:relative;");
		
		this.divParent.appendChild(this.div);	
	}
	
	setValues(values)
	{
		if(values.length != 0)
		{
			values.sort();
			this.values = values;

			this.minP.innerHTML = this.round(values[0],4);
			this.currentP.innerHTML = this.round(values[0],4);
			this.maxP.innerHTML = this.round(values[values.length-1],4);
			this.currentValueID = 0;
		}
		
	}
	
	update()
	{
		this.updateSize(this.canvas2D);	
		this.context.clearRect(0, 0, this.canvas2D.width, this.canvas2D.height);
		if(this.mouseWasPressed)
		{
			this.updateCurrentValue();
			this.mouseWasPressed = false;
		}
		this.context.beginPath();
        this.drawBar();
		this.drawCurrentValue();
		this.drawMarks();
		this.context.stroke();
	}
	
	hide()
	{
		this.div.style.visibility = 'hidden';   
	}
	
	show()
	{
		this.div.style.visibility = 'visible'; 
	}
	
	updateSize(canvas) 
	{
      // Lookup the size the browser is displaying the canvas.
      var displayWidth  = canvas.clientWidth;
      var displayHeight = canvas.clientHeight;

      // Check if the canvas is not the same size.
      if (canvas.width  != displayWidth ||
          canvas.height != displayHeight) {

        // Make the canvas the same size
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
      }
	}
	
	drawBar()
	{
		var y = this.canvas2D.height / 2;
		var x1 = this.xBarOffset;
		var x2 = this.canvas2D.width - this.xBarOffset;
		this.drawLine(x1,y,x2,y,2);
	}
	
	drawMarks()
	{
		var y1 = this.canvas2D.height / 2 + this.markHight;
		var y2 = this.canvas2D.height / 2 - this.markHight;
		var min = this.values[0];
		var max = this.values[this.values.length-1];
		if(this.values.length != 1)
		{
			for(var i=0;i<this.values.length;i++)
			{
				var x =  (this.canvas2D.width - 2*this.xBarOffset) / (max-min) * (this.values[i] - min) + this.xBarOffset;
				this.drawLine(x,y1,x,y2,1);
			}
		}
		else if(this.values.length == 1)
		{
			var x = this.canvas2D.width/2;
			this.drawLine(x,y1,x,y2,1);
		}

	}
	
	drawLine(x1,y1,x2,y2,width)
	{
			this.context.lineWidth=width;
			this.context.moveTo(x1,y1);
			this.context.lineTo(x2,y2);
	}	
	
	drawCurrentValue()
	{
		if(this.values.length > 1)
		{
			var min = this.values[0];
			var max = this.values[this.values.length-1];
			this.context.lineWidth=1;
			var y = this.canvas2D.height / 2 - this.currentValueHight;
			var x =  (this.canvas2D.width - 2*this.xBarOffset) / (max-min) * (this.values[this.currentValueID] - min) + this.xBarOffset - this.currentValueWidth;
			this.context.rect(x,y,this.currentValueWidth * 2 ,this.currentValueHight * 2);
		}
		else if(this.values.length == 1)
		{
			var y = this.canvas2D.height / 2 - this.currentValueHight;
			var x = this.canvas2D.width/2;
			this.context.rect(x,y,this.currentValueWidth * 2 ,this.currentValueHight * 2);
		}

	}
	
	mousePressEvent(event)
	{
        var rect = this.canvas2D.getBoundingClientRect();
		this.mouseWasPressed = true;
        this.mousePosition = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
		this.mouseWasPressed = true;
	}
	
	updateCurrentValue()
	{
		if(this.mousePosition.y>0 && this.mousePosition.y < this.canvas2D.height && this.values.length>0)
		{
			var min = this.values[0];
			var max = this.values[this.values.length-1];
			var xVertLineCoord = (this.canvas2D.width-2*this.xBarOffset)/(max-min)*(this.values[0]-min)+this.xBarOffset;
			var delta= Math.abs(xVertLineCoord - this.mousePosition.x);
			var minDeltaIndex=0;
			for(var i=1;i<this.values.length;i++)
			{
				xVertLineCoord = (this.canvas2D.width - 2 * this.xBarOffset) / (max - min) * (this.values[i] - min) + this.xBarOffset;
				if(Math.abs(xVertLineCoord - this.mousePosition.x < delta))
				{
					delta = Math.abs(xVertLineCoord - this.mousePosition.x);
					minDeltaIndex = i;
				}
			}
			this.currentValueID = minDeltaIndex;
			this.currentP.innerHTML = this.round(this.values[this.currentValueID],4);
		}
	}
	round(value,numberOfDecimalPoints)
	{
		var factor = Math.pow(10,numberOfDecimalPoints)
        return Math.round(value * factor) / factor;
	}
	getCurrentValue()
	{
		var value;
		if(this.values.length !== 0 && this.currentValueID != -1)
		{
			value = this.values[this.currentValueID];
		}
		else
		{
			value = -1;
		}
		return value;
	}
	getCurrentID()
	{
		return this.currentValueID;
	}
}