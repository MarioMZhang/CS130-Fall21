
export class HTTPHandler {

    constructor() {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        this.headers.append('Origin','http://localhost:8000');
    }

    async asyncGetHubs() {
        return await this.getHubs();
    }

    async asyncGetJobsFromID(id) {
        return await this.getJobsFromID(id);
    }

    async asyncGetCustomerJob(username) {
        return await this.getCustomerJobFromUsername(username);
    }

    async asyncGetDriverJobs(username) {
        return await this.getJobListFromUsername(username);
    }

    getHubs() {
        return new Promise(resolve => {
            fetch("http://localhost:3000/api/hubs/", {method: "GET", headers: this.headers})
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(err => console.log(err.toString()));
        });
    }

    getJobsFromID(id) {
        const url = "http://localhost:3000/api/jobs?jobsid=" + id.toString();

        return new Promise(resolve => {
            fetch(url, {method: "GET", headers: this.headers})
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(err => console.log(err.toString()));
        });

    }

    getCustomerJobFromUsername(username) {
        const url = "http://localhost:3000/api/jobs?username=" + username.toString();

        return new Promise(resolve => {
            fetch(url, {method: "GET", headers: this.headers})
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(err => console.log(err.toString()));
        });
    }

    getJobListFromUsername(username) {
        const url = "http://localhost:3000/api/jobs?username=" + username.toString();

        return new Promise(resolve => {
            fetch(url, {method: "GET", headers: this.headers})
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(err => console.log(err.toString()));
        });
    }
}
