
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
                    .push(data);
                    //.push(new Student(data.Id, data.FirstName, data.LastName, data.Gender, data.Phone));

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

    self.readonlyTemplate = ko.observable("readonlyTemplate");
    self.editTemplate = ko.observable();

    // ����� ������� ��������������
    self.currentTemplate = function (tmpl) {
        return tmpl === self.editTemplate() ? 'editTemplate' : self.readonlyTemplate();
    }.bind(viewModel);

    // ����� ������� �� �������
    self.resetTemplate = function (t) {
        self.editTemplate("readonlyTemplate");
    };

    // ������������ ��������� � ������ ���������
    self.students = ko.observableArray();

    // ������ ���������
    self.getStudents = function () {
        self.students.removeAll();

        // �������� ������ ��������� � �������
        $.getJSON('/home/GetStudents', function (data) {
            //$.each(data, function (key, value) {
            //    self.students.push(new Student(value.Id, value.FirstName, value.LastName, value.Gender, value.Phone));
            //});
            self.students(data);
        });
    };

    // �������� �������� �� ������
    self.removeStudent = function (student) {
        $.ajax({
            url: '/home/DeleteStudent/' + student["Id"],
            type: 'post',
            contentType: 'application/json',
            success: function () {
                self.students.remove(student);
            }
        });
    };

    // �������������� ��������
    self.saveChanges = function (data) {

        var student = {
            Id: data.Id,
            FirstName: data.FirstName,
            LastName: data.LastName,
            Gender: data.Gender,
            Phone: data.Phone
        };
        
        $.ajax({
            url: '/home/EditStudent',
            type: 'post',
            data: student,
            success: function (data) {
                self.resetTemplate();
            },
            error: function (err) {
                console.log(err);
            }
        });
    };

    // ���������
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

    // ����������
    self.sortType = "ascending";
    self.currentColumn = ko.observable("");
    self.iconType = ko.observable("");

    self.sortTable = function (students, e) {
        var orderProp = $(e.target).attr("data-column")
        self.currentColumn(orderProp);
        self.students.sort(function (left, right) {
            leftVal = left[orderProp];
            rightVal = right[orderProp];
            if (self.sortType == "ascending") {
                return leftVal < rightVal ? 1 : -1;
            }
            else {
                return leftVal > rightVal ? 1 : -1;
            }
        });
        // ����� ������
        self.sortType = (self.sortType == "ascending") ? "descending" : "ascending";
        self.iconType((self.sortType == "ascending") ? "glyphicon glyphicon-chevron-up" : "glyphicon glyphicon-chevron-down");
    };
}

$(document).ready(function () {
    // �������� ������
    ko.applyBindings(viewModel);

    // �������� ������ ���������
    viewModel.paginationViewModel.getStudents();
});