class App
{
    constructor()
    {
        this.settings = new Settings();
        this.controls = new Controls(this);
        this.canvas = new Canvas(this);
        this.tileTypes = new TileTypes();
        this.grid = new Grid(this);
        this.lastTickUpdate = Date.now();
        this.delta = 0;

        this.run();
    }

    run()
    {
        var _this = this;
        this.loop = setInterval(function() {_this.tick()}, 0);
    }

    tick()
    {
        var now = Date.now();
        this.delta = now - this.lastTickUpdate;
        this.lastTickUpdate = now;
        this.grid.tick();
        this.canvas.draw();
    }
}
