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
function closingCode(){
  // do something...
 Loader.get('http://'+server+ '/cleanUp/'+ SETTINGS.sessionId, function(response) {
			console.log("Cleared the session. Leaveing the page now.");
		});
   return "Closing this page will delete all data generated in this session. Are you sure you want to leave?";
}


function alertCode(){
  // do something...
   return "Closing this page will delete all data generated in this session. Are you sure you want to leave?";
}