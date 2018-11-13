var list=[]; //result list
var prevPage = "";
var nextPage = "";
var searchValue="";

/*run only when page elements are loaded*/
$(document).ready(function() {
	
	/*varibales to store information about each result item*/
	var videoId; // variabble to store Video ID
	var title; // variabble to store title of the video
	var description; // variabble to store description of the video
	var channelId; // variabble to store channel ID by which this video was uploaded
	var channelTitle; // variabble to store channel Title by which this video was uploaded
	var thumbnail; // variabble to store link to the thumbnail of the video
	var publishedDate; //variabble to store cthe publishing date of the video
	var endpoint; //API endpoint

	/*handling click on search button*/
	$('#search-btn').on('click', function() {
		searchValue = $('#search').val(); //value eneterd by user in the search bar
		if(!searchValue) {
			alert("Please enter something in the Search Bar!");
		}
		else {
			search(searchValue);
			$(".dropdown").css("visibility", "visible");
		}
	});

	/*Handling Click On sorting Option - By Name*/
	$('#sort-name').on('click',function() {
		console.log('Sorting By Name');
		sortByName();
	});

	/*Handling Click On sorting Option - By Date*/
	$('#sort-date').on('click',function() {
		console.log('Sorting By Date');
		sortByDate();
	});

	/*Handling Enter Press on keyboard*/
	var input = document.getElementById("search");
	input.addEventListener("keyup", function(event) {
	    event.preventDefault();
	    if (event.keyCode === 13) {
	        document.getElementById("search-btn").click();
	    }
	});

});

/*Driver Function to get result from API call & display it*/
function search(searchValue) {
	$('#results').html('');
	$('#changePageButtons').html('');
	endpoint = "https://www.googleapis.com/youtube/v3/search";	//Youtube search API Endpoint
	
	//JQuery function for getting data from API call
	$.get(
		endpoint,
		{
			part: 'snippet, id',
			q: searchValue,
			type: 'video',
			key: 'AIzaSyDHbSLbr8Rbx5wdnyqTRH6nmlcpCmnhafk',
			maxResults: 10 //restricting maximum results in each by 10
		},
		function(data) { 
			prevPage = data.prevPageToken; //keeping note of the previous page
			nextPage = data.nextPageToken; //keeping note of the next page
			list = data.items; //Returned JSON array from the API call
			console.log(list);

			//Parsing JSON object to extract info about each item and the displaying it on the page 
			$.each(data.items, function(i, item) {
				fetchData(item); //paring
				var output = bindData(); //binding the result
				$('#results').append(output);
			});
			//Handling action for previous and next page buttons
			if(prevPage) {
				$('#changePageButtons').append('<button id="prevPage">Previous</button>');
				$('#prevPage').on('click', function() {
					searchPage(prevPage);
				});
			}
			if(nextPage) {
				$('#changePageButtons').append('<button id="nextPage">Next</button>');
				$('#nextPage').on('click', function() {
					searchPage(nextPage);
				});
			}			
		}
		);
}

/*Helper function to fhndle click on previous & next page button*/
function searchPage(pageToken) {
	$('#results').html('');
	$('#changePageButtons').html('');

	$.get(
		"https://www.googleapis.com/youtube/v3/search",
		{
			part: 'snippet, id',
			q: searchValue,
			type: 'video',
			key: 'AIzaSyDHbSLbr8Rbx5wdnyqTRH6nmlcpCmnhafk',
			maxResults: 10,
			pageToken: pageToken //passing the page token as the parameter to get results of that particular page only
		},
		function(data) { 
			prevPage = data.prevPageToken;
			nextPage = data.nextPageToken;
			list = data.items;
			console.log(list);
			$.each(data.items, function(i, item) {
				console.log(item.snippet.title);
				fetchData(item);
				var output = bindData();
				$('#results').append(output);
			});

			if(prevPage) {
				$('#changePageButtons').append('<button id="prevPage">Previous</button>');
				$('#prevPage').on('click', function() {
					searchPage(prevPage);
				});
			}
			if(nextPage) {
				$('#changePageButtons').append('<button id="nextPage">Next</button>');
				$('#nextPage').on('click', function() {
					searchPage(nextPage);
				});
			}			
		}
		);
}


/*Function To parse the JSON output*/
function fetchData(item) {
	videoId = item.id.videoId;
	title = item.snippet.title;
	description = item.snippet.description;
	if(!description){
		description = 'No Description Available';
	}
	channelId = item.snippet.channelId;
	channelTitle = item.snippet.channelTitle;
	thumbnail = item.snippet.thumbnails.high.url;
	publishedDate = item.snippet.publishedAt.split("T")[0].split("-").reverse().join("-");

}

/*Function To create single list element to disply on the page*/
function bindData() {
	var output = '<li><div class="result">'
	+ '<div class="list-left">'
	+ '<a href="https://www.youtube.com/watch?v=' + videoId + '" target="_blank"><img src="' + thumbnail + '"></a></div>'
	+ '<div class="list-right">'
	+ '<a href="https://www.youtube.com/watch?v=' + videoId + '" target="_blank"><h2>' + title + '</h2></a>'
	+ '<a href="https://www.youtube.com/channel/' + channelId + '" target="_blank"><h4>' + channelTitle + '</h4></a>'
	+ '<p class="stat">Released On: ' + publishedDate + '</p>'
	+ '<p>' + description + '</p>';
	;
	return output;
}

/*Function to sort the resulting list by Name of the video*/
function sortByName() {
	list.sort((a,b) => (a.snippet.title > b.snippet.title) ? 1 : ((b.snippet.title > a.snippet.title) ? -1 : 0));
	$('#results').html('');
	$.each(list, function(i, item) {
				console.log(item.snippet.title);
				fetchData(item);
				var output = bindData();
				$('#results').append(output);
	});
}

/*Function to sort the resulting list by Publishing Date of the video*/
function sortByDate() {
	list.sort(function(a,b) {
		a_date = a.snippet.publishedAt.split("T")[0].split("-").join("");
		b_date = b.snippet.publishedAt.split("T")[0].split("-").join("");
		return a_date > b_date? 1 : a_date < b_date ? -1 : 0;
		
	});

	$('#results').html('');
		$.each(list, function(i, item) {
					console.log(item.snippet.publishedAt.split("T")[0].split("-").reverse().join("-"));
					fetchData(item);
					var output = bindData();
					$('#results').append(output);
	});
}

/***************************END**************************************/