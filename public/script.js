

// //calculations are total messy and aproaximated leap years and seconds are not included ;)
var serverTotalScore;
var serverHighScore;

 async function getFromServer()
 {
     serverTotalScore = await axios.get('/get/score');
	 serverTotalScore = serverTotalScore.data.count;
     serverHighScore =  await axios.get('/get/high-score');
	 serverHighScore  = serverHighScore.data.highScore;
	 highScore.innerHTML = serverHighScore;
 }

getFromServer();

const deathDate = '6 september 2069';

const yearsEl = document.getElementById("years");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("mins");
const secondsEl = document.getElementById("secs");

function countdown()
{
    const deathTime = new Date(deathDate);
	
    const currentTime = new Date();

    const totalSeconds = ( ( (deathTime - currentTime) + (serverTotalScore * 60000 ) )/ 1000)  ;

    const years = Math.floor(totalSeconds / 3600 / 24 / 365) ;

    const days = (Math.floor(totalSeconds / 3600 / 24 ) % 365);

    const hours = Math.floor(totalSeconds / 3600 ) % 24;

    const minutes = (Math.floor(totalSeconds / 60) % 60) ;

    const seconds = Math.floor(totalSeconds % 60);

    yearsEl.innerHTML = years;
    daysEl.innerHTML = days;
    hoursEl.innerHTML = formatTime(hours);
    minutesEl.innerHTML = formatTime(minutes);
    secondsEl.innerHTML = formatTime(seconds);
}

function formatTime(time)
{
    return time < 10 ? `0${time}` : time;
}

countdown();

setInterval(countdown,1000);
