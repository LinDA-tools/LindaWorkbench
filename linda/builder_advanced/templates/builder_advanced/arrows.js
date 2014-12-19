var arrows = {
    connections: [],
    canvas: undefined,
    ctx: undefined,

    set_canvas: function(cnvID) {
        this.canvas = document.getElementById(cnvID);
        this.ctx = this.canvas.getContext("2d");
    },

    add_arrow: function(instance_from, n_of_property_from, instance_to, n_of_property_to, style) {
        this.connections.push({f: instance_from, fp: n_of_property_from, t: instance_to, tp: n_of_property_to, s: style});
        this.draw();
    },

    remove_arrow: function(instance_from, n_of_property_from, instance_to, n_of_property_to) {
        for (var i=0; i<this.connections.length; ) {
            var c = this.connections[i];
            if ((c.f == instance_from) && (c.fp == n_of_property_from) && (c.t == instance_to) && (c.tp == n_of_property_to)) {
                this.connections.splice(i, 1);
            } else {
                i++;
            }
        }

        this.draw();
    },

    remove_instance: function(instance) {
        for (var i=0; i<this.connections.length; ) {
            if ((this.connections[i].f == instance) || (this.connections[i].t == instance)) {
                this.connections.splice(i, 1);
            } else {
                i++;
            }
        }

        this.draw();
    },

    set_style: function(instance_from, n_of_property_from, style) {
        console.log(instance_from + ' ' + n_of_property_from + ' ' + style);
        for (var i=0; i<this.connections.length; i++) {
            var c = this.connections[i];
            if ((c.f == instance_from) && (c.fp == n_of_property_from)) {
                c.s = style;
            }
        }

        this.draw();
    },

    draw: function() {
        var arrow = [
            [ 2, 0 ],
            [ -10, -4 ],
            [ -10, 4]
        ];
        drawFilledPolygon = function(ctx, shape) {
            ctx.beginPath();
            ctx.moveTo(shape[0][0],shape[0][1]);

            for(p in shape)
                if (p > 0) ctx.lineTo(shape[p][0],shape[p][1]);

            ctx.lineTo(shape[0][0],shape[0][1]);
            ctx.fill();
        };
        translateShape = function(shape,x,y) {
            var rv = [];
            for(p in shape)
                rv.push([ shape[p][0] + x, shape[p][1] + y ]);
            return rv;
        };
        rotateShape = function(shape,ang) {
            var rv = [];
            for(p in shape)
                rv.push(rotatePoint(ang,shape[p][0],shape[p][1]));
            return rv;
        };
        rotatePoint = function(ang,x,y) {
            return [
                (x * Math.cos(ang)) - (y * Math.sin(ang)),
                (x * Math.sin(ang)) + (y * Math.cos(ang))
            ];
        };

        if (!this.ctx) return;

        //clear canvas
        this.ctx.clearRect(0 ,0 ,this.canvas.width, this.canvas.height);
        this.ctx.lineWidth=1;

        for (var i=0; i<this.connections.length; i++) {
            var c = this.connections[i];

            if (c == undefined) { //skip deleted connections
                continue;
            }

            //control line style -- buggy for safari
            if (c.s == "dashed") {
                this.ctx.setLineDash([5,5]);
            } else {
                this.ctx.setLineDash([0,0]);
            }

            var p1 = {x: $(c.f).position().left, y: $(c.f).position().top + 90 + c.fp*35, w: $(c.f).width()};
            if (c.tp > 0) { //specific property
                var p2 = {x: $(c.t).position().left, y: $(c.t).position().top + 90 + c.tp*35, w: $(c.t).width()};
            } else { //whole instance
                var p2 = {x: $(c.t).position().left, y: $(c.t).position().top + 20, w: $(c.t).width()};
            }
            var sm_x = 30;

            //four cases
            if (p1.x + p1.w + sm_x< p2.x) { //f is completely left of t
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x + p1.w, p1.y);
                this.ctx.lineTo(p2.x - sm_x, p1.y);
                this.ctx.lineTo(p2.x - sm_x, p2.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.stroke();
                this.ctx.closePath();
                drawFilledPolygon(this.ctx, translateShape(rotateShape(arrow,Math.atan2(0,1)), p2.x, p2.y));
            }
            else if (p2.x + p2.w + sm_x< p1.x) { //f is completely right of t
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x + p2.w + sm_x, p1.y);
                this.ctx.lineTo(p2.x + p2.w + sm_x, p2.y);
                this.ctx.lineTo(p2.x + p2.w + 5, p2.y);
                this.ctx.stroke();
                this.ctx.closePath();
                drawFilledPolygon(this.ctx, translateShape(rotateShape(arrow,Math.atan2(0,-1)), p2.x + p2.w + 5, p2.y));
            }
            else if (p1.x + p1.w/2 > p2.x) {
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(Math.min(p1.x, p2.x) - sm_x, p1.y);
                this.ctx.lineTo(Math.min(p1.x, p2.x) - sm_x, p2.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.stroke();
                this.ctx.closePath();
                drawFilledPolygon(this.ctx, translateShape(rotateShape(arrow,Math.atan2(0,1)), p2.x, p2.y));
            }
            else if (p1.x + p1.w/2 < p2.x) {
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x + p1.w, p1.y);
                this.ctx.lineTo(p2.x + p2.w + sm_x, p1.y);
                this.ctx.lineTo(p2.x + p2.w + sm_x, p2.y);
                this.ctx.lineTo(p2.x + p2.w + 5, p2.y);
                this.ctx.stroke();
                this.ctx.closePath();
                drawFilledPolygon(this.ctx, translateShape(rotateShape(arrow,Math.atan2(0,-1)), p2.x + p2.w + 5, p2.y));
            }
        }
    }
};