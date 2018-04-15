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
class Renderer
{
    constructor(canvasName)
    {
		this.numberOfOjectsRenderedAtOnce = 256;
        this.vertexShaderSourceRendering = 
			`#version 300 es
            layout(location = 0) in highp vec4 vertex;
            layout(location = 1) in highp vec3 normal;
            uniform highp mat4 translationMatrix[`+this.numberOfOjectsRenderedAtOnce+`];
            uniform highp mat4 rotationMatrix[`+this.numberOfOjectsRenderedAtOnce+`];
            uniform highp mat4 scaleMatrix[`+this.numberOfOjectsRenderedAtOnce+`];
            uniform highp mat4 cameraMatrix;
            out highp vec3 vertexNormal;
            out highp vec3 vertexCoordinate;
            flat out int instanceID;
            void main() {
               instanceID = gl_InstanceID;
               mat4 modelMatrix = translationMatrix[gl_InstanceID] * rotationMatrix[gl_InstanceID] * scaleMatrix[gl_InstanceID];
               vertexNormal = mat3(transpose(inverse(modelMatrix))) * normal;
               vertexCoordinate = vec3(modelMatrix * vertex);
               gl_Position = cameraMatrix * modelMatrix * vertex;
            }
            `;
        this.fragmentShaderSourceRendering = 
			`#version 300 es
			precision highp float;
            in highp vec3 vertexNormal;
            in highp vec3 vertexCoordinate;
            flat in int instanceID;
            out highp vec4 fragColor;
            uniform highp vec3 lightPositionVector;
            uniform highp vec4 colorVector[`+this.numberOfOjectsRenderedAtOnce+`];
            void main() 
			{
			   	highp vec3 lightVector = lightPositionVector - vertexCoordinate;
			   	highp float lightFactor = dot(normalize(vertexNormal), normalize(lightVector));
				highp float lowerBound = 0.15;
				highp float upperBound = 0.70;
	
			   	vec3 baseColor = vec3(colorVector[instanceID].x,colorVector[instanceID].y,colorVector[instanceID].z);
//				baseColor *= lightFactor * 0.7;
				baseColor += vec3(1.0,1.0,1.0) * lightFactor * 0.3;
				highp float minVal = min(baseColor.x,baseColor.y);
				minVal = min(minVal,baseColor.z);
//				if(minVal < 0.0)
//				{
//					baseColor = vec3(baseColor.x + minVal,baseColor.y + minVal,baseColor.z + minVal);
//				}	
				highp float maxVal = max(baseColor.x,baseColor.y);
				maxVal = max(maxVal,baseColor.z);
//				if(maxVal > 1.0)
//				{
//					baseColor = baseColor / maxVal;
//				}
//				
				baseColor *=  upperBound - lowerBound;
				baseColor = vec3(baseColor.x + lowerBound,baseColor.y + lowerBound,baseColor.z + lowerBound); 

               fragColor = clamp(vec4(baseColor,colorVector[instanceID].w), 0.0, 1.0);
            }
            `;
		this.vertexShaderSourcePicking =
			`#version 300 es
			layout(location = 0) in highp vec4 vertex;
			layout(location = 1) in highp vec3 normal;
			uniform highp mat4 translationMatrix[`+this.numberOfOjectsRenderedAtOnce+`];
			uniform highp mat4 rotationMatrix[`+this.numberOfOjectsRenderedAtOnce+`];
			uniform highp mat4 scaleMatrix[`+this.numberOfOjectsRenderedAtOnce+`];
			uniform highp mat4 cameraMatrix;
			flat out int instanceID;
			void main() {
			   instanceID = gl_InstanceID;
			   mat4 modelMatrix = translationMatrix[gl_InstanceID] * rotationMatrix[gl_InstanceID] * scaleMatrix[gl_InstanceID];
			   gl_Position = cameraMatrix * modelMatrix * vertex;
			}
			`;

		this.fragmentShaderSourcePicking =
			`#version 300 es
			in highp vec3 vertexNormal;
			in highp vec3 vertexCoordinate;
			flat in int instanceID;
			uniform int colorID;
			out highp vec4 fragColor;
			void main() {
			   fragColor = vec4(float(instanceID)/255.0f,float(colorID)/255.0f,0.345,1);
			}
			`;
        this.canvas = document.getElementById(canvasName);
        // Initialize the GL context
        this.glContext = this.canvas.getContext("webgl2");
      	this.cameraMatrix = mat4.create();
		this.lightPositionVector = vec3.create();
		this.fbo = null;///<frame buffer objects used for mousepicking
		this.numberOfOjectsRenderedAtOnce = 128;
        // Only continue if WebGL is available and working
        if (! this.glContext) {
          ErrorLogger.addMessage("Unable to initialize WebGL2. Your browser or machine may not support it.");
        }		
		//Init shaders
        this.renderingProgram = this.initShaderProgram( this.glContext, this.vertexShaderSourceRendering, this.fragmentShaderSourceRendering);
        this.pickingProgram = this.initShaderProgram( this.glContext, this.vertexShaderSourcePicking, this.fragmentShaderSourcePicking);
		this.pickingProgramIsBind = false;
		this.renderingProgramIsBind = false;
      	// Get pointers  to uniforms for Renderig program
        this.translationMatrixUniformRendering = this.glContext.getUniformLocation(this.renderingProgram, 'translationMatrix');
        this.rotationMatrixUniformRendering = this.glContext.getUniformLocation(this.renderingProgram, 'rotationMatrix');
        this.scaleMatrixUniformRendering = this.glContext.getUniformLocation(this.renderingProgram, 'scaleMatrix');
        this.cameraMatrixUniformRendering = this.glContext.getUniformLocation(this.renderingProgram, 'cameraMatrix');
        this.lightPositionVectorUniformRendering = this.glContext.getUniformLocation(this.renderingProgram, 'lightPositionVector');
        this.colorVectorUniformRendering = this.glContext.getUniformLocation(this.renderingProgram, 'colorVector');
		// Get pointers  to uniforms for Picking program
		this.translationMatrixUniformPicking = this.glContext.getUniformLocation(this.pickingProgram, 'translationMatrix');
        this.rotationMatrixUniformPicking = this.glContext.getUniformLocation(this.pickingProgram, 'rotationMatrix');
        this.scaleMatrixUniformPicking = this.glContext.getUniformLocation(this.pickingProgram, 'scaleMatrix');
        this.cameraMatrixUniformPicking = this.glContext.getUniformLocation(this.pickingProgram, 'cameraMatrix');
        this.colorIDUniformPicking = this.glContext.getUniformLocation(this.pickingProgram, 'colorID');
		//Use shading program
//		this.bindPickingProgramAndClear();
		this.bindRenderingProgramAndClear();
//		this.glContext.useProgram(this.renderingProgram);
//		this.renderingProgramIsBind = true;
		this.initGL();

    }
    //
    // Initialize a shader program, so WebGL knows how to draw our data
    //
    initShaderProgram(glContex, vsSource, fsSource) 
	{
      const vertexShader = this.loadShader(glContex, glContex.VERTEX_SHADER, vsSource);
      const fragmentShader = this.loadShader(glContex, glContex.FRAGMENT_SHADER, fsSource);
    
      // Create the shader program
    
      const shaderProgram = glContex.createProgram();
      glContex.attachShader(shaderProgram, vertexShader);
      glContex.attachShader(shaderProgram, fragmentShader);
      glContex.linkProgram(shaderProgram);
    
      // If creating the shader program failed, alert
    
      if (!glContex.getProgramParameter(shaderProgram, glContex.LINK_STATUS)) {
        ErrorLogger.addMessage("Unable to initialize the shader program: " + glContex.getProgramInfoLog(shaderProgram));
        return null;
      }
    
      return shaderProgram;
    }
    
    //
    // creates a shader of the given type, uploads the source and
    // compiles it.
    //
    loadShader(glContext, type, source) 
	{
      const shader = glContext.createShader(type);
    
      // Send the source to the shader object
    
      glContext.shaderSource(shader, source);
    
      // Compile the shader program
    
      glContext.compileShader(shader);
    
      // See if it compiled successfully
    
      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        ErrorLogger.addMessage("An error occurred compiling the shaders: " + glContext.getShaderInfoLog(shader));
        glContext.deleteShader(shader);
        return null;
      }
    
      return shader;
    }
	setCameraUniform(cameraMatrix)
	{
		this.cameraMatrix = cameraMatrix;		
	}
	setLightUniform(lightPositionVector)
	{
		this.lightPositionVector = lightPositionVector;		
	}
	getContext()
	{
		return this.glContext;
	}
	initGL()
	{
		this.glContext.viewport(0, 0, this.glContext.canvas.width, this.glContext.canvas.height);
		this.glContext.clearColor(1.0, 1.0, 1.0, 1.0);  // Clear to black, fully opaque
		this.glContext.clearDepth(1.0);                 // Clear everything
		this.glContext.enable(this.glContext.DEPTH_TEST);           // Enable depth testing
		this.glContext.depthFunc(this.glContext.LEQUAL);            // Near things obscure far things
	}
	clearAndResize()
	{		
		// Clear the canvas before we start drawing on it.
		this.glContext.clear(this.glContext.COLOR_BUFFER_BIT | this.glContext.DEPTH_BUFFER_BIT);
		//Resize
		this.resize(this.glContext.canvas);
		this.glContext.viewport(0, 0, this.glContext.canvas.width, this.glContext.canvas.height);
	}
    drawMesh(mesh3D,translationMatrices,rotationMatrices,scaleMatrices,colorVectors,colorIDOffset) 
	{
		if(translationMatrices.length != 0)
		{
			var glContext = this.glContext;
			var programInfo = this.programInfo;
			
			var numberOfObjects = translationMatrices.length;
			var numberOfOjectsRenderedAtOnce = this.numberOfOjectsRenderedAtOnce;
			
			//For some reason I need to always bind current program
//			if(this.renderingProgramIsBind)
//			{
//				this.bindRenderingProgramAndClear();
//			}
//			else if(this.pickingProgramIsBind)
//			{
//				this.bindPickingProgramAndClear();
//			}
			this.glContext.bindVertexArray(mesh3D.vao);
			glContext.bindBuffer(glContext.ARRAY_BUFFER, mesh3D.vbo);
			// We can draw only 128 objects per call so we draw entire scene in several iterations using this for loop that renders at most 128 at once
			for(var h=0;h*numberOfOjectsRenderedAtOnce < numberOfObjects;h++)
			{
				var startObjectID = h * numberOfOjectsRenderedAtOnce;
				var numberOfObjectsToRenderNow = numberOfObjects - startObjectID;
				if(numberOfObjectsToRenderNow > numberOfOjectsRenderedAtOnce)
				{
					numberOfObjectsToRenderNow = numberOfOjectsRenderedAtOnce;
				}
				var translationData = new Float32Array(translationMatrices.length*16);
				var rotationData = new Float32Array(translationMatrices.length*16);
				var scaleData = new Float32Array(translationMatrices.length*16);
				var colorData = new Float32Array(translationMatrices.length*4);
				for(var i=0;i<numberOfObjectsToRenderNow;i++)//Stupid JS forces us to convert everything to monolitic Float32Arrays...
				{
					for(var j=0;j<16;j++)
					{
						translationData[i*16+j] = translationMatrices[i + startObjectID][j];
						rotationData[i*16+j] = rotationMatrices[i + startObjectID][j];
						scaleData[i*16+j] = scaleMatrices[i + startObjectID][j];
					}
					for(var j=0;j<4;j++)
					{
						colorData[i*4+j] = colorVectors[i + startObjectID][j];
					}
				}
				if(this.renderingProgramIsBind)
				{
					glContext.uniformMatrix4fv(this.translationMatrixUniformRendering, false, translationData,0,numberOfObjectsToRenderNow*16);//Last numbers: offset and length
					glContext.uniformMatrix4fv(this.rotationMatrixUniformRendering, false, rotationData,0,numberOfObjectsToRenderNow*16);//Last numbers: offset and length
					glContext.uniformMatrix4fv(this.scaleMatrixUniformRendering, false, scaleData,0,numberOfObjectsToRenderNow*16);//Last numbers: offset and length
					glContext.uniform4fv(this.colorVectorUniformRendering, colorData,0,numberOfObjectsToRenderNow*4);//Last numbers: offset and length
					glContext.uniformMatrix4fv(this.cameraMatrixUniformRendering, false, this.cameraMatrix);//Last numbers: offset and length
					glContext.uniform3fv(this.lightPositionVectorUniformRendering, this.lightPositionVector);//Last numbers: offset and length
				}
				else if(this.pickingProgramIsBind)
				{
					glContext.uniformMatrix4fv(this.translationMatrixUniformPicking, false, translationData,0,numberOfObjectsToRenderNow*16);//Last numbers: offset and length
					glContext.uniformMatrix4fv(this.rotationMatrixUniformPicking, false, rotationData,0,numberOfObjectsToRenderNow*16);//Last numbers: offset and length
					glContext.uniformMatrix4fv(this.scaleMatrixUniformPicking, false, scaleData,0,numberOfObjectsToRenderNow*16);//Last numbers: offset and length
					glContext.uniform1i(this.colorIDUniformPicking,h + colorIDOffset);
					glContext.uniformMatrix4fv(this.cameraMatrixUniformPicking, false, this.cameraMatrix);//Last numbers: offset and length
				}
				
				const offset = 0;
				const vertexCount = mesh3D.vertexCount;
				glContext.drawArraysInstanced(glContext.TRIANGLES, offset, vertexCount, numberOfObjectsToRenderNow);
			}
		}        
    }
    resize(canvas) {
      // Lookup the size the browser is displaying the canvas.
      var displayWidth  = canvas.clientWidth;
      var displayHeight = canvas.clientHeight;

      // Check if the canvas is not the same size.
      if (canvas.width  != displayWidth ||
          canvas.height != displayHeight) {

        // Make the canvas the same size
        canvas.width  = displayWidth ;
		var tabsHeight = document.getElementsByClassName("nav nav-tabs").height;
        canvas.height = displayHeight - document.getElementsByClassName("nav nav-tabs").height;
      }
	}
	bindRenderingProgramAndClear()
	{
		this.glContext.clear(this.glContext.COLOR_BUFFER_BIT | this.glContext.DEPTH_BUFFER_BIT);
		this.glContext.useProgram(this.renderingProgram);
		this.pickingProgramIsBind = false;
		this.renderingProgramIsBind = true;
	}	
	bindPickingProgramAndClear()
	{
		this.glContext.clear(this.glContext.COLOR_BUFFER_BIT | this.glContext.DEPTH_BUFFER_BIT);
		this.glContext.useProgram(this.pickingProgram);
		this.pickingProgramIsBind = true;
		this.renderingProgramIsBind = false;
	}
	bindFBO()
	{
		if(this.canvas.width !== 0 && this.canvas.height !== 0)
		{
			var gl = this.glContext;
			this.fbo = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);

						this.fbo.width = this.canvas.width;
			this.fbo.height = this.canvas.height; 

			var framebuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);

			var depthBuffer = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);

			// allocate renderbuffer
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.fbo.width, this.fbo.height);  

			// attach renderebuffer
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

			var colorBuffer = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, colorBuffer);
			// allocate colorBuffer
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA8, this.fbo.width, this.fbo.height);

			// attach colorbuffer
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, colorBuffer);

			gl.clearColor(1,0,0,1);
			gl.clear(gl.COLOR_BUFFER_BIT);
		}		
	}
	unbindFBO()
	{
		if(this.fbo !== null)
		{
			var gl = this.glContext;
			this.glContext.bindFramebuffer(gl.FRAMEBUFFER, null);
			gl.deleteFramebuffer(this.fbo);
			this.fbo = null;
			gl.clearColor(1,1,1,1);
			gl.clear(gl.COLOR_BUFFER_BIT);
		}
	}
	getPixelValueAt(mousePosition)
	{
		if(this.fbo !== null)
		{
			var gl = this.glContext;
			var pixel = new Uint8Array(4);
			gl.readPixels(mousePosition.x, this.fbo.height-mousePosition.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);//3-4 arg stay for width of rect that we pick
			if(pixel[2] == 88)
			{
				return pixel[0] + pixel[1] * this.numberOfOjectsRenderedAtOnce;
			}
			else
			{
				return -1;
			}	
		}
	}
	clearDepthbuffer()
	{
        this.glContext.clear(this.glContext.DEPTH_BUFFER_BIT);
	}
}