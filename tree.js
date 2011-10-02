var TreeGenerator = function(options) {
    var c = options.context,
    interval,
    stack = [],
    generationNum = options.generations || 8,
    counter = 0;

    function drawBranches() {
        c.clearRect( - 400, -400, 800, 450);
        var i = 0;
        var el;
        counter++;
        while (stack[i]) {
            stack[i]();
            i++;
        }
    }

    function createBranch(angle, generation) {
        var scale = randomRange(.6, .9);
        var direction = randomRange( - 1, 1) > 0 ? -1: 1;

        stack.push(draw.bind(c, angle, direction, generation, scale));

        generation++;

        if (generation < generationNum) {
            createBranch(Math.PI / 6 * randomRange(Math.PI / 8, Math.PI / 4), generation);

            if (randomRange( - 2, 1) > 0) {
                stack.push(c.translate.bind(c, randomRange(20, 30), 5))
            }

            createBranch( - Math.PI / 6 * randomRange(Math.PI / 6, Math.PI / 3), generation);
        }

        stack.push(c.restore.bind(c))
        generation--;
    }

    function draw(startAngle, moveDirection, generation, scale) {
        var angle = startAngle + generation * moveDirection * 1 / scale * Math.sin(counter * .07) * .015
        c.save();

        c.rotate(angle);
        c.strokeStyle = 'hsl(' + 4 * generation + ',100%,50%)';
        c.fillStyle = 'hsla(' + 4 * generation + ',100%,50%,1)';
        c.lineWidth = 2;
        c.beginPath();

        c.moveTo(0, -5);
        c.arc(0, 0, 5, -Math.PI / 2, Math.PI / 2, true)
        c.arc(60, 0, 4, Math.PI / 2, -Math.PI / 2, true)
        c.closePath();

        c.fill();

        if (generation > 3) {
            c.globalCompositeOperation = 'destination-over';
            c.arc(25, 0, 50 / scale, 0, Math.PI * 2, true);
            c.fillStyle = 'hsla(110,100%,' + (25 + generation * 1.5) + '%, ' + 2 / generation + ')';
            c.fill();
            c.globalCompositeOperation = 'source-over';
        }

        c.translate(60, 0);
        c.scale(scale, scale);
    }

    function randomRange(min, max) {
        return Math.random() * (max - min) + min
    }

    return {
        create : function() {
          clearInterval(interval);
          stack = [];
          createBranch( - Math.PI / 2, 0);
          interval = setInterval(drawBranches, 30 / 1000);
        }
    }
}