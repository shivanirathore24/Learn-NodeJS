module.exports.home = function (req, res) {
  // return res.end("<h1>Express is up for Social Media.</h1>");
  return res.render("home", {
    title: "Home",
  });
};

/* 
1: `res.end` : is used for sending raw data such as HTML, text, or binary content, as the response. 
When you use res.end, you need to provide the response content as a string or a buffer. It doesn't involve 
any rendering of templates or dynamic data.

2: `res.render`: is used to render dynamic web pages by combining templates with data (often used in Express.js 
  with templating engines like EJS or Pug). When you use res.render, you typically specify a view/template 
  (e.g., an EJS or Pug template) and pass data to it. The template engine processes the template and injects 
  the data to generate an HTML response, which is then sent to the client.
*/
