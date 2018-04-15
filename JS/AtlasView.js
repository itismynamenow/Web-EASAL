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
class AtlasView
{
	constructor()
	{
		//Canvas and Contex
		this.canvas = document.getElementById("CanvasAtlas");
		this.context = this.canvas.getContext('2d');
		//Event listners
		this.hasMouseFocus = false; 
		this.canvas.addEventListener('mousedown', this.mousePressEvent.bind(this),false);
		this.canvas.addEventListener("mouseover", function( event ) 
		  	{   
				this.hasMouseFocus = true; 
			}.bind(this), false);
		this.canvas.addEventListener("mouseout", function( event ) 
		  	{   
				this.hasMouseFocus = false; 
			}.bind(this), false);
		window.addEventListener( 'keydown', this.keyPressEvent.bind(this), false);
		//Timer 		
		this.frameTimeInMS = 30;
		this.timer = setInterval(this.update.bind(this), this.frameTimeInMS); ///< Detemines how often we repaint our canvas	
		this.atlasUpdateFrequencyInFrames = 60; ///< Determines how often we load new roadMap from server. Units are frames. I atlasUpdateFrequencyInFrames = 60 with frameTimeInMS = 30 then we reload roadMap each 1800 ms
		this.currentFrameID = 0; ///< Keeps track of current frame to help reloading roadMap
		//Atlas vars
		this.atlas = ""; 
		this.childrenNodes = [];
		this.rootIndices = [];
		this.rootNodeDimension = 5;
		this.findChildren();
		this.findRootIndecies();
		//IO
		this.mousePosition = {x:0,y:0};
		this.mouseWasPressed = false;
		this.selectedNodeID = -1;
		//Rendering constants
		this.rectXSize = 10;
		this.rectYSize = 5;
		this.maxNodeID=0;
		this.xDistance=20;
		this.yDistance=15;
		this.xBlockDistance = 6*this.xDistance+5*this.rectXSize;
		this.yBlockDistance = 30;
		this.xRootNodeOffset = this.rectXSize + 3*this.xDistance;
		this.yRootNodeOffset = 40;
		this.xRootNode = 10;
		this.yRootNode = 0;
		this.yFoldBonus = 8;
		this.borderTickness = 2;
		this.highlightTickness = 12;
		this.highlightColor = "Yellow";
		this.foldRectOffset = 3;		
		this.colors = ["Gray","Cyan","Blue","LawnGreen","Red","Yellow"];
		//Rendering vars
		this.maxY= -this.yBlockDistance;
		this.lastRow = 0;
		this.y4LastRow = 0;
		this.maxYCurrentBlock = 0;		
		//Canvas vars		
		this.context.font = "10px Arial";
		this.canvasScale = {x:1,y:1};
		this.canvasTranslation = {x:0,y:0};				
		//Fold 
		this.currentParents = [-1,-1,-1,-1,-1,-1];
		this.foldedNodesParents = [];
		this.foldedNodesIsFolded = [];		
		this.foldDimension = [false,false,false,false,false,false];
	}
	update()
	{
		//Reload roadMap if needed (if particular number of frames passed since last reload)
		this.rootNodeDimension = SETTINGS.FourDRootNode?4:5;
		this.updateAtlas();		
		if(this.atlas != "")
		{
			//Reset some rendering variables
			this.maxNodeID = -1;
			this.maxY=0;
			//Handle resize of canvas
			this.updateSize(this.canvas);
			this.context.setTransform(1, 0, 0, 1, 0, 0);
			//Clear canvas
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			//Apply transformation to canvas (shift it and scale)
			this.context.translate(this.canvasTranslation.x,this.canvasTranslation.y);
			this.context.scale(this.canvasScale.x,this.canvasScale.y);
			//Draw stuff
			this.context.beginPath();
			this.traverseNodes(this.rootIndices,this.rootNodeDimension, 0, 0);
			this.context.stroke();
		}		
	}
	stop()
	{
		clearTimeout(this.timer);
	}
	start()
	{
		this.timer = setInterval(this.update.bind(this), 30);
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
	findChildren()
	{
		//Empty
		this.childrenNodes = [];
		//Fill with empty nested arrays
		for(var i=0;i<this.atlas.length;i++)
		{
			this.childrenNodes.push(new Array());
		}
		//Fill with data
		for(var i=0;i<this.atlas.length;i++)
		{
			for(var j=0;j<this.atlas[i].ConnectedNodes.length;j++)
			{
				//Check if dimension of child is smaller than dimension of parent
				if(this.atlas[this.atlas[i].ConnectedNodes[j]].Contacts.length < this.atlas[i].Contacts.length)
				{
                    this.childrenNodes[this.atlas[i].ConnectedNodes[j]].push(i);
				}
			}
		}
	}
	findRootIndecies()
	{
		//Clear
		this.rootIndices = [];
		//Fill
		for(var i=0;i<this.atlas.length;i++)
		{
			//6 - number of contatcs = dimension of node
			if(6-this.atlas[i].Contacts.length == this.rootNodeDimension)
			{
				this.rootIndices.push(i);
			}
		}
	}
	updateAtlas()
	{
		//Check if we need to reaload atlas
		if(this.currentFrameID > this.atlasUpdateFrequencyInFrames)
		{
			//Reset frame counter
			this.currentFrameID = 0;
			//Reload atlas
			var that = this;
			//Check if settings were set
			if(SETTINGS.molecularUnitAPath != undefined)
			{

				//var url = window.location.href.split("/")
				//var server = url[2]
				Loader.get('http://'+server+'/data/RoadMap/'+SETTINGS.sessionId, (function(response) {
					var obj = JSON.parse(response);
					var roadMap = JSON.parse(obj[0].Nodes);
					//console.log(roadMap);
					that.atlas = roadMap;
					that.findRootIndecies();
					that.findChildren();
				}));
			}			
		}
		this.currentFrameID++;
	}
	keyPressEvent(event)
	{		
		if(this.hasMouseFocus)
		{
			switch(event.code)
			{
				case "KeyW":
					this.canvasTranslation.y -= 30;
					break;
				case "KeyS":
					this.canvasTranslation.y += 30;
					break;
				case "KeyC":
					this.context.translate(-this.canvasTranslation.x,-this.canvasTranslation.y);
					this.context.scale(1/this.canvasScale.x,1/this.canvasScale.y);
					this.canvasTranslation.x = 0;
					this.canvasTranslation.y = 0;
					this.canvasScale.x = 1;
					this.canvasScale.y = 1;
					this.foldedNodesParents = [];
					this.foldedNodesIsFolded = [];
					break;
				case "Digit1":
					this.foldDimension[1] = !this.foldDimension[1];
					break;
				case "Digit2":
					this.foldDimension[2] = !this.foldDimension[2];
					break;
				case "Digit3":
					this.foldDimension[3] = !this.foldDimension[3];
					break;
				case "Digit4":
					this.foldDimension[4] = !this.foldDimension[4];
					break;
				case "Digit5":
					this.foldDimension[5] = !this.foldDimension[5];
					break;
				case "Minus":
					this.canvasTranslation.y /=1.2;
					this.canvasScale.x /=1.2;
					this.canvasScale.y /=1.2;
					break;
				case "Equal":
					this.canvasTranslation.y *=1.2;
					this.canvasScale.x *=1.2;
					this.canvasScale.y *=1.2;
					break;
			}
		}

		
	}
	mousePressEvent(event)
	{
        var rect = this.canvas.getBoundingClientRect();
		this.mouseWasPressed = true;
        this.mousePosition = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
		this.mouseWasPressed = true;
	}
	traverseNodes(indicies,dimension,xPreviousDimension,yPreviousDimension)
	{
		var xNodeCoordinate;
		var yNodeCoordinate;		
		var isFolded = false;

		for(var i=0;i<indicies.length;i++)
		{
			var nodeID = indicies[i];
			//Update CurrentParent
			this.currentParents[dimension] = nodeID;
			//Update fold data
			isFolded = this.updateFold(nodeID,dimension);
			//We need switch according to dimension because we draw 5d nodes diffrently from 4d nodes and differently from 3-0d nodes 
			switch(dimension)
			{
				case 5:
					xNodeCoordinate = this.xRootNode;
					yNodeCoordinate = this.maxY + this.yBlockDistance;
					this.y4LastRow = 0;
					if(yNodeCoordinate>this.maxY) this.maxY = yNodeCoordinate;
					break;
				case 4:
					//Stays for number of 4d nodes on current "row"
					var blocksPerRow = Math.max(Math.ceil((this.canvas.width-(this.xRootNodeOffset+this.xDistance)*this.canvasScale.x)/this.xBlockDistance/this.canvasScale.x,1));
					var blockNumberInRow = i%blocksPerRow;
					xNodeCoordinate = this.xRootNodeOffset + this.xDistance + this.xBlockDistance*blockNumberInRow;
					yNodeCoordinate;
					// If this block is first on current row we change its yCoord
					if(blockNumberInRow==0)
					{
						yNodeCoordinate = this.maxY + this.yBlockDistance + this.rectYSize/2;
						// We deal with case of 4d root nodes
						if(i!=0) yNodeCoordinate += this.yRootNodeOffset;
						this.maxY = yNodeCoordinate;
						this.y4LastRow = yNodeCoordinate;
						if(!SETTINGS.FourDRootNode)
						{
							this.drawLine(xPreviousDimension+this.rectXSize+this.borderTickness/2,yPreviousDimension,xPreviousDimension+this.rectXSize+this.borderTickness/2,this.y4LastRow - this.yBlockDistance)
						}
					}
					else
					{
						yNodeCoordinate = this.y4LastRow;
						//Update maxY
						if(this.maxY < yNodeCoordinate) this.maxY = yNodeCoordinate;
					}
					this.maxYCurrentBlock = yNodeCoordinate;
						if(!SETTINGS.FourDRootNode)
						{
							//Draw lines(vertical and horizontal) that connect this node to its parent
							this.drawLine(xPreviousDimension+this.rectXSize+this.borderTickness,this.y4LastRow - this.yBlockDistance,
										  xNodeCoordinate,this.y4LastRow - this.yBlockDistance);
							this.drawLine(xNodeCoordinate-this.borderTickness/2,this.y4LastRow - this.yBlockDistance,
										  xNodeCoordinate-this.borderTickness/2,yNodeCoordinate);
						}
					break;
			   //3d-0d nodes
			   default:
					xNodeCoordinate = xPreviousDimension+this.xDistance+this.rectXSize;
					yNodeCoordinate;
					if(i!=0)
					{
						yNodeCoordinate = this.maxYCurrentBlock + this.yDistance + this.rectYSize;
					}							
					else
					{
						yNodeCoordinate = this.maxYCurrentBlock;
					}						
					
					this.maxYCurrentBlock = yNodeCoordinate;
					//Add small offset to account to fact that folded node is few (6) pixle bigger
					if(isFolded) this.maxYCurrentBlock += this.foldRectOffset*2; 
					if(this.maxYCurrentBlock>this.maxY) this.maxY=this.maxYCurrentBlock;
					//Draw lines(vertical and horizontal) that connect this node to its parent
					this.drawLine(xPreviousDimension+this.rectXSize+this.borderTickness/2,yPreviousDimension+this.rectYSize/2,
								  xPreviousDimension+this.rectXSize+this.borderTickness/2,yNodeCoordinate+this.rectYSize/2);
					this.drawLine(xPreviousDimension+this.rectXSize,yNodeCoordinate+this.rectYSize/2,
								  xNodeCoordinate,yNodeCoordinate+this.rectYSize/2);
					break;
			}
			
			//Rended node and account for mouse picking and folding
			this.drawRect(xNodeCoordinate,yNodeCoordinate,this.colors[dimension],nodeID,isFolded);
			
			if(dimension!=0)
			{
				
				//Keep recursion if this node is not folded
				if(!isFolded)
				{
					this.traverseNodes(this.childrenNodes[nodeID],dimension-1,xNodeCoordinate,yNodeCoordinate);
				}
			}
		}
	}	
	
	drawRect(x,y,color,nodeID,isFolded)
	{
		//Check if stuff for drawing is on canvas or outside it boundaries to avoid overhead
		var lowerBoundary = -this.canvasTranslation.y/this.canvasScale.y;
		var upperBoundary = (-this.canvasTranslation.y + this.canvas.height)/this.canvasScale.y;
		if(y+this.rectYSize+this.borderTickness > lowerBoundary && y-12 < upperBoundary)
		{
			//Check if mouse was clicked on this Rect
			
			this.mouseClickCheck(x,y,nodeID,isFolded);
			//Highlight if node is the one that was selected by mouse	
			if(nodeID == this.selectedNodeID)
			{				
				//Highlight selected node
				this.context.fillStyle = this.highlightColor;
				this.context.fillRect(x-this.highlightTickness,y-this.highlightTickness,this.rectXSize+this.highlightTickness*2, this.rectYSize+this.highlightTickness*2);
			}
			//Draw ID text
			this.context.fillStyle = "Black";
			this.context.fillText(nodeID,x,y-4);
			if(!isFolded)
			{
				//Draw border
				this.context.fillStyle = "Black";
				this.context.fillRect(x-this.borderTickness,y-this.borderTickness,this.rectXSize+this.borderTickness*2, this.rectYSize+this.borderTickness*2);			
				//Draw center of rect in color
				this.context.fillStyle = color;				
				this.context.fillRect(x,y,this.rectXSize, this.rectYSize);
			}
			else
			{
				//Draw border
				this.context.fillStyle = "Black";
				for(var i=0;i<3;i++)
				{
					this.context.fillRect(x-this.borderTickness+i*this.foldRectOffset,y-this.borderTickness+i*this.foldRectOffset,this.rectXSize+this.borderTickness*2, this.rectYSize+this.borderTickness*2);	
				}
				//Draw center of rect in color
				this.context.fillStyle = color;	
				for(var i=0;i<3;i++)
				{
					this.context.fillRect(x+i*this.foldRectOffset,y+i*this.foldRectOffset,this.rectXSize, this.rectYSize);	
				}
			}

		}

	}
	drawLine(x1,y1,x2,y2)
	{
		//Check if stuff for drawing is on canvas or outside it boundaries to avoid overhead
		var lowerBoundary = -this.canvasTranslation.y/this.canvasScale.y;
		var upperBoundary = (-this.canvasTranslation.y + this.canvas.height)/this.canvasScale.y;
		if((y1 > lowerBoundary && y1 < upperBoundary) || 
		   (y2 > lowerBoundary && y2 < upperBoundary));
	 	{
			this.context.lineWidth=2;
			this.context.moveTo(x1,y1);
			this.context.lineTo(x2,y2);
	   	}

	}	
	onClick(x,y,nodeID)
	{
		var nodeDimension = 6 - this.atlas[nodeID].Contacts.length;
		var combinedParentsString = "";//Combines parentIDs
		var isFolded = this.foldDimension[nodeDimension];
		for(var i = 5; i>=nodeDimension;i--)
		{
			combinedParentsString += this.currentParents[i] + " ";
		}
		//Add node intself
		combinedParentsString += nodeID;
		//Check if node already folded
		var index = this.foldedNodesParents.indexOf(combinedParentsString);
		//Not folded
		if(index == -1)
	    {
			this.foldedNodesParents.push(combinedParentsString);
			this.foldedNodesIsFolded.push(!isFolded);
	    }
		//Folded
		else
		{
			this.foldedNodesParents.splice(index,1);
			this.foldedNodesIsFolded.splice(index,1);
		}	
		this.setNode(nodeID);
	}
	mouseClickCheck(x,y,nodeID,isFolded)
	{
		if(this.mouseWasPressed)
		{
			if( this.mousePosition.x >= (x-this.borderTickness)*this.canvasScale.x &&
				this.mousePosition.x <= (x + this.rectYSize + this.borderTickness * 2)*this.canvasScale.x &&
				this.mousePosition.y >= (y-this.borderTickness)*this.canvasScale.y+this.canvasTranslation.y && 
				this.mousePosition.y <= (y + this.rectYSize + this.borderTickness * 2)*this.canvasScale.y+this.canvasTranslation.y)
			{
				//Save ID of selected node
				this.selectedNodeID = nodeID;
				//Remember current node parents for folding purposes
				this.onClick(x,y,nodeID);	
				//Change flag
				this.mouseWasPressed = false;
			}
					
		}
	}
	updateFold(nodeID,dimension)
	{
		var isFolded;
		//Fold related stuff
		var combinedParentsString = "";//Combines parentIDs
		for(var j = 5; j>=dimension;j--)
		{
			combinedParentsString += this.currentParents[j] + " ";
		}
		//Add node intself
		combinedParentsString += nodeID;
		//Determine fold value
		var foldedNodesParentsIndex = this.foldedNodesParents.indexOf(combinedParentsString);
		if(foldedNodesParentsIndex == -1)
		{
			isFolded = this.foldDimension[dimension];
		}
		else
		{
			isFolded = this.foldedNodesIsFolded[foldedNodesParentsIndex];
		}
		//Account for nodes without children
		if(this.childrenNodes[nodeID].length == 0)
		{
			isFolded = false;
		}
		return isFolded;
	}
	
	setNode(nodeID)
	{
		bondView.setNode(this.atlas[nodeID]);
		var currentNodeDimension = 6 - this.atlas[nodeID].Contacts.length;
		cayleySpaceView.setNode(nodeID,currentNodeDimension);
		sweepView.setNode(nodeID);
		
	}


}
