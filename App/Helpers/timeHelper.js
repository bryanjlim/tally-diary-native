export default class TimeHelper {
    static formatDate(dateObject) {
        const formattedMonth = (dateObject.getMonth() + 1).toString().length === 1 ? "0" + (dateObject.getMonth() + 1) : dateObject.getMonth() + 1;
        const dateNumber = dateObject.getDate();
        const formattedDate = dateNumber / 10 < 1 ? "0" + dateNumber : dateNumber;
        return dateObject.getFullYear() + "-" + formattedMonth + "-" + formattedDate;
    }

    static calculateDayDifference(lowerDate, higherDate) {
        return Math.round((higherDate - lowerDate) / (1000 * 60 * 60 * 24))
    }

    static getReadableDate(dateObject) {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
            "November", "December"];
        const weekDays = ["Sun.", "Mon.", "Tues.", "Wed.", "Thurs.", "Fri.", "Sat."];
        const readableDate = months[dateObject.getMonth()] + " " + (dateObject.getDate()) + ", " + dateObject.getFullYear() +
            " (" + weekDays[dateObject.getDay()] + ")";
        return readableDate;
    }
}

