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
class Loader
{
    constructor(){}
    static loadFileFromServer(filename,directory)
    {
        var returnValue;
        jQuery.ajax
        ({
            url:    directory+"/"+filename,
            success: function(data){
                returnValue = data;
            },
			error: function (request, status, error) {
					var err = eval(request.responseText);
  					alert(err.Message);
				},
            async:   false
        });
        return returnValue;
    }

    static getFileFromServer(filename) {
    	var returnValue; 
		Loader.get('http://'+server+ '/staticFiles/'+ filename, function(response) {
			var obj = JSON.parse(response);
			returnValue = obj;
			console.log(obj);
		});
		return returnValue;

    }
	
	static loadRoadMap(atlas)
    {
		atlas = "";
		Loader.get('http://'+server+'/data/RoadMap/'+ SETTINGS.sessionId, function(response) {
				var obj = JSON.parse(response);
				var roadMap = JSON.parse(obj[0].Nodes);
				atlas = roadMap;
			});
    }
	
	static get(aUrl, aCallback) 
	{
		var anHttpRequest = new XMLHttpRequest();
		anHttpRequest.onreadystatechange = function() {
			if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
				aCallback(anHttpRequest.responseText);
		}
		anHttpRequest.open( "GET", aUrl, true );
		anHttpRequest.send( null );
	}
}


