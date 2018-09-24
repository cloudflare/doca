# Doca Suite Road Map

Phase One of the Doca Suite overhaul is complete!

The new back-end (and a bare-bones debugging front-end) for the doca suite
may be found at the [JSON Schema Tools](https://github.com/cloudflare/json-schema-tools)
monorepo.  While not everything exactly aligns with the plan as sketched out here, the
basics were achieved:

* Tool packages for working with JSON Schemas in generic ways
* Libraries for applying schema transformations necessary for generating docs
* Transformed schemas ***are still schemas*** and can still be used with standard tools
* Technology choices and package versions have been updated where possible
  (although it's a moving target)
* Webpack loaders do the absolute minimum work, deferring most code to the libraries
* Schemas can be read in more formats (JSON, JSON5, YAML, JavaScript) and referenced in
  "id"/"$id" and "$ref" without the extension and still work.
* Basic groundwork laid to support multiple vocabularies from draft-04 to draft-07,
  optionally including Cloudflare-specific extensions.  A few peieces, most notably
  the draft-06 "examples" (plural) keyword, still need work.

Some major limitations remain around circular references, but it should be easier to provide
options there going forward.

Please join further efforts at
[the new repository](https://github.com/cloudflare/json-schema-tools).

Any ideas from here that did not get picked up should be re-considered for the ROADMAP
to be built over there.
