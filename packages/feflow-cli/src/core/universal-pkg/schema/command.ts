import { platformType, toArray } from './base';
import { execSync } from 'child_process';

const valRegexp = new RegExp('\\${var:.*?}', 'ig');

function getVal(symbol: string): string {
  return symbol.substring('${var:'.length, symbol.length - 1);
}

type globalVal = {
  pd: string | undefined;
};

export class Command {

  private val: globalVal = {} as globalVal;

  private ctx: any;

  private default: string[];

  private macos: string[];

  private linux: string[];

  private windows: string[];

  constructor(ctx: any, pluginPath: string, command: any) {
    this.val.pd = pluginPath;
    this.default = toArray(command?.default, 'default');
    this.macos = toArray(command?.macos, 'macos', this.default);
    this.linux = toArray(command?.linux, 'linux', this.default);
    this.windows = toArray(command?.windows, 'windows', this.default);
    this.ctx = ctx;
  }

  getCommands(): string[] {
    const commands = this[platformType] as string[];
    return commands.map((c) => {
      if (!c || typeof c !== 'string') {
        throw `invalid command: [${c}]`;
      }
      return c.replace(valRegexp, (match) => {
        const v = getVal(match);
        if (this.val[v] !== undefined) {
          return this.val[v];
        }
        throw `global variable [${v}] not currently supported`;
      });
    });
  }

  run(...args: string[]) {
    const commands = this.getCommands();
    for (let command of commands) {
      if (args && args.length > 0) {
        command = `${command} ${args.join(' ')}`;
      }
      try {
        execSync(command, {
          stdio: 'inherit'
        });
      } catch(e) {
        this.ctx.logger.debug(e);
        this.ctx.logger.error(`[command interrupt] ${e}`);
        return;
      }
    }
  }

  check() {
    let commands: string[];
    switch (platformType) {
      case 'windows':
        commands = this.windows;
        break;
      case 'linux':
        commands = this.linux;
        break;
      case 'macos':
        commands = this.macos;
        break;
      default:
        commands = [];
    }
    if (commands.length === 0) {
      throw `no command was found for the ${platformType} system`;
    }
  }
}
