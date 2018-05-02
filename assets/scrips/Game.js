// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // 这个属性引用了星星预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 2,
        // 星星持续时间
        starDuration: 6,
        // 地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: cc.Node
        },
        
        // 游戏总时间
        gameTimer: 0,

        /** for debug
        gameTimerDisplay: {
            default: null,
            type: cc.Label
        },
        **/

        

        // 游戏得分
        score: 0,
        
        scoreDisplay: {
            default: null,
            type: cc.Label
        },

        // 得分音效资源
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        },


    },

    gameOver: function(){
        //停止 player 节点的跳跃动作
        this.player.stopAllActions(); 
        cc.director.loadScene('game');

    },

    
    updateGameScore: function(){
        this.score += 1;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        cc.audioEngine.playEffect(this.scoreAudio, false);

    },
    


    spawnNewStar: function() {
        // 使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        // 将 Game 组件的实例传入星星组件
        newStar.getComponent('Star').game = this;
    },

    getNewStarPosition: function () {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + cc.random0To1() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.node.width/2;
        randX = cc.randomMinus1To1() * maxX;
        // 返回星星坐标
        return cc.p(randX, randY);
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height/2;
        // 生成一个新的星星
        this.spawnNewStar();
    },

    // start () {},

    
    
    update (dt) {
        
        // 更新游戏总时间
        this.gameTimer += dt;


        // 每N秒减少出现时间加大难度（向下取整）
        if(Math.floor(this.gameTimer/8) >=1 ){
            if(this.starDuration > this.minStarDuration){
                this.starDuration -= 0.5; 
                this.gameTimer = 0;   
            }
            
        }

        // for debug
        // this.gameTimerDisplay.string = 'Dura: ' + this.starDuration.toString();




    },
    
    
});
