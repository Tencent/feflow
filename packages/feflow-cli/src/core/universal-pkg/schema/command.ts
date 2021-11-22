import { execSync } from 'child_process';
import Feflow from '@/core';
import { platformType, toArray } from './base';

const valRegexp = new RegExp('\\${var:.*?}', 'ig');

function getVal(symbol: string): string {
  return symbol.substring('${var:'.length, symbol.length - 1);
}

type GlobalVal = {
  pd?: string;
};

export class Command {
  private val: GlobalVal = {};

  private ctx: Feflow;

  private readonly default: string[];

  private readonly macos: string[];

  private readonly linux: string[];

  private readonly windows: string[];

  constructor(ctx: Feflow, pluginPath: string, command: any) {
    this.val.pd = pluginPath;
    this.default = toArray(command?.default, 'default');
    this.macos = toArray(command?.macos, 'macos', this.default);
    this.linux = toArray(command?.linux, 'linux', this.default);
    this.windows = toArray(command?.windows, 'windows', this.default);
    this.ctx = ctx;
  }

  getCommands(): string[] {
    const commands = this[platformType];
    return commands.map((command) => {
      if (!command) {
        throw new Error(`invalid command: [${command}]`);
      }
      return command.replace(valRegexp, (match) => {
        const v = getVal(match);
        if (this.val[v] !== undefined) {
          return this.val[v];
        }
        throw new Error(`global variable [${v}] not currently supported`);
      });
    });
  }

  run(...args: string[]) {
    const commands = this.getCommands();
    for (let command of commands) {
      if (args && args.length > 0) {
        command = `${command} ${args.join(' ')}`;
      }
      execSync(command, {
        stdio: 'inherit',
        windowsHide: true,
      });
    }
  }

  // exception not thrown
  runLess() {
    const commands = this.getCommands();
    for (const command of commands) {
      try {
        execSync(command, {
          stdio: 'inherit',
          windowsHide: true,
        });
      } catch (e) {
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
      throw new Error(`no command was found for the ${platformType} system`);
    }
  }
}
