'use strict';
const slugify = require('slugify');
const util = require("util");

module.exports = {
  beforeSave: async (model, attrs, options) => {
    if (attrs.Title) {
      attrs.Slug = slugify(attrs.Title, {lower: true});
    }
  },
};
