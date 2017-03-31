
var viewModel = {
    addStudentViewModel: new Student(),
    paginationViewModel: new Pagination()
};



// ������ ���������
function Student(id, firstName, lastName, gender, phone) {
    var self = this;

    // ������������ ���������
    self.Id = ko.observable(id);
    self.FirstName = ko.observable(firstName);
    self.LastName = ko.observable(lastName);
    
    self.Phone = ko.observable(phone);
    self.Gender = ko.observable(gender);

    // ������ �����
    self.genders = [
        "Male",
        "Female",
        "Other"
    ];

    // ���������� ��������
    self.addStudent = function () {
        var dataObject = ko.toJSON(this);

        $.ajax({
            url: '/home/AddStudent',
            type: 'post',
            data: dataObject,
            contentType: 'application/json',
            success: function (data) {
                viewModel.paginationViewModel.students
                    .push(new Student(data.Id, data.FirstName, data.LastName, data.Gender, data.Phone));

                self.Id(null);
                self.FirstName('');
                self.LastName('');
                self.Phone('');
            }
        });
    };
}

// ������������ ����� ������ ���������
function Pagination() {
    var self = this;

    // ������������ ��������� � ������ ���������
    self.students = ko.observableArray([]);

    // ������ ���������
    self.getStudents = function () {
        self.students.removeAll();

        // �������� ������ ��������� � �������
        $.getJSON('/home/GetStudents', function (data) {
            $.each(data, function (key, value) {
                self.students.push(new Student(value.Id, value.FirstName, value.LastName, value.Gender, value.Phone));
            });
        });
    };

    // �������� �������� �� ������
    self.removeStudent = function (student) {
        $.ajax({
            url: '/home/DeleteStudent/' + student.Id(),
            type: 'post',
            contentType: 'application/json',
            success: function () {
                self.students.remove(student);
            }
        });
    };

    self.currentPage = ko.observable();
    self.pageSize = ko.observable(5);
    self.currentPageIndex = ko.observable(0);

    self.currentPage = ko.computed(function () {
        var pagesize = parseInt(self.pageSize(), 10),
        startIndex = pagesize * self.currentPageIndex(),
        endIndex = startIndex + pagesize;
        return self.students.slice(startIndex, endIndex);
    });
    self.nextPage = function () {
        if (((self.currentPageIndex() + 1) * self.pageSize()) < self.students().length) {
            self.currentPageIndex(self.currentPageIndex() + 1);
        }
        else {
            self.currentPageIndex(0);
        }
    };
    self.previousPage = function () {
        if (self.currentPageIndex() > 0) {
            self.currentPageIndex(self.currentPageIndex() - 1);
        }
        else {
            self.currentPageIndex((Math.ceil(self.students().length / self.pageSize())) - 1);
        }
    };
}

$(document).ready(function () {
    // �������� ������
    ko.applyBindings(viewModel);

    // �������� ������ ���������
    viewModel.paginationViewModel.getStudents();
});