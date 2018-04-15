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
class Button
{
    constructor(parent,left,top,width,text)
    {
        this.button =document.createElement("BUTTON");
        this.button.innerHTML = text;
        this.button.setAttribute("style","position:absolute;z-index:1;top:" + top + "px;left:"+ left + "px;width:" + width + "px;");
        parent.appendChild(this.button);
    }
}