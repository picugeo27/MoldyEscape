export class RankingScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'RankingScreen' });
    }

    _rankingList;

    async preload(){
        await this.getRankedUsers();
    }
    async create(){
        
    }

    async getRankedUsers(){
        //Placeholder
        var staticList = ["Blanca", "Unai", "Candela", "George", "Paloma"];
        this._rankingList = staticList;
        $.ajax({
            method: "GET",
            url: "/users/getranking"
        }).done((data) => {
            this.connectedUsersSet = data;
            this.connectedUsers = Array.from(this.connectedUsersSet);
            //this._rankingList = this.connectedUsers;
            //this._maxPages = Math.ceil(this.connectedUsers.length / this._usersPerPage);
            //this.showConnectedUsers();
            //this.hideTexts();
        }).fail(function (data, message) {
            console.log(message);
        })
    }
}