import { Teacher } from './../untils/schemas/teacher.schema';
import { Room } from './../untils/schemas/room.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Class, Subject } from 'src/untils/schemas';
import { Model } from 'mongoose';
import { ClassDTO } from './dto/class.dto';
import { UpdateClassDTO } from './dto/updateClass.dto';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel('Class') private readonly classModel: Model<Class>,
    @InjectModel('Subject') private readonly subjectModel: Model<Subject>,
    @InjectModel('Teacher') private readonly teacherModel: Model<Teacher>,
    @InjectModel('Room') private readonly roomModel: Model<Room>,
  ) {}

  async addClass(newClass: ClassDTO) {
    const class1 = new this.classModel({
      id_class: newClass.id_class,
      id_subject: newClass.id_subject,
      id_teacher: newClass.id_teacher,
      id_room: newClass.id_room,
      limit_student: newClass.limit_student,
      current_student: newClass.current_student,
      class_name: newClass.class_name,
    });

    await class1.save();
    const result = await this.classModel
      .find()
      .populate('id_teacher')
      .populate('id_room')
      .populate('id_subject');
    return result;
  }

  async updateClass(updateClass: UpdateClassDTO) {
    const class1 = await this.classModel.findById(updateClass.id);

    await class1.updateOne({
      $set: {
        id_class: updateClass.id_class,
        id_subject: updateClass.id_subject,
        id_teacher: updateClass.id_teacher,
        id_room: updateClass.id_room,
        limit_student: updateClass.limit_student,
        current_student: updateClass.current_student,
        class_name: updateClass.class_name,
      },
    });

    const result = await this.classModel
      .find()
      .populate('id_teacher')
      .populate('id_room')
      .populate('id_subject');
    return result;
  }

  async deleteClass(id: any) {
    await this.classModel.findByIdAndDelete(id.id_class);
    const result = await this.classModel
      .find()
      .populate('id_teacher')
      .populate('id_room')
      .populate('id_subject');
    return result;
  }
}
