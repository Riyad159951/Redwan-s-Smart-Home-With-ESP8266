const AIO_KEY="add your adafruit io key here";//add your adafruit io key here

function toggleMode(){
const body=document.body;

if(body.classList.contains("light")){
body.classList.remove("light");
document.querySelector(".toggle-btn").innerText="🌙 Light";
}else{
body.classList.add("light");
document.querySelector(".toggle-btn").innerText="🌙 Dark";
}
}

function notify(msg){
const n=document.getElementById("notify");
n.innerText=msg;
n.style.display="block";
setTimeout(()=>n.style.display="none",2000);
}

async function fetchData(){
const t=await fetch("https://io.adafruit.com/api/v2/redwan14/feeds/temperature/data/last",{headers:{"X-AIO-Key":AIO_KEY}});
const h=await fetch("https://io.adafruit.com/api/v2/redwan14/feeds/humidity/data/last",{headers:{"X-AIO-Key":AIO_KEY}});

const temp=await t.json();
const hum=await h.json();

document.getElementById("tempVal").innerText=temp.value+" °C";
document.getElementById("humVal").innerText=hum.value+" %";

addChart(temp.value,hum.value);
}

async function led1(v){
await fetch("https://io.adafruit.com/api/v2/redwan14/feeds/led1control/data",{
method:"POST",
headers:{"Content-Type":"application/json","X-AIO-Key":AIO_KEY},
body:JSON.stringify({value:v})
});
document.getElementById("led1Val").innerText=v.toUpperCase();
notify("LED1 "+v);
}

async function led2(v){
await fetch("https://io.adafruit.com/api/v2/redwan14/feeds/led2control/data",{
method:"POST",
headers:{"Content-Type":"application/json","X-AIO-Key":AIO_KEY},
body:JSON.stringify({value:v})
});
document.getElementById("led2Val").innerText=v.toUpperCase();
notify("LED2 "+v);
}

const ctx=document.getElementById("chart");
const chart=new Chart(ctx,{
type:"line",
data:{labels:[],datasets:[
{label:"Temp",data:[],borderColor:"red"},
{label:"Hum",data:[],borderColor:"blue"}
]},
});

function addChart(t,h){
chart.data.labels.push(new Date().toLocaleTimeString());
chart.data.datasets[0].data.push(t);
chart.data.datasets[1].data.push(h);

if(chart.data.labels.length>15){
chart.data.labels.shift();
chart.data.datasets[0].data.shift();
chart.data.datasets[1].data.shift();
}

chart.update();
}

setInterval(fetchData,5000);
fetchData();