
// <div id="alert-Div" className="alert alert-danger"> {errors Here} </div>

//not on a tuesday, not in the past , during open hours

export function tooEarlyOrTooLate(reservationDate, reservationTime) {
    const splitHrsAndMin = reservationTime.split(':');
    const hour = Number(splitHrsAndMin[0]);
    const minute = Number(splitHrsAndMin[1]);
    const date = new Date(reservationDate);
    const reservationDay = date.getUTCDate();
    const reservationMonth = date.getUTCMonth();
    const reservationYear = date.getUTCFullYear();
    let currentDate = new Date(Date.now());
    let today = currentDate.getUTCDate();
    let thisMonth = currentDate.getUTCMonth();
    let thisYear = currentDate.getUTCFullYear();
    let thisHour = currentDate.getHours();
    let thisMinute = currentDate.getMinutes();
    if (hour === 10 && minute < 30) {
        return true
    }
    if (hour < 10) {
        return true
    }
    if (hour === 21 && minute > 30) {
        return true
    }
    if (hour > 21) {
        return true
    }
    if (reservationYear === thisYear && reservationMonth === thisMonth && reservationDay === today && hour === thisHour && minute < thisMinute) {
        return true
    }
    if (reservationYear === thisYear && reservationMonth === thisMonth && reservationDay === today && hour < thisHour) {
        return true
    }
    return false
}

export function notOnTuesday(reservation_date) {
    const date = new Date(reservation_date);
    const day = date.getUTCDay();
    if (day === 2) {
      return true
    }
    return false
}

export function notOnPreviousDate(reservation_date) {
    const date = new Date(reservation_date);
    const reservationDay = date.getUTCDate();
    const reservationMonth = date.getUTCMonth();
    const reservationYear = date.getUTCFullYear();
    let currentDate = new Date(Date.now());
    let today = currentDate.getUTCDate();
    let thisMonth = currentDate.getUTCMonth();
    let thisYear = currentDate.getUTCFullYear();
    if (thisYear > reservationYear) {
      return true
    }
    if (reservationYear === thisYear && thisMonth > reservationMonth) {
      return true
    }
    if (reservationYear >= thisYear && reservationMonth === thisMonth && today > reservationDay) {
      return true
    }
    return false
}

// seat table, table does not exist, reservation does not exist, table is occupied, table is not big enoug

export function tableDoesNotExists(table_id) {
    if (!table_id) {
        return true
    }
    return false
}

export function reservationDoesNotExist(reservation_id) {
    if (!reservation_id) {
        return true
    }
    return false
}


export function tableIsOccupied(tableReservationId) {
    if (tableReservationId) {
        return true
    }
    return false
}

export function tableIsNotBigEnough(party, capacity) {
    if (party > capacity) {
        return true
    }
    return false
}