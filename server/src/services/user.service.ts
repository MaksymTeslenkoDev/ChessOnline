import { Injectable } from '@nestjs/common';
import { generateUID } from 'src/helpers';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async connect(uuid: string | undefined) {
    try {
      if (!uuid) {
        uuid = generateUID();
        const user = await this.userRepository.create({ id: uuid });
        return {
          status: 'success',
          message: 'User connected',
          data: { user },
        };
      }
      let user = await this.userRepository.findOne(uuid);
      if (!user) {
        uuid = generateUID();
        user = await this.userRepository.create({ id: uuid });
      }

      return {
        status: 'success',
        message: 'User connected',
        data: { user },
      };
    } catch (e) {
      return {
        status: 'error',
        message: e.message,
      };
    }
  }
}
