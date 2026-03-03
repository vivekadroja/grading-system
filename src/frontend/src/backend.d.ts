import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Mark {
    studentId: string;
    score: number;
    subjectId: string;
    examType: string;
}
export interface Subject {
    name: string;
    subjectId: string;
}
export interface Student {
    contact: string;
    studentId: string;
    name: string;
    className: string;
}
export enum UserRole {
    admin = "admin",
    faculty = "faculty",
    student = "student"
}
export interface backendInterface {
    addMark(studentId: string, subjectId: string, score: number, examType: string): Promise<void>;
    addStudent(id: string, name: string, className: string, contact: string): Promise<void>;
    addSubject(id: string, name: string): Promise<void>;
    addUser(username: string, password: string, role: UserRole): Promise<void>;
    getStudentMarks(studentId: string): Promise<Array<Mark>>;
    getTotalStudents(): Promise<bigint>;
    listStudents(): Promise<Array<Student>>;
    listSubjects(): Promise<Array<Subject>>;
    login(username: string, password: string): Promise<UserRole>;
}
