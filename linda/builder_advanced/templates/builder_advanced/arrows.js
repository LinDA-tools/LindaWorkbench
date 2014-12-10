var arrows = {
    connections: [],
    paths: [],
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

    rename_instance: function(old_name, new_name) {
        for (var i=0; i<this.connections.length; i++) {
            if (this.connections[i].f == old_name) {
                this.connections[i].f = new_name;
            }
            if (this.connections[i].t == old_name) {
                this.connections[i].t = new_name;
            }
        }
    },

    remove_property: function(instance, p) {
        for (var i=0; i<this.connections.length; ) {
            var c = this.connections[i];

            if ((c.f == instance)) { //case instance is from
                if (c.fp == p) {
                    this.connections.splice(i, 1); //remove the connection as the property does not exist
                } else {
                    if (c.fp > p) {
                        c.fp--; //change the property counter
                    }
                    i++;
                }
            }

            if ((c.t == instance)) { //case instance is from
                if (c.tp == p) {
                    this.connections.splice(i, 1); //remove the connection as the property does not exist
                } else {
                    if (c.tp > p) {
                        c.tp--; //change the property counter
                    }
                    i++;
                }
            }
        }

        this.draw();
    },

    set_style: function(instance_from, n_of_property_from, style) {
        for (var i=0; i<this.connections.length; i++) {
            var c = this.connections[i];
            if ((c.f == instance_from) && (c.fp == n_of_property_from)) {
                c.s = style;
            }
        }

        this.draw();
    },

    in_segment: function(x1, y1, x2, y2, x, y, tolerate) {
        //return (((x>x1-tolerate) && (x2+tolerate>x))||((x>x2-tolerate) && (x1+tolerate>x))) && (((y>y1-tolerate) && (y2+tolerate>y))||((y>y2-tolerate) && (y1+tolerate>y)));
        var a = {x: x1, y: y1};
        var b = {x: x2, y: y2};
        var p = {x: x, y: y};

        var dy = a.y - b.y;
        var dx = a.x - b.x;
        if(dy == 0) { //horizontal line
            if(Math.abs(p.y -a.y) <= tolerate) {
                if(a.x > b.x) {
                    if((p.x - tolerate <= a.x) && (p.x + tolerate >= b.x))
                        return true;
                }
                else {
                    if((p.x + tolerate >= a.x) && (p.x - tolerate <= b.x))
                        return true;
                }
            }
        }
        else if(dx == 0) { //vertical line
            if(Math.abs(p.x -a.x) <= tolerate) {
                if(a.y > b.y) {
                    if((p.y - tolerate <= a.y) && (p.y + tolerate >= b.y))
                        return true;
                }
                else {
                    if((p.y + tolerate >= a.y) && (p.y - tolerate <= b.y))
                        return true;
                }
            }
        }

        return false;
    },

    in_path: function(x, y, p) {
        for (var i=0; i<p.length-1; i++) {
            if (this.in_segment(p[i].x, p[i].y, p[i+1].x, p[i+1].y, x, y, 10)) {
                return true;
            }
        }

        return false;
    },

    over_arrows: function(x, y) {
        var changed = false;

        for (var i=0; i<this.connections.length; i++) {
            if (this.in_path(x, y, this.paths[i])) {
                if (!this.connections[i].hovered) {
                    changed = true;
                }
                this.connections[i].hovered = true;
            } else {
                if (this.connections[i].hovered) {
                    changed = true;
                }
                this.connections[i].hovered = false;
            }
        }

        if (changed) { //only redraw if an on hover changed
            this.draw();
        }
    },

    in_arrows: function(x, y) {
        for (var i=0; i<this.connections.length; i++) {
            if (this.in_path(x, y, this.paths[i])) {
                this.connections[i].clicked = true;
            } else {
                this.connections[i].clicked = false;
            }
        }

        this.draw();
    },

    delete_selected: function() {
        for (var i=0; i<this.connections.length; ) {
            if (this.connections[i].clicked) {
                this.connections.splice(i, 1);
            } else {
                i++;
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
            this.paths[i] = [];

            if (c == undefined) { //skip deleted connections
                continue;
            }

            //control line style -- buggy for safari
            if (c.s == "dashed") {
                this.ctx.setLineDash([5,5]);
            } else {
                this.ctx.setLineDash([0,0]);
            }

            if (c.clicked) {
                this.ctx.strokeStyle = '#ff0000';
            }
            else if (c.hovered) {
                this.ctx.strokeStyle = '#aa0000';
            } else {
                this.ctx.strokeStyle = '#000000';
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
                this.ctx.moveTo(p1.x + p1.w, p1.y); this.paths[i].push({x: p1.x + p1.w, y: p1.y});
                this.ctx.lineTo(p2.x - sm_x, p1.y); this.paths[i].push({x: p2.x - sm_x,y: p1.y});
                this.ctx.lineTo(p2.x - sm_x, p2.y); this.paths[i].push({x: p2.x - sm_x,y: p2.y});
                this.ctx.lineTo(p2.x, p2.y);        this.paths[i].push({x: p2.x, y: p2.y});
                this.ctx.stroke();
                this.ctx.closePath();
                drawFilledPolygon(this.ctx, translateShape(rotateShape(arrow,Math.atan2(0,1)), p2.x, p2.y));
            }
            else if (p2.x + p2.w + sm_x< p1.x) { //f is completely right of t
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);               this.paths[i].push({x: p1.x, y: p1.y});
                this.ctx.lineTo(p2.x + p2.w + sm_x, p1.y); this.paths[i].push({x: p2.x + p2.w + sm_x, y: p1.y});
                this.ctx.lineTo(p2.x + p2.w + sm_x, p2.y); this.paths[i].push({x: p2.x + p2.w + sm_x, y: p2.y});
                this.ctx.lineTo(p2.x + p2.w + 5, p2.y);    this.paths[i].push({x: p2.x + p2.w + 5, y: p2.y});
                this.ctx.stroke();
                this.ctx.closePath();
                drawFilledPolygon(this.ctx, translateShape(rotateShape(arrow,Math.atan2(0,-1)), p2.x + p2.w + 5, p2.y));
            }
            else if (p1.x + p1.w/2 > p2.x) {
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);                        this.paths[i].push({x: p1.x, y: p1.y});
                this.ctx.lineTo(Math.min(p1.x, p2.x) - sm_x, p1.y); this.paths[i].push({x: Math.min(p1.x, p2.x) - sm_x, y: p1.y});
                this.ctx.lineTo(Math.min(p1.x, p2.x) - sm_x, p2.y); this.paths[i].push({x: Math.min(p1.x, p2.x) - sm_x, y: p2.y});
                this.ctx.lineTo(p2.x, p2.y);                        this.paths[i].push({x: p2.x, y: p2.y});
                this.ctx.stroke();
                this.ctx.closePath();
                drawFilledPolygon(this.ctx, translateShape(rotateShape(arrow,Math.atan2(0,1)), p2.x, p2.y));
            }
            else if (p1.x + p1.w/2 < p2.x) {
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x + p1.w, p1.y);        this.paths[i].push({x: p1.x + p1.w, y: p1.y});
                this.ctx.lineTo(p2.x + p2.w + sm_x, p1.y); this.paths[i].push({x: p2.x + p2.w + sm_x, y: p1.y});
                this.ctx.lineTo(p2.x + p2.w + sm_x, p2.y); this.paths[i].push({x: p2.x + p2.w + sm_x, y: p2.y});
                this.ctx.lineTo(p2.x + p2.w + 5, p2.y);    this.paths[i].push({x: p2.x + p2.w + 5, y: p2.y});
                this.ctx.stroke();
                this.ctx.closePath();
                drawFilledPolygon(this.ctx, translateShape(rotateShape(arrow,Math.atan2(0,-1)), p2.x + p2.w + 5, p2.y));
            }
        }
    }
};