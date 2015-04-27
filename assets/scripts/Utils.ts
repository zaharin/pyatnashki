function random(max: number): number {
    return Math.floor(Math.random() * max);
}

function getSpacing(): number {
    var elementTmp: HTMLDivElement = document.createElement('div');
    elementTmp.className = 'standard-spacing';
    document.body.appendChild(elementTmp);

    var spacing = elementTmp.clientWidth;
    document.body.removeChild(elementTmp);

    return spacing;
}

function createPiece(side: number): HTMLElement {
    var elementPiece = document.createElement('div');
    elementPiece.className = 'piece';
    elementPiece.style.width = side + 'px';
    elementPiece.style.height = side + 'px';

    var elementPieceInner = document.createElement('span');
    elementPieceInner.style.fontSize = side * .5 + 'px';
    elementPieceInner.style.lineHeight = side + 'px';

    elementPiece.appendChild(elementPieceInner);
    return elementPiece;
}

function timeToStr(time) {
    var timeSec: any = time / 1000;
    var timeMin: any = Math.floor(timeSec / 60);
    timeSec = Math.floor(timeSec - timeMin * 60);

    if (timeMin < 10) timeMin = '0' + timeMin;
    if (timeSec < 10) timeSec = '0' + timeSec;

    return timeMin + ':' + timeSec;
}
