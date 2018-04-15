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
class Camera
{
	constructor()
	{
		//Vars
		this.distanceToCamera = 0.2;///< our camera rotates around point
		this.direction = vec3.fromValues(0,0,1);
		this.right = vec3.fromValues(1,0,0);
		this.up = vec3.fromValues(0,1,0);
		this.position = vec3.fromValues(0,0,-15);
		this.screenSize = {x:800, y:600};
		this.lastMouseCoordinates = {x:0, y:0};
		this.cameraMatrix = mat4.create();
		//Flags
		this.mouseIsPressed = false;
		this.mouseWasJustPressed = false;
		//Constants
		this.wheelSensitivity = 0.85;
		this.keySensitivity = 0.1;
		this.rotationSensitivity = 4;
	}
	mousePressEvent(event)
	{
		if(event.button == LEFT_MOUSE_BUTTON)
		{
			this.mouseIsPressed = true;
			this.mouseWasJustPressed = true;
		}
	}	
	mouseReleaseEvent(event)
	{
		if(event.button == LEFT_MOUSE_BUTTON)
		{
			this.mouseIsPressed = false;
		}
	}
	wheelEvent(event)
	{
		if(event.deltaY > 0)
		{
			this.distanceToCamera *= this.wheelSensitivity;
		}
		else if(event.deltaY < 0)
		{
			this.distanceToCamera /= this.wheelSensitivity;
		}		
		this.updateViewMatrix(this.lastMouseCoordinates);
	}
	keyPressEvent(event)
	{
		switch(event.code)
		{
			case "KeyW":
				var scaledUp = vec3.create();
				vec3.scale(scaledUp,this.up,this.keySensitivity)
				vec3.add(this.position,this.position,scaledUp);
				break;			
			case "KeyS":
				var scaledUp = vec3.create();
				vec3.scale(scaledUp,this.up,this.keySensitivity)
				vec3.sub(this.position,this.position,scaledUp);
				break;	
			case "KeyA":
				var scaledRight = vec3.create();
				vec3.scale(scaledRight,this.right,this.keySensitivity)
				vec3.sub(this.position,this.position,scaledRight);
				break;
			case "KeyD":
				var scaledRight = vec3.create();
				vec3.scale(scaledRight,this.right,this.keySensitivity)
				vec3.add(this.position,this.position,scaledRight);
				break;
			case "KeyQ":
				var scaledDirection = vec3.create();
				vec3.scale(scaledDirection,this.direction,this.keySensitivity)
				vec3.add(this.position,this.position,scaledDirection);
				break;
			case "KeyE":
				var scaledDirection = vec3.create();
				vec3.scale(scaledDirection,this.direction,this.keySensitivity)
				vec3.sub(this.position,this.position,scaledDirection);
				break;
			case "KeyJ":
				this.direction = vec3.fromValues(0,1,0);
				this.right = vec3.fromValues(1,0,0);
				this.up = vec3.fromValues(0,0,-1);
				break;
			case "KeyK":
				this.direction = vec3.fromValues(0,0,-1);
				this.right = vec3.fromValues(1,0,0);
				this.up = vec3.fromValues(0,-1,0);
				break;
			case "KeyI":
				this.direction = vec3.fromValues(1,0,0);
				this.right = vec3.fromValues(0,0,1);
				this.up = vec3.fromValues(0,-1,0);
				break;
		}
		this.updateViewMatrix(this.lastMouseCoordinates);
	}
	resizeEvent(width,height)
	{
		if(width === 0 )
		{
			width = 0.001;
		}
		if(height === 0)
		{
			height = 0.001;
		}
		this.screenSize = {x:width,y:height};
		this.updateViewMatrix(this.lastMouseCoordinates);
	}
	getLastCameraMatrix()
	{
		return this.cameraMatrix;
	}
	getCameraMatrix(mouseCoordinates)
	{
		if(this.mouseWasJustPressed)
		{
			this.lastMouseCoordinates = mouseCoordinates;
			this.mouseWasJustPressed = false;
		}
		this.updateViewMatrix(mouseCoordinates);
		return this.cameraMatrix;
	}
	getEyeLocation()
	{
		var scaledDirection = vec3.create();
		vec3.scale(scaledDirection,this.direction,this.distanceToCamera);
		var eye = vec3.create();
		vec3.sum(eye,this.position,scaledDirection);
		return eye;
	}
	getRight()
	{
		return this.right;
	}
	getUp()
	{
		return this.up;
	}
	setPosition(position)
	{
		this.position = position;
		this.updateViewMatrix(this.lastMouseCoordinates);
	}
	setDirection(direction)
	{
		this.direction = direction;
		this.updateViewMatrix(this.lastMouseCoordinates);
	}
	init(screenSize,position,direction)
	{
		this.screenSize = screenSize;
		this.position = position;
		this.direction = direction;
        this.updateViewMatrix(this.lastMouseCoordinates);
	}
	updateViewMatrix(mouseCoordinates)
	{
		//Get angle	
		var mouseDelta;
		if(this.mouseIsPressed)
		{
			mouseDelta = {x:mouseCoordinates.x - this.lastMouseCoordinates.x,y: -(mouseCoordinates.y - this.lastMouseCoordinates.y)};			
		}
		else
		{
			mouseDelta = {x:0,y:0};
		}
		//Update lasMouseCoords
		this.lastMouseCoordinates = mouseCoordinates;
		

		var rotationAngle = vec2.fromValues(mouseDelta.x/this.screenSize.x*this.rotationSensitivity,mouseDelta.y/this.screenSize.y*this.rotationSensitivity);
		//Rotate direction
		var anglePitch = rotationAngle[1];//Around X
		var angleYaw = rotationAngle[0];//Around Y
		var angleRoll = 0;//Around Z
		var directionRotationMatrix = mat4.create();
		mat4.rotate(directionRotationMatrix,directionRotationMatrix,angleYaw,this.up);
		//Rotate right vec3
		this.right = Util.multVec3ByMat4(this.right,directionRotationMatrix);
		vec3.normalize(this.right,this.right);
		//Rotate mat4 according to new value of right
		mat4.rotate(directionRotationMatrix,directionRotationMatrix,anglePitch,this.right);
		//Rotate direction vec3
		this.direction = Util.multVec3ByMat4(this.direction,directionRotationMatrix);
		vec3.normalize(this.direction,this.direction);
		//Get new value of Up vec3
		vec3.cross(this.up,this.right,this.direction);
		vec3.normalize(this.up,this.up);
		//Set view matrix
		var viewMatrix = mat4.create();
		var scaledDirection = vec3.create();
		vec3.scale(scaledDirection,this.direction,this.distanceToCamera);
		var eye = vec3.create();
		vec3.add(eye,this.position,scaledDirection);
		mat4.lookAt(viewMatrix,eye,this.position,this.up);
		//Set projection matrix
		var projectionMatrix = mat4.create();
		var aspectRatio = this.screenSize.x / this.screenSize.y;
		if(aspectRatio > 1)
		{
			mat4.ortho(projectionMatrix,-1.0,1.0,-1.0/aspectRatio,1.0/aspectRatio,-10,10000.0);// ortho(out, left, right, bottom, top, near, far)
		}
		else
		{
			mat4.ortho(projectionMatrix,-1.0*aspectRatio,1.0*aspectRatio,-1.0,1.0,-10,10000.0);
		}
			
		projectionMatrix = Util.scaleMat4(projectionMatrix,this.distanceToCamera);
		
		//Update Camera matrix
		mat4.mul(this.cameraMatrix,projectionMatrix,viewMatrix);					
			
	
	}
}
