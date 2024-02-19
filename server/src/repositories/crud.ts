import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CrudRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const created = new this.model(data);
    return created.save() as T;
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<T> {
    return this.model.findOne({ id: id }).exec();
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return this.model.findOneAndUpdate({ id: id }, data).exec();
  }

  async delete(id: string): Promise<T> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
