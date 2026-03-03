import type {
  Mark,
  Student,
  Subject,
  UserRole,
  backendInterface,
} from "../backend.d";

// These functions accept the actor as a parameter so they can be used with useActor
export async function loginUser(
  actor: backendInterface,
  username: string,
  password: string,
): Promise<UserRole> {
  return actor.login(username, password);
}

export async function addStudent(
  actor: backendInterface,
  id: string,
  name: string,
  className: string,
  contact: string,
): Promise<void> {
  return actor.addStudent(id, name, className, contact);
}

export async function listStudents(
  actor: backendInterface,
): Promise<Student[]> {
  return actor.listStudents();
}

export async function listSubjects(
  actor: backendInterface,
): Promise<Subject[]> {
  return actor.listSubjects();
}

export async function addSubject(
  actor: backendInterface,
  id: string,
  name: string,
): Promise<void> {
  return actor.addSubject(id, name);
}

export async function addMark(
  actor: backendInterface,
  studentId: string,
  subjectId: string,
  score: number,
  examType: string,
): Promise<void> {
  return actor.addMark(studentId, subjectId, score, examType);
}

export async function getStudentMarks(
  actor: backendInterface,
  studentId: string,
): Promise<Mark[]> {
  return actor.getStudentMarks(studentId);
}

export async function getTotalStudents(
  actor: backendInterface,
): Promise<bigint> {
  return actor.getTotalStudents();
}
