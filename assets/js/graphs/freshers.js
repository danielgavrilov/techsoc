function loadFreshersGraph(files,labels){
	loadJSON('../freshers.json',function(dataset){

		dataset = JSON.parse(dataset);
		var labels = [];
		var data = []; 
		for(var x in dataset){
			labels.push(dataset[x][0]);
			data.push(dataset[x][1]); 
		}

		var ctx = document.getElementById("freshersGraph");
		Chart.defaults.global.defaultFontColor = '#fff';
		var myChart = new Chart(ctx, {
		    type: 'pie',
		    data: {
		        labels: [ 'Arts & Sciences',
		        	'School of Management', 
		        	'Natural Sciences', 
		        	'Languages & Linguistics', 
		        	'Medicine', 
		        	'Engineering', 
		        	'School of Architecture',
		        	'Social Sciences', 
		        	'Maths & Economics', 
		        	'Teaching & Education' ],
		        datasets: [
		        {
		            label: 'Files uploaded p/ Week ',
		            data: data,
		            fill: false,
		            lineTension: 0.1,
		            backgroundColor: ["#fff","#B4C5E4","#D9E5D6","#36A2EB","#E2B3DF","#d81e5b","#C16E20", "#FFDF14","#5FAF00","#FFAF00"],
		            borderColor: "#121c44",
		            borderCapStyle: 'butt',
		            borderDash: [],
		            borderDashOffset: 0.0,
		            borderJoinStyle: 'miter',
		            pointBorderColor: "#fff",
		            pointBackgroundColor: "#121c44",
		            pointBorderWidth: 1,
		            pointHoverRadius: 5,
		            pointRadius: 1,
		            pointHitRadius: 10,
		            spanGaps: false,
		        }
		        ],
		        animation:{
        			animateScale:true
    			}
		    },

		});

	});
}

function loadJSON(file,callback) {   
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }
loadFreshersGraph();

