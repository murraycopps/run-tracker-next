export default class LoginData {
    static username: string;
    static password: string;
    static isLoggedIn: boolean = false;
    static user = {
        id: '',
        name: '',
        username: '',
        password: '',
        runs: [] as any,
    }

    static login(username: string, password: string, user: any) {
        if (this.isLoggedIn) return
        this.username = username;
        this.password = password;
        this.isLoggedIn = true;
        this.user = user;
    }

    static getData() {
        return {
            username: this.username,
            password: this.password,
        }
    }
    
    static addUserRun(run: any) {
        //set run id to random number that is not already in the array
        run.id = Math.floor(Math.random() * 1000000).toString();
        while (this.user.runs.find((r: any) => r.id === run.id)) {
            run.id = Math.floor(Math.random() * 1000000).toString();
        }
        this.user.runs.push(run);
    }

    static editUserRun(run: any) {
        const index = this.user.runs.findIndex((r: any) => r.id === run.id);
        this.user.runs[index] = run;
    }

}