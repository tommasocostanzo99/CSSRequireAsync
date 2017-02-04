# CSSRequireAsync
Require CSS asynchronously directly from your CSS code with a simple rule thanks to a smart JS engine.

## Require
Loading CSS resources using `@import` or `link` will cause most browsers to delay page rendering while the style sheet loads and there are many JavaScript projects that avoid this problem, the difference is that this engine allows you to import CSS resources directly from your CSS code with a syntax similar to the standard `@import` at-rule with the difference that the request will be asynchronous.
Plus you don't have to write a line of JavaScript code, just import the engine.

## Usage
First include the engine:
```html
<script type="text/css" src="css-require-async-v1.0.0.js"></script>
```
Then use the following syntax in your external style sheets:
```html
<link rel="stylesheet" href="main.css">
```
```css
/* main.css */
require { content: "path/foo.css" }
...
```
or directly inline:
```html
<style type="text/css">
    require { content: "path/bar.css" }
</style>
```

## Media
Use the following syntax to set the media of the resource:
```css
require [media="screen and (min-width: 480px)"] {
    content: "path/foo.css"
}
```

## Note
The `require` rule is used to import style rules from other style sheets and you can place it anywhere in the document unlike the `@import` at-rule, the rule will not work inside conditional group at-rules and it is not a standard rule but it will not invalidate your documents.

### Google Chrome
The engine does not work when accessing a file locally using the file:/// protocol because of Chrome's security reasons, you can avoid this by accessing your document using your website or localhost or by placing the require rules inline (this limitation is only for who wants to test locally with the file protocol with Google Chrome).

### Base Path
If you use:
```css
require { content: url("path/foo.css") }
```
The final path will be related to the CSS file which contains this require rule.
If you use the standard way the path will be related to the HTML file which included the CSS file.

### MIT License
Copyright (C) 2017 Vasile Pește