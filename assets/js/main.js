console.log("Hi there fellow developer");

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
