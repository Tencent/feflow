// NOTE
// CommandPicker是一个中间层，接收到当前用户执行的命令后，注册对应的执行器，并执行。

// 维护一套命令和插件路径的映射文件.feflowCache，命令被激活后才注册，然后调用。

// .feflowCache 存命令和对应插件路径的映射关系
// 下指配置文件

export default class CommandPicker {
  commandMap: any;
  root: string;
  // 当前picker是否可用, 第一次使用时是不可用的
  isAvailable: boolean;

  constructor(ctx: any) {
    this.commandMap = {};
    this.root = ctx.root;
    this.isAvailable = false;

    this.init();
  }

  // 第一次执行时，需要将commander中的store的信息写入配置文件
  init() {
    this.getCommandMap()
    if(this.commandMap.commandPickerMap) {
        
    }
  }

  // 检查配置文件并更新
  async checkValidAndUpdate() {}

  // 从配置文件中获取到当前命令的插件路径，然后注册进入commander
  pickCommand(cmd: string) {}

  // 获取配置文件
  getCommandMap() {

  }
}

const config = {
    commandPickerMap: {
        help: "./source",
        version: "./source",
        list: "./source",
    }
}