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
class CornerRealisationView extends OpenGLWidget
{
	constructor()
	{
		super();
		this.name = "CornerRealisationView";
		this.init();
		//Flip selection dropdown
		this.flipDropDown = new DropDown(this.canvas.parentNode,50,5,5,"Flip: ");
		this.flipDropDown.dropDown.addEventListener("change", this.updateFlipDropDown.bind(this));
		this.flipDropDown.addEntry("-1");
		//Show all check box
		this.checkBox = new CheckBox(this.canvas.parentNode,100, 5,"Show all flips");
		this.checkBox.checkBox.addEventListener( 'change', this.updateCheckBox.bind(this));
		//Data 
		//this.muA = null;
		//this.muB = null;
		this.path = "files";
		this.muBTransformMat3 = null;
		this.orientations = [];
		this.node = null;
		this.contacts = [];
		this.parameters = [];
		//Vars
		this.scale = 1;
		this.bondRadius = 0.05;
	}
	update()
	{
		this.updateSize(this.canvas);
		var meshLoaded = true;
		for(i=0; i<this.meshTypesLoaded.length; i++) {
			meshLoaded = meshLoaded && this.meshTypesLoaded[i];
		}
		if(this.redrawRequiered && meshLoaded == true && this.muAReceived && this.muBReceived)
		{
			this.redrawRequiered = false;
			this.renderer.setCameraUniform(this.camera.getCameraMatrix(this.lastMouseCoordinates));
			this.renderer.setLightUniform(vec3.fromValues(10,20,40));
			this.renderer.clearAndResize();
			if(this.mouseWasPressed)
			{
				this.mouseWasPressed = false;
			}		

			for(var i=0;i<this.meshTypesNumber;i++)
			{
				if(i == this.meshTypes.CYLINDER)
				{
					this.renderer.clearDepthbuffer();
				}
				this.renderer.drawMesh(this.meshes[i],
										this.meshData[i][this.entryType.TRANSLATION],
										this.meshData[i][this.entryType.ROTATION],
										this.meshData[i][this.entryType.SCALE],
										this.meshData[i][this.entryType.COLOR],
										0);
			}	
		}
	
	}
	setOrientations(node, orientations)
	{
		this.node = node;
		this.orientations = orientations;
		this.flipDropDown.clear();
		for(var h=0;h<this.orientations.length;h++)
		{			
			var orientation = this.orientations[h];
			var flip = orientation.flip;
			this.flipDropDown.addEntry(flip);
		}
		if(orientations.length == 0)
		{
			this.flipDropDown.addEntry("-1");
		}
		this.contacts = [];
		this.parameters = [];
		if(this.node != null)
		{
			for(var i=0;i<this.muB.length;i++)
			{
				this.contacts.push(this.getContacts(i));
				this.parameters.push(this.getParameters(i));
			}
		}		
		this.updateTransformationMatrices();
		this.redrawRequiered = true;
	}
	updateTransformationMatrices()
	{
		this.clearMeshData();
		for(var i=0;i<this.muA.length;i++)
		{
			this.addMeshForRendering(this.meshTypes.SPHERE,vec3.fromValues(this.muA[i].xcoord/this.scale,this.muA[i].ycoord/this.scale,this.muA[i].zcoord/this.scale),this.muA[i].radius/this.scale,this.colorMUA);
		}
		var selectedFlip = parseInt(this.flipDropDown.getCurrentEntry(),10);

		for(var h=0;h<this.orientations.length;h++)
		{			
			var orientation = this.orientations[h];
			var flip = orientation.flip;
			if(flip == selectedFlip || this.checkBox.checked())
			{							
				var muBTransformMat3 = Util.getTransMatrix(orientation.fb,orientation.tb);	
				
				for(var i=0;i<this.muB.length;i++)
				{
					var atomBArray = Util.trans(muBTransformMat3,[this.muB[i].xcoord,this.muB[i].ycoord,this.muB[i].zcoord]);
					var atomBVec3 = vec3.fromValues(atomBArray[0]/this.scale,atomBArray[1]/this.scale,atomBArray[2]/this.scale);
					this.addMeshForRendering(this.meshTypes.SPHERE,atomBVec3,this.muB[i].radius/this.scale,this.colors[flip]);	
					
					for(var j=0;j<this.contacts[i].length;j++)
					{
						var atomAID = this.contacts[i][j];
						var atomAVec3 = vec3.fromValues(this.muA[atomAID].xcoord/this.scale,this.muA[atomAID].ycoord/this.scale,this.muA[atomAID].zcoord/this.scale);
						var cylinderTransforms = Util.transformCylinderAccordingToData(atomAVec3, atomBVec3,this.bondRadius);
						this.addMeshForRenderingAdvanced(this.meshTypes.CYLINDER,cylinderTransforms[0],cylinderTransforms[1],cylinderTransforms[2],vec4.fromValues(0,0,0,1));						
					}
					for(var j=0;j<this.parameters[i].length;j++)
					{
						var aOne = this.parameters[i][j];
						var aTwo = i;
						var atomAID = this.parameters[i][j];
						var atomAVec3 = vec3.fromValues(this.muA[atomAID].xcoord/this.scale,this.muA[atomAID].ycoord/this.scale,this.muA[atomAID].zcoord/this.scale);
						var cylinderTransforms = Util.transformCylinderAccordingToData(atomAVec3, atomBVec3,this.bondRadius);
						this.addMeshForRenderingAdvanced(this.meshTypes.CYLINDER,cylinderTransforms[0],cylinderTransforms[1],cylinderTransforms[2],vec4.fromValues(0.7,0.7,0.7,1));						
					}
					
				}
			}
		}
	}

	updateFlipDropDown()
	{
		this.updateTransformationMatrices();
		this.redrawRequiered = true;
	}
	updateCheckBox()
	{
		this.updateTransformationMatrices();
		this.redrawRequiered = true;
	}
	getContacts(index)
	{
		var contacts = [];
		if(this.node != null)
		{
			for(var i=0;i<this.node.Contacts.length;i++)
			{
				if(this.node.Contacts[i].two == index)
				{
					contacts.push(this.node.Contacts[i].one);
				}
			}		
		}
		return contacts;
	}
	getParameters(index)
	{
		var parameters = [];
		if(this.node != null)
		{
			for(var i=0;i<this.node.Parameters.length;i++)
			{
				if(this.node.Parameters[i].two == index)
				{
					parameters.push(this.node.Parameters[i].one);
				}
			}		
		}
		return parameters;
	}
}
