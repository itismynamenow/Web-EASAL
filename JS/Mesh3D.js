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
//MESHES ARE TAKEN FROM JSON FILES MADE BY https://threejs.org/editor/
//IF MESH MADE ELSWHERE CODE CAN FAIL BECAUSE DATA MAYBE STORED DIFFERENTLY
class Mesh3D
{
    constructor(filenum,glContext, parentPointer)
    {
        this.directory = "data";
	this.parentPointer = parentPointer;
	this.glContext = glContext;
	this.fileIndex = filenum;
        this.vertexData = [];//looks as x0,y0,z0,xn0,yn,zn0,x1,y1.. where n means normal
        this.vbo = undefined;
        this.vao = undefined;
		this.vertexCount = -1;
        this.create(parentPointer.meshFiles[filenum],glContext);
    }
    getVertexDataFromFile(filename)
    {
    	var outerObject = this
        try
        {
			Loader.get('http://' + server + '/staticFiles/' + filename, function(response) {
				outerObject.parentPointer.meshTypesLoaded[outerObject.fileIndex] = true;
				//console.log(response)
				var obj = JSON.parse(response);
				var data = obj.geometries[0].data.attributes;
				var positions = data.position.array;
				var normals = data.normal.array;
				for(var i = 0;i<positions.length;i+=3) {
					outerObject.vertexData.push(positions[i]);
					outerObject.vertexData.push(positions[i+1]);
					outerObject.vertexData.push(positions[i+2]);
					outerObject.vertexData.push(normals[i]);
					outerObject.vertexData.push(normals[i+1]);
					outerObject.vertexData.push(normals[i+2]);
				}
				outerObject.vertexCount = positions.length/3;
				outerObject.createBuffer(outerObject.glContext);
			});
        }
        catch(err)
        {
          ErrorLogger.addMessage("ERROR: Failed to load '" + filename + "' from '" + this.directory + "' : " + err.message + "\n");      
        }
    }
    createBuffer(glContext) {
    
		// Create
		this.vao = glContext.createVertexArray();
		this.vbo = glContext.createBuffer();		
		// Bind
		glContext.bindVertexArray(this.vao);
		glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vbo);
		// Fill with data 
	  	glContext.bufferData(glContext.ARRAY_BUFFER,
					new Float32Array(this.vertexData),
					glContext.STATIC_DRAW);
		// Tell how to treate this data
		glContext.enableVertexAttribArray(0);
		glContext.vertexAttribPointer(0, 3, glContext.FLOAT, false, 24, 0);//24 = 6*sizeof(FLOAT)
		glContext.enableVertexAttribArray(1);
		glContext.vertexAttribPointer(1, 3, glContext.FLOAT, false, 24, 12);//12 = 3*sizeof(FLOAT)
		// Release
		glContext.bindVertexArray(null);
		glContext.bindBuffer(glContext.ARRAY_BUFFER, null);
    }
    create(filename,glContext)
    {
        this.getVertexDataFromFile(filename);
        //this.createBuffer(glContext);
    }
    
    
}
