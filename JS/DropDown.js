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
class DropDown
{
	constructor(parent,width,top,left,text)
	{
		this.dropDown = document.createElement('select');
		this.dropDown.setAttribute("style","position:absolute;z-index:1;width:" + width + "px;top:" + top + "px;left:"+ (left + text.length * 7) + "px;");
		parent.appendChild(this.dropDown);	
		this.textEntry = document.createElement('p');
		this.textEntry.innerHTML = text;
		this.textEntry.setAttribute("style","position:absolute;z-index:1;top:" + (top + 6) + "px;left:" + left + "px;");
		parent.appendChild(this.textEntry);
	}
	addEntry(text)
	{
		var option = document.createElement('option');
		option.innerHTML = text;
		this.dropDown.appendChild(option);
	}
	getCurrentEntry()
	{
		var entry = this.dropDown.options[this.dropDown.selectedIndex].value;
		return entry;
	}
	clear()
	{
		while (this.dropDown.firstChild) 
		{
    		this.dropDown.removeChild(this.dropDown.firstChild);
		}	
	}
}