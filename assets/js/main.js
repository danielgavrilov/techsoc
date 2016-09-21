$.fn.collapse.Constructor.TRANSITION_DURATION = 200;

function loadScript(url) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  document.body.appendChild(script);
  return script;
}

function loadCalendarScript() {
  return loadScript("{{ '/assets/calendar.js' | prepend: site.baseurl }}");
}

$(function(){

  FastClick.attach($(".site-nav")[0]);

  $("#typer").typed({
    strings: ["learning how to code?", "fun socials?", "working with cool tech &amp; fun people?", "taking part?"],
    typeSpeed: 100,
    backDelay: 1000,
    loop: false,
    contentType: 'html', // or text
    // defaults to false for infinite loop
    loopCount: false
  });

  var $calendar = $("#calendar");
  var $calendarButton = $(".calendar-view-button");

  if ($calendar.hasClass("active")) {
    loadCalendarScript();
  } else {
    $calendarButton.one("show.bs.tab", loadCalendarScript);
  }

  var $subscribeButton = $(".subscribe-to-calendar");
  var subscribeButtonText = $subscribeButton.text();

  var $calendarSubscription = $(".calendar-subscription > .description");
  var $subscriptionGuide = $("#subscription-guide");

  $subscriptionGuide.on("show.bs.collapse", function() {
    $subscribeButton.text($subscribeButton.data("expanded-text"));
    $calendarSubscription.css("color", "transparent");
  });

  $subscriptionGuide.on("hide.bs.collapse", function() {
    $subscribeButton.text(subscribeButtonText);
    $calendarSubscription.css("color", "");
  });

});

console.log("Oh, Hi there. Like looking under the hood? Us too!\n\nFind some looking-under-hoods events at {{ '/events' | prepend: site.baseurl | prepend: site.url }} and come along!")
