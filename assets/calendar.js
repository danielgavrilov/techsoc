---
---

{% comment %}

This is a separate dependency because it weighs a whole lot, and it shouldn't be
included anywhere else apart from the events page.

{% endcomment %}

{% include_relative bower_components/moment/min/moment.min.js %}
{% include_relative bower_components/fullcalendar/dist/fullcalendar.min.js %}
{% include_relative bower_components/fullcalendar/dist/lang/en-gb.js %}


function eventTransform(event) {
  return {
    title: (event.label ? "[" + event.label + "] " : "") + event.title,
    start: event.start_time,
    end: event.end_time,
    url: "{{ site.baseurl }}" + event.url
  };
}

function getCalendarEvents() {
  return $.getJSON("{{ '/data/events.json' | prepend: site.baseurl }}")
    .then(function(events) {
      return events.map(eventTransform);
    });
}

function showCalendar() {
  return getCalendarEvents()
    .then(function(events) {

      var $calendar = $("#calendar");
      var $spinner = $calendar.find(".sk-circle");

      $calendar.fullCalendar({
        events: events,
        header: {
          left: "title",
          center: "",
          right: "today agendaWeek,month prev,next"
        },
        lang: "en-gb",
        allDaySlot: false,
        defaultView: "agendaWeek",
        scrollTime: "12:00:00",
        theme: "techsoc",
        timeFormat: "HH:mm",
        slotLabelFormat: "HH:mm",
        columnFormat: "dddd",
        aspectRatio: 16/9,
        eventAfterAllRender: function() {
          $spinner.remove();
        }
      });
    })
}

$(function(){

  var $calendar = $("#calendar");
  var $calendarButton = $(".calendar-view-button");

  if ($calendar.hasClass("active")) {
    showCalendar();
  } else {
    $calendarButton.one("shown.bs.tab", showCalendar);
  }

});
