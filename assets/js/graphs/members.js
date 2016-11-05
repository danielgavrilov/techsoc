function stripDate(date){
	var newDate = Date.parse(date);
	console.log(newDate);
	return newDate; 
}

var date_sort_asc = function (date1, date2) {
  // This is a comparison function that will result in dates being sorted in
  // ASCENDING order. As you can see, JavaScript's native comparison operators
  // can be used to compare dates. This was news to me.
  if (date1 > date2) return 1;
  if (date1 < date2) return -1;
  return 0;
};



function loadGraph(){
    loadJSON('../members.json',function(dataset){
	var ctx = document.getElementById("membersChart");
	dataset = JSON.parse(dataset);
	var labels = [];
	var public = [];
	var total = [];
 	var sum = 0
 	var dates = []
	for( x = 0; x < dataset.length ; x++){
		//console.log(data[x].date)
		dates.push(new Date(dataset[x][0]));
	}
	
	dates.sort(date_sort_asc)
	console.log(dates)
	for( x = 0; x < dataset.length ; x++){
		//console.log(data[x].date)
			public.push(dataset[x][1]);
			labels.push(dates[x].getDate() + "/" + dates[x].getMonth());
			sum += dataset[x][1];
			total.push(sum);
	}

	$('#membersCount').html( "<h1>" + sum + "</h1>")
	Chart.defaults.global.defaultFontColor = '#fff';
	var myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: labels,
	        datasets: [
	        {
	            label: 'Cumulative member growth',
	            data: total,
	            type: "line",
	            fill: false,
	            lineTension: 0.1,
	            backgroundColor: "#fff",
	            borderColor: "#fff",
	            borderCapStyle: 'butt',
	            borderDash: [],
	            borderDashOffset: 0.0,
	            borderJoinStyle: 'miter',
	            pointBorderColor: "#fff",
	            pointBackgroundColor: "#fff",
	            pointBorderWidth: 1,
	            pointHoverRadius: 5,
	            pointRadius: 1,
	            pointHitRadius: 10,
	            spanGaps: false,
	        },
	        {
	            label: 'New members per day',
	            data: public,
	            fill: false,
	            lineTension: 0.1,
	            backgroundColor: "#d81e5b",
	            borderColor: "#d81e5b",
	            borderCapStyle: 'butt',
	            borderDash: [],
	            borderDashOffset: 0.0,
	            borderJoinStyle: 'miter',
	            pointBorderColor: "#d81e5b",
	            pointBackgroundColor: "#d81e5b",
	            pointBorderWidth: 1,
	            pointHoverRadius: 5,
	            pointRadius: 1,
	            pointHitRadius: 10,
	            spanGaps: false,
	        }
	        ]
	    },
	    options: {
	        scales: {
	        	xAxes: [{
	        		stacked:true,
	        		ticks:{
	        			beginAtZero: true,
	        			fontColor: "white"
	        		},
	        		labelFontColor: "#fff"
	        	}],
	            yAxes: [{
	            	stacked: true,
	                ticks: {
	                    beginAtZero: true,
	                    fontColor: "white"
	                },
	                fontColor: "#fff"
	            }]
	        }
	    }
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
 loadGraph();
