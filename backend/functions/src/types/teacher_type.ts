import { User } from "./user_interface";

type Teacher = User & {
    classId : number,
    role: 'teacher',
    Class: string[],
}