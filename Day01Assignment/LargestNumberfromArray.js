let mesBills=[2800, 3200, 2950, 3500, 3100];
let highestBill = mesBills[0];
for(let i=1;i<mesBills.length;i++)
{
    if(mesBills[i]>highestBill)
        highestBill=mesBills[i]
}
console.log("Monthly Mess Bills:",mesBills)
console.log("The highest mess bill is:",highestBill);
