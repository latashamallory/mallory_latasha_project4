//Activity 4
//Latasha Mallory
//Term:  1201

//Wait unitl DOM is ready.
window.addEventListener("DOMContentLoaded", function()

	//getElementById Function
	function $(x){
		var theElement = document.getElementById(x);
		return theElement;
	}
	
	//Create select field element and populate with options.
	function makeCats(){
		var formTag = document.getElementsByTagName("form"),
			selectLi = $('select'),
			makeSelect = document.createElement('select');
			makeSelect.setAttribute("id", "groups");
		for(var i=0, j=songGroups.length; i<j; i++){
			var makeOption = document.createElement('option');
			var optText = songGroups[i];
			makeOption.setAttribute("value", optText);
			makeOption.innerHTML = optText;
			makeSelect.appendChild(makeOption);
		}
		selectLi.appendChild(makeSelect);
	}
	
	//Find value of selected radio button.
	function getSelectedRadio(){
		var radios = document.forms[0].favorite;
		for(var i=0; i<radios.length; i++){
			if(radios[i].checked){
				favoriteValue = radios[i].value;
			}
		}
	}
	
	function getCheckboxValue(){
		if($('favorite').checked){
			favoriteValue = $('favorite').value;
		}else{
			favoriteValue = "No"
		}
	}
	
	function toggleControls(n){
		switch(n){
			case "on":
				$('songForm').style.display = "none";
				$('clear').style.display = "inline";
				$('displayLink').style.display = "none";
				$('add').style.display = "inline";
				break;
			case "off":
				$('songForm').style.display = "block";
				$('clear').style.display = "inline";
				$('displayLink').style.display = "inline";
				$('add').style.display = "none";
				$('items').style.display = "none";
				break;
			default:
				return false;
		}
	}
	
	function storeData(key){
		//If there is no key, this means this is a brand new item and we need a new key.
		if(!key){
			var id              = Math.floor(Math.random()*100000001);
		}else{
			//Set the id to the existing key we're editing so that it will save.
			//The key is the same key that's been passed along from the editSubmit event.
			//to the validate function, and then passed here, into the storeData function.
			id = key;
		}
		getSelectedRadio();
		getCheckboxValue();
		var item            = {};
			item.group      = ["Group:", $('groups').value];
			item.aname      = ["Artist Name:", $('aname').value];
			item.alname     = ["Album Name:", $('alname').value];
			item.sname      = ["Song Name:", $('sname').value];
			item.favorite   = ["Is a favorite:", favoriteValue];
			item.date       = ["Date:", $('date').value];
			item.notes      = ["Notes:", $('notes').value];
		//Save data into Local Storage:  Use Stringify to convert our object to a string.
		localStorage.setItem(id, JSON.stringify(item));
		alert("Song Saved!");
	}
	
	function getData(){
		toggleControls("on");
		if(localStorage.length === 0){
			alert("There is no data in Local Storage so default data was added.");
			autoFillData();
		}
		//Write Data from Local Storage to the browser.
		var makeDiv = document.createElement('div');
		makeDiv.setAttribute("id", "items");
		var makeList = document.createElement('ul');
		makeDiv.appendChild(makeList);
		document.body.appendChild(makeDiv);
		$('items').style.display = "block";
		for(var i=0, len=localStorage.length; i<len;i++){
			var makeli = document.createElement('li');
			var linksLi = document.createElement('li');
			makeList.appendChild(makeLi);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			//Convert the string fom Local Storage value back to an object by using JSON.
			var obj = JSON.parse(value);
			var makeSubList = document.createElement('ul');
			makeli.appendChild(makeSubList);
			getImage(obj.group[1], makeSubList);
			for(var n in obj){
				var makeSubli = document.createElement('li');
				makeSubList.appendChild(makeSubli);
				var optSubText = obj[n][0]+" "+obj[n][1];
				makeSubli.innerHTML = optSubText;
				makeSubList.appendChild(linksLi);
			}
			makeItemLinks(localStorage.key(i), linksLi); //Create our edit and delete button.
		}
	}
	//Get the image for the right category.
	function getImage(catName, makeSubList){
		var imageLi = document.createElement('li');
		makeSubList.appendChild(imageLi);
		var newImg = document.createElement('img');
		var setSrc = newImg.setAttribute("src", "images/"+ catName + ".png");
		imageLi.appendChild(newImg);
	}
	
	//Auto Populate Local Storage.
	function autoFillData(){
		//The actual JSON OBJECT data required for this to work is coming from our json.js file, which is loaded from our HTML page.
		//Store the JSON OBJECT into Local Storage.
		for(var n in json){
			var id = Math.floor(Math.random()*100000001);
			localStorage.setItem(id, SJON.stringify(json[n]));
		}
	}
	
	//Make Item Links
	//Create the edit and delete links for each stored item when displayed.
	function makeItemLinks(key, linksLi){
		//add edit single item link
		var editLink = document.createElement('a');
		editLink.href = "#";
		editLink.key = key;
		var editText = "Edit Song";
		editLink.addEventListener("click", editItem);
		editLink.innerHTML = editText;
		linksLi.appendChild(editLink);
		
		//add line break
		var breakTag = document.createElement('br');
		linksLi.appendChild(breakTag);
		
		//add delete single item link
		var deleteLink = document.createElement('a');
		deleteLink.href = "#";
		deleteLink.key = key;
		var deleteText = "Delete Song";
		deleteLink.addEventListener("click", deleteItem);
		deleteLink.innerHTML = deleteText;
		linksLi.appendChild(deleteLink);
	}
	
	//Edit Single Item
	function editItem() {
		//Grab the data from our item from Local Storage.
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);
		
		//Show the form
		toggleControls("off");
		
		//Populates form fields with current localStorage values.
		$('groups').value = item.group[1];
		$('aname').value = item.aname[1];
		$('alname').value = item.alname[1];
		var radios = document.forms[0].favorite;
		for (var i=0; i<radios.length; i++){
			if(radios[i].value == "Yes" && item.favorite[1] == "Yes"){
				radios[i].setAttribute("checked", "checked");
			}else if(radios[i].value == "No" && item.favorite[1] == "Yes"){
				radios[i].setAttribute("checked", "checked");
			}
		}
		if (item.favorite[1] == "Yes") {
			$('favorite').setAttribute("checked", "checked");
		}
		$('date').value       = item.date[1];
		$('notes').value      = item.notes[1];
		
		//Remove the initial listener from the input 'save song' button.
		save.removeEventListener("click", storeData);
	}
	
	)