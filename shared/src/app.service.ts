import { Injectable, OnModuleInit } from '@nestjs/common';


@Injectable()
export class AppService implements OnModuleInit {
 
  onModuleInit() {
    console.log(`The module has been initialized.`);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
