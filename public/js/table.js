/* 

	
		“course” : ”SOEN341”,
		“title” : “Software Process”,
		“type” : “lecture”,
		“section” : “S”,
		“days”:“W,F”,
		“start” : 8.75,
		“end”: 10.00,
		“prof”: “Sutharsan Sivagnanam”,
		“room”: “H-820”
		}, ...
 *	
 *	
 *	
 */
var counter = 0;

function Table(startHour, endHour, hourIncrement, numOfDays, startingDay) {
    //----------------------------------------
    //		Variable declaration
    //----------------------------------------
    this.tableId = counter++;
    this.rows = [];
    this.startHour = startHour;
    this.endHour = endHour;
    this.hourIncrement = hourIncrement;
    this.table = $('<table/>').attr("id", "ScheduleTableId" + this.tableId).attr("cellspacing", "1");
    var baseDayArray = ['M', 'T', 'W', 'J', 'F', 'S', 'D'];
    this.currentDaySequence = [];
    this.numRows = 0;
    this.numCols = 0;


    //----------------------------------------
    //			Parsers/Converters
    //----------------------------------------

    /* 	GetDayFromChar(charDay)
     *		Takes a character representing a day and returns the full
     *		name of the day ( 'M' -> 'Monday')
     *
     *	@param charDay 		A character within the range of ['M','T','W','J','F','S','D']
     *
     *	@return fullday		Full name of the day
     */
    this.GetDayFromChar = function GetDayFromChar(charDay) {
        switch (charDay) {
        case 'M':
            return "Monday";
        case 'T':
            return "Tuesday";
        case 'W':
            return "Wednesday";
        case 'J':
            return "Thurdsay";
        case 'F':
            return "Friday";
        case 'S':
            return "Saturday";
        case 'D':
            return "Sunday";
        }
    }

    /*  GetRowFromTime(time)
     *		Takes a time of the form hours.percent_of_hour and returns
     *		the integer represent the time's position in the table.
     *
     * @param	time	A time in the format of hours.percent_of_hour
     *
     * @return	index	Position in the schedule table
     * @error	-1		time is not a valid time.
     */
    this.GetRowFromTime = function GetRowFromTime(time) {
        var hours = Math.floor(time);
        var percent_of_hour = time - hours;
        percent_of_hour *= 60;

        //check if time is within valid range
        if (time - this.startHour < 0 || this.endHour - time < 0) {
            return -1;
        }

        var index = Math.floor((time - startHour) / incrementFactor);
        return index - 1;
    }


    /*  GetCellStringId(row,col)
     *		Takes the row and column number of a table cell and
     *		returns the corresponding cell's ID attribute.
     *
     * @param	row	 The row number
     * @param	col	 The column number
     *
     * @return string	The cell's ID attribute.
     */
    this.GetCellStringId = function GetCellStringId(row, col) {
        return "ScheduleTableId" + this.tableId + "_" + row + "_" + col;
    }


    /*  GetColFromDay(day)
     *		Takes a character representing a day of the week and returns its
     *		corresponding column index in the table
     *
     * @param	day	 A character within the domain of ['M','T','W','J','F','S','D'].
     *
     * @return Index	The corresponsing column index.
     * @error 	-1		The corresponding day does not exists.
     */
    this.GetColFromDay = function GetColFromDay(day) {
        for (var i = 0; i < this.currentDaySequence.length; ++i) {
            if (day == this.currentDaySequence[i])
                return i + 1;
        }
        return -1;
    }

    /*  GetDayArrayFromString(days)
     *		Takes a string containing "Day" characters and
     *		returns an array with the contained days.
     *
     *
     * @param	days	 A set of characters within the domain of ['M','T','W','J','F','S','D'].
     *
     * @return rDay[]	Array containing the set of days.
     */
    this.GetDayArrayFromString = function GetDayArrayFromString(days) {
        var tempDayArray = days.split("");
        var rDay = [];
        for (var i = 0; i < tempDayArray.length; ++i) {
            for (var j = 0; j < this.currentDaySequence.length; ++j) {
                if (this.currentDaySequence[j] == tempDayArray[i]) {
                    rDay.push(tempDayArray[i]);
                }
            }
        }
        //check if all entries are withing the domain range

        return rDay;
    }


    /*  HexToDecimal(hexString)
     *		Takes in a hex string and returns its decimal equivalent
     *
     *
     *	@param	hexString	A hex number in the string format of FF
     *
     *	@return rDecimal 	The resulting decimal number
     */

    this.HexToDecimal = function HexToDecimal(hexString) {
        hexString = hexString.toString();
        var rDecimal = 0;
        var counter = 0;
        for (var i = hexString.length - 1; i >= 0; i--) {
            var decimal;
            switch (hexString.charAt(i)) {
            case 'a':
            case 'A':
                decimal = 10;
                break;
            case 'b':
            case 'B':
                decimal = 11;
                break;
            case 'c':
            case 'C':
                decimal = 12;
                break;
            case 'd':
            case 'D':
                decimal = 13;
                break;
            case 'e':
            case 'E':
                decimal = 14;
                break;
            case 'f':
            case 'F':
                decimal = 15;
                break;
            default:
                decimal = parseInt(hexString.charAt(i));
                break;
            }
            if (counter == 0)
                rDecimal += decimal;
            else
                rDecimal += counter * 16 * decimal;
            counter++;
        }

        return rDecimal;
    }

    /*  DecToHex(decString)
     *		Takes in a dec string and returns its hexidecimal equivalent
     *
     *
     *	@param	decString	A decimal number
     *
     *	@return rHex 	The resulting hexadecimal number
     */

    this.DecToHex = function DecToHex(decString) {

        var hex1 = function singleDectoHex(digit) {
            var hexStringComponent;
            switch (digit) {
            case 15:
                hexStringComponent = "F";
                break;
            case 14:
                hexStringComponent = "E";
                break;
            case 13:
                hexStringComponent = "D";
                break;
            case 12:
                hexStringComponent = "C";
                break;
            case 11:
                hexStringComponent = "B";
                break;
            case 10:
                hexStringComponent = "A";
                break;
            default:
                if (hexStringComponent < 0 || hexStringComponent > 9) {
                    return "Wrong decimal format. No negative decimal can be taken by this function.";
                } else {
                    hexStringComponent = digit;
                }

            }
            return hexStringComponent;
        }

        var integer = parseInt(decString);


        if (integer < 16) {
            return "0" + hex1(integer);
        } else {
            var whole = Math.floor(integer / 16);
            var part = (integer / 16 - whole) * 16;
            return "" + hex1(whole) + hex1(part);

        }
    }

    /*  RGBToHex(RGBString)
     *		Takes in a RGB string and returns its hexidecimal equivalent
     *
     *
     *	@param	RGBString	An rgb color string of format rgb(r,g,b)
     *
     *	@return rHex 	The resulting hexadecimal number
     */
    this.RGBToHex = function RGBToHex(RGBString) {
        var l_string = RGBString;
        var t = {};
        t.openP = l_string.indexOf("(");
        t.closeP = l_string.indexOf(")");
        t.comma1 = l_string.indexOf(",");
        l_string = l_string.substr(l_string.indexOf(",") + 1);
        t.comma2 = l_string.indexOf(",") + t.comma1 + 1;

        var l_col = {};
        l_col.r = parseInt(RGBString.substr(t.openP + 1, t.comma1 - t.openP));
        l_col.g = parseInt(RGBString.substr(t.comma1 + 1, t.comma2 - t.comma1));
        l_col.b = parseInt(RGBString.substr(t.comma2 + 1, t.closeP - t.comma2));

        return "#" + this.DecToHex(l_col.r) + this.DecToHex(l_col.g) + this.DecToHex(l_col.b);
        //R component

    }

    /*  DecToStrTime(timeStr)
     *		Converts a decimal time to its string equivalent
     *
     *
     *	@param	timeStr		A decimal time in the form of 8.75 (8:45)
     *
     *	@return rTimeStr	The string equivalent of the given decimal time
     */
    this.DecToStrTime = function DecToStrTime(timeStr) {
        var hour = Math.floor(timeStr);
        var mins = timeStr - hour;

        rTimeStr = hour.toString() + ":" + Math.floor(mins * 60).toString();
        if (mins == 0)
            rTimeStr += "0";
        return rTimeStr;
    }



    //--------------------------------------------
    //			Helper functions
    //--------------------------------------------

    /*  InterpolateColor(hexColor1,hexColor2)
     *		Interpolates linearly between the two hex colors passed as arguments
     *
     *
     *	@param	hexColor1	Primary color, in the format of #FFFFFF
     *	@param	hexColor2	Secondary color, in the format of #FFFFFF
     *
     *	@return interColor	The resulting interpolated color
     */
    this.InterpolateColor = function (hexColor1, hexColor2) {
        //if any color is not in hex, return reference color

        hexColor1 = hexColor1.toString();
        hexColor2 = hexColor2.toString();
        var color1 = hexColor1.split("");
        color1.r = this.HexToDecimal(color1[1] + color1[2]);
        color1.g = this.HexToDecimal(color1[3] + color1[4]);
        color1.b = this.HexToDecimal(color1[5] + color1[6]);
        var color2 = hexColor2.split("");
        color2.r = this.HexToDecimal(color2[1] + color2[2]);
        color2.g = this.HexToDecimal(color2[3] + color2[4]);
        color2.b = this.HexToDecimal(color2[5] + color2[6]);

        var rColor = {};
        rColor.r = (color1.r + color2.r) / 2;
        rColor.g = (color1.g + color2.g) / 2;
        rColor.b = (color1.b + color2.b) / 2;

        var interColor = "#" + this.DecToHex(rColor.r) + this.DecToHex(rColor.g) + this.DecToHex(rColor.b);
        return interColor;
    }

    /*  UpdateDaySequence(numOfDays,startingDay)
     *		Updates the array storing the correct sequence of days with consideration
     *		with the desired starting day and the total number of days present on the table.
     *
     * @param	numOfDays	 	A character within the domain of ['M','T','W','J','F','S','D'].
     * @param	startingDay
     *
     */
    this.UpdateDaySequence = function UpdateDaySequence(numOfDays, startingDay) {
        this.currentDaySequence = [];

        for (var i = 0; i < baseDayArray.length; ++i) {
            if (startingDay == baseDayArray[i]) {
                for (var j = 0; j < numOfDays; ++j) {
                    this.currentDaySequence.push(baseDayArray[(i + j) % baseDayArray.length]);
                }
                return;
            }
        }
    }

    this.GetCell = function GetCell(i_rowNumber, i_colNumber) {

        var a = $("#" + this.GetCellStringId(i_rowNumber, i_colNumber))
        var rVal = {};
        rVal = a;
        rVal.id = this.GetCellStringId(i_rowNumber, i_colNumber);
        rVal.occupied = a.attr("IsOccupied");
        rVal.content = a.html();
        return rVal;
    }

    this.CreateTable = function CreateTable(i_numRows, i_numCols) {
        //Create a new table tag
        this.table = $('<table/>').attr("id", "ScheduleTableId" + this.tableId).addClass('schedule');

        for (var i = 0; i < i_numRows; ++i) {

            this.rows.push($('<tr />'));

            //add the desired number of columns to the row
            for (var j = 0; j < i_numCols; ++j) {


                //Add hours
                if (j == 0 && i != 0) {
                    var time = this.startHour + i * this.hourIncrement;
                    var hour = Math.floor(time);
                    var mins = (time - hour) * 60;

                    $('<td>' + hour + ":" + (mins == 0 ? "00" : mins) + '</td>').attr("id", this.GetCellStringId(i, j))
/*abcd            .css('margin-top', "-1").css('margin-bottom', "-1")*/
                    .attr("IsOccupied", "false").appendTo(this.rows[i]);

                }
                //Add days
                else if (i == 0 && j != 0) {
                    $('<td>' + this.GetDayFromChar(this.currentDaySequence[j - 1]) + '</td>').attr("id", this.GetCellStringId(i, j))
                    //.css('margin-top', "-1").css('margin-bottom', "-1")
                    .attr("IsOccupied", "false").appendTo(this.rows[i]);
                } else {
                    $('<td > </td>').attr("id", this.GetCellStringId(i, j)).attr("IsOccupied", "false")
                    //.css('margin-top', "-1").css('margin-bottom', "-1")
                    .appendTo(this.rows[i]);
                }
            }

            this.rows[i].appendTo(this.table);
        }
    }

    //----------------------------------------
    //			Core Functions
    //----------------------------------------
    /*  Insert(course,color)
     *		Insert a new course into the scheduler and set its cell background to
     *		the specified color.
     *
     * @param	course	The course to be inserted into the table.
     * @param	color	The background color of the cells affectd by the insertion.
     *
     * @return	isSuccess Return value is true if insertion is completed succesfully.
     * @note	The insert function will fail if ever any of the requested slots are already occupied.
     */
    this.Insert = function Insert(course, color) {
        var startRow = this.GetRowFromTime(course.start) + 1;
        var endRow = this.GetRowFromTime(course.end) + 1;
        var middleRow = Math.floor((endRow + startRow) / 2);
        if (startRow >= endRow) {
            return false
        }

        var colArr = this.GetDayArrayFromString(course.days);
        for (var i = 0; i < colArr.length; ++i) {
            var colNumber = this.GetColFromDay(colArr[i]);

            for (var j = startRow; j <= endRow; ++j) {
                //"rgb(0, 21,234)"
                //Check if another cell is already present
                var cell = this.GetCell(j, colNumber);
                var currentBottomBorderStyle = cell.css("border-bottom-style");
                var currentTopBorderStyle = cell.css("border-top-style");
                var cellcontent = cell.content;
                var cellOccupied = cell.occupied;
                var htmlText = "<td/>";

                if (j == middleRow - 1) {
                    htmlText = course.title;
                } else if (j == middleRow) {
                	htmlText = course.course;
                } else if (j == middleRow + 1) {
                    htmlText = course.type + " " + course.section;
                } else if (j == middleRow + 2) {
                    htmlText = this.DecToStrTime(course.start) + " " + this.DecToStrTime(course.end);
                } else if (j == middleRow + 3) {
                    htmlText = course.room;
                } else {
                    htmlText = '';
                }

                cell.text(htmlText);

                //cell.css('border','none');
                if (j == startRow) {

                } else if (j == endRow) {

                } else {
                    //check if overlapping course is finishing beneath this course

                    if (currentTopBorderStyle != "hidden" && cellOccupied == "true") {

                    } else if (currentBottomBorderStyle != "hidden" && cellOccupied == "true") {

                    } else {

                    }
                }

                cell.html(htmlText);

                //Check if cell is already occupied
                if (cellOccupied == "true") {
                    //Interpolate the current color and the new color
                    var bgColor = this.RGBToHex(cell.css("background-color"));
                    var newColor = this.InterpolateColor(bgColor, color);
                    cell.css("background-color", newColor.toString());

                } else {
                    cell.attr("isoccupied", "true");
                    cell.css("background-color", color); //
                }

                cell.addClass('course');

            }
        }
    }

    //----------------------------------------
    //			Constructor
    //----------------------------------------
    //make sure hour increment is divisible by 0.25
    var incrementFactor = Math.floor(hourIncrement / 0.25) * 0.25;

    if (incrementFactor <= 0)
        incrementFactor = 1;

    //Make sure startHour and endHour are also divisible by 0.25
    this.startHour = Math.floor(startHour / 0.25) * 0.25;
    this.endHour = Math.floor(endHour / 0.25) * 0.25;

    this.numRows = Math.ceil((endHour - startHour) / incrementFactor);

    this.UpdateDaySequence(numOfDays, startingDay);

    this.numCols = numOfDays;
    this.numRows += 1;
    this.numCols += 1;
    this.CreateTable(this.numRows, this.numCols);

    //this.table.css("border", "1px solid black").css("border-spacing", "1px").css("border-collapse", "collapse");
}
//json object
var course1 = {
    "course": "SOEN 341",
    "title": "Software Process",
    "type": "lecture",
    "section": "S",
    "days": "M,F",
    "start": 9.25,
    "end": 11.00,
    "prof": "Sutharsan Sivagnanam",
    "room": "H-820"
};

var course2 = {
    "course": "SOEN 341",
    "title": "Software Process",
    "type": "lecture",
    "section": "S",
    "days": "W,J",
    "start": 12.25,
    "end": 15.00,
    "prof": "Sutharsan Sivagnanam",
    "room": "H-820"
};

var course3 = {
    "course": "SOEN 341",
    "title": "Software Process",
    "type": "lecture",
    "section": "S",
    "days": "W,J,F",
    "start": 14.25,
    "end": 17.00,
    "prof": "Sutharsan Sivagnanam",
    "room": "H-820"
};