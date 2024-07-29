const apikey = "fad2606b4b485abadba8e67c028a58cd";
const searchbutton = document.getElementById("search-button");
const currentlocation = document.getElementById("location");

let lattitude ;
let longitude ;
let city = "" ;

// To search MAnually
searchbutton.addEventListener("click",()=>{
    for (let index = 0; index < 5; index++) {
        const databox = document.querySelectorAll(".a5daydata")
        databox[index].innerHTML="";
    }
    const searchedplaced = document.getElementById("search-bar").value;
    console.log(searchedplaced);
    city = searchedplaced;
    gettingcoordinates()
})

// Get Location Details Automatically
currentlocation.addEventListener("click",()=>{
    for (let index = 0; index < 5; index++) {
        const databox = document.querySelectorAll(".a5daydata")
        databox[index].innerHTML="";
    }
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            (value)=>{
            longitude=value.coords.longitude;
            lattitude=value.coords.latitude;
            checkingweather();
            getting5daysdata();
            }
        )
    }
})



// checking to get the Lat and longitude of the Given City name

async function gettingcoordinates(){
    const value= await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apikey}`)
    const maindata = await value.json();
    console.log(maindata)
  

    if(maindata.length>0){
        lattitude=maindata[0].lat;
        longitude=maindata[0].lon;
        checkingweather();
        getting5daysdata();
    }
    else{
       alert("Please Enter a Proper city Name");
    }

    // console.log(lattitude,longitude);
}



// Main Function to get Weather
async function checkingweather()
{
    const report = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lattitude}&lon=${longitude}&appid=${apikey}`)
    const data =  await report.json();

    const display = document.querySelectorAll(".data-display");
    display.forEach(value=>
        value.style.visibility = "visible"
    )
    
    document.getElementById("CityName").innerHTML=`${data.name}`
    
    // Temperature
    document.getElementById("Temperature").innerHTML=`  - ${Math.floor(data.main.temp-273.14)} ° C `
    document.getElementById("Humidity").innerHTML=`  - ${Math.floor(data.main.humidity)} g/Kg `
    document.getElementById("WindSpeed").innerHTML=`  - ${Math.floor(data.wind.speed)} m/sec `
    
    
    // Changing Images according to weather
    if(data.weather[0].main=="Drizzle"||data.weather[0].main=="Cloudy"||data.weather[0].main=="Rain"){
       let photo =  document.getElementById("normal");
    //    removing other photos
       photo.classList.add("hide");
       document.getElementById("sunny").classList.add("hide");
        // adding New Photos
       document.getElementById("rainy").classList.remove("hide");

    }
    else{
       let photo =  document.getElementById("normal");
       photo.classList.add("hide");
       document.getElementById("rainy").classList.add("hide");
        // Adding New photos
       document.getElementById("sunny").classList.remove("hide");

       
    }


}





// 5-day Data of Wetaher Function

async function getting5daysdata(){
    const maindata = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lattitude}&lon=${longitude}&appid=${apikey}`)
    const data = await maindata.json();
    console.log(data)

    // declaring array to store data for different dates
    let dates=[];
    let weatherpic=[];
    let temperatures=[];
    let humidities=[];
    let windspeeds=[];
    
    // Getting data and storing them in array
    for (let index = 0; index < data.list.length; index=index+8) {


        //temperature array
        let temperature =(data.list[index].main.temp-273.14).toFixed(1);  
        temperatures.push(temperature)

        //Dates array
        const date = data.list[index].dt_txt;  
        dates.push(date);

        // weather array
        photo=(data.list[index].weather[0].main)
        weatherpic.push(photo)

        // humidity array
        let humidity=(data.list[index].main.humidity)
        humidities.push(humidity)

        // wind speed Array
        let windspeed=(data.list[index].wind.speed)
        windspeeds.push(windspeed)
    }


    console.log(weatherpic)

    for (let i = 0; i < dates.length; i++) {
    
    // data boxes means the small boxes in the Html to display 5 day weather
    const databox = document.querySelectorAll(".a5daydata")
    
    // display for dates

    const displaydates = document.createElement("p");
    displaydates.innerText=`Date - ${dates[i]}`;
    displaydates.classList.add("dateinboxes");
    

    // display of photos

    let img = document.createElement("img");
    img.width = 80; 
    img.height = 80; 
    img.style.marginLeft="auto"
    img.style.marginRight="auto"
    img.style.marginTop="10px"  

    if(weatherpic[i]=="Drizzle"||weatherpic[i]=="Clouds"||weatherpic[i]=="Rain"){
        img.src = "https://img.icons8.com/officel/80/light-rain.png"
    }
    else{
        img.src = "https://img.icons8.com/emoji/96/sun-emoji.png"
    }

    
    // display Temperature
    const temperaturedata = document.createElement("p");
    temperaturedata.innerHTML=`Temperature - ${temperatures[i]}`
    temperaturedata.classList.add("textinboxes")

    // display Humidity
    const humiditydata = document.createElement("p");
    humiditydata.innerHTML=`Humidity - ${humidities[i]} g/Kg`
    humiditydata.classList.add("textinboxes")

    // display Wind Speed
    const windspeeddata = document.createElement("p");
    windspeeddata.innerHTML=`Wind Speed - ${windspeeds[i]} m/sec`
    windspeeddata.classList.add("textinboxes")

    // appending data to the boxes
    databox[i].appendChild(displaydates);
    databox[i].appendChild(img);
    databox[i].appendChild(temperaturedata);
    databox[i].appendChild(humiditydata);
    databox[i].appendChild(windspeeddata);
    }
}
