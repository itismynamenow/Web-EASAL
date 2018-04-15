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
class RealisationView extends OpenGLWidget
{
	constructor()
	{
		super();
		this.name = "RealisationView";
		this.init();
		//Checkboxes
		this.checkBoxes = new Array(8);
		for(var i=0;i<8;i++)
		{
			this.checkBoxes[i] = new CheckBox(this.canvas.parentNode,20 + i*80, 20,"Flip " + i);
			this.checkBoxes[i].checkBox.addEventListener( 'change', this.updateCheckboxes.bind(this));
			this.checkBoxes[i].checkBox.checked= false;
			this.checkBoxes[i].checkBox.disabled= true;
		}
		//Data 
		/*this.muA = null;
		this.muB = null;
		this.muAReceived = false;
		this.muBReceived = false;*/
		this.orientations = [];
		this.path = "files";
		//Constants
		this.scale = 1;
		
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
		updateCheckboxes()
	{
		this.updateTransformationMatrices();
		this.redrawRequiered = true;
	}
	setOrientations(orientations)
	{
		this.orientations = orientations;
		this.disableCheckboxes();
		for(var h=0;h<this.orientations.length;h++)
		{			
			var orientation = this.orientations[h];
			var flip = orientation.flip;
			this.checkBoxes[flip].checkBox.disabled = false;
			this.checkBoxes[flip].checkBox.checked = true;
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
		for(var h=0;h<this.orientations.length;h++)
		{			
			var orientation = this.orientations[h];
			var flip = orientation.flip;
			if(this.checkBoxes[flip].checked())
			{							
				var muBTransformMat3 = Util.getTransMatrix(orientation.fb,orientation.tb);	
				
				for(var i=0;i<this.muB.length;i++)
				{
					var atomBArray = Util.trans(muBTransformMat3,[this.muB[i].xcoord,this.muB[i].ycoord,this.muB[i].zcoord]);
					var atomBVec3 = vec3.fromValues(atomBArray[0]/this.scale,atomBArray[1]/this.scale,atomBArray[2]/this.scale);
					this.addMeshForRendering(this.meshTypes.SPHERE,atomBVec3,this.muB[i].radius/this.scale,this.colors[flip]);			
				}
			}
		}

		this.camera.setPosition(vec3.fromValues(0,0,0));
	}
	disableCheckboxes()
	{
		for(var i=0;i<8;i++)
		{
			this.checkBoxes[i].checkBox.disabled = true;
			this.checkBoxes[i].checkBox.checked = false;
		}
	}
}
