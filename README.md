# Setup

### 1. Install Ruby & Node

#### Mac OS X

Install [brew](http://brew.sh/) if you don't have it, and then install Ruby & Node by running:

```
brew install ruby node
```

#### Windows

You can download Node.js [here](https://nodejs.org/en/) and Ruby [here](http://rubyinstaller.org/downloads/).
Make sure that it's working by testing whether you have command line access to ```npm``` and ```gem```.

### 2. Clone this repository

Go to the directory you want this project to be in (can be anywhere) and run:

```
git clone https://github.com/techsoc/website-2015.git
```

### 3. Install Jekyll

In order to keep our Jekyll version in sync, we'll be using [bundler](http://bundler.io/). Install it by running:

```
gem install bundler
```

Then cd to the website folder and run:

```
bundle install
```

..which will install all Ruby dependencies.

### 4. Install Gulp

Gulp will help fix our CSS by adding all vendor prefixes as well as regenerate the site whenever changes are made. Install it by cd'ing to this project and running:

```
npm install && npm install -g gulp
```

# Short intro to Jekyll

We are using [Jekyll](https://jekyllrb.com/) to build the site, which is a static site generator. It uses the [Liquid](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers) templating language, which you might need to know the basics of to edit parts of the site.

At the top of files you will often notice a "block" containing some data separated with `---` (three dashes) from the rest of the content. This is the [YAML front matter](http://jekyllrb.com/docs/frontmatter/) and is used to associate some data with a file.

# Contributing

To edit any parts of the site, you will first need cd to this project directory and start gulp by running:

```
gulp
```

Gulp does 2 things:

1. It creates a local webserver (accessible at <http://localhost:3000>)
2. It "watches" files, and whenever something changes it regenerates the website automatically

I've added some little guidance below for some common tasks, but this is definitely not enough. For now, just look around the project and try to spot patterns. And **ask lots of questions on #dev-site on Slack**. I will try to keep this README up to date with common questions.

## Modifying HTML

**Never edit anything in the `_site` folder.** It is autogenerated & will overwrite your changes.

## Modifying CSS

**Do not edit `assets/css/main.css`**, it is autogenerated. Edit CSS in the `assets/scss` directory. It's actually a bit more than raw CSS, it's [SCSS](http://sass-lang.com/guide), which is CSS with some added features.

## Adding events

Create a file with an `.md` extension in the `_events` folder. The filename will be part of the URL, so please name it appropriately (and follow a pattern if there is one), e.g. a file `hacklondon.md` will create a page at `techsoc.io/events/hacklondon`.

#### Fields

- `title` - Make it descriptive. If the event is associated with a project (or an event series), they will appear before of the title, so do not repeat the project (or series) name. (Bad: `Android Project - Session 2!`. Good: `Session 2: UI Prototyping`). Avoid using exclamation marks.

- `series_id` (optional) - It should match the `id` property of a series (series are defined in `_series` folder). Specify only if the event is part of an event series (common ids are `tech-talks`, `socials`, `hackathons`, `office-tours`)

- `project_id` (optional) - It should match the `id` property of a project (projects are defined in `_projects` folder). Specify only if the event is part of a project (common ids are `android`, `vr` & `social-network`)

- `location` - Set it to something people outside the department can find (Bad: `Computer Science Labs`. Good: `Malet Place Engineering Building 1.21`)

- `start_time` - It needs to be surrounded by double quotes and in the format `"<year>-<month>-<day> <hour>:<minute>"`. Example date: `"2015-11-30 18:00"` (meaning 30 November 2015 at 6pm). If the start time is not known, set it to `"TBA"`. It's very important to follow these rules, otherwise things will break.

- `end_time` - Everything that applies to `start_time`, plus: always specify an end time if there is a start time (even try to estimate how long an event will be), because calendars are auto-generated from these events.

- `facebook_id` - The ID of the Facebook event. This is easily extractable from the URL (`facebook.com/events/<facebook_id>`) of the Facebook event, and it's always an integer. Please only include the integer, not the whole URL.

- `actions` - If an event requires tickets, this is where you put the link to where to get them (usually EventBrite). There can be multiple actions & each requires a `label` & `url`. See `_events/brumhack-3.0.md` for an example.

## Adding members/posts/event series/...

Just look at what is already there & if anything is unclear, ask on the #dev-site Slack channel. I will try to write up common questions here.

## Adding a redirect (shortening a URL)

To add a redirect, create a file `<filename>.html` in the `_redirects` folder, with the content:

```
---
redirect_to: <URL to redirect to>
---
```

This will create a redirect from `techsoc.io/<filename>` to `<URL to redirect to>`. See `_redirects/lhd.html` for an example.
