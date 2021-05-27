
export const util = {
    getFormattedError,
	updateCallTimes
};

function getFormattedError(response, data) {
	let error = 'ERROR';
	if (response) {
		if (response.status)
			error += ' ' + response.status + '.';
		if (response.statusText)
			error += ' ' + response.statusText;
		if (response.detail)
			error += ' ' + response.detail;
		if (response.message)
			error += ' ' + response.message;
	}
	
	if (data) {
		if (data.detail)
			error += ' ' + data.detail;
	}
	
	return error;
}

function updateCallTimes(day) {
	if (day && day.times && day.times.length > 0) {
		for (let i in day.times) {
			let time = day.times[i];
			if (time) {
				if (time.timeIn && typeof time.timeIn === 'object') { // If this is an object
					let makeBlank = false;
					if (!time.timeIn.mm || time.timeIn.mm === '')
						makeBlank = true;
					else if (!time.timeIn.hh || time.timeIn.hh === '')
						makeBlank = true;
					else if (!time.timeIn.a || time.timeIn.a === '')
						makeBlank = true;
						
					if (makeBlank === true)
						time.timeIn = '';
					else
						time.timeIn = time.timeIn.hh + ':' + time.timeIn.mm + ' ' + time.timeIn.a;
				}
				else if (typeof time.timeIn === 'string') {
					// "02:mm a"
					if (time.timeIn.indexOf(':mm') !== -1 || (time.timeIn.indexOf(' am') === -1 && time.timeIn.indexOf(' pm') === -1))
						throw 'Invalid call-in time [' + time.timeIn + ']';
				}
	
				if (time.timeOut && typeof time.timeOut === 'object') { // If this is an object
					let makeBlank = false;
					if (!time.timeOut.mm || time.timeOut.mm === '')
						makeBlank = true;
					else if (!time.timeOut.hh || time.timeOut.hh === '')
						makeBlank = true;
					else if (!time.timeOut.a || time.timeOut.a === '')
						makeBlank = true;
						
					if (makeBlank === true)
						time.timeOut = '';
					else
						time.timeOut = time.timeOut.hh + ':' + time.timeOut.mm + ' ' + time.timeOut.a;
				}
				else if (typeof time.timeOut === 'string') {
					// "02:mm a"
					if (time.timeOut.indexOf(':mm') !== -1 || (time.timeOut.indexOf(' am') === -1 && time.timeOut.indexOf(' pm') === -1))
						throw 'Invalid call-out time [' + time.timeOut + ']';
				}
			}
		}
	}
}
