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

        var down = function (event)
        {
            _this.dragging = true;
            switch (event.type)
            {
                case 'mousedown':
                    _this.downPos.x = event.clientX;
                    _this.downPos.y = event.clientY;
                    break;
                case 'touchstart':
                    _this.downPos.x = event.touches[0].clientX;
                    _this.downPos.y = event.touches[0].clientY;
                    break;
            }
        }

        var up = function ()
        {
            _this.dragging = false;
        }

        var move = function (event)
        {
            switch (event.type)
            {
                case 'mousemove':
                    var clientX = event.clientX;
                    var clientY = event.clientY;
                    break;
                case 'touchmove':
                    var clientX = event.touches[0].clientX;
                    var clientY = event.touches[0].clientY;
                    break;
            }

            if (_this.dragging) {
                if (Math.abs(_this.downPos.x - clientX) > this.app.settings.tileSize / 2) {
                    _this.dragging = false;

                    var direction = 'left';
                    if (_this.downPos.x < clientX) {
                        direction = 'right';
                    }

                    _this.app.grid.switchTile(_this.downPos, direction);

                } else if (Math.abs(_this.downPos.y - clientY) > this.app.settings.tileSize / 2) {
                    _this.dragging = false;

                    var direction = 'up';
                    if (_this.downPos.y < clientY) {
                        direction = 'down';
                    }

                    _this.app.grid.switchTile(_this.downPos, direction);
                }
            }
        }
        
        window.addEventListener('mousedown', down, false);
        window.addEventListener('touchstart', down, false);

        window.addEventListener('mouseup', up, false);
        window.addEventListener('touchend', up, false);

        window.addEventListener('mousemove', move, false);
        window.addEventListener('touchmove', move, false);
    }
}
