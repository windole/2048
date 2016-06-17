var board = new Array();
var score = 0;
var hasConflicted =new Array();

$(document).ready(function () {
	newgame();
});

function newgame() {
	//初始化棋盘格
	init();
	//在随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
    for( var i = 0 ; i < 4 ; i ++ ){
        for( var j = 0 ; j < 4 ; j ++ ){

            var gridCell = $('#grid-cell-'+i+"-"+j);
            gridCell.css('top', getPosTop( i , j ) );
            gridCell.css('left', getPosLeft( i , j ) );
        }
    }

    for (var i = 0; i < 4; i++) {
    	board[i]=new Array();
        hasConflicted[i] =new Array();
    	for(var j = 0;j<4;j++)
    		board[i][j] = 0;
            hasConflicted[i][j]=false;
    	 }

    	 updateBoardView();

         score =0;
}


function updateBoardView(){

    $(".number-cell").remove();
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){
            $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if( board[i][j] == 0 ){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j) + 45 );
                theNumberCell.css('left',getPosLeft(i,j) + 45 );
            }
            else{
                theNumberCell.css('width','90px');
                theNumberCell.css('height','90px');
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ) );
                theNumberCell.css('color',getNumberColor( board[i][j] ) );
                theNumberCell.text( board[i][j] );
            }
            hasConflicted[i][j]=false;
        }
}

function generateOneNumber() {
	if (nospace(board)) 
		return false;
	

	//随机一个位置
	// var randx = parseInt(Math.floor(Math.random()*4));
	// var randy = parseInt(Math.floor(Math.random()*4));
	// while(true){
	// 	if (board[randx][randy]==0) 
	// 		break;
		

	// 	randx = Math.floor(Math.random()*4);
	// 	randy = Math.floor(Math.random()*4);
	// }

    var temp = [];
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j] == 0){
                temp.push(i+","+j);
            }
        }
    }
    var randNum = parseInt(Math.floor(Math.random()*temp.length)),
    randx = parseInt(temp[randNum].split(",")[0]),
    randy = parseInt(temp[randNum].split(",")[1]);

	//随机一个数字

	var randNumber =Math.random() < 0.8 ? 2 : 4;

	//在随机位置显示随机数字
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx,randy,randNumber);
		return true;
	
}

//当按钮被按下时，发生 keydown 事件
$(document).keydown( function( event ){
    switch( event.keyCode ){
        case 37: //left
            if( moveLeft() ){
               setTimeout("generateOneNumber()",250) ;
               setTimeout("isgameover()",300) ;
            }
            break;
        case 38: //up
            if( moveUp() ){
                setTimeout("generateOneNumber()",250) ;
                setTimeout("isgameover()",300) ;
            }
            break;
        case 39: //right
            if( moveRight() ){
                setTimeout("generateOneNumber()",250) ;
                setTimeout("isgameover()",300) ;
            }
            break;
        case 40: //down
            if( moveDown() ){
                setTimeout("generateOneNumber()",250) ;
                setTimeout("isgameover()",300) ;
            }
            break;
        default: //default
            break;
    }
});

function isgameover() {
	if( nospace(board)&&nomove(board)){
        gameover();
    }
}

function gameover() {
    alert("gameover");
}

function moveLeft(){

    if( !canMoveLeft( board ) )
        return false;

    //moveLeft
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 1 ; j < 4 ; j ++ ){
            if( board[i][j] != 0 ){

                for( var k = 0 ; k < j ; k ++ ){
                    if( board[i][k] == 0 && noBlockc( i , k , j , board &&!hasConflicted[i][k]) ){
                        //move
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[i][k] == board[i][j] && noBlockc( i , k , j , board ) ){
                        //move
                        showMoveAnimation( i , j , i , k );
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score+=board[i][k];
                        updateScore(score);
                        hasConflicted[i][k]=true;

                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight(){
    if( !canMoveRight( board ) )
        return false;

    //moveRight
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 2 ; j >= 0 ; j -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > j ; k -- ){

                    if( board[i][k] == 0 && noBlockc( i , j , k , board ) ){
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }
                    else if( board[i][k] == board[i][j] && noBlockc( i , j , k , board )&&!hasConflicted[i][k] ){
                        showMoveAnimation( i , j , i , k);
                        board[i][k] *= 2;
                        board[i][j] = 0;

                        //add score
                        score+=board[i][k];
                        updateScore(score);
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){

    if( !canMoveUp( board ) )
        return false;

    //moveUp
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 1 ; i < 4 ; i ++ ){
            if( board[i][j] != 0 ){
                for( var k = 0 ; k < i ; k ++ ){

                    if( board[k][j] == 0 && noBlockr( j , k , i , board ) ){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockr( j , k , i , board ) &&!hasConflicted[k][j]){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        //add score
                        score+=board[k][j];
                        updateScore(score);
                        hasConflicted[k][j]=true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){
    if( !canMoveDown( board ) )
        return false;

    //moveDown
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 2 ; i >= 0 ; i -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > i ; k -- ){

                    if( board[k][j] == 0 && noBlockr( j , i , k , board ) ){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockr( j , i , k , board ) &&!hasConflicted[k][j]){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        //add score
                        score+=board[k][j];
                        updateScore(score);
                        hasConflicted[k][j]=true;

                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}