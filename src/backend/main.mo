import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";

actor {
  type Student = {
    studentId : Text;
    name : Text;
    className : Text;
    contact : Text;
  };

  type Subject = {
    subjectId : Text;
    name : Text;
  };

  type Mark = {
    studentId : Text;
    subjectId : Text;
    score : Float;
    examType : Text;
  };

  type UserRole = {
    #admin;
    #faculty;
    #student;
  };

  type User = {
    username : Text;
    password : Text;
    role : UserRole;
  };

  // Persistent state
  let students = Map.empty<Text, Student>();
  let subjects = Map.empty<Text, Subject>();
  let marks = Map.empty<Text, [Mark]>();
  let users = Map.empty<Text, User>();

  public shared ({ caller }) func addUser(username : Text, password : Text, role : UserRole) : async () {
    if (users.containsKey(username)) {
      Runtime.trap("User already exists");
    };
    users.add(username, { username; password; role });
  };

  public shared ({ caller }) func login(username : Text, password : Text) : async UserRole {
    switch (users.get(username)) {
      case (null) { Runtime.trap("Invalid credentials") };
      case (?user) {
        if (user.password == password) {
          user.role;
        } else {
          Runtime.trap("Invalid credentials");
        };
      };
    };
  };

  public shared ({ caller }) func addStudent(id : Text, name : Text, className : Text, contact : Text) : async () {
    if (students.containsKey(id)) {
      Runtime.trap("Student already exists");
    };
    students.add(id, { studentId = id; name; className; contact });
  };

  public query ({ caller }) func listStudents() : async [Student] {
    students.values().toArray();
  };

  public shared ({ caller }) func addSubject(id : Text, name : Text) : async () {
    if (subjects.containsKey(id)) {
      Runtime.trap("Subject already exists");
    };
    subjects.add(id, { subjectId = id; name });
  };

  public query ({ caller }) func listSubjects() : async [Subject] {
    subjects.values().toArray();
  };

  public shared ({ caller }) func addMark(studentId : Text, subjectId : Text, score : Float, examType : Text) : async () {
    if (not students.containsKey(studentId)) {
      Runtime.trap("Student does not exist");
    };
    if (not subjects.containsKey(subjectId)) {
      Runtime.trap("Subject does not exist");
    };
    let newMark = { studentId; subjectId; score; examType };
    let studentMarks = switch (marks.get(studentId)) {
      case (null) { [] };
      case (?existingMarks) { existingMarks };
    };
    marks.add(studentId, studentMarks.concat([newMark]));
  };

  public query ({ caller }) func getStudentMarks(studentId : Text) : async [Mark] {
    switch (marks.get(studentId)) {
      case (null) { [] };
      case (?studentMarks) { studentMarks };
    };
  };

  public query ({ caller }) func getTotalStudents() : async Nat {
    students.size();
  };
};
