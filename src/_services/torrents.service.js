
import { util } from '../_helpers';

const baseApiUrl = 'http://localhost:8081/torrents';

export const torrentService = {
    search
};

function search(options) {
	
    const requestOptions = {
        method: 'POST',
     //   headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options)
    };

    return fetch(baseApiUrl + '/search', requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
			let error = util.getFormattedError(response, data);
            return Promise.reject(error);
        }

        return data;
    });
}