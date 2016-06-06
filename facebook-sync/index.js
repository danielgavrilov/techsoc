var fs = require("fs");
var rp = require("request-promise");
var glob = require("glob");
var slug = require("slug");
var frontMatter = require("front-matter");
var yaml = require("js-yaml");
var moment = require("moment");
var _ = require("lodash");
var Q = require("q");


// Facebook API

var ACCESS_TOKEN = "EAAK3kpvZBViIBAMj2jeG3ZBEeUaUQxHd43KwBgvRwUhkUYmgZBeJsxnDyiIY8SReZA47UEXFMQf2YIogXkZAahEAbb3nmgTSVMRDuCBvPMf6mOxkTKe0pUrxKadsZB9Lpcmb403fy32RpL2ROO0qBmQ2p6zdBsjXoZD";

function getFacebookEvents() {
  return rp({
    uri: "https://graph.facebook.com/v2.5/UCLUTechSoc/events",
    qs: {
      access_token: ACCESS_TOKEN,
      fields: [
        "id",
        "start_time",
        "end_time",
        "name",
        "place",
        "ticket_uri",
        "description"
      ].join(",")
    },
    json: true
  }).then(function(response) {
    return response.data.map(parseFacebookEvent);
  });
}


// Facebook data transformation

function parseTime(time) {
  return moment(time).format("YYYY-MM-DD HH:mm");
}

function parseFacebookEvent(event) {

  var output = {};
  var attrs = output.attributes = {};

  attrs.facebook_id = event.id;

  if (event.name) {
    // remove trailing exclamation mark
    attrs.title = event.name.replace(/!$/, "");
  }
  if (event.start_time) {
    attrs.start_time = parseTime(event.start_time);
  }
  if (event.end_time) {
    attrs.end_time = parseTime(event.end_time);
  }
  if (event.place && event.place.name) {
    attrs.location = event.place.name;
  }
  if (event.ticket_uri) {
    attrs.actions = [{ label: "Tickets", url: event.ticket_uri }];
  }
  if (event.description) {
    // adding 2 or more spaces at the end of a line forces a newline in Markdown
    var description = event.description.replace(/\n/g, "  \n");
    output.body = "\n" + description;
  }

  return output;
}


// Local files

function getSiteEvents() {
  return new Promise(function(resolve, reject) {

    glob("_events/**/*.md", function(err, filenames) {
      if (err) return reject(err);
      return resolve(filenames.map(getSiteEvent));
    });

  });
}

function getSiteEvent(filename) {
  var fileContent = fs.readFileSync(filename, "utf8");
  var output = frontMatter(fileContent);
  return _.extend(output, { filename: filename });
}

function generateFileContent(event) {
  var output = "";
  output += "---\n";
  output += yaml.dump(event.attributes);
  output += "---\n";
  output += event.body || "";
  return output;
}

function saveEventFile(event) {
  var title = event.attributes.title;
  var content = generateFileContent(event);
  var filename;

  if (event.filename) {
    filename = event.filename;
  } else {
    filename = "_events/import-" + slug(title, {lower: true}) + ".md";
  }

  console.log("Adding " + title + "...")
  fs.writeFileSync(filename, content);
}


// Compare start & end times

function findEvent(events, facebookEventId) {
  return _.find(events, { attributes: { facebook_id: facebookEventId } });
}

function compareEvents(facebookEvent, siteEvent) {
  var title = siteEvent.attributes.title;
  var filename = siteEvent.filename;

  var fb = facebookEvent.attributes;
  var site = siteEvent.attributes;

  if (fb.start_time != site.start_time) {
    console.log("\n" + title + " (" + filename + ") has mismatching start time:");
    console.log("  Facebook start time: " + fb.start_time);
    console.log("      Site start time: " + site.start_time);
  }

  if (fb.end_time && fb.end_time != site.end_time) {
    console.log("\n" + title + " (" + filename + ") has mismatching end time:");
    console.log("  Facebook end time: " + fb.end_time);
    console.log("      Site end time: " + site.end_time);
  }
}


// LET'S GET IT STARTED

Q.all([
  getFacebookEvents(),
  getSiteEvents()
]).spread(function(facebookEvents, siteEvents) {

  var facebookEventsIds = _.pluck(facebookEvents, "attributes.facebook_id");
  var siteEventsIds     = _.pluck(siteEvents,     "attributes.facebook_id");

  // Compare times for existing events

  console.log("\nComparing start/end times for existing events...");

  var existingFacebookIds = _.intersection(
    facebookEventsIds,
    siteEventsIds
  );

  existingFacebookIds.forEach(function(facebookEventId) {
    var facebookEvent = findEvent(facebookEvents, facebookEventId);
    var siteEvent     = findEvent(siteEvents,     facebookEventId);
    compareEvents(facebookEvent, siteEvent);
  })

  // Add missing events

  console.log("\nAdding missing events...");

  var missingFacebookIds = _.difference(
    facebookEventsIds,
    siteEventsIds
  );

  var missingEvents = _.filter(facebookEvents, function(event) {
    return _.contains(missingFacebookIds, event.attributes.facebook_id);
  });

  missingEvents.forEach(saveEventFile);

  if (missingEvents.length > 0) {
    console.log("\nPlease don't forget to rename the files!");
    console.log("Add series_ids and project_ids where necessary, and review content before committing.");
    console.log("\nThanks. TechSoc loves you <3");
  } else {
    console.log("No events to add, they are all synced up!");
  }

}).catch(function(err) {
  console.error(err);
});
