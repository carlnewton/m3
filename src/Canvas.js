class Canvas 
{
    constructor(app) 
    {
        this.app = app;
        this.c=document.getElementById("canvas");
        this.ctx = this.c.getContext("2d");
        this.setDimensions();
        this.drawBackground();
    }

    setDimensions() 
    {
        this.c.height = this.c.clientHeight;
        this.c.width = this.c.clientWidth;

        this.topMargin = 0;
        this.leftMargin = 0;

        if (this.app.settings.columns > this.app.settings.rows) {
            this.app.settings.tileSize = this.c.width / this.app.settings.columns;
            
            if (this.c.height < this.app.settings.tileSize * this.app.settings.rows) {
                this.app.settings.tileSize = this.c.height / this.app.settings.rows;
                this.leftMargin = (this.c.width - this.app.settings.tileSize * this.app.settings.columns) / 2;
            } else {
                this.topMargin = (this.c.height - this.app.settings.tileSize * this.app.settings.rows) / 2;
            }
        } else {
            this.app.settings.tileSize = this.c.height / this.app.settings.rows;
            
            if (this.c.width < this.app.settings.tileSize * this.app.settings.columns) {
                this.app.settings.tileSize = this.c.width / this.app.settings.columns;
                this.topMargin = (this.c.height - this.app.settings.tileSize * this.app.settings.rows) / 2;
            } else {
                this.leftMargin = (this.c.width - this.app.settings.tileSize * this.app.settings.columns) / 2;
            }
        }
    }

    draw()
    {

        for (var row = 0; row < this.app.grid.grid.length; row++)
        {
            for (var cell = 0; cell < this.app.grid.grid[0].length; cell++)
            {
                if (this.app.grid.grid[row][cell] !== -1) {
                    var colour = this.app.tileTypes.list[
                        this.app.grid.grid[row][cell]
                    ].colour;

                this.drawSquare(colour, cell, row);

                if (this.app.grid.matchExists(row, cell))
                {
                    this.drawMatch(cell, row);
                }
                }
            }
        }
    }

    drawBackground()
    {
        this.ctx.fillStyle = this.app.settings.backgroundColour;
        this.ctx.fillRect(0, 0, this.c.width, this.c.height);
    }

    drawSquare(colour, x, y)
    {
        this.ctx.fillStyle = colour;
        this.ctx.fillRect(
            Math.floor(
                this.leftMargin + x * this.app.settings.tileSize
            ), 
            Math.floor(
                this.topMargin + y * this.app.settings.tileSize
            ), 
            Math.ceil(
                this.app.settings.tileSize
            ), 
            Math.ceil(
                this.app.settings.tileSize
            )
        );

        this.ctx.fillStyle = 'rgba(0,0,0, 0.05)';
        this.ctx.fillRect(
            Math.floor(
                this.leftMargin + x * this.app.settings.tileSize + (this.app.settings.tileSize / 4)
            ), 
            Math.floor(
                this.topMargin + y * this.app.settings.tileSize + (this.app.settings.tileSize / 4)
            ), 
            Math.ceil(
                this.app.settings.tileSize / 2
            ), 
            Math.ceil(
                this.app.settings.tileSize / 2
            )
        );
    }

    drawMatch(x, y)
    {
        this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
        this.ctx.fillRect(
            Math.floor(
                this.leftMargin + x * this.app.settings.tileSize
            ), 
            Math.floor(
                this.topMargin + y * this.app.settings.tileSize
            ), 
            Math.ceil(
                this.app.settings.tileSize
            ), 
            Math.ceil(
                this.app.settings.tileSize
            )
        );
    }
}
