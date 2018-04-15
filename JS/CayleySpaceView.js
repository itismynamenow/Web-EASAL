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
class CayleySpaceView extends OpenGLWidget
{
	constructor()
	{
		super();
		this.name = "CayleySpaceView";
		this.init();
		//Sliders
		this.sliderDim4 = new Slider("Canvas" + this.name,0);
		this.sliderDim5 = new Slider("Canvas" + this.name,1);
		//Dropdown  to select which point to show
		this.dropDownDisplayMode = new DropDown(this.canvas.parentNode,150,20,20,"Display:  ");
		this.dropDownDisplayMode.addEntry("All");
		this.dropDownDisplayMode.addEntry("Valid");
		this.dropDownDisplayMode.addEntry("Collision");
		this.dropDownDisplayMode.addEntry("Bad Angle");
		this.dropDownDisplayMode.addEntry("Not Realizable");
		this.dropDownDisplayMode.dropDown.addEventListener("change", this.updateShowMode.bind(this));
		this.showMode = "All";
		//Dropdown to select boundary
		this.dropDownBoundary =  new DropDown(this.canvas.parentNode,150,45,20,"Boundary: ");
        this.dropDownBoundary.addEntry("NONE");
		this.dropDownBoundary.dropDown.addEventListener("change", this.onBoundaryDropdownChange.bind(this));
		//Data
		this.nodeDimension = -1;
		this.points = "";
		this.nodeWasJustSet = false;
		this.groupedPoints = [];
		this.boundaries = [];
		//IO data
		this.current4thDimID = 0;
		this.current3thDimID = 0;
		this.stepSize = 0.2;
		//Axis
		this.axisRadius = 0.05;
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
			this.updateSliders();
			this.handleMouseClick();		

			if(this.redrawRequiered && meshLoaded == true)
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
	setNode(nodeID,nodeDimension)
	{
		this.nodeDimension = nodeDimension;
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
			var pointsGroupedBy4thParameter = this.groupCayleyPointsByParameter(4,this.points);
			this.groupedPoints = [];
			this.groupedPoints = new Array(pointsGroupedBy4thParameter.length);		

			for(var i=0;i<pointsGroupedBy4thParameter.length;i++)
			{
				this.groupedPoints[i] = this.groupCayleyPointsByParameter(3,pointsGroupedBy4thParameter[i]);
			}

			var groupedPoints4thDimensionValues = new Array(this.groupedPoints.length);
			var groupedPoints3thDimensionValues = new Array(this.groupedPoints[0].length);
			for(var i=0;i<this.groupedPoints.length;i++)
			{
				groupedPoints4thDimensionValues[i] = this.groupedPoints[i][0][0].CayleyPoint[4];
			}
			for(var i=0;i<this.groupedPoints[0].length;i++)
			{
				groupedPoints3thDimensionValues[i] = this.groupedPoints[0][i][0].CayleyPoint[3];
			}
			this.current4thDimID = 0;
			this.current3thDimID = 0;
			this.moveCameraToNode(0);
			//Set slider values or hide sliders if they are not needed
			if(groupedPoints4thDimensionValues[0] != undefined)
			{
				this.sliderDim5.setValues(groupedPoints4thDimensionValues);
				this.sliderDim5.show();
			}
			else
			{
				this.sliderDim5.hide()
			}
			
			if(groupedPoints3thDimensionValues[0] != undefined)
			{
				this.sliderDim4.setValues(groupedPoints3thDimensionValues);
				this.sliderDim4.show();
			}
			else
			{
				this.sliderDim4.hide()
			}
			
			this.updateBoundaries();
			
			this.updateTransformationMatrices();
			this.redrawRequiered = true;
			this.nodeWasJustSet = false;
		}

	}
	//Groups Cayley points by 0-4 parameter
	groupCayleyPointsByParameter(parameter,points)
	{
		var uniqueParameterValues = {};
		//Get all unique values for selected parameter
		for(var i=0;i<points.length;i++)
		{
			var currentParameterValue = points[i].CayleyPoint[parameter];
			if(!(currentParameterValue in uniqueParameterValues))
			{
				uniqueParameterValues[currentParameterValue] = 0;
			}
		}
		var keys = [];
		//Create array from that unique selected parameter value to sort it later
		for (var key in uniqueParameterValues) {
			if (uniqueParameterValues.hasOwnProperty(key)) {
				keys.push(key);
			}
		}
		keys.sort();
		for(var i=0;i<keys.length;i++)
		{
			uniqueParameterValues[keys[i]] = i;
		}
		var groupedPoints = new Array(keys.length);
		for(var i=0;i<groupedPoints.length;i++)
		{
			groupedPoints[i] = [];
		}
		//Add points to groupedPoints according to parameter value
		for(var i=0;i<points.length;i++)
		{
			var currentParameterValue = points[i].CayleyPoint[parameter];
			var currentGroupID = uniqueParameterValues[currentParameterValue]
			groupedPoints[currentGroupID].push(points[i]);
		}
		return groupedPoints;
	}
	
	moveCameraToNode(groupedNodeID)
	{
		var currentPoint = this.groupedPoints[this.current4thDimID][this.current3thDimID][groupedNodeID];
		var x = 0;
		var y = 0;
		var z = 0;
		if(currentPoint.CayleyPoint.length > 0) x = currentPoint.CayleyPoint[0];
		if(currentPoint.CayleyPoint.length > 1) y = currentPoint.CayleyPoint[1];
		if(currentPoint.CayleyPoint.length > 2) z = currentPoint.CayleyPoint[2];
		this.camera.setPosition(vec3.fromValues(x,y,z));
	}
	updateTransformationMatrices()
	{
		this.clearMeshData();
		this.drawAxis();
		for(var i=0;i<this.groupedPoints[this.current4thDimID][this.current3thDimID].length;i++)
		{
			var currentPoint = this.groupedPoints[this.current4thDimID][this.current3thDimID][i];
			var colorVec4 = null;
			//Mode determines color
			if(this.showMode == "All")
			{			
				if(currentPoint.Orientations.length > 0)
				{
					colorVec4 = vec4.fromValues(0,1,0,1);
				}
				else if(currentPoint.Collision > 0)
				{
					colorVec4 = vec4.fromValues(1,0,0,1);
				}
				else if(currentPoint.BadAngle > 0)
				{
					colorVec4 = vec4.fromValues(1,0,1,1);
				}
				else if(!currentPoint.Realizable)
				{
					colorVec4 = vec4.fromValues(0,0,1,1);
				}				
			}	
			else if(this.showMode == "Valid")
			{
				if(currentPoint.Orientations.length > 0)
				{
					colorVec4 = vec4.fromValues(0,1,0,1);
				}
			}
			else if(this.showMode == "Collision")
			{
				if(currentPoint.Collision > 0)
				{
					colorVec4 = vec4.fromValues(1,0,0,1);
				}
			}
			else if(this.showMode == "Bad Angle")
			{
				if(currentPoint.BadAngle > 0)
				{
					colorVec4 = vec4.fromValues(1,0,1,1);
				}
			}
			else if(this.showMode == "Not Realizable")
			{
				if(!currentPoint.Realizable)
				{
					colorVec4 = vec4.fromValues(0,0,1,1);
				}
			}
			
			var inBoundary = false;
			
			if(this.dropDownBoundary.getCurrentEntry() == "NONE" ) inBoundary = true;
			
			for(var j=0;j<currentPoint.Boundaries.length;j++)
			{
				if(currentPoint.Boundaries[j] == this.dropDownBoundary.getCurrentEntry()) 
				{
					inBoundary = true;
					break;
				}
			}
			
			if(colorVec4 != null && inBoundary)
			{		
				var x = 0;
				var y = 0;
				var z = 0;
				if(currentPoint.CayleyPoint.length > 0) x = currentPoint.CayleyPoint[0];
				if(currentPoint.CayleyPoint.length > 1) y = currentPoint.CayleyPoint[1];
				if(currentPoint.CayleyPoint.length > 2) z = currentPoint.CayleyPoint[2];
					
				var pointPositionVec3 = vec3.fromValues(x,y,z);
				if(currentPoint.Witness)
				{
                    this.addMeshForRendering(this.meshTypes.ICOSAHEDRON,pointPositionVec3,SETTINGS.stepSize*0.6,colorVec4);
				}
				else
				{
                    this.addMeshForRendering(this.meshTypes.CUBE,pointPositionVec3,SETTINGS.stepSize*0.7,colorVec4);
				}
			}
		}
	}
	
	updateSliders()
	{		
		//We only care about sliders in case of nodes with dimensions 3 and 4
		if(this.nodeDimension == 5 || this.nodeDimension == 4)
	    {
			var tmp4thDimID = this.sliderDim5.getCurrentID();
			var tmp3thDimID = -1;
			//Check if slider is on same position as before
			if(this.current4thDimID != tmp4thDimID && this.nodeDimension == 5)
			{
				var groupedPoints3thDimensionValues = new Array(this.groupedPoints[this.current4thDimID].length);
				for(var i=0;i<this.groupedPoints[this.current4thDimID].length;i++)
				{
					groupedPoints3thDimensionValues[i] = this.groupedPoints[this.current4thDimID][i][0].CayleyPoint[3];
				}
				this.sliderDim4.setValues(groupedPoints3thDimensionValues);			
			}
			tmp3thDimID = this.sliderDim4.getCurrentID();
			if(tmp3thDimID <0) tmp3thDimID=0;
			if(tmp4thDimID <0) tmp4thDimID=0;
			this.updateCurrentDimension(tmp3thDimID, tmp4thDimID);
	    }
	}
	updateCurrentDimension(dim3,dim4)
	{
		if(this.current3thDimID != dim3 || this.current4thDimID != dim4)
		{
			this.current3thDimID = dim3;
			this.current4thDimID = dim4;
			this.moveCameraToNode(0);
			this.updateBoundaries();
			this.updateTransformationMatrices();
			this.redrawRequiered = true;
		}
	}
	handleMouseClick()
	{
		if(this.mouseWasPressed)
		{
			this.mouseWasPressed = false;
			this.renderer.bindPickingProgramAndClear();
			this.renderer.bindFBO();
			for(var i=0;i<this.meshTypesNumber;i++)
			{
				this.renderer.drawMesh(this.meshes[i],
										this.meshData[i][this.entryType.TRANSLATION],
										this.meshData[i][this.entryType.ROTATION],
										this.meshData[i][this.entryType.SCALE],
										this.meshData[i][this.entryType.COLOR],
										0);
			}
			var selectedMesdID = this.renderer.getPixelValueAt(this.lastMouseCoordinates);
			if(selectedMesdID != -1)
			{
//				this.meshData[0][this.entryType.COLOR][selectedMesdID] = vec4.fromValues(1,0,0,1);
				this.moveCameraToNode(selectedMesdID);
				this.renderer.setCameraUniform(this.camera.getCameraMatrix(this.lastMouseCoordinates));
				var selectedCayleyPoint = this.groupedPoints[this.current4thDimID][this.current3thDimID][selectedMesdID];
				if(selectedCayleyPoint.Orientations.length > 0)
				{
					cornerRealisationView.setOrientations(atlasView.atlas[atlasView.selectedNodeID],selectedCayleyPoint.Orientations);
					realisationView.setOrientations(selectedCayleyPoint.Orientations);
				}
				else
				{
					cornerRealisationView.setOrientations(null,[]);
					realisationView.setOrientations([]);
				}			
			}
			this.renderer.unbindFBO();
			this.renderer.bindRenderingProgramAndClear();
			this.redrawRequiered = true;
		}
	}
	updateShowMode()
	{
		this.showMode = this.dropDownDisplayMode.getCurrentEntry();
		this.updateTransformationMatrices();
		this.redrawRequiered = true;
	}
	
	onBoundaryDropdownChange()
	{
		this.updateTransformationMatrices();
		this.redrawRequiered = true;
	}
		
	updateBoundaries()
	{
		var points = this.groupedPoints[this.current4thDimID][this.current3thDimID];
		var boundaries = [];
		for(var i=0;i<points.length;i++)
		{
			for(var j=0;j<points[i].Boundaries.length;j++)
			{
				boundaries.push(points[i].Boundaries[j]);
			}
		}
		//Sort unique
		boundaries = Array.from(new Set(boundaries));
		//Add values to dropdown
		this.dropDownBoundary.clear();
		this.dropDownBoundary.addEntry("NONE");
		for(var i=0;i<boundaries.length;i++)
		{
			this.dropDownBoundary.addEntry(boundaries[i]);
		}
	}
	drawAxis()
	{		
		var xAxisCylinder = Util.transformCylinderAccordingToData(vec3.fromValues(0.001,0.001,0.001), vec3.fromValues(10,0,0),this.axisRadius);
		var yAxisCylinder = Util.transformCylinderAccordingToData(vec3.fromValues(0.001,0.001,0.001), vec3.fromValues(0,10,0),this.axisRadius);
		var zAxisCylinder = Util.transformCylinderAccordingToData(vec3.fromValues(0.001,0.001,0.001), vec3.fromValues(0,0,10),this.axisRadius);
		this.addMeshForRenderingAdvanced(this.meshTypes.CYLINDER,xAxisCylinder[0],xAxisCylinder[1],xAxisCylinder[2],vec4.fromValues(1,0,0,1));						
		this.addMeshForRenderingAdvanced(this.meshTypes.CYLINDER,yAxisCylinder[0],yAxisCylinder[1],yAxisCylinder[2],vec4.fromValues(0,1,0,1));						
		this.addMeshForRenderingAdvanced(this.meshTypes.CYLINDER,zAxisCylinder[0],zAxisCylinder[1],zAxisCylinder[2],vec4.fromValues(0,0,1,1));						
					
	}
}
