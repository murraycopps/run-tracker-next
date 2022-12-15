export default class LoginData {
    static isLoggedIn: boolean = false;
    static user = {
        id: '',
        name: '',
        username: '',
        password: '',
        runs: [] as any,
    }

    static login(user: any) {
        if (this.isLoggedIn) return
        this.isLoggedIn = true;
        this.user = user;
    }

    
    static addUserRun(run: any) {
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

    static deleteUserRun(id: string) {
        const index = this.user.runs.findIndex((r: any) => r.id === id);
        this.user.runs.splice(index, 1);
    }

    static logout() {
        this.isLoggedIn = false;
        this.user = {
            id: '',
            name: '',
            username: '',
            password: '',
            runs: [] as any,
        }
    }

    static changePassword(password: string) {
        this.user.password = password;
    }

    static changeName(name: string) {
        this.user.name = name;
    }

    static changeUsername(username: string) {
        this.user.username = username;
    }


}