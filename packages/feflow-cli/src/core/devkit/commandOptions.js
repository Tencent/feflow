"use strict";
exports.__esModule = true;
var getCommandLine = function (optionsDescription, description, cmd) {
    if (Array.isArray(optionsDescription))
        return optionsDescription;
    var options = [];
    var optionDescritions = Object.keys(optionsDescription);
    if (!optionDescritions.length)
        return options;
    optionDescritions.forEach(function (option) {
        var optionItemConfig = optionsDescription[option];
        var optionDescritionItem = getOptionItem(optionItemConfig, option);
        options.push(optionDescritionItem);
    });
    return [
        {
            header: "fef " + cmd,
            content: description
        },
        {
            header: 'Usage',
            content: "$ fef " + cmd + " [options]"
        },
        {
            header: 'Options',
            optionList: options
        }
    ];
};
var getOptionItem = function (optionItemConfig, option) {
    var optionDescritionItem = {};
    if (typeof optionItemConfig == 'string') {
        optionDescritionItem = {
            name: option,
            description: optionItemConfig
        };
    }
    else {
        if (!optionItemConfig.name) {
            optionItemConfig.name = option;
        }
        optionDescritionItem = optionItemConfig;
        optionDescritionItem.type =
            typeof optionItemConfig.type === 'function'
                ? optionItemConfig.type
                : String;
    }
    return optionDescritionItem;
};
exports["default"] = getCommandLine;
//# sourceMappingURL=commandOptions.js.map