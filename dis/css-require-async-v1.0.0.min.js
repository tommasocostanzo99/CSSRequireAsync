/*
 * The MIT License (MIT)
 * Copyright (C) 2017 Vasile Pește
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
*/

/*
 * @module CSSRequireAsync
 * @version 1.0.0
 * @author Vasile Pește
*/

(function(f,m,q){function p(c,d){var g=f.document.createElement("link"),a=f.document.getElementsByTagName("head")[0];a&&(g.setAttribute("rel","stylesheet"),g.setAttribute("media","mock"),g.setAttribute("href",c),g.addEventListener("load",function(){this.setAttribute("media",d||"all")}),a.appendChild(g))}m.a=function(c,d){c&&"string"===typeof c&&p(c,d)};f.addEventListener("DOMContentLoaded",function(){for(var c,d=0,g=f.document.styleSheets.length;d<g;d++)if(f.document.styleSheets[d].cssRules&&f.document.styleSheets[d].rules){var a;
c=f.document.styleSheets[d];for(var e=c.cssRules||c.rules,n=[],h=0,m=e.length;h<m;h++)if(a=e[h].selectorText,1===e[h].type&&"."!==a[0]&&"#"!==a[0]&&"["!==a[0]){var b;a=e[h];var k=a.selectorText;b=a.style.content;var l={};!b||0!==k.indexOf("require")||k[7]&&" "!==k[7]?a=!1:(b=b.replace(/['"]+/g,""),0===b.indexOf("url")&&(b=b.substr(4,b.length-5)),l.url=b,-1!==k.indexOf(" [media]")?b="":(b=k.split("[media="),b=b[1]?b[1].split("]")[0].replace(/['"]+/g,""):!1),l.media=b||q,l.selectorText=k,l.cssText=
a.cssText,l.type="require",a=l);a&&(a.source={url:c.href,index:h},n.push(a))}if(c=0!==n.length?n:!1)for(e=0;e<c.length;e++)p(c[e].url,c[e].media)}});return m})(window,{});