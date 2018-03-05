/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
    "use strict";
    var xml2js = require('xml2js');
    var parseString = xml2js.parseString;
    var processors = xml2js.processors;

    function XMLNode(n) {
        RED.nodes.createNode(this, n);
        this.attrkey = n.attr;
        this.charkey = n.chr;
        this.ignoreAttrs = n.ignoreAttrs;
        this.explicitRoot = n.explicitRoot;
        this.explicitArray = n.explicitArray;
        this.tagNameProcessors = [];
        if (n.tagNameProcessorsNormalize) {
            this.tagNameProcessors.push("normalize");
        }
        if (n.tagNameProcessorsFirstCharLowerCase) {
            this.tagNameProcessors.push("firstCharLowerCase");
        }
        if (n.tagNameProcessorsStripPrefix) {
            this.tagNameProcessors.push("stripPrefix");
        }
        if (n.tagNameProcessorsParseNumbers) {
            this.tagNameProcessors.push("parseNumbers");
        }
        if (n.tagNameProcessorsParseBooleans) {
            this.tagNameProcessors.push("parseBooleans");
        }
        this.attrNameProcessors = [];
        if (n.attrNameProcessorsNormalize) {
            this.attrNameProcessors.push("normalize");
        }
        if (n.attrNameProcessorsFirstCharLowerCase) {
            this.attrNameProcessors.push("firstCharLowerCase");
        }
        if (n.attrNameProcessorsStripPrefix) {
            this.attrNameProcessors.push("stripPrefix");
        }
        if (n.attrNameProcessorsParseNumbers) {
            this.attrNameProcessors.push("parseNumbers");
        }
        if (n.attrNameProcessorsParseBooleans) {
            this.attrNameProcessors.push("parseBooleans");
        }
        this.valueProcessors = [];
        if (n.valueProcessorsNormalize) {
            this.valueProcessors.push("normalize");
        }
        if (n.valueProcessorsFirstCharLowerCase) {
            this.valueProcessors.push("firstCharLowerCase");
        }
        if (n.valueProcessorsStripPrefix) {
            this.valueProcessors.push("stripPrefix");
        }
        if (n.valueProcessorsParseNumbers) {
            this.valueProcessors.push("parseNumbers");
        }
        if (n.valueProcessorsParseBooleans) {
            this.valueProcessors.push("parseBooleans");
        }
        this.attrValueProcessors = [];
        if (n.attrValueProcessorsNormalize) {
            this.attrValueProcessors.push("normalize");
        }
        if (n.attrValueProcessorsFirstCharLowerCase) {
            this.attrValueProcessors.push("firstCharLowerCase");
        }
        if (n.attrValueProcessorsStripPrefix) {
            this.attrValueProcessors.push("stripPrefix");
        }
        if (n.attrValueProcessorsParseNumbers) {
            this.attrValueProcessors.push("parseNumbers");
        }
        if (n.attrValueProcessorsParseBooleans) {
            this.attrValueProcessors.push("parseBooleans");
        }

        var node = this;
        this.on("input", function(msg) {
            if (msg.hasOwnProperty("payload")) {
                var options;
                if (typeof msg.payload === "object") {
                    options = { renderOpts: { pretty: false } };
                    if (msg.hasOwnProperty("options") && typeof msg.options === "object") { options = msg.options; }
                    options.async = false;
                    var builder = new xml2js.Builder(options);
                    msg.payload = builder.buildObject(msg.payload, options);
                    node.send(msg);
                } else if (typeof msg.payload == "string") {
                    options = {};
                    if (msg.hasOwnProperty("options") && typeof msg.options === "object") { options = msg.options; }
                    options.async = true;
                    options.attrkey = node.attrkey || options.attrkey || '$';
                    options.charkey = node.charkey || options.charkey || '_';
                    options.ignoreAttrs = node.ignoreAttrs || options.ignoreAttrs || false;
                    options.explicitRoot = node.explicitRoot || options.explicitRoot || false;
                    options.explicitArray = node.explicitArray || options.explicitArray || false;
                    options.tagNameProcessors = node.tagNameProcessors || options.tagNameProcessors || '';
                    options.attrNameProcessors = node.attrNameProcessors || options.attrNameProcessors || '';
                    options.valueProcessors = node.valueProcessors || options.valueProcessors || '';
                    options.attrValueProcessors = node.attrValueProcessors || options.attrValueProcessors || '';

                    let processorsList = ["normalize", "firstCharLowerCase", "stripPrefix", "parseNumbers", "parseBooleans"]

                    if (options.tagNameProcessors && Array.isArray(options.tagNameProcessors)) {
                        options.tagNameProcessors.forEach(function(value, key) {

                            if (typeof value == "string" && processorsList.indexOf(value) > -1) {
                                options.tagNameProcessors[key] = processors[value];
                            }
                        })
                    }
                    if (options.attrNameProcessors && Array.isArray(options.attrNameProcessors)) {
                        options.attrNameProcessors.forEach(function(value, key) {

                            if (typeof value == "string" && processorsList.indexOf(value) > -1) {
                                options.attrNameProcessors[key] = processors[value];
                            }
                        })
                    }
                    if (options.valueProcessors && Array.isArray(options.valueProcessors)) {
                        options.valueProcessors.forEach(function(value, key) {

                            if (typeof value == "string" && processorsList.indexOf(value) > -1) {
                                options.valueProcessors[key] = processors[value];
                            }
                        })
                    }
                    if (options.attrValueProcessors && Array.isArray(options.attrValueProcessors)) {
                        options.attrValueProcessors.forEach(function(value, key) {

                            if (typeof value == "string" && processorsList.indexOf(value) > -1) {
                                options.attrValueProcessors[key] = processors[value];
                            }
                        })
                    }

                    parseString(msg.payload, options, function(err, result) {
                        if (err) { node.error(err, msg); } else {
                            msg.payload = result;
                            node.send(msg);
                        }
                    });
                } else { node.warn(RED._("xml2js.errors.xml_js")); }
            } else { node.send(msg); } // If no payload - just pass it on.
        });
    }
    RED.nodes.registerType("xml2js", XMLNode);
}