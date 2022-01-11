import axios from "axios";

export default class AuthService {

    static register(user) {
        return axios
        .post("http://127.0.0.1:8000/users/", user)
        .then((response) => {
          return response
        })
        .catch((error) => {
          if (error) {
            return error
          };
        });
    }

    static getUserData() {
      const userId = localStorage.getItem("userId");
      return axios
      .get(`http://127.0.0.1:8000/users/${userId}/`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        if (error) {
          return error
        };
      });
  }

    static updateUserData(user) {
        const userId = localStorage.getItem("userId");
        return axios
        .put(`http://127.0.0.1:8000/users/${userId}/`, user)
        .then((response) => {
          return response
        })
        .catch((error) => {
          if (error) {
            return error
          };
        });
    }

    static login(user) {
        return axios
        .post(`http://127.0.0.1:8000/login/`, null, { auth: user })
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userId", response.data.user.id);
          return response;
        })
        .catch((error) => {
          if (error) {
            return "Incorrect password or username"
          };
        });

    }

    static logout () {
        const token = localStorage.getItem("token");
        return axios
        .post(`http://127.0.0.1:8000/logout/`, null, {
          headers: {
            "Authorization": `Token ${token}`,
          }})
        .then(response => {
            localStorage.removeItem("token");
        })
        .catch(error => {
            return error 
        });

    }

}