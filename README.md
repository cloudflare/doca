# doca

**Doca is a command-line tool that scaffolds API documentation (doca project)** based on your [JSON HyperSchemas](http://json-schema.org/). The doca project is a full-fledged web app based on React and Webpack. Getting the final documentation is as easy as typing few commands or you can dive deeper and create your own completely different layout. **[Read the introductory blog post.](https://blog.cloudflare.com/cloudflares-json-powered-documentation-generator/)**

## Overview

Doca consists of a **command line tool** (this repository), **themes** (standalone node modules) and **webpack loaders** (background node modules you can mostly forget about). Here is a diagram:

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

### help

```
doca help
```

This gives you some description.


## Example usage

```
git clone git@github.com:cloudflare/doca.git
cd doca/example
doca init
cd documentation
npm install
npm start
open http://localhost:8000
```

**That's it!** This is the development mode where you can make quick changes in your schemas and see the results immediately because of webpack and mighty hot reloading.

You can **build a static production ready app** with

```
npm run build
open build/index.html
```

Or you can **build it without any JavaScript** with

```
npm run build:nojs
open build/index.html
```

Do you need to **add more schemas** or change their order? Edit the file `/schema.js`.

Do you want to change the generic page title or make CURL examples nicer? Edit the file `/config.js`.

## Themes

**Themes are additional node modules**. Doca theme is just a set of React components and style sheets. At CloudFlare we use our own custom private CF theme. You can see it [here](https://api.cloudflare.com) in action. We have also open source a [theme based on Twitter Bootstrap](https://github.com/cloudflare/doca-bootstrap-theme). It is used as a default option for doca. [There](https://github.com/cloudflare/doca-bootstrap-theme) is also a detailed description about how to fork and **create your own theme**. It's pretty easy!

### The list of doca themes:
- [doca-bootstrap-theme](https://github.com/cloudflare/doca-bootstrap-theme)

*If you create one, please send a PR with link.*

You can **install any theme** with the command

```
doca theme THEME_NAME documentation
```

You can use full name `doca-THEME_NAME-theme` or just shortcut `THEME_NAME`.




