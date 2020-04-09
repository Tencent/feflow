const getOptionFromCommand = (optionsDescription: any): Object[] => {
  if(Array.isArray(optionsDescription)) return optionsDescription;

  const options: Object[] = [];

  const optionDescritions = Object.keys(optionsDescription);
  if (!optionDescritions.length) return options;

  optionDescritions.forEach(option => {
    let optionItemConfig = optionsDescription[option];
    const optionDescritionItem = getOptionItem(optionItemConfig, option);
    options.push(optionDescritionItem);
  });

  return options;
};

const getOptionItem = (optionItemConfig: any, option: any): object => {
  let optionDescritionItem: any = {};
  if (typeof optionItemConfig == 'string') {
    optionDescritionItem = {
      name: option,
      description: optionItemConfig,
    };
  } else {
    if (!optionItemConfig.name) {
      optionItemConfig.name = option;
    }

    optionDescritionItem = optionItemConfig;
    optionDescritionItem.type = String;
  }
  return optionDescritionItem;
};

export default getOptionFromCommand;
