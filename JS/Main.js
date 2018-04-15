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
var SETTINGS = {
	"molecularUnitAPath": undefined,
    "molecularUnitBPath": undefined,
    "predefinedInteractionsPath": undefined,
    "bondingTreshholdLowerBoundLambda": undefined,
    "bondingTreshholdLowerBoundDelta": undefined,
    "bondingTreshholdUpperBoundLambda": undefined,
    "bondingTreshholdUpperBoundDelta": undefined,
    "collisionTreshholdLowerBoundLambda": undefined,
    "collisionTreshholdLowerBoundDelta": undefined,
    "angleLow": undefined,
    "angleHigh": undefined,
    "stepSize": undefined,
	"ParticipatingAtomsZDistance": 1,
	"ParticipatingAtomIndexLow": 0,
	"ParticipatingAtomIndexHigh": 0,
	"Initial4DContactSeperationLow": 1.8,
	"Initial4DContactSeperationHigh": 7.2,
	"SavePointFrequency": 10000,
	"ReverseWitness": false,
	"WholeCollision": false,
	"FourDRootNode": false,
	"DynamicStepSizeAmong": false,
	"DynamicStepSizeBetween": false,
	"ReversePairDumbbells": false,
	"ShortRangeSamplingCheckBox": false,
	"UseParticipatingAtomsZDistance": false,
	"sessionId": undefined,
	"moleculeAPdb": undefined,
	"moleculeBPdb": undefined
}
var availableMolecularUnits = ["3AtomA","3AtomB","6AtomA","6AtomB"];
//var availableMolecularUnits = ["A","B","3AtomA","3AtomB","6AtomA","6AtomB","20AtomA","20AtomB"];
var molecularUnitA = availableMolecularUnits[0];
var molecularUnitB = availableMolecularUnits[1];
setAvailableMolecularUnits();
var url = window.location.href.split("/");
var server = url[2];
var bondView = new BondView();
var atlasView = new AtlasView();
var cayleySpaceView = new CayleySpaceView();
var cornerRealisationView = new CornerRealisationView();
var sweepView = new SweepView();
var realisationView = new RealisationView();

function setAvailableMolecularUnits()
{
	let molecularUnitADropdown = document.getElementById("molecularUnitADropdown");
	let molecularUnitBDropdown = document.getElementById("molecularUnitBDropdown");
	setDropdownEntries(molecularUnitADropdown,availableMolecularUnits);
	setDropdownEntries(molecularUnitBDropdown,availableMolecularUnits);
}

function setDropdownEntries(dropdown,entries)
{
	for(let i=0;i<entries.length;i++)
	{
		let option = document.createElement('option');
		option.innerHTML = entries[i];
		dropdown.appendChild(option);
	}	
}

function openTab(evt, tabName) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	if (tabName == "Atlas")
	{
		atlasView.start();
	}
	else
	{
		atlasView.stop();
	}
	if (tabName == "CayleySpace")
	{
		cayleySpaceView.start();
	}
	else
	{
		cayleySpaceView.stop();
	}
	if (tabName == "Sweep")
	{
        sweepView.start();
	}
	else
	{
        sweepView.stop();
	}
    if (tabName == "Realisation")
    {
        realisationView.start();
    }
    else
    {
        realisationView.stop();
    }
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";
}
