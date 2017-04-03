using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KnockoutTable.Models
{
    public class StudentRepository
    {
        public static List<Student> StudentList = new List<Student>()
        {
            new Student() { Id=1,FirstName="Andrew",LastName="Andrew",Gender="Male",Phone="12345" },
            new Student() { Id=2,FirstName="Robert",LastName="Robert",Gender="Female",Phone="34567" },
            new Student() { Id=3,FirstName="Peter",LastName="Peter",Gender="Other",Phone="45678" },
            new Student() { Id=4,FirstName="Andrew",LastName="Andrew",Gender="Male",Phone="12345" },
            new Student() { Id=5,FirstName="Robert",LastName="Robert",Gender="Female",Phone="34567" },
            new Student() { Id=6,FirstName="Peter",LastName="Peter",Gender="Other",Phone="45678" },
            new Student() { Id=7,FirstName="Andrew",LastName="Andrew",Gender="Male",Phone="12345" },
            new Student() { Id=8,FirstName="Robert",LastName="Robert",Gender="Female",Phone="34567" },
            new Student() { Id=9,FirstName="Peter",LastName="Peter",Gender="Other",Phone="45678" },
            new Student() { Id=10,FirstName="Andrew",LastName="Andrew",Gender="Male",Phone="12345" },
            new Student() { Id=11,FirstName="Robert",LastName="Robert",Gender="Female",Phone="34567" },
            new Student() { Id=12,FirstName="Peter",LastName="Peter",Gender="Other",Phone="45678" },
            new Student() { Id=13,FirstName="Andrew",LastName="Andrew",Gender="Male",Phone="12345" },
            new Student() { Id=14,FirstName="Robert",LastName="Robert",Gender="Female",Phone="34567" },
            new Student() { Id=15,FirstName="Peter",LastName="Peter",Gender="Other",Phone="45678" }
        };

        public static List<Student> GetStudents()
        {
            return StudentList;
        }

        public static void InsertStudent(Student student)
        {
            student.Id = StudentList.Count + 1;
            StudentList.Add(student);
        }
        
        public static void EditStudent(Student model)
        {
            var student = StudentList.FirstOrDefault(x => x.Id == model.Id);
            student.FirstName = model.FirstName;
            student.LastName = model.LastName;
            student.Gender = model.Gender;
            student.Phone = model.Phone;
        }

        public static void DeleteStudent(int studentId)
        {
            var student = StudentList.FirstOrDefault(x => x.Id == studentId);

            if (student != null)
            {
                StudentList.Remove(student);
            }
        }
    }
}