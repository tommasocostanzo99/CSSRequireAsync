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
 * @version 1.1.0
 * @author Vasile Pește
*/

var CSSRequireAsync = (

    function (w, e, undefined)
    {
        "use strict";
        
        // Used as rule identifier (and selector name).
        var IDENTIFIER = "require";
        
        // Used as option name for media.
        var MEDIA = "media";
        
        /**
         * __requestAsync Send an async request to a resource and retrieve the content.
         * @private
         * @param {string} url
         * @param {function} callback
        */
        
        function __requestAsync (url, callback)
        {
            var requestHandler = new w.XMLHttpRequest();
            
            requestHandler.addEventListener("load", callback);
            requestHandler.open("GET", url, true);
            requestHandler.send();
        }
        
        /**
         * __appendCSSLink Append a link[rel="stylesheet"] to the document.
         * @private
         * @param {string} url
         * @param {string} media
        */
        
        function __appendCSSAsyncLink (url, media)
        {
            var link = w.document.createElement("link");
            var head = w.document.getElementsByTagName("head")[0];
            
            if (!head)
                return;
            
            link.setAttribute("rel", "stylesheet");
            // link.setAttribute("type", "text/css");
            // Set a invalid value to the media attribute in order to avoid rendering block.
            link.setAttribute("media", "mock");
            link.setAttribute("href", url);
            
            // When the style sheet is loaded set the right value to the media attribute.
            link.addEventListener
            (
                "load", function ()
                {
                    this.setAttribute("media", media || "all");
                    __evalCSSStyleSheet(this.sheet);
                }
            );
            
            head.appendChild(link);
        }
        e.appendCSSAsyncLink = function (url, media)
        {
            if (url && typeof url === "string")
                __appendCSSAsyncLink(url, media);  
        };
        
        /**
         * __parseCSSStyleSheet Parse a CSS style sheet searching for require rules.
         * @private
         * @param {CSSStyleSheet} CSSStyleSheet
         * @return {Array|false}
        */
        
        function __parseCSSStyleSheet (CSSStyleSheet)
        {
            // Fallback to "rules" for Internet Explorer.
            var rules = CSSStyleSheet.cssRules || CSSStyleSheet.rules;
            var requireRules = [];
            var rule, selector;
            
            for (var i = 0, l = rules.length; i < l; i++)
            {
                selector = rules[i].selectorText;
                
                // Jump in case of at-rule or if the selector starts with a class, an ID or an attribute.
                if (rules[i].type !== 1 || selector[0] === "." || selector[0] === "#" || selector[0] === "[")
                    continue;
                
                // Parse the rule.
                rule = __parseCSSRule(rules[i]);
                
                // If the rule is a require rule append it to the collector.
                if (rule)   
                {
                    rule.source = { url: CSSStyleSheet.href, index: i };
                    requireRules.push(rule);
                }
            }
            
            // If the collector array of require rules is not empty return it else return false.
            return requireRules.length !== 0 ? requireRules : false;
        }
        
        /**
         * __parseCSSRule Parse a CSS rule searching for a require rule.
         * @private
         * @param {CSSRule} CSSRule
         * @return {Object|false}
        */
        
        function __parseCSSRule (CSSRule)
        {
            var selector = CSSRule.selectorText;
            var url = CSSRule.style.content;
            var key = IDENTIFIER;
            var require = {};
            
            // Return false if the content property is empty or if the selector does not starts with the identifier.
            if (!url || selector.indexOf(key) !== 0 || selector[key.length] && selector[key.length] !== " ")
                return false;
            
            url = url.replace(/['"]+/g, "");
            
            // If the content property follows the url() syntax remove the useless characters.
            if (url.indexOf("url") === 0)
                url = url.substr(4, url.length - 5);
            
            require.url = url;
            require.media = __getCSSRuleSelectorOption(selector, MEDIA) || undefined;
            require.selectorText = selector;
            require.cssText = CSSRule.cssText;
            require.type = key;
            
            return require;
        }
        
        /**
         * __getCSSRuleSelectorOption Get an option from a CSS rule selector.
         * @private
         * @param {string} selector
         * @param {string} option
         * @return {string|false}
        */
        
        function __getCSSRuleSelectorOption (selector, option)
        {
            // Syntax: selector [option="value"].
            var value;
            
            // If the syntax is [option] return an empty string.
            if (selector.indexOf(" " + "[" + option + "]") !== -1)
                return "";
            
            value = selector.split("[" + option + "=");
            
            // If the option is not found return false.
            if (!value[1])
                return false;
            
            // The syntax is [option="value"] then return the value.
            return value[1].split("]")[0].replace(/['"]+/g, "");
        }
        
        /**
         * __evalCSSStyleSheet Evaluate a CSS style sheet.
         * @private
         * @param {CSSStyleSheet} CSSStyleSheet
         * @return {Array|false}
        */
        
        function __evalCSSStyleSheet (CSSStyleSheet)
        {
            var rules;
            
            // Return false in case of CORS or if the style sheet is not completely loaded.
            if (!CSSStyleSheet.cssRules && !CSSStyleSheet.rules)
                return false;
            
            rules = __parseCSSStyleSheet(CSSStyleSheet);
            
            if (!rules)
                return false;
            
            for (var i = 0, l = rules.length; i < l; i++)
                __appendCSSAsyncLink(rules[i].url, rules[i].media);
            
            return rules;
        }
        
        // INITIALIZER.
        function __init ()
        {
            for (var i = 0, l = w.document.styleSheets.length; i < l; i++)
                __evalCSSStyleSheet(w.document.styleSheets[i]);
        }
        w.addEventListener("DOMContentLoaded", __init);
        
        // PUBLIC CONTEXT.
        return e;
    }

(window, {}));