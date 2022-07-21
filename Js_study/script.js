//reference https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript

let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');


let img = new Image();
img.onload = function(x, y, angle) {
    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(angle * Math.PI/180);
    ctx.drawImage(document.getElementById('target'), -10, -10, 20, 20);
    
    ctx.restore();
}


let ball = {
    radius: 10,
    x: 0,
    y: 0,
    v_x: 0,
    v_y: 0,
    rotate_angle: 0,
    color: "#0095DD",

    v: 0
};

ball.draw = function() {

    img.onload(this.x , this.y, this.rotate_angle);
    ctx.beginPath();
    //ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
}

ball.detect_collision_with_screen = function() {
    if( this.x < this.radius || this.x > canvas.width - this.radius) {
        this.v_x = -this.v_x;
    }
    if( this.y < this.radius ) {
        this.v_y = -this.v_y;
    }
    if( this.y + this.v_y > canvas.height - this.radius) {
        alert("Game over");
        document.location.reload();
        clearInterval(interval);
    }
}

ball.detect_collision_with_paddle = function() {
    if( this.y + this.v_y > canvas.height - this.radius - paddle.height) {
        if( this.x > paddle.x && this.x < paddle.x + paddle.width) {
            if( this.x == paddle.x + paddle.width/2) {
                this.v_y = -this.v_y;
            }
            else{

                var axis_rotation_theta = Math.PI * 3/4 - (ball.x - paddle.x) * (Math.PI / 2) / paddle.width;
                var ball_incidence_theta = Math.acos( -ball.v_x / ball.v )
                
                ball.v_x = ball.v * Math.cos( ball_incidence_theta - 2 * (ball_incidence_theta - axis_rotation_theta) );
                ball.v_y = -Math.abs( ball.v * Math.sin( ball_incidence_theta - 2 * (ball_incidence_theta - axis_rotation_theta) ) );

                if( ball.v_y > -0.3) {
                    ball.v_y -= 0.4;

                }
            }
        }
    }

}

ball.move = function() {
    this.x += this.v_x;
    this.y += this.v_y;
    this.rotate_angle = (this.rotate_angle + 2) %360;
}

let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if( e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if( e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if( e.key == "Right" || e.key == "ArrowRight" ) {
        rightPressed = false;
    }
    else if( e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }

}

let paddle = {
    height: 10,
    width: 75,
    x: 0,
    y: 0,
    v_x: 0,

    color: "#0095DD",
};

paddle.draw = function() {
    ctx.beginPath();
    ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
}

paddle.detect_move = function() {
    if(rightPressed) {
        paddle.x += paddle.v_x;
        if(paddle.x + paddle.width > canvas.width) {
            paddle.x = canvas.width - paddle.width;
        }
    }
    else if(leftPressed) {
        paddle.x -= paddle.v_x;
        if(paddle.x < 0) {
            paddle.x = 0;
        }
    }
}

let brick = {
    row_count: 5,
    column_count: 3,
    width: 75,
    height: 20,
    padding: 10,
    offset_top: 30,
    offset_left: 30,

    bricks: [],
    color: "#0095DD",
    colors: [],
};

brick.set_colors = function() {
    for(var r = 0; r < this.row_count; r++) {
        var red   = parseInt( parseInt("00", 16) * (r/(this.row_count-1)) );
        var green = parseInt( parseInt("95", 16) * (r/(this.row_count-1)) );
        var blue  = parseInt( parseInt("DD", 16) * (r/(this.row_count-1)) );
        red   = red.toString(16);
        green = green.toString(16);
        blue  = blue.toString(16);

        if(red.length < 2) red = "0" + red;
        if(green.length < 2) green = "0" + green;
        if(blue.length < 2) blue = "0" + blue;

        this.colors[r] = "#" + red.toString(16) + green.toString(16) + blue.toString(16);
        console.log(this.colors[r]);
    }
    
}

brick.make_bricks = function() {
    for( var r = 0; r < brick.row_count; r++) {
        brick.bricks[r] = [];
        for( var c = 0; c < brick.column_count; c++) {
            brick.bricks[r][c] = {
                x: 0,
                y: 0,
                status: brick.row_count - r,
            };
        }
    }
}

brick.draw = function() {
    for(var r = 0; r < this.row_count; r++) {
        for( var c = 0; c < this.column_count; c++) {
            if( this.bricks[r][c].status >= 1) {

                var brick_x = (r * (this.width + this.padding)) + this.offset_left;
                var brick_y = (c * (this.height + this.padding)) + this.offset_top;


                this.bricks[r][c].x = brick_x;
                this.bricks[r][c].y = brick_y;
 
                ctx.beginPath();
                ctx.rect(brick_x, brick_y, this.width,this.height);
                ctx.fillStyle = this.colors[this.bricks[r][c].status - 1];
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function set_game() {

    ball.x = canvas.width/2;
    ball.y = canvas.height - 30;
    ball.v = 3 //near 2sqrt(2)
    ball.v_x = 2;
    ball.v_y = -2;
    
    paddle.x = (canvas.width - paddle.width) / 2;
    paddle.y = (canvas.height - paddle.height);
    paddle.v_x = 7;



    brick.make_bricks();
    brick.set_colors();

    
}

let score = 0;



function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function collisionDetection() {
    for(var r = 0; r < brick.row_count; r++) {
        for(var c = 0; c < brick.column_count; c++ ) {
            var b = brick.bricks[r][c];
            if(b.status >= 1) {

                if( ball.x >= b.x - ball.radius&& ball.x <= b.x + brick.width + ball.radius&& ball.y >= b.y - ball.radius && ball.y <= b.y + brick.height + ball.radius) {
                    
                    if(ball.x >= b.x - ball.radius&& ball.x <= b.x + brick.width + ball.radius&& ball.y >= b.y && ball.y <= b.y + brick.height)
                    {
                        ball.v_x = -ball.v_x;
                    }
                    else{
                        ball.v_y = -ball.v_y;
                    }
                    
                    b.status = b.status - 1;

                    score++;

                    if( score == 5*4*3*2*1 * brick.column_count ) {
                        alert("you win");
                        document.location.reload();
                        clearInterval(interval);
                    }
                    r = brick.row_count;
                    break;
                }
            }
        }
    }
}

let _angle = 0;
function draw() {

    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawScore();

    brick.draw();
    ball.draw();
    paddle.draw();

    collisionDetection();

    ball.detect_collision_with_screen();
    ball.detect_collision_with_paddle();


    paddle.detect_move();
    ball.move();

}
set_game();
var interval = setInterval(draw, 10);