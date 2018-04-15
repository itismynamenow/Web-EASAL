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
class BondView
{
	constructor()
	{
		this.name = "BondView";
		this.canvas = document.getElementById("Canvas" + this.name);
		this.context = this.canvas.getContext('2d');
		//Vars
		this.currentNode = null;		
		this.contacts = [];
		this.parameters = [];		
		this.oneIDs = [];
		this.twoIDs = [];
		
		//Constants
		this.radius = 15;
		this.atomVerticalOffsetFactor = 0.5;
		this.atomHorisontalOffsetFactor = 1.5;
	};
	
	setNode(node)
	{
		this.currentNode = node;
		this.clear();
		//Get all atoms in connection
		for(var i=0;i<node.Contacts.length;i++)
		{
			if(this.oneIDs.indexOf(node.Contacts[i].one) == -1)
			{
				this.oneIDs.push(node.Contacts[i].one);
			}
			if(this.twoIDs.indexOf(node.Contacts[i].two) == -1)
			{
				this.twoIDs.push(node.Contacts[i].two);
			}
		}
		for(var i=0;i<node.Parameters.length;i++)
		{
			if(this.oneIDs.indexOf(node.Parameters[i].one) == -1)
			{
				this.oneIDs.push(node.Parameters[i].one);
			}
			if(this.twoIDs.indexOf(node.Parameters[i].two) == -1)
			{
				this.twoIDs.push(node.Parameters[i].two);
			}
		}
		//Sort IDs
		this.oneIDs.sort();
		this.twoIDs.sort();
		//Specfify which atoms to connect
		for(var i=0;i<node.Contacts.length;i++)
		{
			this.contacts.push({one:this.oneIDs.indexOf(node.Contacts[i].one), two:this.twoIDs.indexOf(node.Contacts[i].two)});
		}
		for(var i=0;i<node.Parameters.length;i++)
		{
			this.parameters.push({one:this.oneIDs.indexOf(node.Parameters[i].one), two:this.twoIDs.indexOf(node.Parameters[i].two)});
		}
		
		this.drawNode();
	}
	
	drawNode()
	{
		this.updateSize(this.canvas);
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
		//Draw bonds
		for(var i=0;i<this.contacts.length;i++)
		{
			var x1 = this.radius * (1+this.atomHorisontalOffsetFactor);
			var y1 = this.radius * ( (1+this.atomHorisontalOffsetFactor) * this.contacts[i].one + this.atomHorisontalOffsetFactor);
			var x2 = this.canvas.clientWidth - (this.radius * (1 + this.atomHorisontalOffsetFactor));
			var y2 = this.radius * ( (1+this.atomHorisontalOffsetFactor) * this.contacts[i].two + this.atomHorisontalOffsetFactor);
			this.drawLine(x1,y1,x2,y2,3,false);
		}
		for(var i=0;i<this.parameters.length;i++)
		{
			var x1 = this.radius * (1+this.atomHorisontalOffsetFactor);
			var y1 = this.radius * ( (1+this.atomHorisontalOffsetFactor) * this.parameters[i].one + this.atomHorisontalOffsetFactor);
			var x2 = this.canvas.clientWidth - (this.radius * (1 + this.atomHorisontalOffsetFactor));
			var y2 = this.radius * ( (1+this.atomHorisontalOffsetFactor) * this.parameters[i].two + this.atomHorisontalOffsetFactor);
			this.drawLine(x1,y1,x2,y2,3,true);
		}
		//Draw circles
        for(var i=0;i<this.oneIDs.length;i++)
		{
			var x = this.radius * (1+this.atomHorisontalOffsetFactor);
			var y = this.radius * ( (1+this.atomHorisontalOffsetFactor) * i + this.atomHorisontalOffsetFactor);
			//One
			this.drawCircle(x,y,this.radius,"Red");
			this.context.fillStyle = "Black";
			this.context.fillText(this.oneIDs[i].toString(),x1,y);
		}
		for(var i=0;i<this.twoIDs.length;i++)
		{
			var x = this.canvas.clientWidth - (this.radius * (1 + this.atomHorisontalOffsetFactor));
			var y = this.radius * ( (1+this.atomHorisontalOffsetFactor) * i + this.atomHorisontalOffsetFactor);
			//Two	
			this.drawCircle(x,y,this.radius,"Yellow");
			this.context.fillStyle = "Black";
		 	this.context.fillText(this.twoIDs[i].toString(),x2,y);
		}

	}
	clear()
	{
		this.contacts = [];
		this.parameters = [];		
		this.oneIDs = [];
		this.twoIDs = [];
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
	drawLine(x1,y1,x2,y2,width,isDashed)
	{
		this.context.beginPath();
		if(isDashed)
			this.context.setLineDash([15, 8]);
		this.context.lineWidth = width;
		this.context.moveTo(x1, y1);
		this.context.lineTo(x2, y2);
		this.context.stroke();
			
		if(isDashed)
			this.context.setLineDash([]);
		
		this.context.lineWidth = 1;
	}
	drawCircle(x,y,radius,color)
	{
		this.context.beginPath();
		this.context.lineWidth = 2;
		this.context.fillStyle = color;			
		this.context.arc(x,y,this.radius,0,2*Math.PI);
		this.context.fill();
		this.context.stroke();		
		this.context.lineWidth = 0;
	}
	
}