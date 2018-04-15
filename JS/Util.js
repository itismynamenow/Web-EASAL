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
class Util
{
	static sendToServer(command)
	{
        jQuery.ajax({
            data: 'command=' + command,
            url: 'PHP/Test.php',
            method: 'POST', // or GET
        });
	}
//    static sendSettingsToServer(molecularUnitAPath,
//                                molecularUnitBPath,
//								bondingTreshholdLowerBoundLambda,
//								bondingTreshholdLowerBoundDelta,
//								bondingTreshholdUpperBoundLambda,
//                                bondingTreshholdUpperBoundDelta,
//                                collisionTreshholdLowerBoundLambda,
//                                collisionTreshholdLowerBoundDelta,
//                                angleLow,
//                                angleHigh,
//                                stepSize)
//    {
//        jQuery.ajax({
//            data: {	molecularUnitAPath:molecularUnitAPath,
//               		molecularUnitBPath:molecularUnitBPath,
//            		bondingTreshholdLowerBoundLambda:bondingTreshholdLowerBoundLambda,
//					bondingTreshholdLowerBoundDelta:bondingTreshholdLowerBoundDelta,
//					bondingTreshholdUpperBoundLambda:bondingTreshholdUpperBoundLambda,
//					bondingTreshholdUpperBoundDelta:bondingTreshholdUpperBoundDelta,
//					collisionTreshholdLowerBoundLambda:collisionTreshholdLowerBoundLambda,
//					collisionTreshholdLowerBoundDelta:collisionTreshholdLowerBoundDelta,
//					angleLow:angleLow,
//					angleHigh:angleHigh,
//					stepSize:stepSize
//			},
//            url: 'PHP/MakeSettingsFile.php',
//            method: 'POST', // or GET
//        });
//    }
	    static sendSettingsToServer()
    {
        var settings = 	
			'; Strings are enclosed in ""' + '\n' + 
			'; Bools are either "true" or "false"' + '\n' + 
			'; Arrays are enclosed in {} and values are separated by commas' + '\n' + 
			
			'[PointSetA]' +  '\n' + 
			'file = "easal-backend/files/' + SETTINGS.molecularUnitAPath +  '"\n' + 
			'ignored_rows = {}' +  '\n' + 
			'x_col = 6' +  '\n' + 
			'y_col = 7' +  '\n' + 
			'z_col = 8' +  '\n' + 
			'radius_col = 11' + '\n'  + 
			'label_col = 3' +  '\n' + 
			'pointNo_col = 1' +  '\n' + 
			


			'[PointSetB]' +  '\n' + 
			'file = "easal-backend/files/' + SETTINGS.molecularUnitBPath + '"\n' + 
//			'file = "../files/' + molecularUnitBPath + '"\n' + 
			'ignored_rows = {}' +  '\n' + 
			'x_col = 6' +  '\n' + 
			'y_col = 7' +  '\n' + 
			'z_col = 8' +  '\n' + 
			'radius_col = 11' + '\n'  + 
			'label_col = 3' +  '\n' + 
			'pointNo_col = 1' +  '\n' + 


			'[DistanceData]' +  '\n' + 
			'file = "easal-backend/files/' + + SETTINGS.predefinedInteractionsPath + '"\n' + 
			'ignored_rows = {}' +  '\n' + 
			'label1_col = 0' +  '\n' + 
			'label2_col = 1' +  '\n' + 
			'radius_col = 2' +  '\n' + 
			'radiusMin_col = -1' +  '\n' + 
			'radiusMax_col = -1' +  '\n' + 


			'[Output]' +  '\n' + 
			'dataDirectory = "*dataDirectory"' +  '\n' + 
			'sessionId = "*sessionId"' +  '\n' + 


			'[General]' +  '\n' + 
			'candidate_interactions = false' +  '\n' + 
			'reverseWitness = ' + SETTINGS.ReverseWitness +  '\n' + 


			'[RootNodeCreation]' +  '\n' + 
			'createChildren = true' +  '\n' + 
//			'dimension_of_initialContactGraphs = 4' +  '\n' + 
			'dimension_of_initialContactGraphs = ' + new String(SETTINGS.FourDRootNode?4:5) +  '\n' + 
			'useParticipatingPointZDistance = ' + SETTINGS.UseParticipatingAtomsZDistance +  '\n' + 
			'participatingPointZDistance = ' + SETTINGS.ParticipatingAtomsZDistance +  '\n' + 
			'reversePairDumbbells = ' + SETTINGS.ReversePairDumbbells +  '\n' + 
			'initial4DcontactSeparationLow = ' + SETTINGS.Initial4DContactSeperationLow +  '\n' + 
			'initial4DcontactSeparationHigh = ' + SETTINGS.Initial4DContactSeperationHigh +  '\n' + 


			'[Sampling]' +  '\n' + 
			'runSample = true' + '\n'  + 
			'GridXY = 20' +  '\n' + 
			'GridZ = 3.5' +  '\n' + 
			'stepSize = ' + SETTINGS.stepSize + '\n' + 
			'sixDimensions = false' +  '\n' + 
			'dynamicStepSizeAmong = ' + SETTINGS.DynamicStepSizeAmong + '\n'  + 
			'dynamicStepSizeWithin = ' + SETTINGS.DynamicStepSizeBetween +  '\n' + 
			'JacobianSampling = true' +  '\n' + 
			'gridSteps = {1., 1., 1., 10., 0.044658, 10.}' +  '\n' + 
			'binarySearch = true' +  '\n' + 
			'sampleAllNodes = false' +  '\n' + 
			

			'[Constraint]' +  '\n' + 
			'stericConstraint = true' + '\n'  + 
			'wholeCollision = ' + SETTINGS.WholeCollision +  '\n' + 
			'activeLowerLambda = ' + SETTINGS.bondingTreshholdLowerBoundLambda + '\n' + 
			'activeLowerDelta = ' + SETTINGS.bondingTreshholdLowerBoundDelta +  '\n' + 
			'activeUpperLambda = ' + SETTINGS.bondingTreshholdUpperBoundLambda +  '\n' + 
			'activeUpperDelta = ' + SETTINGS.bondingTreshholdUpperBoundDelta +  '\n' + 
			'collisionLambda = ' + SETTINGS.collisionTreshholdLowerBoundLambda +  '\n' + 
			'collisionDelta = ' + SETTINGS.collisionTreshholdLowerBoundDelta +  '\n' + 
			'angleLow = ' + SETTINGS.angleLow +  '\n' + 
			'angleHigh = ' + SETTINGS.angleHigh +  '\n' + 


			'[AtlasBuilding]' +  '\n' + 
			'stop = false' +  '\n' + 
			'breadthFirst = false' + '\n'  + 
			'parameterMinDeviation = false' + '\n'  + 
			'ifBadAngleWitness_createChild = false' + '\n'  + 


			'[Saving]' +  '\n' + 
			'savePointsFrequency = ' + SETTINGS.SavePointFrequency +  '\n' + 
			'saveWitnessToFinalChild = true' +  '\n' + 
			'saveBoundary = false' +  '\n' + 
			'saveOutGridOrientation = false' +  '\n' + 


			'[Statistics]' +  '\n' + 
			'run_statistics = true' +  '\n' + 
			'folder1Location = ""' +  '\n' + 
			'folder2Location = ""' +  '\n' + 
			'folder3Location = ""' +  '\n' + 
			'gridLocation = ""' +  '\n' + 
			'createPseudoAtlas = false' +  '\n' + 
		
			'[Paths]' +  '\n' + 
			'path_length = 10' +  '\n' + 
			'energy_level_upper_bound = 1' +  '\n' + 
			'energy_level_lower_bound = 0';
		
		var base64Settings = btoa(settings);
		
		Loader.get('http://'+server+'/run/' + base64Settings, (function(response) {
				var obj = JSON.parse(response);			
				console.log(obj);
//				//TMP to test sessionId
//				obj['error'] = false;
//				obj['sessionId'] = 'Run1';
				if(obj.error)
				{
					console.log("Error after sending settings to server:");
					console.log(obj.errorMsg);
				}
				else
				{
					console.log("Settings sent without errors");
					SETTINGS.sessionId = obj.sessionId;
				}
			}));
    }
	
	static multVec3ByMat4(vec3In,mat4In)
	{
		var result = vec3.create();
		for(var i=0;i<3;i++)
		{
			var matrixColumn = vec3.fromValues(mat4In[i*4],mat4In[i*4+1],mat4In[i*4+2]);
			result[i] = vec3.dot(vec3In,matrixColumn);
		}
		return result;
	}
	static scaleMat4(mat4In,factor)
	{
		var scaleVector = vec3.fromValues(factor,factor,factor);
		var outMat4 = mat4.create();
		mat4.scale(outMat4,mat4In,scaleVector);
		return outMat4;
	}
	static scaleMat4ByVec3(mat4In,scaleVector)
	{
		var outMat4 = mat4.create();
		mat4.scale(outMat4,mat4In,scaleVector);
		return outMat4;
	}
	static getTransMatrix(from,to)
	{
		var matrix = [];
		var o = [0,0,0];
		var x = [1,0,0];
		var y = [0,1,0];
		var z = [0,0,1];

		var no = this.matApp(o,from,to);
		var nx = this.matApp(x,from,to);
		var ny = this.matApp(y,from,to);
		var nz = this.matApp(z,from,to);
		// row major matrix
		for(var i = 0; i < 3; i++){
			matrix.push(nx[i]-no[i]);
			matrix.push(ny[i]-no[i]);
			matrix.push(nz[i]-no[i]);
			matrix.push(no[i]);
		}
		return matrix;
	}
	static trans(t,coord)
	{
		var ncoord = [3];
		for(var i = 0; i < 3; i++){
			ncoord[i] = 0;

			// rotation
			for(var j = 0; j < 3; j++){
				ncoord[i] += t[i*4+j]*coord[j];
			}

			// translation
			ncoord[i] += t[i*4+3];
		}
		return ncoord;
	}
	//WARNING: this is shitty method because it doesn't work in case of any coordinates of start and end with same value. Probability of this is very low using floting point math
	//so I didn't bother to fix the problem. 
	static transformCylinderAccordingToData(positionStartVec3, positionEndVec3,radious)
	{
		var directionNotNormalized = vec3.create();
		var direction = vec3.create();
		
		vec3.subtract(directionNotNormalized,positionEndVec3,positionStartVec3);
		vec3.normalize(direction,directionNotNormalized);
		
		var directionProjection = vec3.fromValues(directionNotNormalized[0],0,directionNotNormalized[2]);
		
		var axisOfRotation = vec3.create();
		vec3.cross(axisOfRotation,directionProjection,direction);
		
		var angle = Math.acos(vec3.dot(direction,directionProjection)/(vec3.length(direction) * vec3.length(directionProjection)));
		angle += Math.PI/2;
//		angle = angle*180/Math.PI+90;
		
		var translationMat4 = mat4.create();
		var translationVec3 = vec3.create();
		vec3.add(translationVec3,positionStartVec3,vec3.fromValues(directionNotNormalized[0]/2,directionNotNormalized[1]/2,directionNotNormalized[2]/2));
		mat4.fromTranslation(translationMat4,translationVec3);
		
		var rotationMat4 = mat4.create();
		mat4.rotate(rotationMat4,rotationMat4,angle,axisOfRotation);
		
		var scaleMat4 = mat4.create();
		mat4.scale(scaleMat4,scaleMat4,vec3.fromValues(radious,vec3.length(directionNotNormalized)/2,radious));
		
//		mat4.transpose(translationMat4,translationMat4);
//		mat4.transpose(rotationMat4,rotationMat4);
//		mat4.transpose(scaleMat4,scaleMat4);
		
		return [translationMat4,rotationMat4,scaleMat4];
		
	}

	static matApp(x,from,to)
	{
		var x1 = x[0];
		var x2 = x[1];
		var x3 = x[2];

		var a1 = from[0];
		var a2 = from[1];
		var a3 = from[2];

		var b1 = from[3];
		var b2 = from[4];
		var b3 = from[5];

		var c1 = from[6];
		var c2 = from[7];
		var c3 = from[8];

		var ap1 = to[0];
		var ap2 = to[1];
		var ap3 = to[2];

		var bp1 = to[3];
		var bp2 = to[4];
		var bp3 = to[5];

		var cp1 = to[6];
		var cp2 = to[7];
		var cp3 = to[8];

		//the output
		//var* cg3= new var[3];

		var t1 =  ( b1 *  b1);
		var t2 =  ( ap1 *  t1);
		var t3 =  ( c3 *  c3);
		var t5 =  ( b2 *  b2);
		var t6 =  ( ap1 *  t5);
		var t7 =  ( c1 *  c1);
		var t9 =  ( b3 *  b3);
		var t10 =  ( ap1 *  t9);
		var t11 =  ( c2 *  c2);
		var t13 =  ( a3 *  a3);
		var t14 =  ( bp1 *  t13);
		var t17 =  ( cp1 *  t9);
		var t18 =  ( a2 *  a2);
		var t20 =  ( a1 *  a1);
		var t21 =  ( bp1 *  t20);
		var t23 =  ( bp1 *  b3);
		var t24 =  ( a2 *  c3);
		var t25 =  ( t24 *  x2);
		var t27 =  ( ap1 *  b3);
		var t28 =  ( c1 *  a1);
		var t29 =  ( t28 *  c3);
		var t31 =  ( ap3 *  cp2);
		var t32 =  ( b1 *  c2);
		var t33 =  ( t32 *  a3);
		var t35 =  ( ap1 *  c2);
		var t36 =  ( a2 *  c1);
		var t37 =  ( t36 *  x1);
		var t39 =  ( bp1 *  a1);
		var t40 =  ( b1 *  a3);
		var t41 =  ( t40 *  x3);
		var t43 =  ( ap2 *  cp3);
		var t44 =  ( b3 *  a2);
		var t45 =  ( t44 *  x1);
		var t47 =  (- t2 *  t3 -  t6 *  t7 -  t10 *  t11 -  t14 *  t11 -  t2 *  t11 -  t17 *  t18 -  t21 *  t3 -  t23 *  t25 -  t27 *  t29 +  t31 *  t33 +  t35 *  t37 +  t39 *  t41 +  t43 *  t45);
		var t48 =  ( b2 *  a1);
		var t49 =  ( t48 *  x3);
		var t51 =  ( t36 *  x3);
		var t53 =  ( t32 *  x2);
		var t55 =  ( bp3 *  cp2);
		var t56 =  ( b2 *  c1);
		var t57 =  ( t56 *  a3);
		var t59 =  ( b3 *  c1);
		var t60 =  ( t59 *  x2);
		var t62 =  ( a3 *  c2);
		var t63 =  ( t62 *  x1);
		var t65 =  b3 *  c2;
		var t66 =  (t65 *  a1);
		var t68 =  ( bp2 *  ap3);
		var t71 =  ( c3 *  c2);
		var t72 =  ( t71 *  x2);
		var t74 =  ( b2 *  c3);
		var t75 =  ( t74 *  x1);
		var t78 =  ( t32 *  x3);
		var t80 =  bp3 *  ap2;
		var t82 =  ( t43 *  t49 +  t43 *  t51 -  t39 *  t53 +  t55 *  t57 +  t55 *  t60 +  t43 *  t63 +  t43 *  t66 +  t68 *  t66 +  t68 *  t45 +  t23 *  t72 +  t55 *  t75 +  t55 *  t51 +  t55 *  t78 - t80 *  t49);
		var t85 =  ( t56 *  x3);
		var t87 =  ( a1 *  c2);
		var t88 =  ( t87 *  x3);
		var t90 =  ( b1 *  a2);
		var t91 =  ( t90 *  x3);
		var t93 =  ( t40 *  x2);
		var t96 =  ( a1 *  c3);
		var t97 =  ( t96 *  x2);
		var t100 =  ( b1 *  c3);
		var t101 =  ( t100 *  a2);
		var t103 =  ( t100 *  x2);
		var t105 =  ( a3 *  c1);
		var t106 =  ( t105 *  x2);
		var t108 =  ( b3 *  a1);
		var t109 =  ( t108 *  x2);
		var t111 =  ( t59 *  a2);
		var t114 =  (-t80 *  t57 + t80 *  t85 + t80 *  t88 + t80 *  t91 +  t68 *  t93 + t80 *  t33 - t80 *  t97 - t80 *  t93 - t80 *  t101 + t80 *  t103 + t80 *  t106 + t80 *  t109 + t80 *  t111 - t80 *  t60);
		var t118 =  (t65 *  x1);
		var t120 =  ( t24 *  x1);
		var t122 =  ( b2 *  a3);
		var t123 =  ( t122 *  x1);
		var t125 =  ( t74 *  a1);
		var t134 =  (-t80 *  t63 - t80 *  t45 - t80 *  t66 + t80 *  t118 + t80 *  t120 + t80 *  t123 + t80 *  t125 - t80 *  t75 - t80 *  t51 - t80 *  t78 -  t31 *  t49 -  t31 *  t57 +  t31 *  t85 +  t31 *  t88);
		var t150 =  ( t31 *  t91 -  t31 *  t97 -  t31 *  t93 -  t31 *  t101 +  t31 *  t103 +  t31 *  t106 +  t31 *  t109 +  t31 *  t111 -  t31 *  t60 -  t31 *  t63 -  t31 *  t45 -  t31 *  t66 +  t31 *  t118);
		var t157 =  ( t74 *  c2);
		var t160 =  ( ap1 *  b2);
		var t161 =  ( c1 *  b1);
		var t162 =  ( t161 *  c2);
		var t165 =  ( cp1 *  b3);
		var t166 =  ( t161 *  a3);
		var t168 =  ( cp1 *  a3);
		var t169 =  ( a1 *  b1);
		var t170 =  ( t169 *  c3);
		var t172 =  ( t169 *  a3);
		var t176 =  ( a1 *  a3);
		var t177 =  ( t176 *  c1);
		var t179 =  ( t74 *  a2);
		var t181 = t31 * t120 + t31 * t123 + t31 * t125 - t31 * t75 - t31 * t51 - t31 * t78 + 2 * t27 * t157 + 2 * t160 * t162 - t165 * t166 - t168 * t170 + 2 * t165 * t172 - t165 * t170 - t165 * t177 - t165 * t179;
		var t183 =  ( t62 *  a2);
		var t185 =  ( t122 *  a2);
		var t188 =  ( t122 *  c2);
		var t190 =  ( cp1 *  c2);
		var t191 =  ( t90 *  x1);
		var t193 =  ( ap1 *  a2);
		var t194 =  ( t56 *  x1);
		var t196 =  ( t28 *  c2);
		var t199 =  ( c1 *  c3 *  x1);
		var t201 =  ( t96 *  x1);
		var t205 =  ( t105 *  x1);
		var t207 =  ( ap1 *  a3);
		var t209 =  ( ap1 *  b1);
		var t210 =  ( c3 *  a3);
		var t211 =  ( t210 *  x1);
		var t215 = -t165 * t183 + 2 * t165 * t185 - t165 * t188 - t190 * t191 - t193 * t194 - t160 * t196 - t27 * t199 + 2 * t27 * t201 - t193 * t162 - t27 * t205 + t207 * t199 - t209 * t211 + t43 * t75 + t43 * t78;
		var t230 =  ( t55 *  t49 -  t55 *  t85 -  t55 *  t88 -  t55 *  t91 -  t55 *  t33 +  t55 *  t97 +  t55 *  t93 +  t55 *  t101 -  t55 *  t103 -  t55 *  t106 -  t55 *  t109 -  t55 *  t111 +  t55 *  t63 +  t55 *  t45);
		var t240 =  ( cp1 *  b2);
		var t241 =  ( t161 *  a2);
		var t243 =  ( t161 *  c3);
		var t247 =  ( bp1 *  t18);
		var t249 =  ( cp1 *  t1);
		var t253 = t55 * t66 - t55 * t118 - t55 * t120 - t55 * t123 - t55 * t125 - t23 * t201 - t240 * t241 + 2 * t27 * t243 + t207 * t72 - t247 * t3 - t249 * t13 - t21 * t11 - t14 * t7;
		var t256 =  ( cp1 *  t5);
		var t259 =  ( bp1 *  b2);
		var t260 = t3 * x2;
		var t262 =  ( bp1 *  c1);
		var t263 =  ( t96 *  x3);
		var t265 =  ( t105 *  x3);
		var t267 =  ( t100 *  x3);
		var t269 = t48 * x2;
		var t272 = t87 * x2;
		var t274 =  ( t71 *  x3);
		var t276 =  ( t24 *  x3);
		var t278 =  ( t62 *  x3);
		var t280 =  ( bp1 *  a2);
		var t281 =  ( t122 *  x3);
		var t283 = -t6 * t3 - t247 * t7 - t256 * t13 - t256 * t20 - t259 * t260 - t262 * t263 - t39 * t265 - t39 * t267 + 2 * t262 * t269 - t262 * t272 + t259 * t274 - t259 * t276 - t259 * t278 + t280 * t281;
		var t286 =  (t65 *  x3);
		var t290 =  ( bp1 *  a3);
		var t292 = t74 * x2;
		var t295 = t36 * x2;
		var t297 = t90 * x2;
		var t299 =  ( t108 *  x3);
		var t303 = t44 * x2;
		var t305 = t62 * x2;
		var t309 =  ( t24 *  c2);
		var t311 = -t280 * t274 + 2 * t280 * t286 - t280 * t278 - t290 * t25 + 2 * t290 * t292 - t39 * t295 + t39 * t297 + 2 * t262 * t299 - t290 * t72 + t290 * t303 - t23 * t305 + t262 * t267 - t207 * t243 - t27 * t309;
		var t314 = t48 * x1;
		var t328 = -t35 * t191 - t35 * t194 + 2 * t35 * t314 - t207 * t157 - t43 * t103 - t43 * t106 - t43 * t109 - t43 * t111 + t43 * t60 - t43 * t118 - t43 * t120 - t43 * t123 - t43 * t125 - t23 * t29;
		var t338 =  ( bp1 *  c2);
		var t346 = t87 * x1;
		var t348 = -t290 * t170 + 2 * t290 * t29 - t290 * t243 - t23 * t177 - t23 * t183 - t23 * t309 + 2 * t338 * t191 + t338 * t194 - t338 * t37 - t338 * t314 - t290 * t157 - t280 * t194 - t280 * t346;
		var t356 =  ( t169 *  c2);
		var t359 =  ( ap1 *  c1);
		var t366 =  ( ap1 *  a1);
		var t370 = 2 * t290 * t309 - t290 * t179 - t259 * t196 + 2 * t280 * t196 + t23 * t199 - t280 * t356 + t280 * t314 + 2 * t359 * t297 - t359 * t53 + 2 * t359 * t41 + t359 * t263 - t366 * t267 - t359 * t269 + t359 * t272;
		var t387 =  ( a1 *  a2);
		var t388 =  ( t387 *  c1);
		var t390 = -t366 * t53 - t160 * t274 - t160 * t276 + 2 * t160 * t278 + t193 * t274 - t193 * t286 - t27 * t72 - t207 * t292 - t359 * t299 + 2 * t27 * t25 - t27 * t305 - t359 * t267 - t280 * t162 - t259 * t388;
		var t393 = t176 * x1;
		var t396 =  ( bp1 *  b1);
		var t403 =  ( cp1 *  a2);
		var t410 = -t23 * t205 - t290 * t199 + t23 * t393 - t39 * t211 + 2 * t396 * t211 - t262 * t297 + t262 * t53 - t262 * t41 - t190 * t314 + 2 * t403 * t194 + t403 * t346 - t168 * t179 - t240 * t356 + t240 * t286;
		var t415 = t44 * x3;
		var t419 =  ( t169 *  a2);
		var t426 = t122 * x2;
		var t428 =  ( cp1 *  b1);
		var t429 = t59 * x3;
		var t433 =  ( cp1 *  a1);
		var t436 = -t240 * t415 - t403 * t356 - t403 * t314 + 2 * t240 * t419 - t165 * t201 - t240 * t388 + 2 * t165 * t205 - t165 * t426 + t428 * t429 - t428 * t299 - t165 * t393 + t433 * t211 - t428 * t211;
		var t439 = t32 * x1;
		var t442 = t100 * x1;
		var t444 =  ( cp1 *  c1);
		var t451 = t40 * x1;
		var t453 = t161 * x2;
		var t458 = -t428 * t269 + t165 * t292 + t240 * t439 - t240 * t191 + t165 * t442 - t444 * t297 - t444 * t41 + t433 * t265 + 2 * t433 * t267 - t444 * t269 - t165 * t451 + t240 * t453 + 2 * t433 * t53 - t433 * t41;
		var t476 = 2 * t240 * t276 - t240 * t278 - t403 * t281 - t403 * t286 + t403 * t278 + t168 * t25 - t168 * t292 + t433 * t295 - t433 * t297 - t444 * t299 - t168 * t303 - t165 * t25 + 2 * t165 * t305 - t27 * t166;
		var t481 = c2 * x2;
		var t483 = t20 * x3;
		var t485 = t7 * a3;
		var t487 = a3 * t11;
		var t489 = a2 * t3;
		var t491 = a1 * t11;
		var t493 = t7 * a2;
		var t495 = a1 * t3;
		var t497 = t20 * x2;
		var t499 = cp1 * t20;
		var t501 = -t27 * t170 - t27 * t179 - t27 * t188 + t6 * t210 + t10 * t481 - t23 * t483 + t27 * t485 + t27 * t487 + t160 * t489 + t209 * t491 + t160 * t493 + t209 * t495 + t240 * t497 - t499 * t481;
		var t504 = t13 * x1;
		var t506 = cp1 * t13;
		var t507 = c1 * x1;
		var t509 = cp1 * t18;
		var t511 = t18 * x1;
		var t513 = c2 * a2;
		var t515 = t18 * x3;
		var t517 = c3 * x3;
		var t521 = t13 * x2;
		var t523 = a2 * x2;
		var t526 = t1 * x2;
		var t528 = t428 * t504 - t506 * t507 - t509 * t507 + t428 * t511 + t17 * t513 + t165 * t515 - t509 * t517 - t499 * t517 - t506 * t481 + t240 * t521 + t17 * t523 + t249 * t523 - t190 * t526;
		var t529 = a1 * x1;
		var t535 = t20 * c3;
		var t538 = a3 * x3;
		var t540 = t18 * c3;
		var t546 = t13 * c2;
		var t548 = t17 * t529 - t17 * t507 + t256 * t529 - t256 * t507 + t506 * t161 + t165 * t535 + t17 * t28 + t256 * t538 + t165 * t540 - t256 * t517 + t249 * t538 - t249 * t517 + t256 * t28 + t240 * t546;
		var t551 = t20 * c2;
		var t554 = t1 * a2;
		var t566 = t509 * t161 + t240 * t551 + t249 * t210 + t190 * t554 + t256 * t210 - t17 * t481 + t165 * t483 + t10 * t513 - t10 * t523 - t2 * t523 + t35 * t526 - t10 * t529 + t10 * t507 - t6 * t529;
		var t577 = t7 * x2;
		var t580 = t3 * x1;
		var t583 = t6 * t507 + t10 * t28 - t6 * t538 + t6 * t517 - t2 * t538 + t2 * t517 + t6 * t28 + t2 * t210 - t259 * t497 + t21 * t481 + t280 * t577 - t259 * t577 + t39 * t580 - t396 * t504;
		var t591 = t11 * x1;
		var t594 = t11 * x3;
		var t600 = t7 * x3;
		var t603 = -t396 * t580 + t14 * t507 + t247 * t507 - t396 * t511 + t39 * t591 - t396 * t591 + t290 * t594 - t23 * t515 - t23 * t594 + t247 * t517 + t21 * t517 + t290 * t600 - t23 * t600;
		var t618 = t14 * t481 + t280 * t260 - t259 * t521 + t14 * t161 + t23 * t535 + t23 * t485 + t23 * t487 + t23 * t540 + t259 * t489 + t259 * t546 + t396 * t491 + t247 * t161 + t259 * t551 + t259 * t493;
		var t634 = t396 * t495 + t160 * t260 - t193 * t577 + t160 * t577 - t366 * t580 + t209 * t580 - t366 * t591 + t209 * t591 - t207 * t594 + t27 * t594 - t207 * t600 + t27 * t600 - t193 * t260 + t35 * t554;
		var t649 = -t10 * t7 - t17 * t20 - t249 * t18 - t160 * t356 - t160 * t241 - t160 * t286 + t160 * t415 + t27 * t426 - t209 * t429 + t209 * t299 + t209 * t269 - t27 * t292 - t160 * t439 + t160 * t191;
		var t655 =  ( bp2 *  cp3);
		var t667 = -t27 * t442 + t27 * t451 - t160 * t453 - t655 * t49 - t655 * t57 + t655 * t85 + t655 * t88 + t655 * t91 + t655 * t33 - t655 * t97 - t655 * t93 - t655 * t101 + t655 * t103 + t655 * t106;
		var t682 = t655 * t109 + t655 * t111 - t655 * t60 - t655 * t63 - t655 * t45 - t655 * t66 + t655 * t118 + t655 * t120 + t655 * t123 + t655 * t125 - t655 * t75 - t655 * t51 - t655 * t78 + t68 * t49;
		var t698 = t68 * t57 - t68 * t85 - t68 * t88 - t68 * t91 - t68 * t33 + t68 * t97 + t68 * t101 - t68 * t103 - t68 * t106 - t68 * t109 - t68 * t111 + t68 * t60 + t68 * t63 - t68 * t118;
		var t713 = -t68 * t120 - t68 * t123 - t68 * t125 + t68 * t75 + t68 * t51 + t68 * t78 + t43 * t57 - t43 * t85 - t43 * t88 - t43 * t91 - t43 * t33 + t43 * t97 + t43 * t93 + t43 * t101;
		var t748 = -2 * t5 * c1 * a1 - 2 * t18 * c1 * b1 - 2 * t13 * c1 * b1 - 2 * c2 * t1 * a2 - 2 * b2 * t7 * a2 - 2 * b2 * t13 * c2 + t5 * t3 + t18 * t3 + t20 * t11 - 2 * t1 * c3 * a3 + t1 * t11 + t13 * t7 + t18 * t7 + t1 * t3 + t5 * t20;
		var t776 = t9 * t11 + t5 * t13 + t1 * t18 - 2 * b3 * t7 * a3 + t5 * t7 + t13 * t11 + t1 * t13 - 2 * t59 * t100 + 2 * t59 * t96 + 2 * t59 * t40 + 2 * t176 * t100 - 2 * t105 * t96 + 2 * t105 * t100 - 2 * t108 * t40 + 2 * t108 * t100 + 2 * t108 * t105;
		var t778 = b3 * b2;
		var t781 = b3 * a3;
		var t784 = a3 * a2;
		var t797 = t778 * t24 - t778 * t71 + t781 * t513 + t44 * t71 - t778 * t784 + t778 * t62 + t122 * t71 - t784 * t71 + t122 * t24 + t48 * t32 + t56 * t87 + t56 * t90 - t56 * t32 - t36 * t87 + t387 * t32 - t48 * t90;
		var t833 = 2 * t36 * t32 + 2 * t48 * t36 + t9 * t18 + t9 * t20 + t9 * t7 - 2 * t9 * c2 * a2 - 2 * t9 * c1 * a1 - 2 * t5 * c3 * a3 - 2 * t781 * t11 - 2 * b3 * t18 * c3 - 2 * b2 * t20 * c2 - 2 * b3 * t20 * c3 - 2 * t169 * t11 - 2 * b2 * a2 * t3 + t20 * t3 - 2 * t169 * t3;
		var t836 = 1 / (t748 + t776 + 2 * t797 + t833);
		var t838 = cp2 * t5;
		var t840 = cp2 * t1;
		var t842 = ap2 * t5;
		var t844 = bp2 * t20;
		var t846 = bp2 * t13;
		var t848 = cp2 * a2;
		var t851 =  ( ap1 *  cp3);
		var t853 = bp3 * cp1;
		var t855 = bp2 * a2;
		var t858 = bp3 * ap1;
		var t860 = ap3 * cp1;
		var t862 = -t838 * t13 - t840 * t18 - t842 * t3 - t844 * t11 - t846 * t11 - t848 * t281 - t846 * t7 + t851 * t111 + t853 * t120 - t855 * t346 + t848 * t346 + t858 * t97 + t860 * t60;
		var t866 = ap2 * b1;
		var t870 = bp2 * a1;
		var t872 = cp2 * b2;
		var t874 = bp2 * a3;
		var t877 = bp2 * b3;
		var t882 = t860 * t51 + t851 * t103 + t853 * t118 + t866 * t299 + t858 * t60 + t858 * t66 + t870 * t41 + t872 * t453 + t874 * t303 + t860 * t66 - t877 * t29 + t853 * t109 + t877 * t199 + t853 * t125;
		var t898 = -t853 * t75 - t853 * t51 - t853 * t78 + t858 * t49 + t858 * t57 - t858 * t85 - t858 * t88 - t858 * t91 - t858 * t33 + t858 * t93 - t858 * t103 - t858 * t106 - t858 * t109 - t858 * t111;
		var t905 = ap2 * b3;
		var t910 = ap2 * b2;
		var t916 = t858 * t45 - t874 * t170 + 2 * t874 * t29 - t874 * t243 - t877 * t177 + t905 * t426 - t866 * t429 + t866 * t269 - t905 * t292 - t910 * t439 + t910 * t191 - t905 * t442 - t905 * t166 - t905 * t170;
		var t932 = -t905 * t179 - t905 * t188 - t910 * t356 - t910 * t241 - t910 * t286 + t910 * t415 - t858 * t118 - t858 * t120 - t858 * t123 - t858 * t125 + t858 * t75 + t858 * t51 + t858 * t78;
		var t945 = bp1 * ap3;
		var t948 = t860 * t49 + t860 * t57 - t860 * t85 - t860 * t88 - t860 * t91 - t860 * t33 + t860 * t97 + t860 * t93 + t860 * t101 - t860 * t103 - t860 * t106 - t860 * t109 + t945 * t33 - t945 * t97;
		var t964 = -t945 * t93 - t945 * t101 + t945 * t103 + t945 * t106 + t945 * t109 + t945 * t111 - t945 * t60 - t945 * t63 + t853 * t111 + t853 * t106 + t851 * t120 - t877 * t309 - t851 * t60 + t945 * t118;
		var t965 = ap2 * t9;
		var t967 = ap2 * t1;
		var t969 = ap2 * c2;
		var t978 = cp2 * t20;
		var t980 = cp2 * b1;
		var t982 = cp2 * t13;
		var t984 = cp2 * t18;
		var t986 = -t965 * t523 - t967 * t523 + t969 * t526 - t965 * t529 + t965 * t507 - t842 * t529 + t842 * t507 + t910 * t493 + t866 * t495 + t872 * t497 - t978 * t481 + t980 * t504 - t982 * t507 - t984 * t507;
		var t991 = cp2 * t9;
		var t993 = cp2 * b3;
		var t997 = bp2 * b2;
		var t1002 = bp1 * cp3;
		var t1008 = t980 * t511 + t991 * t513 + t993 * t515 - t984 * t517 - t978 * t517 - t997 * t260 - t997 * t497 + t844 * t481 - t969 * t194 + t1002 * t101 + t993 * t292 - t872 * t278 + 2 * t872 * t276;
		var t1023 = -t945 * t45 - t945 * t66 + t945 * t120 + t945 * t123 + t945 * t125 - t945 * t75 - t945 * t51 - t945 * t78 - t1002 * t103 - t1002 * t106 - t1002 * t109 - t1002 * t111 + t1002 * t60 + t1002 * t63;
		var t1039 = t1002 * t45 - t1002 * t118 - t1002 * t120 - t1002 * t123 - t1002 * t125 + t1002 * t75 + t1002 * t51 + t1002 * t78 - t945 * t49 - t945 * t57 + t945 * t85 + t945 * t88 - t860 * t111 + t860 * t63;
		var t1054 = t860 * t45 - t860 * t118 - t860 * t120 - t860 * t123 - t860 * t125 + t860 * t75 + t860 * t78 + t1002 * t49 + t1002 * t57 - t1002 * t85 - t1002 * t88 - t1002 * t91 - t1002 * t33 + t1002 * t97;
		var t1063 = ap2 * a3;
		var t1065 = ap2 * a2;
		var t1074 = t1002 * t93 - t905 * t309 - t969 * t191 + t969 * t37 + 2 * t969 * t314 - t1063 * t157 - t1065 * t194 - t910 * t196 - t905 * t199 + 2 * t905 * t201 - t1065 * t162 + t851 * t125 - t851 * t75;
		var t1089 = -t851 * t51 - t851 * t78 - t851 * t49 - t851 * t57 + t851 * t85 + t851 * t88 + t851 * t33 - t851 * t97 - t851 * t93 - t851 * t101 + t851 * t106 + t851 * t109 - t851 * t63 - t851 * t45;
		var t1108 = -t851 * t66 + t851 * t118 + t851 * t123 + 2 * t905 * t243 - t997 * t276 - t997 * t278 + t855 * t281 - t855 * t274 + 2 * t855 * t286 - t855 * t278 + t877 * t72 - t874 * t25 + 2 * t874 * t292 - t870 * t295;
		var t1110 = bp2 * c1;
		var t1119 = bp2 * t18;
		var t1126 = t870 * t297 + 2 * t1110 * t299 - t874 * t72 - t877 * t25 - t877 * t305 + t1110 * t267 + t851 * t91 - t844 * t3 - t1119 * t7 - t965 * t11 - t991 * t18 - t842 * t7 - t991 * t20 - t965 * t7;
		var t1136 = cp2 * a1;
		var t1142 = cp2 * c1;
		var t1149 = -t840 * t13 + 2 * t905 * t157 + 2 * t910 * t162 + t1136 * t211 - t980 * t211 - t980 * t269 - t872 * t191 + t993 * t442 - t1142 * t297 - t1142 * t41 + t1136 * t265 + 2 * t1136 * t267 - t1142 * t269;
		var t1165 = -t993 * t451 + 2 * t1136 * t53 - t1136 * t41 - t853 * t57 + t853 * t85 + t853 * t88 + t853 * t91 + t853 * t33 - t853 * t97 - t853 * t93 - t853 * t101 + t853 * t103 - t853 * t60 - t853 * t63;
		var t1173 = ap2 * c1;
		var t1180 = ap2 * a1;
		var t1185 = -t853 * t45 - t853 * t66 + t853 * t123 - t905 * t205 + t1063 * t199 - t866 * t211 + 2 * t1173 * t297 - t1173 * t53 + 2 * t1173 * t41 + t1173 * t263 - t1180 * t267 - t1173 * t269 - t1180 * t53 - t910 * t274;
		var t1187 = bp2 * c2;
		var t1204 = -t877 * t183 + 2 * t1187 * t191 + t1187 * t194 - t1187 * t37 - t1187 * t314 - t874 * t157 - t855 * t194 + 2 * t874 * t309 - t874 * t179 - t997 * t196 + 2 * t855 * t196 - t855 * t356 + t855 * t314 - t877 * t201;
		var t1211 = cp2 * a3;
		var t1222 = t905 * t451 - t910 * t453 - t853 * t49 - t993 * t166 - t1211 * t170 + 2 * t993 * t172 - t993 * t170 - t993 * t177 - t993 * t179 - t993 * t183 - t848 * t286 + t848 * t278 + t1211 * t25;
		var t1237 = bp2 * b1;
		var t1239 = -t1211 * t292 - t1136 * t297 - t1142 * t299 - t1211 * t303 - t993 * t25 + 2 * t993 * t305 - t905 * t29 + t945 * t91 - t1063 * t243 + t997 * t274 + t855 * t577 - t997 * t577 + t870 * t580 - t1237 * t504;
		var t1255 = -t1237 * t580 + t846 * t507 + t1119 * t507 - t1237 * t511 + t870 * t591 - t842 * t538 + t842 * t517 - t967 * t538 + t967 * t517 + t842 * t28 + t967 * t210 + t969 * t554 + t842 * t210 + t965 * t481;
		var t1270 = t965 * t28 - t1237 * t591 + t874 * t594 - t877 * t515 - t877 * t594 + t1119 * t517 + t844 * t517 + t874 * t600 - t877 * t600 + t846 * t481 + t855 * t260 - t997 * t521 + t846 * t161 + t877 * t535;
		var t1287 = t877 * t485 + t877 * t487 + t877 * t540 + t997 * t489 + t997 * t546 + t1237 * t491 + t1119 * t161 + t997 * t551 + t997 * t493 + t1237 * t495 - t877 * t483 + t910 * t260 - t1065 * t577;
		var t1302 = t910 * t577 - t1180 * t580 + t866 * t580 - t1180 * t591 + t866 * t591 - t1063 * t594 + t905 * t594 - t1063 * t600 + t905 * t600 - t1065 * t260 + t905 * t485 + t905 * t487 + t910 * t489 + t866 * t491;
		var t1308 = cp2 * c2;
		var t1319 = -t982 * t481 + t872 * t521 + t991 * t523 + t840 * t523 - t1308 * t526 + t991 * t529 - t991 * t507 + t838 * t529 - t838 * t507 + t982 * t161 + t993 * t535 + t991 * t28 + t838 * t538 + t993 * t540;
		var t1334 = -t838 * t517 + t840 * t538 - t840 * t517 + t838 * t28 + t872 * t546 + t984 * t161 + t872 * t551 + t840 * t210 + t858 * t101 + t1173 * t272 + t872 * t439 - t838 * t20 - t967 * t11 - t1119 * t3;
		var t1353 = -t967 * t3 + t1136 * t295 + t858 * t63 + t1002 * t66 + t872 * t286 + 2 * t872 * t419 + 2 * t993 * t185 - t993 * t188 + t1308 * t554 + t838 * t210 - t991 * t481 + t993 * t483 + t965 * t513 - t1308 * t191;
		var t1370 = -t1308 * t314 + 2 * t848 * t194 - t1211 * t179 - t872 * t356 - t872 * t241 - t872 * t415 - t848 * t356 - t848 * t314 - t993 * t201 - t872 * t388 + 2 * t993 * t205 - t993 * t426 + t980 * t429 - t980 * t299;
		var t1388 = -t993 * t393 - t910 * t276 + 2 * t910 * t278 + t1065 * t274 - t1065 * t286 - t905 * t72 - t1063 * t292 - t1173 * t299 + t1063 * t72 + 2 * t905 * t25 - t905 * t305 - t1173 * t267 - t855 * t162 - t997 * t388;
		var t1405 = -t877 * t205 - t874 * t199 + t877 * t393 - t870 * t211 + 2 * t1237 * t211 - t1110 * t297 + t1110 * t53 - t1110 * t41 - t1110 * t263 - t870 * t265 - t870 * t267 + 2 * t1110 * t269 - t1110 * t272 - t870 * t53;
		var t1412 = ap3 * t5;
		var t1415 = ap3 * t1;
		var t1417 = bp3 * t13;
		var t1419 = cp3 * t5;
		var t1421 = bp3 * t18;
		var t1423 = bp1 * ap2;
		var t1425 = bp3 * t20;
		var t1427 = cp3 * a2;
		var t1430 = cp3 * t9;
		var t1433 = cp3 * t1;
		var t1435 = -t1412 * t3 - t1412 * t7 - t1415 * t3 - t1417 * t7 - t1419 * t13 - t1421 * t7 - t1423 * t88 - t1425 * t3 - t1427 * t281 - t1415 * t11 - t1430 * t18 - t1419 * t20 - t1433 * t13;
		var t1436 = bp2 * cp1;
		var t1439 = ap3 * b1;
		var t1443 = ap2 * cp1;
		var t1445 = bp3 * b3;
		var t1447 = bp3 * a3;
		var t1450 = cp3 * a1;
		var t1452 = cp3 * b2;
		var t1455 = ap3 * c1;
		var t1459 = bp1 * cp2;
		var t1461 = -t1436 * t88 + t1423 * t45 + t1439 * t299 + t1436 * t60 + t1436 * t51 + t1443 * t33 + t1445 * t72 - t1447 * t170 - t1425 * t11 + t1450 * t295 + 2 * t1452 * t276 + 2 * t1455 * t41 + t1450 * t211 + t1459 * t120;
		var t1463 = bp3 * a1;
		var t1465 = ap1 * cp2;
		var t1469 = bp2 * ap1;
		var t1477 = bp3 * a2;
		var t1481 = -t1463 * t53 + t1465 * t57 + t1423 * t51 + t1436 * t45 + t1469 * t123 + t1443 * t88 - t1459 * t97 - t1423 * t118 + t1469 * t120 + t1469 * t33 - t1452 * t191 + t1477 * t314 + t1443 * t85 + t1459 * t111;
		var t1484 = cp3 * a3;
		var t1488 = cp3 * b3;
		var t1492 = cp3 * b1;
		var t1498 = ap3 * b3;
		var t1500 = -t1436 * t33 + t1459 * t123 + t1484 * t25 - t1459 * t57 - t1477 * t356 + t1488 * t442 - t1488 * t451 + t1452 * t453 - t1492 * t269 + t1488 * t292 - t1488 * t426 + t1452 * t286 - t1452 * t415 - t1498 * t179;
		var t1504 = ap3 * b2;
		var t1517 = -t1498 * t188 - t1504 * t356 - t1504 * t241 - t1504 * t439 - t1498 * t442 + t1498 * t451 - t1504 * t453 + t1439 * t269 - t1498 * t292 - t1439 * t429 - t1459 * t63 - t1459 * t49 - t1459 * t60;
		var t1532 = -t1459 * t66 + t1459 * t33 - t1459 * t101 + t1459 * t85 + t1459 * t109 - t1459 * t51 + t1459 * t103 + t1459 * t106 - t1459 * t75 + t1459 * t91 - t1459 * t78 + t1423 * t97 + t1423 * t63 + t1423 * t49;
		var t1548 = t1423 * t60 + t1423 * t66 - t1423 * t33 + t1423 * t101 - t1423 * t123 - t1423 * t125 + t1423 * t93 - t1423 * t85 - t1423 * t111 - t1423 * t109 - t1423 * t120 + t1423 * t57 - t1423 * t103 - t1423 * t106;
		var t1563 = t1423 * t75 - t1423 * t91 + t1423 * t78 + t1465 * t49 + t1465 * t101 - t1465 * t123 - t1465 * t125 + t1465 * t93 - t1465 * t85 - t1465 * t111 - t1465 * t109 - t1465 * t120 - t1465 * t118 + t1465 * t51;
		var t1580 = t1465 * t45 - t1465 * t103 - t1465 * t106 + t1465 * t75 + t1465 * t78 + t1436 * t97 + t1436 * t63 + t1436 * t49 + t1436 * t66 + t1436 * t101 - t1436 * t123 - t1436 * t125 - t1436 * t111;
		var t1595 = -t1436 * t109 - t1436 * t120 - t1436 * t118 + t1436 * t57 - t1436 * t103 + t1450 * t265 + t1459 * t88 + t1459 * t118 - t1465 * t88 + t1504 * t415 + t1459 * t125 + t1465 * t97 + t1465 * t63 - t1477 * t162;
		var t1611 = -t1436 * t106 + t1436 * t75 - t1436 * t91 + t1436 * t78 - t1469 * t97 - t1469 * t63 - t1469 * t49 - t1469 * t60 - t1469 * t101 + t1469 * t125 - t1469 * t93 + t1469 * t85 + t1469 * t111 + t1469 * t109;
		var t1626 = t1469 * t88 + t1469 * t118 - t1469 * t51 - t1469 * t57 - t1469 * t45 - t1469 * t75 + t1469 * t91 - t1469 * t78 - t1443 * t97 - t1443 * t63 - t1443 * t49 - t1443 * t60 - t1443 * t66 - t1443 * t101;
		var t1643 = t1443 * t123 + t1443 * t125 + t1443 * t118 - t1443 * t51 - t1443 * t57 - t1443 * t45 + t1443 * t103 + t1443 * t106 - t1443 * t75 + t1443 * t91 - t1443 * t78 + 2 * t1504 * t162 - t1484 * t170;
		var t1649 = ap3 * a3;
		var t1661 = -t1488 * t188 - t1445 * t29 - t1498 * t29 - t1452 * t278 - t1427 * t314 + t1649 * t72 - t1488 * t166 + 2 * t1488 * t172 - t1504 * t286 + 2 * t1427 * t194 - t1498 * t170 - t1445 * t183 - t1445 * t309 - t1443 * t93;
		var t1669 = bp3 * b2;
		var t1674 = bp3 * c2;
		var t1682 = t1443 * t111 + 2 * t1447 * t29 - t1447 * t243 - t1445 * t177 - t1447 * t179 - t1669 * t196 + 2 * t1477 * t196 - t1669 * t388 + 2 * t1674 * t191 + t1674 * t194 - t1674 * t314 - t1674 * t37 - t1477 * t346 - t1477 * t194;
		var t1687 = bp3 * b1;
		var t1691 = bp3 * c1;
		var t1701 = t1445 * t199 - t1445 * t205 - t1445 * t201 - t1447 * t199 + 2 * t1687 * t211 - t1463 * t211 + t1691 * t53 - t1691 * t297 - t1691 * t272 + 2 * t1691 * t269 - t1463 * t295 - t1447 * t25 - t1445 * t305 + t1447 * t303;
		var t1721 = -t1447 * t72 + 2 * t1691 * t299 + t1691 * t267 - t1691 * t41 - t1691 * t263 - t1463 * t265 - t1463 * t267 + t1463 * t41 + t1669 * t274 - t1669 * t276 + t1477 * t281 - t1477 * t274 + 2 * t1477 * t286;
		var t1725 = ap3 * t9;
		var t1734 = cp3 * c2;
		var t1738 = -t1477 * t278 - t1649 * t243 - t1421 * t3 - t1725 * t7 - t1430 * t20 - t1725 * t11 - t1436 * t85 + t1465 * t60 + t1465 * t66 - t1459 * t45 + t1504 * t191 - t1734 * t191 + t1443 * t109 + t1443 * t120;
		var t1750 = cp3 * t13;
		var t1752 = cp3 * t20;
		var t1756 = -t1465 * t33 - t1459 * t93 - t1465 * t91 + t1436 * t93 + t1427 * t346 + t1463 * t297 + t1430 * t513 - t1419 * t507 + t1419 * t529 + t1430 * t523 - t1750 * t507 - t1752 * t481 + t1750 * t161 + t1433 * t523;
		var t1768 = cp3 * t18;
		var t1772 = t1488 * t535 + t1492 * t504 + t1430 * t28 - t1419 * t517 + t1488 * t540 + t1492 * t511 + t1433 * t538 + t1419 * t28 - t1433 * t517 + t1452 * t546 + t1452 * t521 + t1768 * t161 - t1734 * t526 + t1452 * t551;
		var t1788 = t1430 * t529 + t1433 * t210 + t1734 * t554 + t1419 * t538 + t1419 * t210 + t1452 * t497 + t1488 * t515 - t1750 * t481 - t1752 * t517 - t1768 * t517 + t1725 * t507 + t1725 * t481 + t1725 * t513;
		var t1798 = ap3 * c2;
		var t1804 = t1412 * t507 - t1412 * t529 - t1725 * t523 - t1415 * t523 + t1725 * t28 + t1412 * t517 - t1415 * t538 + t1412 * t28 + t1415 * t517 + t1798 * t526 - t1725 * t529 + t1415 * t210 + t1798 * t554 - t1412 * t538;
		var t1811 = ap3 * a2;
		var t1824 = t1412 * t210 - t1498 * t309 - t1649 * t157 + 2 * t1504 * t278 - t1811 * t162 - t1798 * t191 - t1798 * t194 + 2 * t1798 * t314 + t1798 * t37 - t1811 * t194 - t1498 * t205 + 2 * t1498 * t201 + t1649 * t199 - t1439 * t211;
		var t1830 = ap3 * a1;
		var t1842 = -t1455 * t53 + 2 * t1455 * t297 + t1455 * t272 - t1455 * t269 - t1830 * t53 - t1649 * t292 - t1498 * t72 - t1498 * t305 + 2 * t1498 * t25 - t1455 * t299 - t1455 * t267 + t1455 * t263 - t1830 * t267 - t1504 * t274;
		var t1860 = -t1504 * t276 + t1811 * t274 - t1811 * t286 - t1488 * t170 - t1488 * t177 - t1488 * t179 - t1488 * t183 + 2 * t1488 * t185 - t1484 * t179 - t1452 * t356 - t1452 * t241 - t1427 * t356 - t1452 * t388;
		var t1865 = cp3 * c1;
		var t1878 = -t1734 * t314 - t1488 * t201 - t1488 * t393 - t1492 * t211 - t1865 * t297 - t1865 * t269 + 2 * t1450 * t53 - t1450 * t297 - t1484 * t292 + 2 * t1488 * t305 - t1488 * t25 - t1484 * t303 - t1865 * t299 - t1865 * t41;
		var t1895 = 2 * t1450 * t267 - t1450 * t41 + t1452 * t439 - t1417 * t11 - t1433 * t18 + t1447 * t594 + t1463 * t591 + t1421 * t507 - t1445 * t483 - t1669 * t260 - t1669 * t577 - t1687 * t580 + t1417 * t507 + t1425 * t481;
		var t1910 = t1417 * t161 + t1445 * t535 - t1687 * t504 + t1445 * t485 - t1687 * t591 + t1447 * t600 + t1445 * t487 + t1445 * t540 - t1687 * t511 + t1477 * t577 + t1669 * t489 + t1669 * t546 + t1687 * t491 - t1445 * t594;
		var t1927 = -t1669 * t521 + t1421 * t161 + t1669 * t551 + t1669 * t493 + t1463 * t580 - t1669 * t497 - t1445 * t600 - t1445 * t515 + t1477 * t260 + t1687 * t495 + t1417 * t481 + t1425 * t517 + t1421 * t517 - t1649 * t594;
		var t1942 = -t1830 * t591 + t1504 * t260 + t1504 * t577 + t1439 * t580 + t1498 * t485 + t1439 * t591 - t1649 * t600 + t1498 * t487 - t1811 * t577 + t1504 * t489 + t1439 * t491 + t1498 * t594 + t1504 * t493 - t1830 * t580;
		var t1961 = t1498 * t600 - t1811 * t260 + t1439 * t495 - t1430 * t507 - t1430 * t481 - t1768 * t507 + t1488 * t483 - t1469 * t66 + t1492 * t429 + t1427 * t278 + 2 * t1447 * t309 + 2 * t1452 * t419 - t1447 * t157 + 2 * t1447 * t292;
		var t1979 = t1445 * t393 - t1498 * t166 - t1498 * t199 - t1427 * t286 - t1445 * t25 + t1498 * t426 - t1669 * t278 - t1492 * t299 + t1469 * t103 + t1469 * t106 + 2 * t1498 * t157 - t1504 * t196 + 2 * t1488 * t205 + 2 * t1498 * t243;
		var cg3 = [3];
		cg3[0] = -(t698 + t713 + t667 + t47 + t82 + t150 + t181 + t114 + t134 + t215 + t230 + t253 + t283 + t311 + t328 + t348 + t370 + t390 + t410 + t436 + t458 + t476 + t501 + t528 + t548 + t566 + t583 + t603 + t618 + t634 + t649 + t682) * t836;
		cg3[1] = -(t1023 + t1185 + t1270 + t862 + t1126 + t1353 + t1255 + t1074 + t1287 + t1149 + t882 + t986 + t1319 + t1388 + t1089 + t1204 + t932 + t1405 + t1222 + t898 + t1165 + t1302 + t1334 + t1008 + t1370 + t1039 + t964 + t1108 + t1054 + t948 + t1239 + t916) * t836;
		cg3[2] = -(t1548 + t1788 + t1942 + t1626 + t1772 + t1961 + t1643 + t1860 + t1804 + t1842 + t1661 + t1701 + t1721 + t1895 + t1481 + t1435 + t1611 + t1682 + t1595 + t1563 + t1580 + t1532 + t1517 + t1738 + t1461 + t1500 + t1910 + t1756 + t1878 + t1979 + t1824 + t1927) * t836;
		
		return cg3;
	}
}
