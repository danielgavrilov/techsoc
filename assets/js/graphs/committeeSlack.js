function loadFileGraph(files,labels){
	var ctx = document.getElementById("committeeSlackChartFiles");
	var myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: labels,
	        datasets: [
	        {
	            label: 'Files uploaded p/ Week ',
	            data: files.reverse(),
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
	        		labelFontColor: "#fff",
	        		display:false
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
}

function loadSlackGraph(){
    loadJSON('../comSlack.json',function(dataset){
	var ctx = document.getElementById("committeeSlackChart");
	dataset = JSON.parse(dataset);
	var weekly_msg = [];
	var labels = [];
	var files = [];
	var fileLabels = [];

	for( x = 0; x < dataset.length ; x++){
		//console.log(data[x].date)
		weekly_msg.push(dataset[x]['total_msg']);
		labels.push( dataset[x]['date'].split(":")[0]);
		files.push( dataset[x]['total_files']  );
		fileLabels.push(x);
	}

	

	Chart.defaults.global.defaultFontColor = '#fff';
	var myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: labels.reverse(),
	        datasets: [
	        {
	            label: 'Slack Messages p/ Week ',
	            data: weekly_msg.reverse(),
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
	        		labelFontColor: "#fff",
	        		display:false
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
	loadFileGraph(files,fileLabels);
   });


 }


loadSlackGraph();

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

