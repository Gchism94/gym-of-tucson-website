module.exports = function (eleventyConfig) {
  // Pass static assets through to _site
  eleventyConfig.addPassthroughCopy({ "src/assets/css/output.css": "assets/css/output.css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js/app.js": "assets/js/app.js" });
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("favicon");
  eleventyConfig.addPassthroughCopy("robots.txt");

  // Watch CSS changes in dev
  eleventyConfig.addWatchTarget("src/assets/css/styles.css");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "html", "md"],
  };
};
