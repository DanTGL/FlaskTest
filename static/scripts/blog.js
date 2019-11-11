"use strict";

var open = false;

/* Set the width of the side navigation and the left margin of the page content to 250px */
function openNav() {
    if (open) {
        closeNav();
        return;
    }

    //document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("mySidenav").style.width = "250px";
    //document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    //document.getElementById("main").style.backgroundColor = "rgba(0,0,0,0.4)";
    //document.getElementById("main").style.left = "250px";
    open = true;
}

/* Set the width of the side navigation and the left margin of the page content to 0 */
function closeNav() {
    if (open == false) {
        return;
    }

    document.getElementById("mySidenav").style.width = "0";
    //document.getElementById("main").style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
    // document.getElementById("main").style.backgroundColor = "white";
    document.getElementById("main").style.left = "10%";
    document.getElementById("main").style.transition = "0s";
    open = false;
}

function pressed() {
    alert("Pressed Button");
}

var rectX = 200;
var rectY = 200;

function keyDown(event) {
    console.log(event.keyCode);
    if (event.keyCode == 37) {
        rectX -= 10;
    } else if (event.keyCode == 38) {
        rectY -= 10;
    } else if (event.keyCode == 39) {
        rectX += 10;
    } else if (event.keyCode == 40) {
        rectY += 10;
    } else {
        return;
    }
    document.getElementById("rect1").style.left = String(rectX + "px");
    document.getElementById("rect1").style.top = String(rectY + "px");

}

function redirect(page) {
    if (page == "about") {
        redirect("/blog/about");
    }
}

function RenderPDF(url, canvasContainer, options) {

    var options = options || { scale: 1 };

    function renderPage(page) {
        var viewport = page.getViewport(options.scale);
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        canvasContainer.appendChild(canvas);

        page.render(renderContext);
    }

    function renderPages(pdfDoc) {
        for (var num = 1; num <= pdfDoc.numPages; num++) {
            pdfDoc.getPage(num).then(renderPage);
        }
    }

    PDFJS.disableWorker = true;
    PDFJS.getDocument(url).then(renderPages);
}

function loadiframe() {
    document.getElementById("page").contentWindow.document.body.onclick = closeNav();
}

function initPage(page) {
    PDFJS.getDocument('/static/blog/' + page + '.pdf').then(function (pdf) {
        var ctx = document.createElement('canvas').getContext('2d', { alpha: false });

        for (var i = 1; i <= pdf.numPages; i++) {
            pdf.getPage(i).then(function (page) {
                var viewport = page.getViewport(1.5);

                var pageContainer = document.createElement('div');
                pageContainer.classList.add('page-container');
                pageContainer.style.width = viewport.width + 'px';
                pageContainer.style.height = viewport.height + 'px';

                document.body.appendChild(pageContainer);

                page.getTextContent({ normalizeWhitespace: true }).then(function (textContent) {
                    textContent.items.forEach(function (textItem) {
                        var tx = PDFJS.Util.transform(
                            PDFJS.Util.transform(viewport.transform, textItem.transform),
                            [1, 0, 0, -1, 0, 0]
                        );

                        var style = textContent.styles[textItem.fontName];

                        var fontSize = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));

                        if (style.ascent) {
                            tx[5] -= fontSize * style.ascent;
                        } else if (style.descent) {
                            tx[5] -= fontSize * (1 + style.descent);
                        } else {
                            tx[5] -= fontSize / 2;
                        }

                        if (textItem.width > 0) {
                            ctx.font = tx[0] + 'px ' + style.fontFamily;

                            var width = ctx.measureText(textItem.str).width;

                            if (width > 0) {
                                tx[0] = (textItem.width * viewport.scale) / width;
                            }
                        }

                        var item = document.createElement('span');
                        item.textContent = textItem.str;
                        item.style.fontFamily = style.fontFamily;
                        item.style.fontSize = fontSize + 'px';
                        item.style.transform = 'scaleX(' + tx[0] + ')';
                        item.style.left = tx[4] + 'px';
                        item.style.top = tx[5] + 'px';

                        pageContainer.appendChild(item);
                    });
                });
            });
        }
    });
}
