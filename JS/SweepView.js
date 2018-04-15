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
class SweepView extends OpenGLWidget
{
	constructor()
	{
		super();
		this.name = "SweepView";
		this.init();
		//Checkboxes
		this.checkBoxes = new Array(8);
		for(var i=0;i<8;i++)
		{
			this.checkBoxes[i] = new CheckBox(this.canvas.parentNode,20 + i*80, 20,"Flip " + i);
			this.checkBoxes[i].checkBox.addEventListener( 'change', this.updateCheckboxes.bind(this));
			this.checkBoxes[i].checkBox.disabled = true;
		}
		//Animation
		this.animationMode = false;
        this.timerAnimation = null;
        this.timerMSPerOrientation = 700;
		this.orientationsGroupedByFlip = new Array (8);
		for(var i=0;i<8;i++)
		{
            this.orientationsGroupedByFlip[i] = [];
		}
		this.currentFlip = -1;
		this.currentOrientationIndex = -1;
		var buttonWidth = 65;
		var gapBetweenButtons = 3;
		var buttonVerticalOffset = 45;
		this.buttonPrev = new Button(this.canvas.parentNode,20,buttonVerticalOffset,buttonWidth-gapBetweenButtons,"Prev");
		this.buttonPrev.button.addEventListener( 'click', this.buttonPrevEvent.bind(this));
		this.buttonPlay = new Button(this.canvas.parentNode,20 + buttonWidth,buttonVerticalOffset,buttonWidth-gapBetweenButtons,"Play");
		this.buttonPlay.button.addEventListener( 'click', this.buttonPlayEvent.bind(this));
		this.buttonStop = new Button(this.canvas.parentNode,20 + buttonWidth*2,buttonVerticalOffset,buttonWidth-gapBetweenButtons,"Stop");
		this.buttonStop.button.addEventListener( 'click', this.buttonStopEvent.bind(this));
		this.buttonNext = new Button(this.canvas.parentNode,20 + buttonWidth*3,buttonVerticalOffset,buttonWidth-gapBetweenButtons,"Next");
		this.buttonNext.button.addEventListener( 'click', this.buttonNextEvent.bind(this));
		this.buttonAnimationMode = new Button(this.canvas.parentNode,20 + buttonWidth*4,buttonVerticalOffset,buttonWidth*3-gapBetweenButtons,"Animation Mode");
		this.buttonAnimationMode.button.addEventListener( 'click', this.buttonAnimationModeEvent.bind(this));
		//Data
		//this.muA = null;
		//this.muB = null;
		this.points = "";
		this.nodeWasJustSet = false;
		this.path = "files";
		//Constants
		this.scale = 1;
        this.maxOrientations = 300;
	}
	update()
	{
		this.updateSize(this.canvas);	
		var meshLoaded = true;
		for(i=0; i<this.meshTypesLoaded.length; i++) {
			meshLoaded = meshLoaded && this.meshTypesLoaded[i];
		}
		if( this.points != "")
		{
			this.initNode();
			if(this.redrawRequiered && meshLoaded && this.muAReceived && this.muBReceived)
			{
				this.redrawRequiered = false;
				this.renderer.setCameraUniform(this.camera.getCameraMatrix(this.lastMouseCoordinates));
				this.renderer.setLightUniform(vec3.fromValues(10,20,40));
				this.renderer.clearAndResize();		
				for(var i=0;i<this.meshTypesNumber;i++)
				{
					this.renderer.drawMesh(this.meshes[i],
											this.meshData[i][this.entryType.TRANSLATION],
											this.meshData[i][this.entryType.ROTATION],
											this.meshData[i][this.entryType.SCALE],
											this.meshData[i][this.entryType.COLOR],
											0);
				}	
			}
		}

	}
	/*setMolecularUnits(muAFileName,muBFileName)
	{
		var outerObj = this;
		Loader.get('http://ufo-host.cise.ufl.edu:2000/staticFiles/'+ muAFileName, function(response) {
			var obj = JSON.parse(response);
			outerObj.muA = obj;
			//console.log(obj);
		});

		Loader.get('http://ufo-host.cise.ufl.edu:2000/staticFiles/'+ muBFileName, function(response) {
			var obj = JSON.parse(response);
			outerObj.muB = obj;
			outerObj.updateTransformationMatrices();
			//console.log(obj);
		});

		//this.muA = Loader.loadFileFromServer(muAFileName,this.path);
		//this.muB = Loader.loadFileFromServer(muBFileName,this.path);
		//tmp
		//this.updateTransformationMatrices();
	}*/
	updateTransformationMatrices()
	{
		this.clearMeshData();		
		for(var i=0;i<this.muA.length;i++)
		{
			this.addMeshForRendering(this.meshTypes.SPHERE,vec3.fromValues(this.muA[i].xcoord/this.scale,this.muA[i].ycoord/this.scale,this.muA[i].zcoord/this.scale),this.muA[i].radius/this.scale,this.colorMUA);
		}
		if(this.animationMode)
		{
			if(this.currentFlip !== -1 && this.currentOrientationIndex !== -1)
			{
                var i = this.orientationsGroupedByFlip[this.currentFlip][this.currentOrientationIndex].point;
                var j = this.orientationsGroupedByFlip[this.currentFlip][this.currentOrientationIndex].orientation;
                var orientation = this.points[i].Orientations[j];
                var flip = orientation.flip;
                if(this.checkBoxes[flip].checked())
                {
                    var muBTransformMat3 = Util.getTransMatrix(orientation.fb,orientation.tb);
                    if(muBTransformMat3 !== null)
                    {
                        for(var k=0;k<this.muB.length;k++)
                        {
                            var atomBArray = Util.trans(muBTransformMat3,[this.muB[k].xcoord,this.muB[k].ycoord,this.muB[k].zcoord]);
                            var atomBVec3 = vec3.fromValues(atomBArray[0]/this.scale,atomBArray[1]/this.scale,atomBArray[2]/this.scale);
                            this.addMeshForRendering(this.meshTypes.SPHERE,atomBVec3,this.muB[k].radius/this.scale,this.colors[flip]);
                        }
                    }
                }
			}
		}
		else
		{
            var orientationCount = 0;
            //There is upper limit to how many orientationcan be rendered this.maxOrientations
            for(var i=0;i<this.points.length && orientationCount < this.maxOrientations;i++)
            {
                for(var j=0;j<this.points[i].Orientations.length;j++)
                {

                    var orientation = this.points[i].Orientations[j];
                    var flip = orientation.flip;
                    if(this.checkBoxes[flip].checked())
                    {
                        //TMP
                        orientationCount++;
                        var muBTransformMat3 = Util.getTransMatrix(orientation.fb,orientation.tb);
                        if(muBTransformMat3 != null)
                        {
                            for(var k=0;k<this.muB.length;k++)
                            {
                                var atomBArray = Util.trans(muBTransformMat3,[this.muB[k].xcoord,this.muB[k].ycoord,this.muB[k].zcoord]);
                                var atomBVec3 = vec3.fromValues(atomBArray[0]/this.scale,atomBArray[1]/this.scale,atomBArray[2]/this.scale);
                                this.addMeshForRendering(this.meshTypes.SPHERE,atomBVec3,this.muB[k].radius/this.scale,this.colors[flip]);
                            }
                        }
                    }

                }
            }
		}

        this.redrawRequiered = true;
	}
	
	setNode(nodeID)
	{
		var that = this;
		Loader.get('http://'+server+'/data/CayleySpace/'+ SETTINGS.sessionId + '/' + nodeID, function(response) {
			var obj = JSON.parse(response);
//			console.log(obj);
			var cSpace = JSON.parse(obj[0].Sampling);
//			console.log(cSpace);
			that.points = cSpace;
			that.nodeWasJustSet = true;
		});		
	}
	
	//When we set node it takes some time to load it so we wait inside update() till points are not empty and call this fucntion that process points
	initNode()
	{
		if(this.nodeWasJustSet)
		{
			this.nodeWasJustSet = false;
			this.disableCheckboxes();
			for(var i=0;i<this.points.length;i++)
			{
				var muBTransformMat3 = null;
				for(var j=0;j<this.points[i].Orientations.length;j++)
				{
					var orientation = this.points[i].Orientations[j];
					var flip = orientation.flip;
					var tmp = {point:i,orientation:j};
					this.orientationsGroupedByFlip[flip].push(tmp);
					this.checkBoxes[flip].checkBox.disabled = false;
				}
			}
			this.updateTransformationMatrices();
		}

	}
	updateCheckboxes()
	{
		this.updateTransformationMatrices();
	}
	disableCheckboxes()
	{
		for(var i=0;i<8;i++)
		{
			this.checkBoxes[i].checkBox.disabled = true;
			this.checkBoxes[i].checkBox.checked = false;
		}
	}
	buttonPrevEvent()
	{
		if(this.animationMode )
		{
            if(this.currentFlip === -1)
			{
                this.currentFlip = this.getPreviousFlip(this.currentFlip);
                this.currentOrientationIndex = -1;
			}
            if(this.currentFlip !== -1)
			{
				if(this.currentOrientationIndex === -1)
				{
                    this.currentOrientationIndex = this.orientationsGroupedByFlip[this.currentFlip].length;
				}
                if(!this.checkBoxes[this.currentFlip].checkBox.checked)
                {
                    this.currentFlip = this.getPreviousFlip(this.currentFlip);
                    this.currentOrientationIndex = this.orientationsGroupedByFlip[this.currentFlip].length;
                }
                this.currentOrientationIndex = this.getPreviousOrientationIndex(this.currentFlip,this.currentOrientationIndex);
                if(this.currentOrientationIndex === -1)
                {
                    this.currentFlip = this.getPreviousFlip(this.currentFlip);
                    this.currentOrientationIndex = this.orientationsGroupedByFlip[this.currentFlip].length;
                    this.currentOrientationIndex = this.getPreviousOrientationIndex(this.currentFlip,this.currentOrientationIndex);
                }
			}
            this.updateTransformationMatrices();
		}
	}
	buttonPlayEvent()
	{
        if(this.animationMode)
        {
            this.buttonStopEvent();
            this.timerAnimation = setInterval(this.buttonNextEvent.bind(this), this.timerMSPerOrientation);
        }
	}
    buttonAnimationModeEvent()
	{
        this.animationMode = !this.animationMode;
        if(this.animationMode)
		{
            this.buttonNextEvent();
		}
		else
		{
            this.buttonStopEvent();
            this.currentFlip  = -1;
            this.currentOrientationIndex = -1;
            this.updateTransformationMatrices();
		}
	}
	buttonStopEvent()
	{
        if(this.animationMode)
        {
            if (this.timerAnimation !== null) {
                clearInterval(this.timerAnimation);
            }
        }
	}
	buttonNextEvent()
	{
        if(this.animationMode)
        {
        	//Animation mode was jsut selected and currentFlip or and currentOrintationIndex have default -1 value
            if(this.currentFlip  === -1|| this.currentOrientationIndex === -1)
            {
                var nextFlip = this.getNextFlip(-1);
                if(nextFlip !== -1)
                {
                    this.currentFlip = nextFlip;
                    this.currentOrientationIndex = this.getNextOrientationIndex(this.currentFlip,this.currentOrientationIndex);
                }
            }
            //CurrentFlip and currentOrientationIndex have proper values and we just increment them
            else
            {
            	if(!this.checkBoxes[this.currentFlip].checkBox.checked)
				{
                    this.currentFlip = this.getNextFlip(this.currentFlip);
                    this.currentOrientationIndex = -1;
				}
				if(this.currentFlip !== -1)
				{
                    this.currentOrientationIndex = this.getNextOrientationIndex(this.currentFlip,this.currentOrientationIndex);
                    if(this.currentOrientationIndex === -1)
                    {
                        this.currentFlip = this.getNextFlip(this.currentFlip);
                        this.currentOrientationIndex = this.getNextOrientationIndex(this.currentFlip,this.currentOrientationIndex);
                    }
				}
            }
            this.updateTransformationMatrices();
        }
	}
	getNextFlip(currentFlip)
	{
		for(var i=0;i<8;i++)
		{
			var index = (currentFlip+i+1)%8;
            if(this.checkBoxes[index].checkBox.checked)
			{
                return index;
			}
		}
		return -1;
	}
    getPreviousFlip(currentFlip)
    {
        for(var i=0;i<8;i++)
        {
            var index = (currentFlip-i-1+16)%8;
            if(this.checkBoxes[index].checkBox.checked)
            {
                return index;
            }
        }
        return -1;
    }
	getNextOrientationIndex(flip,currentOrientationIndex)
	{
		if(currentOrientationIndex+1<this.orientationsGroupedByFlip[flip].length)
		{
			return currentOrientationIndex + 1 ;
		}
		return -1;
	}
    getPreviousOrientationIndex(flip,currentOrientationIndex)
    {
        if(currentOrientationIndex-1>=0)
        {
            return currentOrientationIndex - 1 ;
        }
        return -1;
    }
}
