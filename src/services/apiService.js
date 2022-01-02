import axios from "axios";

export default class apiService {

    static getJobReports(jobType, params) {
        const token = localStorage.getItem("token");
        return axios
        .get(`http://127.0.0.1:8000/${jobType}/`, {params: params, headers: {
            "Authorization": `Token ${token}`
        }})
        .then((response) => {
            return response
        })
        .catch((error) => {
            if (error) {
                return error
            };
        });
    }

    static postJobReport(jobType, job) {
        const token = localStorage.getItem("token");
        console.log(token);
        return axios
        .post(`http://127.0.0.1:8000/${jobType}/`, job, { headers: {
            "Authorization": `Token ${token}`
        }})
        .then((response) => {
            return response
        })
        .catch((error) => {
            if (error) {
                return error
            };
        });
    }

}