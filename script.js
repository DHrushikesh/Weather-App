const apikey = "fad2606b4b485abadba8e67c028a58cd";
const searchbutton = document.getElementById("search-button");
const currentlocation = document.getElementById("location");

let lattitude ;
let longitude ;
let city = "" ;
// let lat= 17.4065;
// let lon= 78.4772;

// To search MAnually
searchbutton.addEventListener("click",()=>{
    const searchedplaced = document.getElementById("search-bar").value;
    console.log(searchedplaced);
    city = searchedplaced
    gettingcoordinates()
})

// Get Location Details Automatically
currentlocation.addEventListener("click",()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            (value)=>{
            longitude=value.coords.longitude;
            lattitude=value.coords.latitude;
            checkingweather()
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
    document.getElementById("Temperature").innerHTML=` - ${Math.floor(data.main.temp-273.14)} ° C `
    document.getElementById("Humidity").innerHTML=` - ${Math.floor(data.main.humidity)} g/Kg `
    document.getElementById("WindSpeed").innerHTML=` - ${Math.floor(data.wind.speed)} m/sec `
    
    
    // Changing Images according to weather
    if(data.weather[0].main=="Drizzle"||data.weather[0].main=="Cloudy"){
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



