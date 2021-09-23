const getCommandLine = (optionsDescription: any, description: any, cmd: any): Object[] => {
  if (Array.isArray(optionsDescription)) return optionsDescription;

  const options: Object[] = [];

  const optionDescritions = Object.keys(optionsDescription);
  if (!optionDescritions.length) return options;

  optionDescritions.forEach((option) => {
    const optionItemConfig = optionsDescription[option];
    const optionDescritionItem = getOptionItem(optionItemConfig, option);
    options.push(optionDescritionItem);
  });

  return [
    {
      header: `fef ${cmd}`,
      content: description,
    },
    {
      header: 'Usage',
      content: `$ fef ${cmd} [options]`,
    },
    {
      header: 'Options',
      optionList: options,
    },
  ];
};

const getOptionItem = (optionItemConfig: any, option: any): object => {
  let optionItemConfigCopy: any = {};
  if (typeof optionItemConfig === 'string') {
    optionItemConfigCopy = {
      name: option,
      description: optionItemConfig,
    };
  } else {
    optionItemConfigCopy = {...optionItemConfig};
    if (!optionItemConfigCopy.name) {
      optionItemConfigCopy.name = option;
    }
    optionItemConfigCopy.type = typeof optionItemConfig.type === 'function' ? optionItemConfig.type : String;
  }
  return optionItemConfigCopy;
};

export default getCommandLine;
