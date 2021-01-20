//code is a real mess :(

function preload() {

laser = new Audio("audio/Laser.mp3");

}


var turnedBig = false;
var turnedSmall = false;
var translatedinfovisible = false;


var bg = document.getElementById("bg");
var body = document.getElementById("bodyID");

var infosection = document.getElementById("info-section");
var infoContent = document.getElementById("info-content");
var social = document.getElementById("social");
var aboveFold = document.getElementById("above-fold");
var container = document.getElementById("container");
var yourScore = document.getElementById("your-score-points");
var highScore = document.getElementById("high-score-points");

var localScore = 0;


function Heart()
{
    this.x = random(10,width-10);
    this.y = -20;

    this.gravity = .01;
    this.velocity = 0;
    this.size = 24;
    this.arcSize = 10;
    this.destroyed = false;
    this.added = false;

    this.show = function ()
    {
        noFill();
        stroke(64, 64, 61);
        strokeWeight(2);
        arc(this.x - 10, this.y - 10, this.arcSize, this.arcSize, PI+45, PI-160);
        fill(64, 64, 61);
        stroke(0);
        strokeWeight(1);
        ellipse(this.x,this.y,this.size,this.size);
        fill(255);
        arc(this.x + 2, this.y - 2, this.arcSize, this.arcSize, PI+45, PI-160)
    }

    this.update = function ()
    {

        this.velocity += this.gravity;
        this.y += this.velocity;
    }

    this.offscreen = function ()
    {
        if(this.y - 20 > height )
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    this.shrink = function()
    {
        if(this.size > 0)
        {
            this.size = this.size - 2;
        }

        if(this.arcSize > 0)
        {
            this.arcSize = this.arcSize - 2;
        }
    }

    this.hits = function()
    {
        if(mouseIsPressed || ( keyIsPressed && key == ' ') )
        {

            if( (dist(this.x,this.y,mouseX,mouseY) <= (this.size - 12) ) )
            {


                this.destroyed = true;
                stroke(3, 146, 255);
                strokeWeight(2);
                line(width / 2,height,this.x,this.y);

                background(33, 252, 223,25);

                bg.style.backgroundColor ="rgba(33, 252, 223,50)";

                laser.play();
                laser.currentTime = 0;

                return true;
            }
        }

        return false;

    }
    this.addScore = function()
    {
        if( (this.added === false) && (this.destroyed === true) )
        {
            localScore++;
            yourScore.innerHTML = localScore;
            this.added = true;
			
			if(localScore > serverHighScore)
				{
					highScore.innerHTML = localScore;	
				}
				
             addToServer();
        }
    }

}


 async function addToServer()
 {
     await axios.post('/count/score',{"count" : 1});
     if(localScore > serverHighScore)
     {
		 
         await axios.post('/count/high-score',{"highScore" : localScore});
		 
     }
	 
	 if( (highScore.innerHTML === '0') )
		 {
			 
			 serverHighScore = await axios.get('/get/high-score');
			 serverHighScore = serverHighScore.data.highScore;
			 highScore.innerHTML = serverHighScore;
			 
		 }
 }
function Star()
{
    this.size = random(.5,2);
    this.x = random(0,width);
    this.y = random(0,height);

    this.show = function()
    {
        fill(255);
        noStroke();
        ellipse(this.x,this.y,this.size,this.size);
    }

}

var hearts = [];
var stars = [];
function setup() {

    var mycanvas = createCanvas(700, 350);
    mycanvas.parent("canvas");

    hearts.push(new Heart);

    for(let i = 0; i < 150; i++)
    {
        stars[i] = new Star();
    }

}

function makeVisible()
{
    infoContent.style.visibility = 'visible';
    social.style.visibility = 'visible';
    container.style.visibility = 'hidden';
    aboveFold.innerHTML = 'Tap to close';

    noLoop();
}

function makeHidden()
{
    infoContent.style.visibility = 'hidden';
    social.style.visibility = 'hidden';
    container.style.visibility = 'visible';
    aboveFold.innerHTML = 'Tap for details';
    loop();
}

function changeCanvasSize()
{
    if(turnedBig)
    {
        resizeCanvas(700,350);
    }
    if(turnedSmall)
    {
        resizeCanvas(325,375);
    }
}

function translateInfo()
{
    if(translatedinfovisible === false)
    {
        infosection.style.transform = 'translate(0)';
        translatedinfovisible = true;

        makeVisible();
    }
    else if(translatedinfovisible === true)
    {
        if(turnedBig === true)
        {
            infosection.style.transform = 'translate(-96vw,0)'
            translatedinfovisible = false;

            makeHidden();
        }
        else
        {
            infosection.style.transform = 'translate(0,93vh)'
            translatedinfovisible = false;

            makeHidden();
        }

    }
}

function checkCanvasSize()
{
    if( body.offsetWidth > 600 )
    {
        if(turnedBig === false)
        {
            turnedBig = true;
            turnedSmall = false;
            changeCanvasSize();
            if(translatedinfovisible)
            {
                infosection.style.transform = 'translate(0)'

                makeVisible();
            }
            else
            {
                infosection.style.transform = 'translate(-96vw,0)'

                makeHidden();
            }
        }
    }
    else
    {
        if(turnedSmall === false )
        {
            turnedBig = false;
            turnedSmall = true;
            changeCanvasSize();
            if(translatedinfovisible)
            {
                infosection.style.transform = 'translate(0)'

                makeVisible();
            }
            else
            {
                infosection.style.transform = 'translate(0,93vh)'

                makeHidden();
            }
        }
    }
}


function draw() {

    checkCanvasSize();

    bg.style.backgroundColor ="";
    background(0);

    for(let i = 0; i < 150; i++)
    {
        stars[i].show();
    }

    cursor(CROSS);

    if(frameCount % 30 == 0)
    {
        hearts.push(new Heart);
    }
    for (var i = hearts.length - 1 ; i >= 0  ; i-- )
    {
        hearts[i].update();
        hearts[i].show();
        hearts[i].hits();
        hearts[i].addScore();

        if(hearts[i].offscreen())
        {
            hearts[i].shrink();
            hearts.splice(i,1);
        }

        if(hearts[i].destroyed)
        {
            hearts[i].shrink();

        }
    }



    //push localScore


}
