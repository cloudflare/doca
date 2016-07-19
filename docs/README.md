# Open Sourcing CloudFlare's Docs Generator

CloudFlare exposes the entire infrastructure via a RESTful API. In order to keep track of all our endpoints we use a rich notation called [JSON Hyper-Schema](http://json-schema.org/). These schemas are (not only) used to generate a complete HTML documentation that you can see at [https://api.cloudflare.com](https://api.cloudflare.com). Today, we want to share a set of tools that we use in this process.

## Understanding JSON Schema

JSON Schema is a powerful way how to describe your JSON data format. **It provides a complete structural validation** and can be used for things like validation of incoming requests. JSON Hyper-Schema further extends this format by links and gives you a way to describe your API.

### JSON Schema Example

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "number" },
    "address": {
      "type": "object",
      "properties": {
        "street_address": { "type": "string" },
        "city": { "type": "string" },
        "state": { "type": "string" },
        "country": { "type" : "string" }
      }
    }
  }
}
```

### Matching JSON

```json
{
  "name": "John Doe",
  "age": 45,
  "address": {
    "street_address": "2433 State St NW",
    "city": "Atlanta",
    "state": "Georgia",
    "country": "United States"
  }
}
```

**JSON Schema supports all simple data types.** It also defines some special meta properties as title, description, default, enum, id, $ref, $schema, allOf, anyOf, oneOf and more. **The most powerful construct is $ref.** It provides similar functionality as hypertext links. You can reference external schemas (external reference) or a fragment inside the current schema (internal reference). This way you can easily compose and combine multiple schemas together without repeating yourself.

**JSON Hyper-Schema** introduces another property **links** where you define your API links, methods, request and response formats and more. The best way to learn more about JSON Schemas is to visit [Understanding JSON Schema](https://spacetelescope.github.io/understanding-json-schema/). You can also visit the official [specification website](http://json-schema.org/) or [wiki](https://github.com/json-schema/json-schema/wiki). If you want to jump straight into examples try [this](https://github.com/cloudflare/doca/tree/master/example).

## Generating Documentation: Tools

We have already open source a library that can generate a complete HTML documentation based on JSON Schema files and [Handlerbars.js](http://handlebarsjs.com/) templates. It is called [Json Schema Docs Generator (JSDC)](https://github.com/cloudflare/json-schema-docs-generator). However, it has some drawbacks making hard to use it by other teams:

- Complicated configuration
- It is necessary to rebuild everything with every change (slow)
- Templates cannot have their own dependencies
- All additional scripting must be in a different place
- It is hard to further customize it (splitting into sections, pages)

We wanted something more modular and extensible that addresses issues above but still getting some ready-to-go output just with a few commands. We have created a toolchain based on JSDC and modern JavaScript libraries. This article is not just a description how to use these tools but it also explains our design decisions. **It is described in a bottom-up manner.** You can skip this section if you are not interested in technical solutions.

### [json-schema-loader](https://github.com/cloudflare/json-schema-loader)

JSON Schema files need to be preprocessed first. **The first thing we have to do is to resolve their references ($ref).** This can be quite a complex task since every schema can have multiple references and these can be external (referencing even more schemas). Also, when we make a change, we want to only resolve schemas that need to be resolved. We have decided to use [Webpack](https://webpack.github.io/) for this task. Webpack loaders have some great properties:

- It is a simple function that transforms input into output
- It can **maintain and track additional file dependencies**
- It can cache the ouput
- It can be chained
- Webpack watches all changes in required modules and their dependencies

Our loader is using 3rd party [JSON Schema Ref Parser](https://github.com/BigstickCarpet/json-schema-ref-parser) library. It does not adhere JSON Schema specification related to id properties and their ability of changing reference scope since it is [ambiguous](https://github.com/json-schema/json-schema/wiki/The-%22id%22-conundrum). However, it implements [JSON Pointer](https://tools.ietf.org/html/rfc6901) and [JSON Reference](https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03) specifications. What does it mean? You can still combine relative (or absolute) paths with JSON Pointers and use references as:

```
 "$ref": "./product.json#/definitions/identifier"
```

but ids are simply ignored and the scope is always relative to the root. That makes reasoning about our schemas easier. That being said, there is still expected an unique root id for other purposes.

### [json-schema-example-loader](https://github.com/cloudflare/json-schema-example-loader)

Finally, we have resolved schemas. Unfortunately, their structure don't really match our final HTML documentation. It can be still deeply nested and we want to present our users nice examples of API requests and responses. We need to do further transformations. We remove some original properties and precompute some new ones. **The goal is to create a data structure that will better fit our UI components.** Please, check [the project page](https://github.com/cloudflare/json-schema-example-loader) for more details.

You might be asking why we use an another webpack loader. This could be part of our web application instead. The main reason is performance. We do not want to bog down browsers by doing these transformations repeatedly since JSON Schemas can be arbitrarily nested and very complex.

### [doca-bootstrap-theme](https://github.com/cloudflare/doca-bootstrap-theme)

With both Webpack loaders, you can use your favorite JavaScript framework and easily build your own application already. However, we want to make docs generation accessible even to people who don't have time to build their own application. Therefore, we have created a set of templates that matches the output of [json-schema-example-loader](https://github.com/cloudflare/json-schema-example-loader). These templates are using popular library [React](https://facebook.github.io/react/). Why React?

- It can be used and rendered server-side
- We can now bake in additional features into components (show/hide...)
- It is easily composable
- We really really like it :)

[doca-bootstrap-theme](https://github.com/cloudflare/doca-bootstrap-theme) is a generic theme based on [Twitter Bootstrap v3](http://getbootstrap.com/). We also have our private theme used by [https://api.cloudflare.com](https://api.cloudflare.com). You are encouraged to fork it and create your own awesome themes!

### [doca](https://github.com/cloudflare/doca)

So, we have loaders and nice UI components. **Now it is a time to put it all together.** We have something that can do just that! We call it **doca**. Doca is a command-line tool written in Node.js that scaffolds the whole application for you. It is actually pretty simple. It takes fine-tuned webpack/redux/babel based [application](https://github.com/cloudflare/doca/tree/master/app), copies it into a destination of your choice and does few simple replacements.

Since all hard work is done by webpack loaders and all UI components live in a different theme package, the final app can be pretty minimalistic and it's not intended to be updated by doca tool. **You should use doca only once.** Otherwise, it would just rewrite your application which is not desirable if you made some custom modifications. For example, you might want to add [React Router](https://github.com/reactjs/react-router) and create a multi-page documentation.

It contains webpack configs for development and production modes. You can build a completely static version with no JavaScript. It transforms output of [json-schema-example-loader](https://github.com/cloudflare/json-schema-example-loader) into immutable data structure (using [Immutable.js](https://facebook.github.io/immutable-js/)). This brings some nice performance optimizations. This immutable structure is then passed to [doca-bootstrap-theme](https://github.com/cloudflare/doca-bootstrap-theme) (default option). That's it.

This is a good compromise between easy-to-setup requirement and later customization. Do have a folder with JSON Schema files and want to quickly get `index.html`? Install doca and use a few commands. Do you need your own look? Fork and update [doca-bootstrap-theme](https://github.com/cloudflare/doca-bootstrap-theme). Do you need to create more pages, sections or use a different framework? Just modify the app that was scaffolded by doca.

One of the coolest features of Webpack is [hot module replacement](https://webpack.github.io/docs/hot-module-replacement.html). Once you save a file, you can immediately see the result in your browser. No waiting, refreshing, scrolling or lost state. It is mostly used in a [combination with React](https://github.com/gaearon/react-hot-loader). However, **we can use it for JSON Schemas as well** and here is the demo:

![JSON Schema Hot Reloading](pics/hot-reload.gif)

**It gets even better.** It is easy to make a mistake in your schemas. No worries! You will be immediately prompted with a descriptive error message. Once it is fixed, you can continue with your work. No need to leave your editor. Refreshing is so yesterday!

![JSON Schema Hot Reloading Error](pics/hot-reload-error.gif)

## Generating Documentation: Usage

The only prerequisite is to have Node.js v4+ in your system. Then you can install doca by:

```
npm install doca -g
```


**There are just two simple commands.** The first one is `doca init`:

```
doca init [-i schema_folder] [-o project_folder] [-t theme_name]
```

It goes through the current dir (or `schema_folder`), looks for `**/*.json` files and generates `/documentation` (or `/project_folder`). This command should be used only once when you need to bootstrap your project.


The second one is `doca theme`:

```
doca theme newTheme project
```

This sets a different theme `newTheme` to the `project`. It has two steps:

- It calls `npm install newTheme --save` inside of `project`
- It renames all `doca-xxx-theme` references to `doca-newTheme-theme`

**This can make destructive changes in your project.** Always use version control!


### Getting started

The best way how to start is to try our example. It includes two JSON Schemas.

```
git clone git@github.com:cloudflare/doca.git
cd doca/example
doca init
cd documentation
npm install
npm start
open http://localhost:8000
```

**That's it!** This is the development mode where you can make quick changes in your schemas and see the results immediately because of mighty hot reloading.

You can **build a static production ready app** with

```
npm run build
open build/index.html
```

Or you can **build it with no JavaScript** with

```
npm run build:nojs
open build/index.html
```

Do you need to **add more schemas** or change their order? Edit the file `/schema.js`.
Do you want to change the generic page title or make CURL examples nicer? Edit the file `/settings.js`.

## Conclusion

We have open source a set of libraries that can help you develop and ship a rich RESTful API documentation. We are happy for any feedback and can't wait to see new themes created by open source community. Please, gives us a [star on GitHub]((https://github.com/cloudflare/doca)). Also, if this work interests you then you should come [join our team](https://careers.jobscore.com/careers/cloudflare/jobs/senior-front-end-engineer-cI9kn86-ir4z5yiGakhP3Q)!
