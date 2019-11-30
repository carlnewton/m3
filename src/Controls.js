class Controls
{
    constructor(app)
    {
        this.app = app;
        this.dragging = false;
        this.listen();
        this.downPos = { x: 0, y: 0 };
    }

    listen()
    {
        var _this = this;
        window.addEventListener('mousedown', function(event) {
            _this.dragging = true;
            _this.downPos.x = event.clientX;
            _this.downPos.y = event.clientY;
        });

        window.addEventListener('mouseup', function() {
            _this.dragging = false;
        });

        window.addEventListener('mousemove', function(event) {
            if (_this.dragging) {
                if (Math.abs(_this.downPos.x - event.clientX) > this.app.settings.tileSize / 2) {
                    _this.dragging = false;

                    var direction = 'left';
                    if (_this.downPos.x < event.clientX) {
                        direction = 'right';
                    }

                    _this.app.grid.switchTile(_this.downPos, direction);

                } else if (Math.abs(_this.downPos.y - event.clientY) > this.app.settings.tileSize / 2) {
                    _this.dragging = false;

                    var direction = 'up';
                    if (_this.downPos.y < event.clientY) {
                        direction = 'down';
                    }

                    _this.app.grid.switchTile(_this.downPos, direction);
                }
            }
        });
    }
}
