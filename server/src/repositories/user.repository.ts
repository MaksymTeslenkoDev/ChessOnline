import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { CrudRepository } from './crud';
import { User, UserDocument } from 'src/schemas/User';

@Injectable()
export class UserRepository extends CrudRepository<UserDocument> {
  private userModel: Model<UserDocument>;
  constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
    super(userModel);
    this.userModel = userModel;
  }

  // async findOne(id: string): Promise<UserDocument> {
  //   return this.userModel.findOne({ uuid: id }).exec();
  // }
}
