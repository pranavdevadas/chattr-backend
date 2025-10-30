import { Container } from "inversify";
import "reflect-metadata";

import { IUserService } from "../interface/user/IUserService";
import { UserService } from "../service/userService";
import { IUserRepository } from "../interface/user/IUserRepository";
import { UserRepository } from "../repository/userRepository";
import { UserController } from "../controller/userController";

import { IMessageService } from "../interface/message/IMessageService";
import { messageService } from "../service/messageService";
import { IMessageRepository } from "../interface/message/IMessageRepository";
import { MessageRepository } from "../repository/messageRepository";
import { MessageController } from "../controller/messageController";

const container = new Container();

container.bind<IUserRepository>("IUserRepository").to(UserRepository).inSingletonScope();
container.bind<IUserService>("IUserService").to(UserService).inSingletonScope();
container.bind<UserController>("UserController").to(UserController).inSingletonScope();

container.bind<IMessageRepository>('IMessageRepository').to(MessageRepository).inSingletonScope()
container.bind<IMessageService>('IMessageService').to(messageService).inSingletonScope()
container.bind<MessageController>('MessageController').to(MessageController).inSingletonScope()

export { container };
