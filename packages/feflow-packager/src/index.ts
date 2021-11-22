import { packCLI } from './tarball';

export default class Packager {
  private cmd: string;
  constructor(cmd: string) {
    this.cmd = cmd;
  }

  public pack() {
    switch (this.cmd) {
      case 'mac':
        this.packMac();
        break;
    }
  }

  private async packMac() {
    const tarballPath = await packCLI();

    console.log('tarballPath', tarballPath);
  }
}
