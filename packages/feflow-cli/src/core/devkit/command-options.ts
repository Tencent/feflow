import { CmdObj } from '../commander';

type Options = Required<CmdObj>['options'];
type Description = CmdObj['desc'];
const getCommandLine = (
  optionsDescription: Options | Record<string, object>,
  description: Description,
  cmd: string,
) => {
  if (Array.isArray(optionsDescription)) return optionsDescription;

  const options: Object[] = [];

  const optionDescriptions = Object.keys(optionsDescription);
  if (!optionDescriptions.length) return options;

  optionDescriptions.forEach((option) => {
    const optionItemConfig = optionsDescription[option];
    const optionDescriptionItem = getOptionItem(optionItemConfig, option);
    options.push(optionDescriptionItem);
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

const getOptionItem = (optionItemConfig: AnyObject | string, option: string) => {
  let optionItemConfigCopy: AnyObject;
  if (typeof optionItemConfig === 'string') {
    optionItemConfigCopy = {
      name: option,
      description: optionItemConfig,
    };
  } else {
    optionItemConfigCopy = { ...optionItemConfig };
    if (!optionItemConfigCopy.name) {
      optionItemConfigCopy.name = option;
    }
    optionItemConfigCopy.type = typeof optionItemConfig.type === 'function' ? optionItemConfig.type : String;
  }
  return optionItemConfigCopy;
};

export default getCommandLine;
