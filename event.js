// function that goes through the history and grabs the last 15 issues visited
// it will display 15 unique issues. if an issue has already been visited already
// it will be displayed at the top instead of its previous position
function checkHistory(divID)
{
	var urlList = [];
	// look through chrome history and search for
	// all page visits to "github.com"
	urlList = chrome.history.search({
      'text': 'github.com'
    },
    function(historyItems) 
	{
		// This array will store the latest 15 issues visited 
		// according to the users chrome history
		var urlList = [];
		
		// For each time github was visited, (1) check to see if user visited a github issue within the past 24 hours.
		// (2) Also checks to see if the url includes "issues" and (3) checks to see if the last character of the url is a number.
		// Checking the last character will help determine if the user actually visited a github issue as the link to an issue
		// is in this format https://github.com/username/repo_name/issues/issue_number . Lastly it (4) checks to see if the array 
		// size is less than 15 as we want to only display the latest 15 issues visited. 
		for (var i = 0; i < historyItems.length; i++) 
		{
			var url = historyItems[i].url;
			var lastChar = url.slice(-1);
			if(url.includes('issues') && !isNaN(lastChar) && urlList.length < 15)
				urlList.push(url);
			else if(urlList.length >= 15)
				break;
		}
		createPopupDom(divID,urlList);
    });
}

//function that displays the url links to the UI
function createPopupDom(divID, urlList) 
{
	var popdiv = document.getElementById(divID);
	var list = document.createElement("ul");
	if(urlList.length > 0)
	{
		popdiv.appendChild(list);
		for (var i = 0; i < urlList.length; i++) 
		{	
			var a = document.createElement('a');
			a.href = urlList[i];
			a.appendChild(document.createTextNode(urlList[i]));
			a.addEventListener('click', onAnchorClick);
			var elem = document.createElement('li');
			elem.appendChild(a);
			list.appendChild(elem);
		}
	}
	else
		popdiv.innerHTML = "No GitHub issues were visited in the past 24 hours";
	
}

// Event listener to open browser when user clicks on the url links.
// A new tab will be opened to lead the user to the webpage.
function onAnchorClick(event) 
{
	chrome.tabs.create({
		selected: true,
		url: event.srcElement.href
	});
	return false;
}

//when user clicks on extension icon, function checkHistory
//will be called.
document.addEventListener('DOMContentLoaded', function () 
{
	checkHistory("issue_list");
});
