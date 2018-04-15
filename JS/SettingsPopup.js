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
// Get the modal
var modal = document.getElementById('settingsPopup');
var currentlyCreatedMoleculeType; //A or B
var advansedSettingsPopup = document.getElementById('advancedSettingsPopup');
var moleculeCreatorPopup = document.getElementById('moleculeCreatorPopup');
var cancelButton = document.getElementById('cancelSettingsButton');
var cancelAdvancedSettingsButton = document.getElementById('cancelAdvancedSettingsButton');
var acceptAdvancedSettingsButton = document.getElementById('acceptAdvancedSettingsButton');
var acceptButton = document.getElementById('acceptSettingsButton');
var acceptMoleculeButton = document.getElementById('acceptMoleculeButton');
var cancelMoleculeButton = document.getElementById('cancelMoleculeButton');
var makeMoleculeAButton = document.getElementById('makeMoleculeAButton');
var makeMoleculeBButton = document.getElementById('makeMoleculeBButton');
var addAtomButton = document.getElementById('addAtomButton');
var removeAtomButton = document.getElementById('removeAtomButton');
// Get the button that opens the modal
var settingPopupButton = document.getElementById("setSettingsButton");
var advancedSettingPopupButton = document.getElementById("advancedOptionsButton");

document.getElementById('loadMoleculeA').addEventListener('change', readMoleculeA, false);
document.getElementById('loadMoleculeB').addEventListener('change', readMoleculeB, false);

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
	  var contents = e.target.result;
	  if(currentlyCreatedMoleculeType === "A"){
		  SETTINGS.moleculeAPdb = contents;
	  }else if(currentlyCreatedMoleculeType === "B"){
		  SETTINGS.moleculeBPdb = contents;
	  }	  
  };
  reader.readAsText(file);
}

function readMoleculeA(e){
	currentlyCreatedMoleculeType = "A";
	readSingleFile(e);
}

function readMoleculeB(e){
	currentlyCreatedMoleculeType = "B";
	readSingleFile(e);
}

addAtomButton.onclick = function() {
	var table = document.getElementById("moleculeCreatorTable");
	var tableRowsNumber = table.rows.length;
	var tableColumnsNumber = 11;
	var columnWidthPx = 80;
	var row = table.insertRow(tableRowsNumber);
	for(var i=0;i<tableColumnsNumber;i++){
		var cell = row.insertCell(i);
		var input = document.createElement("INPUT");
		input.setAttribute("style", "width:"+columnWidthPx+"px");
		cell.appendChild(input);
	}	
};
removeAtomButton.onclick = function() {
	var table = document.getElementById("moleculeCreatorTable");
	var tableRowsNumber = table.rows.length;
	if(tableRowsNumber>1)
	{
		table.deleteRow(tableRowsNumber-1);
	}
};
acceptMoleculeButton.onclick = function() {
	var table = document.getElementById("moleculeCreatorTable");
	var tableRowsNumber = table.rows.length;
	var tableColumnsNumber = 11;
	var pdbString = "";
	//Fisrt row is just columns names
	for(var i=1;i<tableRowsNumber;i++){
		for(var j=0;j<tableColumnsNumber;j++){
			pdbString += table.rows[i].cells[j].firstChild.value + " ";
		}
		pdbString += '\n';
	}
	if(currentlyCreatedMoleculeType === "A"){
		SETTINGS.moleculeAPdb = pdbString;
	}
	else if(currentlyCreatedMoleculeType === "B"){
		SETTINGS.moleculeBPdb = pdbString;
	}
	console.log(pdbString);
	moleculeCreatorPopup.style.display = "none";
};
cancelMoleculeButton.onclick = function() {
	moleculeCreatorPopup.style.display = "none";
};
makeMoleculeAButton.onclick = function() {
	currentlyCreatedMoleculeType = "A";
   	moleculeCreatorPopup.style.display = "block";
};
makeMoleculeBButton.onclick = function() {
	currentlyCreatedMoleculeType = "B";
   	moleculeCreatorPopup.style.display = "block";
};
// When the user clicks the button, open the modal 
settingPopupButton.onclick = function() {
    modal.style.display = "block";
};

advancedSettingPopupButton.onclick = function() {
    advansedSettingsPopup.style.display = "block";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    // if (event.target == modal) {
    //     modal.style.display = "none";
    // }
};

cancelButton.onclick = function(event) {
    modal.style.display = "none";
}

cancelAdvancedSettingsButton.onclick = function(event) {
    advansedSettingsPopup.style.display = "none";
}

acceptButton.onclick = function(event) {

    var errorMSG = "";
    if(isNaN(parseFloat(document.getElementById("bondingTreshholdLowerBoundLambda").value))) errorMSG += "bondingTreshholdLowerBoundLambda is NAN \n";
    if(isNaN(parseFloat(document.getElementById("bondingTreshholdLowerBoundDelta").value))) errorMSG += "bondingTreshholdLowerBoundDelta is NAN \n";
    if(isNaN(parseFloat(document.getElementById("bondingTreshholdUpperBoundLambda").value))) errorMSG += "bondingTreshholdUpperBoundLambda is NAN \n";
    if(isNaN(parseFloat(document.getElementById("bondingTreshholdUpperBoundDelta").value))) errorMSG += "bondingTreshholdUpperBoundDelta is NAN \n";
    if(isNaN(parseFloat(document.getElementById("collisionTreshholdLowerBoundLambda").value))) errorMSG += "collisionTreshholdLowerBoundLambda is NAN \n";
    if(isNaN(parseFloat(document.getElementById("collisionTreshholdLowerBoundDelta").value))) errorMSG += "collisionTreshholdLowerBoundDelta is NAN \n";
    if(isNaN(parseFloat(document.getElementById("angleLow").value))) errorMSG += "angleLow is NAN \n";
    if(isNaN(parseFloat(document.getElementById("angleHigh").value))) errorMSG += "angleHigh is NAN \n";
    if(isNaN(parseFloat(document.getElementById("stepSize").value))) errorMSG += "angleHigh is NAN \n";
    if(errorMSG !== "")
    {
        alert( errorMSG);
    }
    else
    {
		let muAName = document.getElementById("molecularUnitADropdown").value;
		let muBName = document.getElementById("molecularUnitBDropdown").value;
        SETTINGS.molecularUnitAPath = muAName + ".pdb";
        SETTINGS.molecularUnitBPath = muBName + ".pdb";
        SETTINGS.predefinedInteractionsPath = document.getElementById("predefinedInteractionsPath").value;
		SETTINGS.bondingTreshholdLowerBoundLambda = document.getElementById("bondingTreshholdLowerBoundLambda").value;
        SETTINGS.bondingTreshholdLowerBoundDelta = document.getElementById("bondingTreshholdLowerBoundDelta").value;
        SETTINGS.bondingTreshholdUpperBoundLambda = document.getElementById("bondingTreshholdUpperBoundLambda").value;
        SETTINGS.bondingTreshholdUpperBoundDelta = document.getElementById("bondingTreshholdUpperBoundDelta").value;
        SETTINGS.collisionTreshholdLowerBoundLambda = document.getElementById("collisionTreshholdLowerBoundLambda").value;
        SETTINGS.collisionTreshholdLowerBoundDelta = document.getElementById("collisionTreshholdLowerBoundDelta").value;
        SETTINGS.angleLow = document.getElementById("angleLow").value;
        SETTINGS.angleHigh = document.getElementById("angleHigh").value;
        SETTINGS.stepSize = document.getElementById("stepSize").value;
		Util.sendSettingsToServer();
        modal.style.display = "none";
		cornerRealisationView.setMolecularUnits(muAName + ".json", muBName + ".json");
		sweepView.setMolecularUnits(muAName + ".json", muBName + ".json");
		realisationView.setMolecularUnits(muAName + ".json", muBName + ".json");
    }
}

acceptAdvancedSettingsButton.onclick = function(event) {

    var errorMSG = "";
    if(isNaN(parseFloat(document.getElementById("ParticipatingAtomsZDistance").value))) errorMSG += "ParticipatingAtomsZDistance is NAN \n";
    if(isNaN(parseFloat(document.getElementById("ParticipatingAtomIndexLow").value))) errorMSG += "ParticipatingAtomIndexLow is NAN \n";
    if(isNaN(parseFloat(document.getElementById("ParticipatingAtomIndexHigh").value))) errorMSG += "ParticipatingAtomIndexHigh is NAN \n";
    if(isNaN(parseFloat(document.getElementById("Initial4DContactSeperationLow").value))) errorMSG += "Initial4DContactSeperationLow is NAN \n";
    if(isNaN(parseFloat(document.getElementById("Initial4DContactSeperationHigh").value))) errorMSG += "Initial4DContactSeperationHigh is NAN \n";
    if(isNaN(parseFloat(document.getElementById("SavePointFrequency").value))) errorMSG += "SavePointFrequency is NAN \n";
    if(errorMSG !== "")
    {
        alert( errorMSG);
    }
    else
    {
		SETTINGS.ParticipatingAtomsZDistance = document.getElementById("ParticipatingAtomsZDistance").value;
		SETTINGS.ParticipatingAtomIndexLow = document.getElementById("ParticipatingAtomIndexLow").value;
		SETTINGS.ParticipatingAtomIndexHigh = document.getElementById("ParticipatingAtomIndexHigh").value;
		SETTINGS.Initial4DContactSeperationLow = document.getElementById("Initial4DContactSeperationLow").value;
		SETTINGS.Initial4DContactSeperationHigh = document.getElementById("Initial4DContactSeperationHigh").value;
		SETTINGS.SavePointFrequency = document.getElementById("SavePointFrequency").value;
		SETTINGS.ReverseWitness = document.getElementById("ReverseWitnessCheckBox").checked;
		SETTINGS.WholeCollision = document.getElementById("WholeCollisionCheckBox").checked;
		SETTINGS.FourDRootNode = document.getElementById("FourDRootNodeCheckBox").checked;
		SETTINGS.DynamicStepSizeAmong = document.getElementById("DynamicStepSizeAmongCheckBox").checked;
		SETTINGS.DynamicStepSizeBetween = document.getElementById("DynamicStepSizeBetweenCheckBox").checked;
		SETTINGS.ReversePairDumbbells = document.getElementById("ReversePairDumbbellsCheckBox").checked;
		SETTINGS.ShortRangeSamplingCheckBox = document.getElementById("ShortRangeSamplingCheckBox").checked;
		SETTINGS.UseParticipatingAtomsZDistanceCheckBox = document.getElementById("UseParticipatingAtomsZDistanceCheckBox").checked;
		advansedSettingsPopup.style.display = "none";
    }
}

