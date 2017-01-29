var fs = require("fs");
var rp = require("request-promise");
var path = require("path");
var glob = require("glob");
var slug = require("slug");
var frontMatter = require("front-matter");
var yaml = require("js-yaml");
var moment = require("moment");
var _ = require("lodash");
var Q = require("q");
var chalk = require("chalk");

var categorise = require("./categorise");

// Facebook API

var ACCESS_TOKEN = "EAAK3kpvZBViIBALfU2MNTMtWbFVXRVJASHVtITVYlwyufGuXKiZCBPpZBujUL3gKz5ZCQoovHjZB54jAvmnyjgVGRK6EsM5IF6iu8gzB0sn6YHBTGZAnK0oIJOzomF1CGdWUX9fa31SGAZAU3vSaTm6rOSi1cJdYe0ZD";

function getFacebookEvents() {
  return rp({
    uri: "https://graph.facebook.com/v2.6/UCLUTechSoc/events",
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
  }).catch(function(error) {
    if (error && error.statusCode == 400) {
      console.error("\nERROR: Fetching Facebook events failed because the access token is probably out of date.\n\nThe access token has to be renewed every 60 days, because Facebook does not allow for longer-lasting access tokens.\n\nThe process of renewing sucks and is described here: https://stackoverflow.com/questions/10467272/get-long-live-access-token-from-facebook");
      process.exit();
    } else {
      throw error;
    }
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
  var category = event.attributes.project_id || event.attributes.series_id;
  var content = generateFileContent(event);
  var filename;

  if (event.filename) {
    filename = event.filename;
  } else if (category) {
    var dir = path.join(
      "_events",
      category
    )
    if (!fs.existsSync(dir)) {
      // create directory if it doesn't exist
      fs.mkdirSync(dir);
    }
    filename = path.join(
      dir,
      slug(title, {lower: true}) + ".md"
    );
  } else {
    filename = path.join(
      "_events",
      "import-" + slug(title, {lower: true}) + ".md"
    );
  }

  fs.writeFileSync(filename, content);
}


// Compare start & end times

function findEvent(events, facebookEventId) {
  return _.find(events, { attributes: { facebook_id: facebookEventId } });
}

function diffEventAttrs(facebookEventAttrs, siteEventAttrs) {

  var diff = {};

  ["start_time", "end_time", "location"].forEach(function(attr) {
    var fbAttrs = facebookEventAttrs[attr];
    var siteAttrs = siteEventAttrs[attr];
    if (fbAttrs && fbAttrs !== siteAttrs) {
      diff[attr] = fbAttrs;
    }
  });

  return diff;
}


// LET'S GET IT STARTED

Q.all([
  getFacebookEvents(),
  getSiteEvents()
]).spread(function(facebookEvents, siteEvents) {

  var facebookEventsIds = _.pluck(facebookEvents, "attributes.facebook_id");
  var siteEventsIds     = _.pluck(siteEvents,     "attributes.facebook_id");

  // Compare times for existing events

  var existingFacebookIds = _.intersection(
    facebookEventsIds,
    siteEventsIds
  );

  existingFacebookIds.forEach(function(facebookEventId) {

    var facebookEvent = findEvent(facebookEvents, facebookEventId);
    var siteEvent     = findEvent(siteEvents,     facebookEventId);

    var diffAttrs = diffEventAttrs(facebookEvent.attributes, siteEvent.attributes);

    if (!_.isEmpty(diffAttrs)) {

      var attrs = siteEvent.attributes;
      var title = attrs.title;
      var filename = siteEvent.filename;

      console.log("Updating " + chalk.bold(title) + " (" + filename + ")");

      for (attr in diffAttrs) {
        console.log(attr + ": " + chalk.red(attrs[attr]) + " → " + chalk.green(diffAttrs[attr]));
      }

      console.log("");

      siteEvent.attributes = _.extend(siteEvent.attributes, diffAttrs);
      saveEventFile(siteEvent);
    }
  })

  // Add missing events

  var missingFacebookIds = _.difference(
    facebookEventsIds,
    siteEventsIds
  );

  var missingEvents = _.filter(facebookEvents, function(event) {
    return _.contains(missingFacebookIds, event.attributes.facebook_id);
  });

  missingEvents.forEach(function(event) {
    console.log("Adding " + chalk.bold(event.attributes.title));
    categorise(event);
    saveEventFile(event);
  });

  if (missingEvents.length > 0) {
    console.log("\nPlease don't forget to " + chalk.bold("rename the files!"));
    console.log("Add " + chalk.bold("series_ids") + " and " + chalk.bold("project_ids") + " where necessary, and review content before committing.");
    console.log("\nThanks. TechSoc loves you <3");
  } else {
    console.log("No events to add, they are all synced up!");
  }

}).catch(function(err) {
  console.error(err);
});
