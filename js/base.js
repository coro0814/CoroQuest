"use strict";

let text;
let pHp;
let pMp;
let eHp;
let nHp;
let nMp;
let nEHp;
let consoleText;
let judge;

window.onload = () => {
    // 初期化
    Initialize();

    /* 初期表示 */
    const start = document.getElementById("start");
    start.addEventListener("click", e => { Start(e); })

    // イベント設定
    const ttack = document.getElementById("attack");
    attack.addEventListener("click", e => { Command.textDisplay("attack", e); }, false);

    const drink = document.getElementById("drink");
    drink.addEventListener("click", e => { Command.textDisplay("drink", e); }, false);

    const think = document.getElementById("think");
    think.addEventListener("click", e => { Command.textDisplay("think", e); }, false);

    const throwSomething = document.getElementById("throwSomething");
    throwSomething.addEventListener("click", e => { Command.textDisplay("throwSomething", e); }, false);

    const retry = document.getElementById("retry");
    retry.addEventListener("click", e => { Initialize(); RetrySet(e); false });

    const bye = document.getElementById("bye");
    bye.addEventListener("click", e => { ByeSet(e); false });

}

function Initialize() {

    /* メイン画面 */
    // コンソールのもじ
    text = document.getElementById("text");
    text.textContent = "いねむり大王があらわれた！";

    consoleText = Array(4);
    consoleText.fill("");

    // ステータス
    let player = new Status("100", "70");

    pHp = document.getElementById("hp");
    pHp.textContent = player.hp;

    pMp = document.getElementById("mp");
    pMp.textContent = player.mp;

    eHp = document.getElementById("enemyHp");
    eHp.value = "50";
}

function Start(e) {
    e.preventDefault();
    const first = document.getElementById("first");
    first.classList.add("screenOff");

    const main = document.getElementById("main");
    main.classList.remove("screenOff");
    Initialize();
}

function Last() {
    const main = document.getElementById("main");
    main.classList.add("screenOff");

    const last = document.getElementById("last");
    last.classList.remove("screenOff");

    const msg = document.getElementById("last-msg");
    if (judge) {
      msg.textContent = "YOU WIN !!!"
    }
    else {
      msg.textContent = "GAME OVER!!"
    }
}

function RetrySet(e) {

    e.preventDefault();
    const last = document.getElementById("last");
    last.classList.add("screenOff");

    const bye = document.getElementById("byebye");
    bye.classList.add("screenOff");

    const first = document.getElementById("first");
    first.classList.remove("screenOff");

    const cnsl = document.getElementById("cnsl");
    cnsl.classList.remove("end");
    cnsl.classList.remove("warning");

    const sts = document.getElementById("sts");
    sts.classList.remove("end");
    sts.classList.remove("warning");

    const player = document.getElementById("player");
    player.classList.remove("p-end");
    player.classList.remove("p-warning");
}
function ByeSet(e) {

    e.preventDefault();

    const last = document.getElementById("last");
    last.classList.add("screenOff");

    const bye = document.getElementById("byebye");
    bye.classList.remove("screenOff");
}

class Command {

    static textDisplay(cmd, e) {
        let text = document.getElementById("text");
        let console = document.getElementById("console");
        let sts = document.getElementById("sts");
        let skipEnemyTurn = false;

        for (let count = 0; count < 5; count++) {
            switch (count) {
                case 0:
                    PlayerCmd.sort(cmd, e);
                    setTimeout(() => {
                        this.display(count);
                    }, 0);
                    break;
                case 1:
                    if (nHp > 0 && nEHp > 0) {
                        setTimeout(() => {
                            EnemyCmd.sort(cmd);
                            this.display(count);
                        }, 1500)
                    }
                    else {
                        skipEnemyTurn = true;
                    };
                    break;
                case 2:
                case 3:
                    let delay = 3000;
                    if (skipEnemyTurn) {
                        delay = 1500;
                    }
                    setTimeout(() => {
                        Status.CheckPlayerHP();
                        Status.CheckEnemyHP();
                        if (consoleText[count] !== "") {
                            this.display(count);
                        }
                    }, delay);
                    break;
                case 4:
                    let delay2 = 5000;
                    if (skipEnemyTurn) {
                        delay2 = 3500;
                    }
                    setTimeout(() => {
                        if (consoleText[3] !== "") {
                            Last();
                        }
                    }, delay2);
                    break;
            }
        }
    }

    static display(count) {
        let text = document.getElementById("text");
        let cnsl = document.getElementById("cnsl");
        let sts = document.getElementById("sts");
        let player = document.getElementById("player");

        if (nHp <= 0) {
            // HP0になったら表示を赤くして終了
            cnsl.classList.add("end");
            sts.classList.add("end");
            player.classList.add("p-end");
        }
        else if (nHp <= 20) {
            // 瀕死の場合表示を黄色にする
            cnsl.classList.add("warning");
            sts.classList.add("warning");
            player.classList.add("p-warning");
        }
        text.innerHTML = consoleText[count];
        pHp.textContent = nHp.toString();
        pMp.textContent = nMp.toString();
        eHp.value = nEHp.toString();
    }
}

class Status {
    constructor(hp, mp) {
        this.hp = hp;
        this.mp = mp;
    }
    static getPlayerHP() {
        pHp = document.getElementById("hp");
        nHp = Number.parseInt(pHp.textContent);
    }
    static getPlayerMP() {
        pMp = document.getElementById("mp");
        nMp = Number.parseInt(pMp.textContent);
    }
    static getEnemyHP() {
        eHp = document.getElementById("enemyHp");
        nEHp = Number.parseInt(eHp.value)
    }
    static CheckPlayerHP() {
        if (nHp <= 0) {
            consoleText[2] = "";
            consoleText[3] = "げんきがなくなった…もうだめだ…";
            judge = false;
        }
        else {
            consoleText[2] = "さあどうする？";
        }
    }
    static CheckEnemyHP() {
        if (nEHp <= 0) {
          consoleText[2] = "";
          consoleText[3] = "むくり。ついにいねむり大王がおきた！！<br>やったぜ！！";
          judge = true;
        }
    }
}

class PlayerCmd {
    static sort(cmd, e) {
        Status.getPlayerHP();
        Status.getPlayerMP();
        Status.getEnemyHP();

        if (cmd === "attack") {
            PlayerCmd.Attack(e);
        }
        else if (cmd === "drink") {
            PlayerCmd.Drink(e);
        }
        else if (cmd === "think") {
            PlayerCmd.Think(e);
        }
        else if (cmd === "throwSomething") {
            PlayerCmd.ThrowSomething(e);
        }
    }
    static Attack(e) {
        e.preventDefault();
        if (nMp >= 100) {
          consoleText[0] = "[じぶん] かいしんのいちげき！<br>おなかをつまんでやる！むにむに！";
          nEHp -= 50;
        }
        else {
          consoleText[0] = "[じぶん] いねむり大王をぶつ！<br>ふりをして、つついた！";
          nEHp -= 10;
        }
    }
    static Drink(e) {
        e.preventDefault();

        consoleText[0] = "[じぶん] ビールをのんだ！ぷはー！<br>やるきがでた！<br>やるきが10ふえた！";

        nMp = Number.parseInt(pMp.textContent) + 10;
    }
    static Think(e) {
        e.preventDefault();

        text = document.getElementById("text");
        const random = Math.floor(Math.random() * 3);

        switch (random) {
            case 0:
                consoleText[0] = "[じぶん] ふとかんがえてみた。おなかすいたな。<br>げんきが30へった…";
                nHp -= 30;
                if (nHp < 0) {
                    nHp = 0;
                }
                break;
            case 1:
                consoleText[0] = "[じぶん] とくになにも思いつかなかった。";
                break;
            case 2:
                consoleText[0] = "[じぶん] てんきがよくてねむくなってきた。<br>うとうと。<br>げんきが5ふえた。";
                nHp += 5;
                break;
        }
    }
    static ThrowSomething(e) {
        e.preventDefault();
        consoleText[0] = "[じぶん] ひまわりの種をいねむり大王の前になげたのに気づかれなかった。かなしみ…<br>げんきが20へった。";
        nHp -= 20;
    }
}
class EnemyCmd {
    static sort(cmd) {
        const random = Math.floor(Math.random() * 2);

        switch (cmd) {
            case "attack":
            case "think":
                if (random === 0) {
                    this.Sleeping();
                }
                else {
                    this.Rolling();
                }
                break;
            case "drink":
                if (random === 0) {
                    this.Rolling();
                }
                else {
                    this.Yawn();
                }
                break;
            case "throwSomething":
                this.Yawn();
                break;
        }
    }
    static Sleeping() {
        consoleText[1] = "[だいおう] いねむり大王のねむけが5ふえた！";

        nEHp += 5;
        eHp.value = nEHp.toString();
    }
    static Rolling() {
        consoleText[1] = "[だいおう] ごろん。ねがえりした。さみしい…<br>げんきが10へった。";

        nHp -= 20;
        if (nHp < 0) {
            nHp = 0;
        }
    }
    static Yawn() {
        consoleText[1] = "[だいおう] ダイナミックあくびをした。<br>むむ？おきそう…？<br>いねむり大王のねむけが10へった。";

        nEHp -= 10;
        eHp.value = nEHp.toString();
    }
}
