// Generated by CoffeeScript 1.9.0
(function() {
  var BG_COLOR, DOT_RADIUS, DOT_U, GRAVITY_Y, SQUARE_SIDE, VELOCITY_X, VELOCITY_Y, applyGravityToDot, bounceDot, bounceLineNormal, copy, createLine, d, distance, draw, drawDot, drawDots, drawLine, drawLines, drawSquare, drawTempLine, getInputCoordinates, getLineLength, initWorld, isDotLineCollison, isDotSquareCollision, isOutOfBounds, magnitude, makeDot, makeLine, makeSquare, makeVector, makeVectorByLine, moveDot, onDrawOut, placePoint, pointOnLineClosestToDot, randomInt, resizeCanvas, setFinalLinePoint, setStartLinePoint, setTempLineEndPoint, stackToLine, this_is_the_end, tick, unitVector, update, updateDots, updateLines, vectorPointProduct, _ANIMATION_FRAME_ID_, _CTX_, _C_, _DEBUG_, _VCTX_, _VC_, _W_;

  _DEBUG_ = true;

  _W_ = {};

  _ANIMATION_FRAME_ID_ = 0;

  VELOCITY_Y = 4;

  VELOCITY_X = 0;

  DOT_RADIUS = 3;

  DOT_U = 6;

  GRAVITY_Y = 0.01;

  SQUARE_SIDE = 35;

  BG_COLOR = '#eee';

  _VC_ = document.getElementById('lsd');

  _VCTX_ = _VC_.getContext('2d');

  _VC_.style.backgroundColor = BG_COLOR;

  _C_ = document.createElement('canvas');

  _C_.style.backgroundColor = BG_COLOR;

  _CTX_ = _C_.getContext('2d');

  resizeCanvas = function() {
    _VC_.width = _C_.width = window.innerWidth;
    return _VC_.height = _C_.height = window.innerHeight;
  };

  initWorld = function() {
    resizeCanvas();
    _W_.dots = [];
    _W_.lines = [];
    _W_.line_point_stack = [];
    _W_.h = _C_.height;
    _W_.w = _C_.width;
    _W_.time_since_last_circle = 0;
    _W_.square = makeSquare();
    _W_.dots.push(makeDot());
    _W_.end = false;
    _W_.won = false;
    _W_.lost = false;
    _W_.pointer_down = false;
    return _W_.temp_line_end_point = null;
  };

  d = function(msg) {
    if (_DEBUG_) {
      console.log(msg);
    }
    return msg;
  };

  window.addEventListener('resize', window.startLsd, false);

  copy = function() {
    return _VCTX_.drawImage(_C_, 0, 0);
  };

  window.startLsd = function() {
    initWorld();
    return tick();
  };

  tick = function() {
    if (!_W_.end) {
      _ANIMATION_FRAME_ID_ = requestAnimationFrame(tick);
      update(_W_);
      return draw(_W_, _CTX_);
    } else {
      this_is_the_end(_W_);
      copy();
      return window.cancelAnimationFrame(_ANIMATION_FRAME_ID_);
    }
  };

  this_is_the_end = function(world) {
    if (world.won === true) {
      drawSquare(world.square, _CTX_, true);
    }
    drawDots(world.dots, _CTX_, true);
    if (_W_.end === true) {
      return setTimeout(startLsd, 1000);
    }
  };

  update = function(world) {
    world = updateDots(world);
    stackToLine(world.line_point_stack);
    return world;
  };

  draw = function(world, ctx) {
    _CTX_.fillStyle = BG_COLOR;
    _CTX_.fillRect(0, 0, world.w, world.h);
    drawDots(world.dots, ctx);
    drawLines(world.lines, ctx);
    drawSquare(world.square, ctx);
    drawTempLine(world, ctx);
    return copy();
  };

  randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  makeDot = function(x, y) {
    var a;
    if (x == null) {
      x = Math.floor(_W_.w / 2);
    }
    if (y == null) {
      y = 10;
    }
    a = [x, y];
    a.velocity = {};
    a.velocity.x = VELOCITY_X;
    a.velocity.y = VELOCITY_Y;
    return a;
  };

  makeLine = function(x1, y1, x2, y2) {
    return [x1, y1, x2, y2];
  };

  createLine = function(x1, y1, x2, y2, world) {
    if (world == null) {
      world = _W_;
    }
    return world.lines.push(makeLine(x1, y1, x2, y2));
  };

  updateDots = function(world) {
    var dot, i, j, line, _i, _j, _len, _len1, _ref, _ref1;
    _ref = world.dots;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      dot = _ref[i];
      _ref1 = world.lines;
      for (j = _j = 0, _len1 = _ref1.length; _j < _len1; j = ++_j) {
        line = _ref1[j];
        if (isDotLineCollison(dot, line)) {
          bounceDot(dot, line);
        }
      }
      dot = moveDot(dot);
      if (isDotSquareCollision(dot, _W_.square)) {
        world.end = true;
        world.won = true;
      }
      if (isOutOfBounds(dot, world)) {
        world.end = true;
        world.lost = true;
      }
    }
    return world;
  };

  updateLines = function(world) {
    return world;
  };

  drawDot = function(dot, ctx, inverse) {
    if (inverse == null) {
      inverse = false;
    }
    ctx.beginPath();
    ctx.arc(dot[0], dot[1], DOT_RADIUS, 0, Math.PI * 2, true);
    ctx.closePath();
    if (!inverse) {
      ctx.fillStyle = "black";
      return ctx.fill();
    } else {
      ctx.strokeStyle = "black";
      ctx.fillStyle = BG_COLOR;
      ctx.fill();
      return ctx.stroke();
    }
  };

  drawDots = function(dots, ctx, inverse) {
    var dot, _i, _len, _results;
    if (inverse == null) {
      inverse = false;
    }
    _results = [];
    for (_i = 0, _len = dots.length; _i < _len; _i++) {
      dot = dots[_i];
      _results.push(drawDot(dot, ctx, inverse));
    }
    return _results;
  };

  drawLine = function(line, ctx, is_temp_line) {
    if (is_temp_line == null) {
      is_temp_line = false;
    }
    ctx.beginPath();
    ctx.moveTo(Math.floor(line[0]), Math.floor(line[1]));
    ctx.lineTo(Math.floor(line[2]), Math.floor(line[3]));
    if (!is_temp_line) {
      ctx.restore();
      ctx.setLineDash([0, 0]);
      ctx.strokeStyle = "black";
    } else {
      ctx.strokeStyle = "red";
      ctx.setLineDash([7]);
    }
    return ctx.stroke();
  };

  drawLines = function(lines, ctx) {
    var line, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = lines.length; _i < _len; _i++) {
      line = lines[_i];
      _results.push(drawLine(line, ctx));
    }
    return _results;
  };

  drawTempLine = function(world, ctx) {
    var sx, sy, tx, ty, _ref, _ref1;
    if (world.pointer_down === true && world.line_point_stack[0] && world.temp_line_end_point) {
      _ref = world.line_point_stack[0], sx = _ref[0], sy = _ref[1];
      _ref1 = world.temp_line_end_point, tx = _ref1[0], ty = _ref1[1];
      return drawLine([sx, sy, tx, ty], ctx, true);
    }
  };

  makeSquare = function(x, y) {
    if (x == null) {
      x = randomInt(SQUARE_SIDE + 2, _W_.w - (SQUARE_SIDE + 2));
    }
    if (y == null) {
      y = randomInt(SQUARE_SIDE + 2, _W_.h - (SQUARE_SIDE + 2));
    }
    return [x, y];
  };

  drawSquare = function(p, ctx, fill) {
    var x, y;
    if (ctx == null) {
      ctx = _CTX_;
    }
    if (fill == null) {
      fill = false;
    }
    x = p[0], y = p[1];
    ctx.restore();
    ctx.setLineDash([0, 0]);
    ctx.rect(x, y, SQUARE_SIDE, SQUARE_SIDE);
    ctx.strokeStyle = "black";
    ctx.stroke();
    if (fill === true) {
      ctx.fillStyle = "black";
      return ctx.fill();
    }
  };

  distance = function(dot_a, dot_b) {
    var x, y;
    x = dot_a[0] - dot_b[0];
    y = dot_a[1] - dot_b[1];
    return Math.sqrt(x * x + y * y);
  };

  getLineLength = function(line) {
    return distance([line[0], line[1]], [line[2], line[3]]);
  };

  magnitude = function(vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  };

  makeVector = function(dot_a, dot_b) {
    var vector;
    vector = {
      x: dot_b[0] - dot_a[0],
      y: dot_b[1] - dot_a[1]
    };
    return vector;
  };

  makeVectorByLine = function(l) {
    return makeVector([l[0], l[1]], [l[2], l[3]]);
  };

  unitVector = function(vector) {
    var r_vector, vector_magnitude;
    vector_magnitude = magnitude(vector);
    return r_vector = {
      x: vector.x / vector_magnitude,
      y: vector.y / vector_magnitude
    };
  };

  vectorPointProduct = function(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  };

  pointOnLineClosestToDot = function(dot, line) {
    var end_of_line_to_dot_vector, line_unit_vector, projection, r_point;
    line_unit_vector = unitVector(makeVectorByLine(line));
    end_of_line_to_dot_vector = makeVector([line[0], line[1]], dot);
    projection = vectorPointProduct(end_of_line_to_dot_vector, line_unit_vector);
    if (projection <= 0) {
      return [line[0], line[1]];
    }
    if (projection >= getLineLength(line)) {
      return [line[2], line[3]];
    }
    return r_point = [line[0] + line_unit_vector.x * projection, line[1] + line_unit_vector.y * projection];
  };

  isDotSquareCollision = function(dot, square) {
    var dx, dy, sx, sy;
    dx = dot[0], dy = dot[1];
    drawSquare(dot);
    sx = square[0], sy = square[1];
    drawSquare(square);
    if (dx > sx && dx < sx + SQUARE_SIDE) {
      if (dy > sy && dy < sy + SQUARE_SIDE) {
        return true;
      }
    }
    return false;
  };

  isOutOfBounds = function(dot, world) {
    if (dot[1] > world.h + 3 || dot[0] < -3 || dot[0] > world.w + 3) {
      return true;
    } else {
      return false;
    }
  };

  isDotLineCollison = function(dot, line) {
    var closest, r;
    closest = pointOnLineClosestToDot(dot, line);
    r = distance(dot, closest) < DOT_RADIUS;
    return r;
  };

  moveDot = function(dot) {
    dot[0] = dot[0] + dot.velocity.x;
    dot[1] = dot[1] + dot.velocity.y;
    dot = applyGravityToDot(dot);
    return dot;
  };

  applyGravityToDot = function(dot) {
    if (dot.velocity.y < VELOCITY_Y) {
      dot.velocity.y = dot.velocity.y + GRAVITY_Y;
    }
    return dot;
  };

  bounceDot = function(dot, line) {
    var bounce_line_normal, dot_to_line_vector_product;
    bounce_line_normal = bounceLineNormal(dot, line);
    dot_to_line_vector_product = vectorPointProduct(dot.velocity, bounce_line_normal);
    dot.velocity.x = dot.velocity.x - (2 * dot_to_line_vector_product * bounce_line_normal.x);
    return dot.velocity.y = dot.velocity.y - (2 * dot_to_line_vector_product * bounce_line_normal.y);
  };

  bounceLineNormal = function(dot, line) {
    var dot_to_closest_point_on_line_vector;
    dot_to_closest_point_on_line_vector = makeVector(pointOnLineClosestToDot(dot, line), dot);
    return unitVector(dot_to_closest_point_on_line_vector);
  };

  getInputCoordinates = function(e) {
    var ex, ey, rect, x, y, _ref, _ref1, _ref2;
    rect = _VC_.getBoundingClientRect();
    ex = e.pageX || (e != null ? (_ref = e.touches[0]) != null ? _ref.clientX : void 0 : void 0);
    ey = e.pageY || (e != null ? (_ref1 = e.touches[0]) != null ? _ref1.clientY : void 0 : void 0);
    if (e.type === 'touchend') {
      _ref2 = _W_.temp_line_end_point, ex = _ref2[0], ey = _ref2[1];
      _W_.temp_line_end_point = null;
    }
    x = ex - _VC_.offsetLeft;
    y = ey - _VC_.offsetTop;
    return [x, y];
  };

  placePoint = function(point, world) {
    return world.line_point_stack.push(point);
  };

  setStartLinePoint = function(e) {
    var point;
    e.preventDefault();
    _W_.line_point_stack = [];
    point = getInputCoordinates(e);
    placePoint(point, _W_);
    return _W_.pointer_down = true;
  };

  setFinalLinePoint = function(e) {
    var point;
    e.preventDefault();
    point = getInputCoordinates(e);
    placePoint(point, _W_);
    return _W_.pointer_down = false;
  };

  setTempLineEndPoint = function(e) {
    e.preventDefault();
    return _W_.temp_line_end_point = getInputCoordinates(e);
  };

  onDrawOut = function(e) {
    e.preventDefault();
    return setFinalLinePoint(e);
  };

  stackToLine = function(stack) {
    var end_point, start_point;
    if (stack.length > 1) {
      end_point = stack.pop();
      start_point = stack.pop();
      return createLine(start_point[0], start_point[1], end_point[0], end_point[1]);
    }
  };

  _VC_.addEventListener('mousedown', function(e) {
    return setStartLinePoint(e);
  });

  _VC_.addEventListener('touchstart', function(e) {
    d('touchstart');
    return setStartLinePoint(e);
  });

  _VC_.addEventListener('mouseup', function(e) {
    return setFinalLinePoint(e);
  });

  _VC_.addEventListener('touchend', function(e) {
    d('touchend');
    d(e);
    return setFinalLinePoint(e);
  });

  _VC_.addEventListener('mousemove', function(e) {
    return setTempLineEndPoint(e);
  });

  _VC_.addEventListener('touchmove', function(e) {
    return setTempLineEndPoint(e);
  });

  _VC_.addEventListener('mouseout', function(e) {
    return onDrawOut(e);
  });

  _VC_.addEventListener('touchleave', function(e) {
    return onDrawOut(e);
  });

  window.document.body.addEventListener('touchmove', function(e) {
    return e.preventDefault();
  });

}).call(this);
