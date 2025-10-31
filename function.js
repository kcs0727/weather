const searchfield= document.querySelector(".searchfield");
const search=document.querySelector(".fa-magnifying-glass");
const api_key= "b456f0369b15609a8e49dcb0c0e0d783";

//functions
function getdate(timestamp){
    let now= new Date(timestamp* 1000);
    let date= now.toLocaleDateString();
    let time= now.toLocaleTimeString("en-US", {hour: "2-digit",minute: "2-digit",hour12: true});
    let day= now.toLocaleDateString("en-US", { weekday: "short" });
    return [date, time, day];
}

function gettemperature(data){
    const city= document.getElementById("city");
    const temp= document.getElementById("temp");
    const sky= document.getElementById("sky");
    const date= document.getElementById("date");
    const time= document.getElementById("time");

    city.innerText=data.name;
    temp.innerText=data.main.temp;
    sky.innerText=data.weather[0].description;

    let now= getdate(data.dt);
    date.innerText=now[0];
    time.innerText=now[1];
}

function getforecast(data){
    const forecastrows=document.querySelectorAll(".forecastrow");

    let days={};
    let cnt=0;
    for(let item of data.list){
        let arr=getdate(item.dt);
        let date= arr[0];
        if(!days[date]){
            days[date]={
                temp:item.main.temp,
                day:arr[2],
                icon: item.weather[0].icon
            }
            cnt++;
        }
        if(cnt==5) break;
    }

    let i=0;
    Object.keys(days).forEach(date=>{
        let forecasttemp= forecastrows[i].querySelector(".forecasttemp");
        let forecastday= forecastrows[i].querySelector(".forecastday");
        let forecastdate= forecastrows[i].querySelector(".forecastdate");
        let forecasticon= forecastrows[i].querySelector(".forecasticon");
        forecasttemp.innerText=days[date].temp.toFixed(1);
        forecastday.innerText= days[date].day;
        forecastdate.innerText= date;
        forecasticon.outerHTML=`<img class="forecasticon w-10 h-8" src="https://openweathermap.org/img/wn/${days[date].icon}@2x.png" />`;
        i++;
    })
}

function getaqi(aqidata){
    const co= document.getElementById("co");
    const no2= document.getElementById("no2");
    const so2= document.getElementById("so2");
    const o3= document.getElementById("o3");
    
    co.innerText= aqidata.list[0].components.co;
    no2.innerText= aqidata.list[0].components.no2;
    o3.innerText= aqidata.list[0].components.o3;
    so2.innerText= aqidata.list[0].components.so2;
}

function getmetric(data){
    const pressure= document.getElementById("pressure");
    const humidity= document.getElementById("humidity");
    const feelslike= document.getElementById("feelslike");
    const windspeed= document.getElementById("windspeed");

    pressure.innerText= data.main.pressure;
    humidity.innerText= data.main.humidity;
    feelslike.innerText= data.main.feels_like;
    windspeed.innerText= data.wind.speed;
}

function getsun(data){
    const sunrise= document.getElementById("sunrise");
    const sunset= document.getElementById("sunset");

    sunrise.innerText=getdate(data.sys.sunrise)[1];
    sunset.innerText=getdate(data.sys.sunset)[1];
}

function getdayreport(data) {
    const dayreports= document.querySelectorAll(".reportchild");

    let i=0;
    for(let item of data.list){
        let time=dayreports[i].querySelector(".reporttime");
        let temp=dayreports[i].querySelector(".reporttemp");
        let icon=dayreports[i].querySelector(".reporticon");
        time.innerText= getdate(item.dt)[1];
        temp.innerText= item.main.temp;
        icon.outerHTML=`<img class="forecasticon w-14 h-12" src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" />`;
        i++;
        if(i==6) break;
    }
}

//main function
search.addEventListener("click",async()=>{

    try{
        let input=searchfield.value.trim();
        let response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=b456f0369b15609a8e49dcb0c0e0d783&units=metric`);
        
        let data= await response.json();
        let lat=data.coord.lat;
        let lon=data.coord.lon;

        //description & calender
        gettemperature(data);
        
        //metrics
        getmetric(data);

        //sun
        getsun(data);
        
        //forecast & dayreoort
        try{
            let res= await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`);
            let info= await res.json();
            getforecast(info);
            getdayreport(info);
        }
        catch(error){
            console.log(error);
            console.log("problem in forecast api");
        }

        //AQI
        try{
            let aqiresponse= await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`);
            let aqidata= await aqiresponse.json();
            getaqi(aqidata);
        }
        catch(error){
            console.log(error);
            console.log("problem in aqi api");
        }

    }

    catch(error){
        console.error("error:", error);
        alert("Enter City Name Correctly");
    }

})

searchfield.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
        e.preventDefault();
        search.click();
    }
})

searchfield.addEventListener("focus", function () {
  this.select();
});


