let a = new Array(3).fill(new Array(5).fill(0));
let b = a.map((arr)=>arr.slice());
d[0][1] = 1;
console.log(a)
console.log(b)

a.forEach((v)=>{
    v.forEach((v2)=>{
        console.log(v2)
    })
})