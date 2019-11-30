class Grid
{
    constructor(app)
    {
        this.app = app;
        this.new();
        this.matches = [];
        this.mode = 'wait';
        this.remainingRestTime = this.app.settings.restTime;
    }

    new()
    {
        this.grid = [];
        for (var row = 0; row < this.app.settings.rows; row++)
        {
            this.grid[row] = [];
            for (var cell = 0; cell < this.app.settings.columns; cell++)
            {
                this.grid[row][cell] = Math.floor(Math.random() * Math.floor(this.app.tileTypes.list.length));
            }
        }
    }

    tick()
    {
        if (this.remainingRestTime > 0)
        { 
            this.remainingRestTime -= this.app.delta / 1000;
            return;
        }

        switch (this.mode)
        {
            case 'wait':
                this.mode = 'check';
                break;

            case 'check':
                this.findMatches();
                this.mode = 'pop';
                this.remainingRestTime = this.app.settings.restTime;
                break;

            case 'pop':
                this.popMatches();
                this.mode = 'drop';
                break;

            case 'drop':
                this.dropColumns();

                if (this.full())
                {
                    this.mode = 'wait';
                    this.remainingRestTime = this.app.settings.restTime;
                }
                break;
        }
    }

    switchTile(position, direction)
    {
        var tile = this.getTileFromCoords(position.x, position.y);
        
        if (tile === undefined) {
            return;
        }

        var row = tile[0] - 1;
        var cell = tile[1] - 1;

        switch(direction)
        {
            case 'up':
                if (row > 0) {
                    var cellValue = getValue(this.grid[row][cell]);
                    this.grid[row][cell] = getValue(this.grid[row - 1][cell]);
                    this.grid[row - 1][cell] = cellValue;
                }

                this.findMatches();

                if (this.matches.length === 0) {
                    var cellValue = getValue(this.grid[row][cell]);
                    this.grid[row][cell] = getValue(this.grid[row - 1][cell]);
                    this.grid[row - 1][cell] = cellValue;
                }
                break;
            case 'down':
                if (row < this.app.settings.rows - 1) {
                    var cellValue = getValue(this.grid[row][cell]);
                    this.grid[row][cell] = getValue(this.grid[row + 1][cell]);
                    this.grid[row + 1][cell] = cellValue;
                }

                this.findMatches();

                if (this.matches.length === 0) {
                    var cellValue = getValue(this.grid[row][cell]);
                    this.grid[row][cell] = getValue(this.grid[row + 1][cell]);
                    this.grid[row + 1][cell] = cellValue;
                }
                break;
            case 'left':
                if (cell > 0) {
                    var cellValue = getValue(this.grid[row][cell]);
                    this.grid[row][cell] = getValue(this.grid[row][cell - 1]);
                    this.grid[row][cell - 1] = cellValue;
                }

                this.findMatches();

                if (this.matches.length === 0) {
                    var cellValue = getValue(this.grid[row][cell]);
                    this.grid[row][cell] = getValue(this.grid[row][cell - 1]);
                    this.grid[row][cell - 1] = cellValue;
                }
                break;
            case 'right':
                if (cell < this.app.settings.columns - 1) {
                    var cellValue = getValue(this.grid[row][cell]);
                    this.grid[row][cell] = getValue(this.grid[row][cell + 1]);
                    this.grid[row][cell + 1] = cellValue;
                }

                this.findMatches();

                if (this.matches.length === 0) {
                    var cellValue = getValue(this.grid[row][cell]);
                    this.grid[row][cell] = getValue(this.grid[row][cell + 1]);
                    this.grid[row][cell + 1] = cellValue;
                }
                break;
        }

    }

    getTileFromCoords(x, y)
    {
        var row = Math.ceil((y - this.app.canvas.topMargin) / this.app.settings.tileSize);
        var cell = Math.ceil((x - this.app.canvas.leftMargin) / this.app.settings.tileSize);

        if (row > 0 && row <= this.app.settings.rows && cell > 0 && cell <= this.app.settings.columns) {
            return [row, cell];
        }
    }

    full()
    {
        for (let row of this.grid)
        {
            for (let cell of row)
            {
                if (cell === -1)
                {
                    return false;
                }
            }
        }

        return true;
    }

    dropColumns()
    {
        var rowCount = 0;
        for (let row of this.grid)
        {
            var cellCount = 0;
            for (let cell of row)
            {   
                if (cell === -1 && this.grid[rowCount - 1] !== undefined)
                {
                    this.grid[rowCount][cellCount] = getValue(this.grid[rowCount - 1][cellCount]);
                    this.grid[rowCount - 1][cellCount] = -1;
                }
                cellCount++;
            }
            rowCount++;
        }

        this.generateRow();
    }

    generateRow()
    {
        var cellCount = 0;
        for (let cell of this.grid[0])
        {
            if (cell === -1) {
                this.grid[0][cellCount] = Math.floor(Math.random() * Math.floor(this.app.tileTypes.list.length));
            }

            cellCount++;
        }
    }

    matchExists(row, cell)
    {
        for (let match of this.matches)
        {
            if (match == row + ',' + cell) {
                return true;
            }
        }

        return false;
    }

    popMatches()
    {
        for (let match of this.matches)
        {
            var matchCoords = match.split(',');
            this.grid[parseInt(matchCoords[0])][parseInt(matchCoords[1])] = -1;
        }
        this.matches = [];
    }

    findMatches()
    {
        var rowCount = 0;
        for (let row of this.grid)
        {
            var cellCount = 0;
            for (let cellValue of row)
            {
                var checkCell = cellCount + 1,
                    sameRowCount = 1,
                    sameColCount = 1;

                while (checkCell <= row.length)
                {
                    if (cellValue !== row[checkCell])
                    {
                        break;
                    }

                    sameRowCount++;

                    checkCell += 1;
                }

                var checkRow = rowCount + 1;

                while (checkRow < this.grid.length)
                {
                    if (cellValue !== this.grid[checkRow][cellCount])
                    {
                        break;
                    }

                    sameColCount++;

                    checkRow += 1;
                }

                if (sameRowCount > 2) 
                {
                    var samePos = 0;
                    while (samePos < sameRowCount) {
                        if (!this.matchExists(rowCount, cellCount + samePos))
                        {
                            this.matches.push(rowCount + ',' + (cellCount + samePos));
                        }
                        samePos++;
                    }
                }

                if (sameColCount > 2) 
                {
                    var samePos = 0;
                    while (samePos < sameColCount) {
                        if (!this.matchExists(rowCount + samePos, cellCount))
                        {
                            this.matches.push((rowCount + samePos) + ',' + cellCount);
                        }
                        samePos++;
                    }
                }
                
                cellCount++;
            }
            rowCount++;
        }
    }
}
