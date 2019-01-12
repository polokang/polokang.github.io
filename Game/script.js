// your logic here
var cardArray = ['aws', 'css3', 'github', 'heroku', 'html5', 'js', 'linkedin', 'nodejs', 'react', 'sass'];
var curCard = null;
var curCardDom = null;
var canClick = true;
var MEMMM = {
    sumTime: 60,
    timeId: null,
    level: 1,
    score: 0,
    isStart: false
}

bindKeyPress();

function startTimer() {
    if (MEMMM.sumTime <= 0) {
        canClick = false;
        clearTimeout(MEMMM.timeId);
        alert("Game over!")
        return;
    }
    var timerDom = document.querySelector('.game-timer__bar');
    MEMMM.sumTime = MEMMM.sumTime - 1;
    var timeStr = '';
    timeStr = 'width:' + MEMMM.sumTime / 60 * 100 + '%';
    timerDom.style = timeStr;
    timerDom.innerHTML = MEMMM.sumTime + 's';
    MEMMM.timeId = setTimeout("startTimer()", 1000)
}

function endGame() {
    clearTimeout(MEMMM.timeId);
    var timerDom = document.querySelector('.game-timer__bar');
    MEMMM.sumTime = 60;
    var timeStr = '';
    timeStr = 'width:' + MEMMM.sumTime / 60 * 100 + '%';
    timerDom.style = timeStr;
    timerDom.innerHTML = MEMMM.sumTime + 's';
}


function bindKeyPress() {
    var keys = document.querySelector('.game-stats__button');
    keys.addEventListener('click', function (event) {
        var target = event.target;
        if (target.matches('button')) {
            if(MEMMM.timeId != null){
                MEMMM.sumTime = 60;
                MEMMM.level = 1;
                MEMMM.score = 0;
                clearTimeout(MEMMM.timeId);
            }
            startNewGame(MEMMM.level);
        }
    })
}

function addScore(score){
    var scoreDom = document.querySelector('.game-stats__score--value');
    MEMMM.score = MEMMM.score+score;
    scoreDom.innerHTML = MEMMM.score;
}

function clickCard(dom) {
    if (dom.className.includes("card--flipped") || canClick === false) {    //the card has flipped.
        
    } else {
        var clipName = dom.className + ' ' + 'card--flipped';
        dom.className = clipName;   //flip the card
        if (curCard === null) {   // flip the first card.
            curCard = dom.getAttribute('data-tech');
            curCardDom = dom;
        } else {  //flip the second card
            if (curCard === dom.getAttribute('data-tech')) {
                addScore(10);
                curCard = null;
                curCardDom = null;
                if(document.querySelectorAll('.card--flipped').length === MEMMM.level*2*MEMMM.level*2){
                    if(MEMMM.level<3){
                        MEMMM.level = MEMMM.level+1;
                        endGame();
                        startNewGame(MEMMM.level)
                    }
                }

            } else {
                canClick = false;
                setTimeout(function(){flipCard(dom, curCardDom);}, 1200);
            }
            
        }
    }
}

function flipCard(dom, curCardDom) {
    curCardDom.className = 'card ' + curCard;   //flip the pre card
    dom.className = dom.className.replace("card--flipped", "");
    curCard = null;
    curCardDom = null;
    canClick = true;
}

/**
 * 
 * @param {幂} power 
 * 随机选出 幂次*幂次/2 张牌，放入幂次*幂次数组中
 * 将数组顺序打乱
 */
function getCardNameList(power) {
    var arr = [];
    var cnt = 0;
    var cardIdx = 0;
    for (var i = 0; i < power; i++) {
        for (var j = 0; j < power / 2; j++) {
            cardIdx = Math.floor(Math.random() * 10);
            arr[cnt] = cardArray[cardIdx];
            arr[cnt + 1] = cardArray[cardIdx];
            cnt = cnt + 2;
        }
    }

    var len = arr.length;
    for (var i = 0; i < len - 1; i++) {
        var index = parseInt(Math.random() * (len - i));
        var temp = arr[index];
        arr[index] = arr[len - i - 1];
        arr[len - i - 1] = temp;
    }

    return arr;
}

function startNewGame(level) {
    var dom = document.querySelector('.game-board');
    var newDom = document.createElement('div');
    var cardNameList = [];
    canClick = true;
    var newBoard = '';
    switch (level) {
        case 1:
            dom.style = 'grid-template-columns: 1fr 1fr;';
            cardNameList = getCardNameList(2);
            break;
        case 2:
            dom.style = 'grid-template-columns: 1fr 1fr 1fr 1fr;';
            cardNameList = getCardNameList(4);
            break;
        case 3:
            dom.style = 'grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;';
            cardNameList = getCardNameList(6);
            break;
        default:
            break;
    }
    for (var idx = 0; idx < cardNameList.length; idx++) {
        newBoard = getCard(cardNameList[idx]) + newBoard;

    }
    dom.innerHTML = newBoard;

    var levelDom = document.querySelector('.game-stats__level--value');
    levelDom.innerHTML = MEMMM.level;

    var cardKeys = document.querySelectorAll('.card');
    for (var i = 0; i < cardKeys.length; i++) {
        cardKeys[i].addEventListener('click', function (event) {
            clickCard(this);
        })
    }

    startTimer();
}

function getCard(type) {
    var className = 'card ' + type;
    var htmlTag = '<div class="' + className + '" data-tech="' + type + '"><div class="card__face card__face--front"></div><div class="card__face card__face--back"></div></div>';
    return htmlTag;
}