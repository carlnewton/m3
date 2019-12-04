function getValue(t){return JSON.parse(JSON.stringify(t))}class Controls{constructor(t){this.app=t,this.dragging=!1,this.listen(),this.downPos={x:0,y:0}}listen(){var t=this,i=function(i){switch(t.dragging=!0,i.type){case"mousedown":t.downPos.x=i.clientX,t.downPos.y=i.clientY;break;case"touchstart":t.downPos.x=i.touches[0].clientX,t.downPos.y=i.touches[0].clientY}},s=function(){t.dragging=!1},e=function(i){switch(i.type){case"mousemove":var s=i.clientX,e=i.clientY;break;case"touchmove":s=i.touches[0].clientX,e=i.touches[0].clientY}if(t.dragging)if(Math.abs(t.downPos.x-s)>this.app.settings.tileSize/2){t.dragging=!1;var h="left";t.downPos.x<s&&(h="right"),t.app.grid.switchTile(t.downPos,h)}else if(Math.abs(t.downPos.y-e)>this.app.settings.tileSize/2){t.dragging=!1;h="up";t.downPos.y<e&&(h="down"),t.app.grid.switchTile(t.downPos,h)}};window.addEventListener("mousedown",i,!1),window.addEventListener("touchstart",i,!1),window.addEventListener("mouseup",s,!1),window.addEventListener("touchend",s,!1),window.addEventListener("mousemove",e,!1),window.addEventListener("touchmove",e,!1)}}class Settings{constructor(){this.tileSize=0,this.columns=7,this.rows=12,this.backgroundColour="rgb(0,0,0)",this.restTime=.3}}class TileTypes{constructor(){this.list=[{image:"parrot"},{image:"gorilla"},{image:"chick"},{image:"crocodile"},{image:"narwhal"}]}}class Tile{constructor(t){this.type=t}}class Grid{constructor(t){this.app=t,this.matches=[],this.changes=[],this.new(),this.mode="wait",this.remainingRestTime=this.app.settings.restTime}new(){this.grid=[];for(var t=0;t<this.app.settings.rows;t++){this.grid[t]=[];for(var i=0;i<this.app.settings.columns;i++)this.grid[t][i]=Math.floor(Math.random()*Math.floor(this.app.tileTypes.list.length)),this.changes.push([t,i])}}tick(){if(this.remainingRestTime>0)this.remainingRestTime-=this.app.delta/1e3;else switch(this.mode){case"wait":this.mode="check";break;case"check":this.changes=[],this.findMatches(),this.mode="pop",this.remainingRestTime=this.app.settings.restTime;break;case"pop":this.popMatches(),this.mode="drop";break;case"drop":this.dropColumns(),this.full()&&(this.mode="wait",this.remainingRestTime=this.app.settings.restTime)}}switchTile(t,i){var s=this.getTileFromCoords(t.x,t.y);if(void 0!==s){var e=s[0]-1,h=s[1]-1,a=e,n=h;switch(i){case"up":e>0&&(a=e-1);break;case"down":e<this.app.settings.rows-1&&(a=e+1);break;case"left":h>0&&(n=h-1);break;case"right":h<this.app.settings.columns-1&&(n=h+1)}if(a!==e||n!==h){var r=getValue(this.grid[e][h]);if(this.grid[e][h]=getValue(this.grid[a][n]),this.grid[a][n]=r,this.findMatches(),0===this.matches.length){r=getValue(this.grid[e][h]);this.grid[e][h]=getValue(this.grid[a][n]),this.grid[a][n]=r}else this.changes.push([e,h],[a,n])}}}tileChanged(t,i){for(let s of this.changes)if(s[0]===t&&s[1]===i)return!0;return!1}getTileFromCoords(t,i){var s=Math.ceil((i-this.app.canvas.topMargin)/this.app.settings.tileSize),e=Math.ceil((t-this.app.canvas.leftMargin)/this.app.settings.tileSize);if(s>0&&s<=this.app.settings.rows&&e>0&&e<=this.app.settings.columns)return[s,e]}full(){for(let t of this.grid)for(let i of t)if(-1===i)return!1;return!0}dropColumns(){var t=0;for(let s of this.grid){var i=0;for(let e of s)-1===e&&void 0!==this.grid[t-1]&&(this.grid[t][i]=getValue(this.grid[t-1][i]),this.grid[t-1][i]=-1,this.changes.push([t,i],[t-1,i])),i++;t++}this.generateRow()}generateRow(){var t=0;for(let i of this.grid[0])-1===i&&(this.grid[0][t]=Math.floor(Math.random()*Math.floor(this.app.tileTypes.list.length)),this.changes.push([0,t])),t++}matchExists(t,i){for(let s of this.matches)if(s==t+","+i)return!0;return!1}popMatches(){for(let i of this.matches){var t=i.split(",");this.grid[parseInt(t[0])][parseInt(t[1])]=-1}this.matches=[]}findMatches(){var t=0;for(let r of this.grid){var i=0;for(let o of r){for(var s=i+1,e=1,h=1;s<=r.length&&o===r[s];)e++,s+=1;for(var a=t+1;a<this.grid.length&&o===this.grid[a][i];)h++,a+=1;if(e>2)for(var n=0;n<e;)this.matchExists(t,i+n)||this.matches.push(t+","+(i+n)),n++;if(h>2)for(n=0;n<h;)this.matchExists(t+n,i)||this.matches.push(t+n+","+i),n++;i++}t++}}}class Canvas{constructor(t){this.app=t,this.c=document.getElementById("canvas"),this.ctx=this.c.getContext("2d"),this.setDimensions(),this.drawBackground()}setDimensions(){this.c.height=this.c.clientHeight,this.c.width=this.c.clientWidth,this.topMargin=0,this.leftMargin=0,this.app.settings.columns>this.app.settings.rows?(this.app.settings.tileSize=this.c.width/this.app.settings.columns,this.c.height<this.app.settings.tileSize*this.app.settings.rows?(this.app.settings.tileSize=this.c.height/this.app.settings.rows,this.leftMargin=(this.c.width-this.app.settings.tileSize*this.app.settings.columns)/2):this.topMargin=(this.c.height-this.app.settings.tileSize*this.app.settings.rows)/2):(this.app.settings.tileSize=this.c.height/this.app.settings.rows,this.c.width<this.app.settings.tileSize*this.app.settings.columns?(this.app.settings.tileSize=this.c.width/this.app.settings.columns,this.topMargin=(this.c.height-this.app.settings.tileSize*this.app.settings.rows)/2):this.leftMargin=(this.c.width-this.app.settings.tileSize*this.app.settings.columns)/2)}draw(){for(var t=0;t<this.app.grid.grid.length;t++)for(var i=0;i<this.app.grid.grid[0].length;i++)if(-1!==this.app.grid.grid[t][i]&&this.app.grid.tileChanged(t,i)){var s=this.app.tileTypes.list[this.app.grid.grid[t][i]].image;this.drawSquare(s,i,t),this.app.grid.matchExists(t,i)&&this.drawMatch(i,t)}}drawBackground(){this.ctx.fillStyle=this.app.settings.backgroundColour,this.ctx.fillRect(0,0,this.c.width,this.c.height)}drawSquare(t,i,s){var e=new Image,h=this;e.onload=function(){h.ctx.drawImage(e,h.leftMargin+i*h.app.settings.tileSize,h.topMargin+s*h.app.settings.tileSize,h.app.settings.tileSize,h.app.settings.tileSize)},e.src="dist/img/"+t+".png"}drawMatch(t,i){this.ctx.fillStyle="rgba(0,0,0,0.3)",this.ctx.fillRect(Math.floor(this.leftMargin+t*this.app.settings.tileSize),Math.floor(this.topMargin+i*this.app.settings.tileSize),Math.ceil(this.app.settings.tileSize),Math.ceil(this.app.settings.tileSize))}}class App{constructor(){this.settings=new Settings,this.controls=new Controls(this),this.canvas=new Canvas(this),this.tileTypes=new TileTypes,this.grid=new Grid(this),this.lastTickUpdate=Date.now(),this.delta=0,this.run()}run(){var t=this;this.loop=setInterval(function(){t.tick()},0)}tick(){var t=Date.now();this.delta=t-this.lastTickUpdate,this.lastTickUpdate=t,this.grid.tick(),this.grid.changes.length&&this.canvas.draw()}}var app=new App;window.onresize=function(t){app.canvas.setDimensions()};