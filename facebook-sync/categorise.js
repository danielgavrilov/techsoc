var _ = require("lodash");

var categories = [
  {
    match: /coding.+cookies/i,
    assign: { series_id: "coding-and-cookies" }
  },
  {
    match: /cs50/i,
    assign: { series_id: "cs50" }
  },
  {
    match: /(virtual reality|vr).+project/i,
    assign: { project_id: "vr-project" }
  },
  {
    match: /hardware project/i,
    assign: { project_id: "hardware-project" }
  },
  {
    match: /open hour/i,
    assign: { series_id: "open-hours" }
  },
  {
    match: /mixer|social/i,
    assign: { series_id: "socials" }
  },
  {
    match: /tech talk/i,
    assign: { series_id: "tech-talks" }
  }
];

function matches(match, d) {
  if (_.isRegExp(match)) {
    // for a regex, we only match against title
    return match.test(d.attributes.title);
  } else if (_.isFunction(match)) {
    // for a function, pass whole event object
    return match(d);
  }
  return false;
}

module.exports = function(event) {

  for (var i = 0; i < categories.length; i++) {
    var { match, assign } = categories[i];
    if (matches(match, event)) {
      _.assign(event.attributes, assign);
      // if a match is found, we don't want to test for other matches
      break;
    }
  }

  return event;
}
