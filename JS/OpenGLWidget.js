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
//Parent class for all 3D widgets
class OpenGLWidget
{
	//Empty constructor - call super() in child class to make this not null
	constructor()
	{
	}
	init()
	{		
		this.renderer = new Renderer("Canvas" + this.name);		
		//Canvas and Contex
		this.canvas = document.getElementById("Canvas" + this.name);
		//Mouse
		this.lastMouseCoordinates = {x:0,y:0};
		this.mouseWasPressed = false;
		this.hasMouseFocus = false;
		//Event listners
		this.canvas.addEventListener('mousemove', this.updateMouseCoordinates.bind(this),false);
		this.canvas.addEventListener('mousedown', this.mousePressEvent.bind(this),false);
		this.canvas.addEventListener('mouseup', this.mouseReleaseEvent.bind(this),false);
		this.canvas.addEventListener('wheel', this.wheelEvent.bind(this),false);
		this.canvas.addEventListener("mouseover", function( event ) 
		  	{   
				this.hasMouseFocus = true; 
			}.bind(this), false);
		this.canvas.addEventListener("mouseout", function( event ) 
		  	{   
				this.hasMouseFocus = false; 
			}.bind(this), false);
		window.addEventListener( 'keydown', this.keyPressEvent.bind(this), false);		
		//Camera
		this.camera = new Camera();
		this.camera.init({x:this.canvas.width,y:this.canvas.height},vec3.fromValues(0,0,0),vec3.fromValues(0,0,1));
		//Timer 		
		this.timer = setInterval(this.update.bind(this), 30);
		//Rendering data
		this.meshFiles= ["Cube.json","Sphere.json","Cylinder.json","Icosahedron.json"];
		this.meshTypes = {CUBE:0,SPHERE:1,CYLINDER:2,ICOSAHEDRON:3};
		this.meshTypesLoaded = [false,false,false,false];
		this.redrawRequiered = true;
		this.meshTypesNumber = this.meshFiles.length;
		this.cube = new Mesh3D(this.meshTypes.CUBE,this.renderer.getContext(), this);
		this.sphere = new Mesh3D(this.meshTypes.SPHERE,this.renderer.getContext(), this);
		this.cylinder = new Mesh3D(this.meshTypes.CYLINDER,this.renderer.getContext(), this);
		this.icosahedron = new Mesh3D(this.meshTypes.ICOSAHEDRON,this.renderer.getContext(), this);
		this.meshes = [this.cube,this.sphere,this.cylinder,this.icosahedron];	
		this.entryType = {TRANSLATION:0,ROTATION:1,SCALE:2,COLOR:3};
		this.meshData = []
		for(var i =0;i<this.meshTypesNumber;i++)
		{
			this.meshData.push([[],[],[],[]])//0:position, 1:rotation, 2:sclae, 3:color
		}
		//Constants
		this.colorMUA = vec4.fromValues(0.1,0.4,0.9,1);
		this.colors = [8];
		this.colors[0] = vec4.fromValues(0.75,0,0.75,1);
    	this.colors[1] = vec4.fromValues(0.75,0,0.5,1);
		this.colors[2] = vec4.fromValues(0.75,1,0,1);
		this.colors[3] = vec4.fromValues(0.25,1,0.25,1);
		this.colors[4] = vec4.fromValues(0,1,0.75,1);
		this.colors[5] = vec4.fromValues(0,1,1,1);
		this.colors[6] = vec4.fromValues(0,0.5,0.25,1);
		this.colors[7] = vec4.fromValues(0,0.5,0.5,1);
		this.muA = null;
		this.muB = null;
		this.muAReceived = false;
		this.muBReceived = false;

	}
	
	setMolecularUnits(muAFileName,muBFileName)
	{
		var outerObj = this;
		Loader.get('http://' + server + '/staticFiles/'+ muAFileName, function(response) {
			var obj = JSON.parse(response);
			outerObj.muA = obj;
			outerObj.muAReceived = true;
			if(outerObj.muBReceived == true){
			outerObj.updateTransformationMatrices();
			outerObj.redrawRequiered = true;

			}
			//console.log(obj);
		});

		Loader.get('http://' + server + '/staticFiles/'+ muBFileName, function(response) {
			var obj = JSON.parse(response);
			outerObj.muB = obj;
			outerObj.muBReceived = true;

			if(outerObj.muAReceived == true){
			outerObj.updateTransformationMatrices();
			outerObj.redrawRequiered = true;
			}
			//console.log(obj);
		});
	}

	//Overwrite it in child
	update()
	{
		
	}
	//Turns timer off stopping updates
	stop()
	{
		clearTimeout(this.timer);
	}
	//Turns timer on resuming uppdates
	start()
	{
		this.timer = setInterval(this.update.bind(this), 30);
		this.redrawRequiered = true;
	}
	//Empties all rendering related data
	clearMeshData()
	{
		for(var i=0;i<this.meshTypesNumber;i++)
		{
			this.meshData[i] = [[],[],[],[]];
		}
	}
	//Takes care of resizes of this widget
	updateSize(canvas) 
	{
		// Lookup the size the browser is displaying the canvas.
		var displayWidth  = canvas.clientWidth;
		var displayHeight = canvas.clientHeight;

		// Check if the canvas is not the same size.
		if (canvas.width  != displayWidth ||
		  canvas.height != displayHeight) 
		{
			// Make the canvas the same size
			canvas.width  = displayWidth;
			canvas.height = displayHeight;
			this.camera.resizeEvent(displayWidth,displayHeight);
			this.redrawRequiered = true;
		}
	}
	addMeshForRendering(meshType,positionVec3,scaleFloat,colorVec4)
	{
		//Create matrices
		var positionMat4 = mat4.create();
		mat4.translate(positionMat4,positionMat4,positionVec3);
		var rotationMat4 = mat4.create();
		var scaleMat4 = mat4.create();
		scaleMat4 = Util.scaleMat4(scaleMat4,scaleFloat);
		this.addMeshForRenderingAdvanced(meshType,positionMat4,rotationMat4,scaleMat4,colorVec4);
	}
	addMeshForRenderingAdvanced(meshType,positionMat4,rotationMat4,scaleMat4,colorVec4)
	{
		this.meshData[meshType][this.entryType.TRANSLATION].push(positionMat4);
		this.meshData[meshType][this.entryType.ROTATION].push(rotationMat4);
		this.meshData[meshType][this.entryType.SCALE].push(scaleMat4);
		this.meshData[meshType][this.entryType.COLOR].push(colorVec4);
	}
	keyPressEvent(event)
	{
		if(this.hasMouseFocus)
		{
			this.camera.keyPressEvent(event);
			this.redrawRequiered = true;
		}
		
	}
	mousePressEvent(event)
	{
		this.camera.mousePressEvent(event);
		this.mouseWasPressed = true;
		this.redrawRequiered = true;
	}
	mouseReleaseEvent(event)
	{
		this.camera.mouseReleaseEvent(event);
		this.redrawRequiered = true;
	}
	wheelEvent(event)
	{
		this.camera.wheelEvent(event);
		this.redrawRequiered = true;
	}
	updateMouseCoordinates(event)
	{
		var rect = this.canvas.getBoundingClientRect();
        this.lastMouseCoordinates = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
		this.redrawRequiered = true;
	}

}
