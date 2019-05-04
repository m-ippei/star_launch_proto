class StarBoard {
    constructor(){
        this.colors = ["blue","green","purple","red","water","yellow"];
        this.A = [];
        this.B = [];
        this.C = [];
        this.D = [];
        this.E = [];
    }
    
    initialise() {
        this.A = this.rPC_threeTimes();
        this.B = this.rPC_threeTimes();
        this.C = this.rPC_threeTimes();
        this.D = this.rPC_threeTimes();
        this.E = this.rPC_threeTimes();
    }
    
    rPC_threeTimes(){
        return [this.randomPickColors(),this.randomPickColors(),this.randomPickColors()];
    }
    
    randomPickColors(){
        return this.colors[Math.floor(Math.random()*this.colors.length)];
    }
    
    pickOrbs(){
        return [this.A[0],this.B[0],this.C[0],this.D[0],this.E[0]];
    }
}

let sb = new StarBoard();
sb.initialise();
console.log(sb);
console.log(sb.pickOrbs());