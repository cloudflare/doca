# doca

**Doca is a command-line tool that scaffolds API documentation (doca project)** based on your [JSON Hyper-Schemas](http://json-schema.org/) (draft-04 supported, draft-07 support [forthcoming](ROADMAP.md)).

Doca bootstraps a full-fledged web app based on React and Webpack. Getting the final documentation is as easy as typing few commands or you can dive deeper and create your own completely different layout. **[Read the introductory blog post.](https://blog.cloudflare.com/cloudflares-json-powered-documentation-generator/)**

## Road Map

The doca suite is under active development!  See our [Road Map](ROADMAP.md) for details.

## Overview

Doca consists of:
* a **command line tool** (this repository)
* **themes** (standalone node modules such as [doca-bootstrap-theme](https://github.com/cloudflare/doca-bootstrap-theme))
* **webpack loaders** (background node modules you can mostly forget about)
    * [json-schema-loader](https://github.com/cloudflare/json-schema-loader) loads schemas and tracks dependencies
    * [json-schema-example-loader](https://github.com/cloudflare/json-schema-example-loader) converts schemas into the format expected by the themes

Here is a diagram:

<p align="center">
  <img src="doca.png" title="Doca project" alt="Doca project" width="80%" height="80%" />
</p>

## Installation

```
npm install doca -g
```

You need to use **Node.js 4+** and Npm 2+.

## Commands

### init

```
doca init [-i schema_folder] [-o project_folder] [-t theme_name]
```

It goes through the current dir (or `schema_folder`), looks for `**/*.json` files and generates `/documentation` (or `/project_folder`). Doca has modular 3rd party themes. The default one is [doca-boostrap-theme](https://github.com/cloudflare/doca-bootstrap-theme). It can be aliased just as `bootstrap`. This command should be used only once when you need to bootstrap your project.


### theme

```
doca theme newTheme project
```

This sets a different theme `newTheme` to the `project`. It has two steps:
- it calls `npm install newTheme --save` inside of `project`
- renames all `doca-xxx-theme` references to `doca-newTheme-theme`
**This can make destructive changes in your project.** Always use version control!

**A note about package scopes:** While non-scoped themes can be referenced by their simple name (e.g. `newTheme` for `doca-newTheme-theme`), scoped theme packages such as `@myscope/doca-abc-theme` must be passed as the full package name, including the scope.

### help

```
doca --help
```

This lists the commands and their syntax.


## Example usage

```
git clone git@github.com:cloudflare/doca.git
cd doca/example
doca init
cd documentation
npm install
```

**That's it!** Once installed, there are three ways to run the project:

1.  The development mode where you can make quick changes in your schemas and see the results immediately because of webpack and mighty hot reloading:

```
npm start
open http://localhost:8000
```

2.  A **static production-ready app**:

```
npm install
npm run build
open build/index.html
```

3.  A static app built **without any JavaScript**:

```
npm install
npm run build:nojs
open build/index.html
```

Do you need to **add more schemas** or change their order? Edit the file `schema.js`.

Do you want to change the generic page title or make CURL examples nicer? Edit the file `config.js`.

## Themes

**Themes are additional node modules**. Doca theme is just a set of React components and style sheets. At CloudFlare we use our own custom private CF theme. You can see it [here](https://api.cloudflare.com) in action. We have also open source a [theme based on Twitter Bootstrap](https://github.com/cloudflare/doca-bootstrap-theme). It is used as a default option for doca.

The Bootstrap theme also contains [a detailed description about how to fork and **create your own theme**](https://github.com/cloudflare/doca-bootstrap-theme) . It's pretty easy!

Currently, themes include nearly all UI functionality.  We are working on allowing CSS-level themes while sharing the UI structure.  See our [road map](ROADMAP.md) for details.

### The list of doca themes:
- [doca-bootstrap-theme](https://github.com/cloudflare/doca-bootstrap-theme)

*If you create one, please send a PR with link.*

You can **install any theme** with the command

```
doca theme THEME_NAME documentation
```

For non-scoped theme packages, you can use full name `doca-THEME_NAME-theme` or just shortcut `THEME_NAME`.

For scoped theme packages, you must use the full name `@myscope/doca-THEME_NAME-theme`




