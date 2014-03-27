//define User and Student

exports.User = function(firstName, lastName, userId, emailAddress, isAccountValid, password, isLoggedIn, privilegeLevel) 
{
    this.firstName = firstName;
    this.lastName = lastName;
    this.userId = userId;
    this.emailAddress = emailAddress;
    this.isAccountValid = isAccountValid;
    this.password = password;
    this.isLoggedIn = isLoggedIn;
    this.privilegeLevel = privilegeLevel;
};

exports.Student = function(firstName, lastName, userId, emailAddress, isAccountValid, password, isLoggedIn, privilegeLevel, studentId, coursesRemaining, coursesCompleted, scheduleFavorites, gpa, creditsCompleted, studentStatus, dateAdmitted)
{
	exports.User.call(this, firstName, lastName, userId, emailAddress, isAccountValid, password, isLoggedIn, privilegeLevel);
    this.studentId = studentId;
    this.coursesRemaining = coursesRemaining;
    this.coursesCompleted = coursesCompleted;
    this.scheduleFavorites = scheduleFavorites;
    this.gpa = gpa;
    this.creditsCompleted = creditsCompleted;
    this.studentStatus = studentStatus;
    this.dateAdmitted = dateAdmitted;
};

exports.Student.prototype = new exports.User();

//Student (according to the class diagram from Deliverable 2) will need the following:
//addConstraint
//deleteConstraint
//addScheduleFavorites
//deleteScgeduleFavorites
