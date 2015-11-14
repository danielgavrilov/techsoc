$.fn.collapse.Constructor.TRANSITION_DURATION = 200;

$(function(){

  FastClick.attach($(".site-nav")[0]);

  $("#typer").typed({
    strings: ["technology?", "socials?", "hackathons?", "projects?", "taking part?"],
    typeSpeed: 100,
    backDelay: 1000,
    loop: false,
    contentType: 'html', // or text
    // defaults to false for infinite loop
    loopCount: false
  });
});

console.log("Oh, Hi there. Like looking under the hood? Us too!\n\nFind some looking-under-hoods events at {{ '/events' | prepend: site.baseurl | prepend: site.url }} and come along!")
