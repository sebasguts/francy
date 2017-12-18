(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonUtils = require('./util/json-utils');

var _jsonUtils2 = _interopRequireDefault(_jsonUtils);

var _canvas = require('./render/canvas');

var _canvas2 = _interopRequireDefault(_canvas);

var _menuMain = require('./render/menu-main');

var _menuMain2 = _interopRequireDefault(_menuMain);

var _graph = require('./render/graph');

var _graph2 = _interopRequireDefault(_graph);

var _chart = require('./render/chart');

var _chart2 = _interopRequireDefault(_chart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//import Tracker from './tracker/change';

var ALL_CANVAS = {};

/* global d3 */

/**
 * Francy is the main entry point for the whole framework. By passing an input string/object to the {Francy.handle} function,
 * Francy will handle the creation of that json as long it is a valid and understandable json object to Francy.
 * @access public
 * 
 * @version 0.5.0
 * 
 * @example
 * let francy = new Francy({verbose: true, appendTo: '#div-id', callbackHandler: console.log});
 * francy.render(json);
 */

var Francy = function () {

  /**
   * Creates an instance of Francy with the following options:
   * @typedef {Object} Options
   * @property {Boolean} verbose prints extra log information to console.log, default false
   * @property {Boolean} appendTo where the generated html/svg components will be attached to, default body
   * @property {Function} callbackHandler this handler will be used to invoke actions from the menu, default console.log
   */
  function Francy(_ref) {
    var _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose,
        appendTo = _ref.appendTo,
        callbackHandler = _ref.callbackHandler;

    _classCallCheck(this, Francy);

    if (!callbackHandler) {
      throw new Error('A Callback Handler must be provided! This will be used to trigger events from the graphics produced...');
    }
    if (!appendTo) {
      throw new Error('Missing an element or id to append the graphics to...!');
    }
    if (!d3) {
      throw new Error('D3 is not imported! Francy won\'t work without it... please import D3 v4+.');
    }
    /**
     * @typedef {Object} Options
     * @property {Boolean} verbose prints extra log information to console.log, default false
     * @property {Boolean} appendTo where the generated html/svg components will be attached to, default body
     * @property {Function} callbackHandler this handler will be used to invoke actions from the menu, default console.log
     */
    this.options = {
      verbose: verbose,
      appendTo: appendTo,
      callbackHandler: callbackHandler
    };
  }

  /**
   * Main entry point. Calling render passing a json representation string will 
   * trigger the drawing of a json object.
   * @param {String} input a json string/object render
   * @returns {Object} the element created
   */


  _createClass(Francy, [{
    key: 'render',
    value: function render(input) {
      var json = _jsonUtils2.default.parse(input);
      if (json) {
        //var tracker = new Tracker(json, this.options);
        //tracker.subscribe(function(obj) { console.log(obj); });
        //return new Draw(this.options).handle(tracker.object);
        var canvas = new _canvas2.default(this.options);
        var menu = new _menuMain2.default(this.options);
        var graph = new _graph2.default(this.options);
        var chart = new _chart2.default(this.options);
        canvas.add(menu);
        canvas.add(graph);
        canvas.add(chart);
        var element = canvas.render(json);
        ALL_CANVAS[json.canvas.id] = element;
        return element.node();
      }
    }
  }, {
    key: 'unrender',
    value: function unrender(id) {
      delete ALL_CANVAS[id];
    }
  }]);

  return Francy;
}();

exports.default = Francy;


try {
  exports.Francy = window.Francy = Francy;
  // handle events on resize
  window.onresize = function () {
    // zoom to fit all canvas on resize
    Object.values(ALL_CANVAS).forEach(function (canvas) {
      canvas.zoomToFit();
    });
    // adjust top menus on resize
    d3.selectAll('foreignObject.francy-main-menu-holder').attr('width', '100%');
  };
} catch (e) {
  exports.Francy = Francy;
}

},{"./render/canvas":4,"./render/chart":8,"./render/graph":10,"./render/menu-main":12,"./util/json-utils":18}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = require('../util/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Base = function () {
  function Base(_ref) {
    var _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose,
        appendTo = _ref.appendTo,
        callbackHandler = _ref.callbackHandler;

    _classCallCheck(this, Base);

    /**
     * @type {Object}
     */
    this.options = {
      verbose: verbose,
      appendTo: appendTo,
      callbackHandler: callbackHandler
    };
    /**
     * @type {Logger}
     */
    this.logger = new _logger2.default(this.options);
  }

  _createClass(Base, [{
    key: 'update',
    value: function update(_ref2) {
      var _ref2$verbose = _ref2.verbose,
          verbose = _ref2$verbose === undefined ? false : _ref2$verbose,
          appendTo = _ref2.appendTo,
          callbackHandler = _ref2.callbackHandler;

      this.options = {
        verbose: verbose,
        appendTo: appendTo,
        callbackHandler: callbackHandler
      };
      return this;
    }
  }]);

  return Base;
}();

exports.default = Base;

},{"../util/logger":19}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _modalRequired = require('./modal-required');

var _modalRequired2 = _interopRequireDefault(_modalRequired);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CallbackHandler = function (_Base) {
  _inherits(CallbackHandler, _Base);

  function CallbackHandler(_ref) {
    var _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose,
        appendTo = _ref.appendTo,
        callbackHandler = _ref.callbackHandler;

    _classCallCheck(this, CallbackHandler);

    return _possibleConstructorReturn(this, (CallbackHandler.__proto__ || Object.getPrototypeOf(CallbackHandler)).call(this, { verbose: verbose, appendTo: appendTo, callbackHandler: callbackHandler }));
  }

  _createClass(CallbackHandler, [{
    key: 'execute',
    value: function execute(config) {
      if (Object.keys(config.callback.requiredArgs).length) {
        return new _modalRequired2.default(this.options).render(config);
      } else {
        return this.options.callbackHandler(config.callback);
      }
    }
  }]);

  return CallbackHandler;
}(_base2.default);

exports.default = CallbackHandler;

},{"./base":2,"./modal-required":15}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _composite = require('./composite');

var _composite2 = _interopRequireDefault(_composite);

var _message = require('./message');

var _message2 = _interopRequireDefault(_message);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global d3 */

var Canvas = function (_Composite) {
  _inherits(Canvas, _Composite);

  function Canvas(_ref) {
    var _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose,
        appendTo = _ref.appendTo,
        callbackHandler = _ref.callbackHandler;

    _classCallCheck(this, Canvas);

    return _possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).call(this, { verbose: verbose, appendTo: appendTo, callbackHandler: callbackHandler }));
  }

  _createClass(Canvas, [{
    key: 'render',
    value: function render(json) {
      var parent = d3.select(this.options.appendTo);

      var canvasId = json.canvas.id;
      var canvas = d3.select('svg#' + canvasId);
      // check if the canvas is already present
      if (!canvas.node()) {
        // create a svg element detached from the DOM!
        this.logger.debug('Creating Canvas [' + canvasId + ']...');
        canvas = parent.append('svg').attr('id', canvasId).attr('class', 'francy francy-canvas');
      }

      // cannot continue if canvas is not present
      if (!canvas.node()) {
        throw new Error('Oops, could not create canvas with id [' + canvasId + ']... Cannot proceed.');
      }

      canvas.attr('width', json.canvas.width).attr('height', json.canvas.height);

      var zoom = d3.zoom();

      var content = canvas.select('g.francy-content');

      if (!content.node()) {
        content = canvas.append('g').attr('class', 'francy-content');
        zoom.on("zoom", zoomed);
        canvas.call(zoom).on("dblclick.zoom", null);
      }

      canvas.on("click", stopped, true);

      canvas.zoomToFit = function () {
        // only execute if enable, of course
        if (json.canvas.zoomToFit) {
          var bounds = content.node().getBBox();

          var clientBounds = canvas.node().getBoundingClientRect(),
              fullWidth = clientBounds.right - clientBounds.left,
              fullHeight = clientBounds.bottom - clientBounds.top + 45; //well, the menu is part of the canvas +-45px

          var width = bounds.width,
              height = bounds.height;

          if (width == 0 || height == 0) return;

          var midX = bounds.x + width / 2,
              midY = bounds.y + height / 2;

          var scale = 0.75 / Math.max(width / fullWidth, height / fullHeight);
          var translateX = fullWidth / 2 - scale * midX,
              translateY = fullHeight / 2 - scale * midY;

          content.transition().duration(2000).attr('transform', 'translate(' + translateX + ',' + translateY + ')scale(' + scale + ',' + scale + ')').on('end', function () {
            return updateZoom(translateX, translateY, scale);
          });
        }
      };

      function updateZoom(translateX, translateY, scale) {
        canvas.call(zoom.transform, d3.zoomIdentity.translate(translateX, translateY).scale(scale, scale));
      }

      function zoomed() {
        content.attr("transform", d3.event.transform);
      }

      function stopped() {
        if (d3.event.defaultPrevented) {
          d3.event.stopPropagation();
        }
      }

      this.logger.debug('Canvas updated [' + canvasId + ']...');

      // add messages to canvas
      this.options.appendTo = canvas;
      var messages = new _message2.default(this.options);
      messages.render(json.canvas.messages);

      this.renderChildren(canvas, json);

      return canvas;
    }
  }, {
    key: 'unrender',
    value: function unrender() {}
  }]);

  return Canvas;
}(_composite2.default);

exports.default = Canvas;

},{"./composite":9,"./message":14}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

var _tooltip = require('./tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _chart = require('./chart');

var _chart2 = _interopRequireDefault(_chart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global d3 */

var BarChart = function (_Renderer) {
  _inherits(BarChart, _Renderer);

  function BarChart(_ref) {
    var _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose,
        appendTo = _ref.appendTo,
        callbackHandler = _ref.callbackHandler;

    _classCallCheck(this, BarChart);

    return _possibleConstructorReturn(this, (BarChart.__proto__ || Object.getPrototypeOf(BarChart)).call(this, { verbose: verbose, appendTo: appendTo, callbackHandler: callbackHandler }));
  }

  _createClass(BarChart, [{
    key: 'render',
    value: function render(json) {

      // just ignore rendering if no chart is present
      if (!json.canvas.chart) {
        this.logger.debug('No BarChart to render here... continuing...');
        return;
      }

      var tooltip = new _tooltip2.default(this.options);

      var parent = this.options.appendTo;

      var axis = json.canvas.chart.axis,
          datasets = json.canvas.chart.data,
          datasetNames = Object.keys(datasets);

      var svg = parent.select('g.francy-content'),
          margin = { top: 50, right: 50, bottom: 50, left: 50 },
          width = +parent.attr('width') || d3.select('body').node().getBoundingClientRect().width,
          height = +parent.attr('height') || d3.select('body').node().getBoundingClientRect().height;

      // set the dimensions and margins of the chart
      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;

      // set the ranges
      var x = d3.scaleBand().range([0, width]).padding(0.1).domain(axis.x.domain);
      var y = d3.scaleLinear().range([height, 0]).domain(axis.y.domain);

      var tmp = [];
      datasetNames.forEach(function (key) {
        return tmp = tmp.concat(datasets[key]);
      });

      if (!axis.y.domain.length) {
        y.domain([0, d3.max(tmp, function (d) {
          return d;
        })]);
      }

      if (!axis.x.domain.length) {
        axis.x.domain = _chart2.default.domainRange(tmp.length / datasetNames.length);
        x.domain(axis.x.domain);
      }

      var barsGroup = svg.selectAll('g.francy-bars');

      if (!barsGroup.node()) {
        barsGroup = svg.append('g').attr('class', 'francy-bars');
      }

      datasetNames.forEach(function (key, index) {
        var bar = barsGroup.selectAll('.francy-bar' + index).data(datasets[key]);

        bar.exit().remove();

        // append the rectangles for the bar chart
        bar.enter().append('rect').style('fill', function () {
          return _chart2.default.colors(index * 5);
        }).attr('class', 'francy-bar' + index).attr('x', function (d, i) {
          return x(axis.x.domain[i]) + index * (x.bandwidth() / datasetNames.length);
        }).attr('width', x.bandwidth() / datasetNames.length - 1).attr('y', function (d) {
          return y(d);
        }).attr('height', function (d) {
          return height - y(d);
        }).on("mouseover", function (d) {
          d3.select(this).transition().duration(250).style("fill-opacity", 0.5);
          tooltip.render({ 'Dataset': key, 'Value': d });
        }).on("mouseout", function () {
          d3.select(this).transition().duration(250).style("fill-opacity", 1);
          tooltip.unrender();
        });

        bar.merge(bar);
      });

      // force rebuild axis again
      var xAxisGroup = svg.selectAll('g.francy-x-axis');

      if (!xAxisGroup.node()) {
        xAxisGroup = svg.append('g').attr('class', 'francy-x-axis');
      }

      xAxisGroup.selectAll('*').remove();

      // add the x Axis
      xAxisGroup.attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(x)).append('text').attr('dy', 50).attr('dx', width / 2).attr('fill', 'black').attr('class', 'francy-axis').style('text-anchor', 'end').text(axis.x.title);

      // force rebuild axis again
      var yAxisGroup = svg.selectAll('g.francy-y-axis');

      if (!yAxisGroup.node()) {
        yAxisGroup = svg.append('g').attr('class', 'francy-y-axis');
      }

      yAxisGroup.selectAll('*').remove();

      // add the y Axis
      yAxisGroup.call(d3.axisLeft(y)).append('text').attr('dx', -50).attr('dy', height / 2).attr('fill', 'black').attr('class', 'francy-axis').style('text-anchor', 'end').text(axis.y.title);

      var legendGroup = svg.selectAll('.francy-legend');

      if (!legendGroup.node()) {
        legendGroup = svg.append('g').attr('class', 'francy-legend');
      }

      // force rebuild legend again
      legendGroup.selectAll('*').remove();

      var legend = legendGroup.selectAll('g').data(datasetNames.slice());

      legend.exit().remove();

      legend = legend.enter().append('g').attr('transform', function (d, i) {
        return 'translate(0,' + i * 20 + ')';
      }).merge(legend);

      legend.append('rect').attr('x', width + 20).attr('width', 19).attr('height', 19).style('fill', function (d, i) {
        return _chart2.default.colors(i * 5);
      });

      legend.append('text').attr('x', width + 80).attr('y', 9).attr('dy', '.35em').style('text-anchor', 'end').text(function (d) {
        return d;
      });

      parent.zoomToFit();

      return svg;
    }
  }, {
    key: 'unrender',
    value: function unrender() {}
  }]);

  return BarChart;
}(_renderer2.default);

exports.default = BarChart;

},{"./chart":8,"./renderer":16,"./tooltip":17}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

var _tooltip = require('./tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _chart = require('./chart');

var _chart2 = _interopRequireDefault(_chart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global d3 */

var LineChart = function (_Renderer) {
  _inherits(LineChart, _Renderer);

  function LineChart(_ref) {
    var _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose,
        appendTo = _ref.appendTo,
        callbackHandler = _ref.callbackHandler;

    _classCallCheck(this, LineChart);

    return _possibleConstructorReturn(this, (LineChart.__proto__ || Object.getPrototypeOf(LineChart)).call(this, { verbose: verbose, appendTo: appendTo, callbackHandler: callbackHandler }));
  }

  _createClass(LineChart, [{
    key: 'render',
    value: function render(json) {

      // just ignore rendering if no chart is present
      if (!json.canvas.chart) {
        this.logger.debug('No LineChart to render here... continuing...');
        return;
      }

      var tooltip = new _tooltip2.default(this.options);

      var parent = this.options.appendTo;

      var axis = json.canvas.chart.axis,
          datasets = json.canvas.chart.data,
          datasetNames = Object.keys(datasets);

      var svg = parent.select('g.francy-content'),
          margin = { top: 50, right: 50, bottom: 50, left: 50 },
          width = +parent.attr('width') || d3.select('body').node().getBoundingClientRect().width,
          height = +parent.attr('height') || d3.select('body').node().getBoundingClientRect().height;

      // set the dimensions and margins of the chart
      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;

      // set the ranges
      var x = d3.scaleLinear().range([0, width]).domain(axis.x.domain);
      var y = d3.scaleLinear().range([height, 0]).domain(axis.y.domain);

      var tmp = [];
      datasetNames.forEach(function (key) {
        return tmp = tmp.concat(datasets[key]);
      });

      if (!axis.y.domain.length) {
        y.domain([0, d3.max(tmp, function (d) {
          return d;
        })]);
      }

      if (!axis.x.domain.length) {
        x.domain([0, tmp.length / datasetNames.length]);
      }

      var linesGroup = svg.selectAll('g.francy-lines');

      if (!linesGroup.node()) {
        linesGroup = svg.append('g').attr('class', 'francy-lines');
      }

      datasetNames.forEach(function (key, index) {
        var valueLine = d3.line().x(function (d, i) {
          return x(i);
        }).y(function (d) {
          return y(d);
        });

        var line = linesGroup.selectAll('.line' + index).data([datasets[key]]);

        line.exit().remove();

        // append the rectangles for the bar chart
        line.enter().append('path').style('stroke', function () {
          return _chart2.default.colors(index * 5);
        }).style('stroke-width', '5px').attr('class', 'francy-line' + index).attr('d', valueLine).on("mouseover", function (d) {
          d3.select(this).transition().duration(250).style("stroke-opacity", 0.5).style('stroke-width', '10px');
          tooltip.render({ 'Dataset': key, 'Value': d });
        }).on("mouseout", function () {
          d3.select(this).transition().duration(250).style("stroke-opacity", 1).style('stroke-width', '5px');
          tooltip.unrender();
        });

        line.merge(line);
      });

      // force rebuild axis again
      var xAxisGroup = svg.selectAll('g.francy-x-axis');

      if (!xAxisGroup.node()) {
        xAxisGroup = svg.append('g').attr('class', 'francy-x-axis');
      }

      xAxisGroup.selectAll('*').remove();

      // add the x Axis
      xAxisGroup.attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(x)).append('text').attr('dy', 50).attr('dx', width / 2).attr('fill', 'black').attr('class', 'francy-axis').style('text-anchor', 'end').text(axis.x.title);

      // force rebuild axis again
      var yAxisGroup = svg.selectAll('g.francy-y-axis');

      if (!yAxisGroup.node()) {
        yAxisGroup = svg.append('g').attr('class', 'francy-y-axis');
      }

      yAxisGroup.selectAll('*').remove();

      // add the y Axis
      yAxisGroup.call(d3.axisLeft(y)).append('text').attr('dx', -50).attr('dy', height / 2).attr('fill', 'black').attr('class', 'francy-axis').style('text-anchor', 'end').text(axis.y.title);

      var legendGroup = svg.selectAll('.francy-legend');

      if (!legendGroup.node()) {
        legendGroup = svg.append('g').attr('class', 'francy-legend');
      }

      // force rebuild legend again
      legendGroup.selectAll('*').remove();

      var legend = legendGroup.selectAll('g').data(datasetNames.slice());

      legend.exit().remove();

      legend = legend.enter().append('g').attr('transform', function (d, i) {
        return 'translate(0,' + i * 20 + ')';
      }).merge(legend);

      legend.append('rect').attr('x', width + 20).attr('width', 19).attr('height', 19).style('fill', function (d, i) {
        return _chart2.default.colors(i * 5);
      });

      legend.append('text').attr('x', width + 80).attr('y', 9).attr('dy', '.35em').style('text-anchor', 'end').text(function (d) {
        return d;
      });

      parent.zoomToFit();

      return svg;
    }
  }, {
    key: 'unrender',
    value: function unrender() {}
  }]);

  return LineChart;
}(_renderer2.default);

exports.default = LineChart;

},{"./chart":8,"./renderer":16,"./tooltip":17}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

var _tooltip = require('./tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _chart = require('./chart');

var _chart2 = _interopRequireDefault(_chart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global d3 */

var ScatterChart = function (_Renderer) {
  _inherits(ScatterChart, _Renderer);

  function ScatterChart(_ref) {
    var _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose,
        appendTo = _ref.appendTo,
        callbackHandler = _ref.callbackHandler;

    _classCallCheck(this, ScatterChart);

    return _possibleConstructorReturn(this, (ScatterChart.__proto__ || Object.getPrototypeOf(ScatterChart)).call(this, { verbose: verbose, appendTo: appendTo, callbackHandler: callbackHandler }));
  }

  _createClass(ScatterChart, [{
    key: 'render',
    value: function render(json) {

      // just ignore rendering if no chart is present
      if (!json.canvas.chart) {
        this.logger.debug('No ScatterChart to render here... continuing...');
        return;
      }

      var tooltip = new _tooltip2.default(this.options);

      var parent = this.options.appendTo;

      var axis = json.canvas.chart.axis,
          datasets = json.canvas.chart.data,
          datasetNames = Object.keys(datasets);

      var svg = parent.select('g.francy-content'),
          margin = { top: 50, right: 50, bottom: 50, left: 50 },
          width = +parent.attr('width') || d3.select('body').node().getBoundingClientRect().width,
          height = +parent.attr('height') || d3.select('body').node().getBoundingClientRect().height;

      // set the dimensions and margins of the chart
      width = width - margin.left - margin.right;
      height = height - margin.top - margin.bottom;

      // set the ranges
      var x = d3.scaleLinear().range([0, width]).domain(axis.x.domain);
      var y = d3.scaleLinear().range([height, 0]).domain(axis.y.domain);

      var tmp = [];
      datasetNames.forEach(function (key) {
        return tmp = tmp.concat(datasets[key]);
      });

      if (!axis.y.domain.length) {
        y.domain([0, d3.max(tmp, function (d) {
          return d;
        })]);
      }

      if (!axis.x.domain.length) {
        x.domain([0, tmp.length / datasetNames.length]);
      }

      var scatterGroup = svg.selectAll('g.francy-scatters');

      if (!scatterGroup.node()) {
        scatterGroup = svg.append('g').attr('class', 'francy-scatters');
      }

      datasetNames.forEach(function (key, index) {
        var scatter = scatterGroup.selectAll('.scatter' + index).data(datasets[key]);

        scatter.exit().remove();

        // append the rectangles for the bar chart
        scatter.enter().append('circle').style('fill', function () {
          return _chart2.default.colors(index * 5);
        }).attr('class', 'francy-scatter' + index).attr("r", 5).attr("cx", function (d, i) {
          return x(i);
        }).attr("cy", function (d) {
          return y(d);
        }).on("mouseover", function (d) {
          d3.select(this).transition().duration(250).style("fill-opacity", 0.5).attr('r', 10);
          tooltip.render({ 'Dataset': key, 'Value': d });
        }).on("mouseout", function () {
          d3.select(this).transition().duration(250).style("fill-opacity", 1).attr('r', 5);
          tooltip.unrender();
        });

        scatter.merge(scatter);
      });

      // force rebuild axis again
      var xAxisGroup = svg.selectAll('g.francy-x-axis');

      if (!xAxisGroup.node()) {
        xAxisGroup = svg.append('g').attr('class', 'francy-x-axis');
      }

      xAxisGroup.selectAll('*').remove();

      // add the x Axis
      xAxisGroup.attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(x)).append('text').attr('dy', 50).attr('dx', width / 2).attr('fill', 'black').attr('class', 'francy-axis').style('text-anchor', 'end').text(axis.x.title);

      // force rebuild axis again
      var yAxisGroup = svg.selectAll('g.francy-y-axis');

      if (!yAxisGroup.node()) {
        yAxisGroup = svg.append('g').attr('class', 'francy-y-axis');
      }

      yAxisGroup.selectAll('*').remove();

      // add the y Axis
      yAxisGroup.call(d3.axisLeft(y)).append('text').attr('dx', -50).attr('dy', height / 2).attr('fill', 'black').attr('class', 'francy-axis').style('text-anchor', 'end').text(axis.y.title);

      var legendGroup = svg.selectAll('.francy-legend');

      if (!legendGroup.node()) {
        legendGroup = svg.append('g').attr('class', 'francy-legend');
      }

      // force rebuild legend again
      legendGroup.selectAll('*').remove();

      var legend = legendGroup.selectAll('g').data(datasetNames.slice());

      legend.exit().remove();

      legend = legend.enter().append('g').attr('transform', function (d, i) {
        return 'translate(0,' + i * 20 + ')';
      }).merge(legend);

      legend.append('rect').attr('x', width + 20).attr('width', 19).attr('height', 19).style('fill', function (d, i) {
        return _chart2.default.colors(i * 5);
      });

      legend.append('text').attr('x', width + 80).attr('y', 9).attr('dy', '.35em').style('text-anchor', 'end').text(function (d) {
        return d;
      });

      parent.zoomToFit();

      return svg;
    }
  }, {
    key: 'unrender',
    value: function unrender() {}
  }]);

  return ScatterChart;
}(_renderer2.default);

exports.default = ScatterChart;

},{"./chart":8,"./renderer":16,"./tooltip":17}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

var _chartBar = require('./chart-bar');

var _chartBar2 = _interopRequireDefault(_chartBar);

var _chartLine = require('./chart-line');

var _chartLine2 = _interopRequireDefault(_chartLine);

var _chartScatter = require('./chart-scatter');

var _chartScatter2 = _interopRequireDefault(_chartScatter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global d3 */

var Chart = function (_Renderer) {
  _inherits(Chart, _Renderer);

  function Chart(_ref) {
    var _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose,
        appendTo = _ref.appendTo,
        callbackHandler = _ref.callbackHandler;

    _classCallCheck(this, Chart);

    return _possibleConstructorReturn(this, (Chart.__proto__ || Object.getPrototypeOf(Chart)).call(this, { verbose: verbose, appendTo: appendTo, callbackHandler: callbackHandler }));
  }

  _createClass(Chart, [{
    key: 'render',
    value: function render(json) {

      if (!json.canvas.chart) {
        return;
      }

      var element = undefined;
      switch (json.canvas.chart.type) {
        case "bar":
          element = new _chartBar2.default(this.options).render(json);
          break;
        case "line":
          element = new _chartLine2.default(this.options).render(json);
          break;
        case "scatter":
          element = new _chartScatter2.default(this.options).render(json);
          break;
      }

      return element;
    }
  }, {
    key: 'unrender',
    value: function unrender() {}
  }], [{
    key: 'domainRange',
    value: function domainRange(max) {
      return Array.from(new Array(max), function (_, i) {
        return i;
      }).map(function (x) {
        return x;
      });
    }
  }, {
    key: 'colors',
    get: function get() {
      return d3.scaleSequential().domain([0, 100]).interpolator(d3.interpolateRainbow);
    }
  }]);

  return Chart;
}(_renderer2.default);

exports.default = Chart;

},{"./chart-bar":5,"./chart-line":6,"./chart-scatter":7,"./renderer":16}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Composite = function (_Renderer) {
  _inherits(Composite, _Renderer);

  function Composite(_ref) {
    var _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose,
        appendTo = _ref.appendTo,
        callbackHandler = _ref.callbackHandler;

    _classCallCheck(this, Composite);

    var _this = _possibleConstructorReturn(this, (Composite.__proto__ || Object.getPrototypeOf(Composite)).call(this, { verbose: verbose, appendTo: appendTo, callbackHandler: callbackHandler }));

    if (new.target === Composite) {
      throw new TypeError('Cannot construct [Composite] instances directly!');
    }
    _this.renderers = [];
    return _this;
  }

  _createClass(Composite, [{
    key: 'add',
    value: function add(renderer) {
      this.renderers.push(renderer);
    }
  }, {
    key: 'renderChildren',
    value: function renderChildren(parent, json) {
      // update children rendering with a new parent if required!
      var childrenOptions = this.options;
      if (parent) {
        childrenOptions.appendTo = parent;
      }
      // render other components
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.renderers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var renderer = _step.value;

          renderer.update(childrenOptions).render(json);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }]);

  return Composite;
}(_renderer2.default);

exports.default = Composite;

},{"./renderer":16}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

var _menuContext = require('./menu-context');

var _menuContext2 = _interopRequireDefault(_menuContext);

var _tooltip = require('./tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _callback = require('./callback');

var _callback2 = _interopRequireDefault(_callback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global d3 */

var Graph = function (_Renderer) {
  _inherits(Graph, _Renderer);

  _createClass(Graph, null, [{
    key: 'getSymbol',
    value: function getSymbol(type) {
      if (type === 'circle') {
        return d3.symbolCircle;
      } else if (type === 'cross') {
        return d3.symbolCross;
      } else if (type === 'diamond') {
        return d3.symbolDiamond;
      } else if (type === 'square') {
        return d3.symbolSquare;
      } else if (type === 'triangle') {
        return d3.symbolTriangle;
      } else if (type === 'star') {
        return d3.symbolStar;
      } else if (type === 'wye') {
        return d3.symbolWye;
      } else {
        return d3.symbolCircle;
      }
    }
  }, {
    key: 'colors',
    get: function get() {
      return d3.scaleSequential().domain([0, 100]).interpolator(d3.interpolateRainbow);
    }
  }]);

  function Graph(_ref) {
    var _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose,
        appendTo = _ref.appendTo,
        callbackHandler = _ref.callbackHandler;

    _classCallCheck(this, Graph);

    return _possibleConstructorReturn(this, (Graph.__proto__ || Object.getPrototypeOf(Graph)).call(this, { verbose: verbose, appendTo: appendTo, callbackHandler: callbackHandler }));
  }

  _createClass(Graph, [{
    key: 'render',
    value: function render(json) {

      // just ignore rendering if no graph is present
      if (!json.canvas.graph) {
        this.logger.debug('No Graph to render here... continuing...');
        return;
      }

      var dataChanged = false;
      var tooltip = new _tooltip2.default(this.options);
      var contextMenu = new _menuContext2.default(this.options);
      var callback = new _callback2.default(this.options);

      var parent = this.options.appendTo;

      var canvasNodes = json.canvas.graph.nodes ? Object.values(json.canvas.graph.nodes) : [],
          canvasLinks = json.canvas.graph.links ? Object.values(json.canvas.graph.links) : [];

      var svg = parent.select('g.francy-content'),
          width = +parent.attr('width') || d3.select('body').node().getBoundingClientRect().width,
          height = +parent.attr('height') || d3.select('body').node().getBoundingClientRect().height;

      var linkGroup = svg.selectAll('g.francy-links');

      if (!linkGroup.node()) {
        linkGroup = svg.append('g').attr('class', 'francy-links');
      }

      var link = linkGroup.selectAll('line.francy-link').data(canvasLinks);

      if (link.enter().data().length > 0 || link.enter().data().length > 0) {
        dataChanged = true;
      }

      link.exit().remove();

      link = link.enter().append('line').attr('class', 'francy-link').attr('id', function (d) {
        return d.source + ',' + d.target;
      }).attr('x1', function (d) {
        return d.source.x;
      }).attr('y1', function (d) {
        return d.source.y;
      }).attr('x2', function (d) {
        return d.target.x;
      }).attr('y2', function (d) {
        return d.target.y;
      }).merge(link);

      if (json.canvas.graph.type === 'directed') {
        // this means we need arrows, so we append the marker
        parent.append('defs').selectAll('marker').data(['arrow']).enter().append('marker').attr('class', 'francy-arrows').attr('id', function (d) {
          return d;
        }).attr('viewBox', '0 -5 10 10').attr('refX', 25).attr('refY', 0).attr('markerWidth', 10).attr('markerHeight', 10).attr('orient', 'auto').append('path').attr('d', 'M0,-5L10,0L0,5 L10,0 L0, -5');
        // update the style of the link
        link.style('marker-end', 'url(#arrow)');
      }

      var nodeGroup = svg.selectAll('g.francy-nodes');

      if (!nodeGroup.node()) {
        nodeGroup = svg.append('g').attr('class', 'francy-nodes');
      }

      var node = nodeGroup.selectAll('path.francy-node').data(canvasNodes);

      if (node.enter().data().length > 0 || node.enter().data().length > 0) {
        dataChanged = true;
      }

      node.exit().remove();

      node = node.enter().append('path').merge(node).attr('d', d3.symbol().type(function (d) {
        return Graph.getSymbol(d.type);
      }).size(function (d) {
        return d.size * 100;
      })).attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      }).style('fill', function (d) {
        return Graph.colors(d.layer * 5);
      }).attr('class', function (d) {
        return 'francy-node' + (d.highlight ? ' francy-highlight' : '') + (Object.values(d.menus).length ? ' francy-context' : '');
      }).attr('id', function (d) {
        return d.id;
      });

      node.append('title').text(function (d) {
        if (d.messages && Object.values(d.messages).length) {
          return Object.keys(d.messages).map(function (key) {
            return d.messages[key].title + ': ' + d.messages[key].text;
          }).join('\n');
        }
      });

      if (json.canvas.graph.drag) {
        node.call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended));
      }

      node.on('contextmenu', function (d) {
        d3.event.preventDefault();
        // default, build context menu
        contextMenu.render(d);
        // any callbacks will be handled here
        executeCallback.call(this, d, 'contextmenu');
      }).on('click', function (d) {
        // default, highlight connected nodes
        connectedNodes.call(this);
        // any callbacks will be handled here
        executeCallback.call(this, d, 'click');
      }).on('dblclick', function (d) {
        // any callbacks will be handled here
        executeCallback.call(this, d, 'dblclick');
      }).on("mouseover", function () {
        // default, show tooltip
        //tooltip.render(d.messages);
      }).on("mouseout", function () {
        // default, hide tooltip
        //tooltip.unrender();
      });

      var labelGroup = svg.selectAll('.francy-labels');

      if (!labelGroup.node()) {
        labelGroup = svg.append('g').attr('class', 'francy-labels');
      }

      var label = labelGroup.selectAll('text').data(canvasNodes);

      label.exit().remove();

      label = label.enter().append('text').merge(label).attr('class', 'francy-label').text(function (d) {
        return d.title;
      }).attr('x', function (d) {
        return d.x - d.title.length - Math.sqrt(d.size * d.title.length * 2);
      }).attr('y', function (d) {
        return d.y - Math.sqrt(d.size * 2);
      });

      label.on('contextmenu', function (d) {
        // default, build context menu
        contextMenu.render(d);
        // any callbacks will be handled here
        executeCallback.call(this, d, 'contextmenu');
      }).on('click', function (d) {
        // default, highlight connected nodes
        connectedNodes.call(this);
        // any callbacks will be handled here
        executeCallback.call(this, d, 'click');
      }).on('dblclick', function (d) {
        // any callbacks will be handled here
        executeCallback.call(this, d, 'dblclick');
      }).on("mouseover", function (d) {
        // default, show tooltip
        tooltip.render(d.messages);
      }).on("mouseout", function () {
        // default, hide tooltip
        tooltip.unrender();
      });

      if (json.canvas.graph.simulation && dataChanged) {
        // Canvas Forces
        var centerForce = d3.forceCenter().x(width / 2).y(height / 2);
        var manyForce = d3.forceManyBody().strength(-canvasNodes.length * 30);
        var linkForce = d3.forceLink(canvasLinks).id(function (d) {
          return d.id;
        }).distance(50);
        var collideForce = d3.forceCollide(function (d) {
          return d.size * 2;
        });

        //Generic gravity for the X position
        var forceX = d3.forceX(width / 2).strength(0.05);

        //Generic gravity for the Y position - undirected/directed graphs fall here
        var forceY = d3.forceY(height / 2).strength(0.25);

        if (json.canvas.graph.type === 'hasse') {
          //Generic gravity for the X position
          forceX = d3.forceX(width / 2).strength(0.5);
          //Strong y positioning based on layer to simulate the hasse diagram
          forceY = d3.forceY(function (d) {
            return d.layer * 50;
          }).strength(5);
        }

        var simulation = d3.forceSimulation(canvasNodes).force("charge", manyForce).force("link", linkForce).force("center", centerForce).force("x", forceX).force("y", forceY).force("collide", collideForce).on('tick', ticked).on("end", function () {
          // zoom to fit when simulation is over
          parent.zoomToFit();
        });

        //force simulation restart
        simulation.restart();
      } else {
        // well, simulation is off, zoom to fit now
        parent.zoomToFit();
      }

      function ticked() {
        link.attr('x1', function (d) {
          return d.source.x;
        }).attr('y1', function (d) {
          return d.source.y;
        }).attr('x2', function (d) {
          return d.target.x;
        }).attr('y2', function (d) {
          return d.target.y;
        });

        node.attr('transform', function (d) {
          return 'translate(' + d.x + ',' + d.y + ')';
        });

        label.attr('x', function (d) {
          return d.x - d.title.length - Math.sqrt(d.size * d.title.length * 2);
        }).attr('y', function (d) {
          return d.y - Math.sqrt(d.size * 2);
        });

        node.each(collide(1));
      }

      // COLLISION
      var padding = 10; // separation between circles;

      function collide(alpha) {
        var quadTree = d3.quadtree(canvasNodes);
        return function (d) {
          var rb = 100 * d.size + padding,
              nx1 = d.x - rb,
              nx2 = d.x + rb,
              ny1 = d.y - rb,
              ny2 = d.y + rb;
          quadTree.visit(function (quad, x1, y1, x2, y2) {
            if (quad.point && quad.point !== d) {
              var x = d.x - quad.point.x,
                  y = d.y - quad.point.y,
                  l = Math.sqrt(x * x + y * y);
              if (l < rb) {
                l = (l - rb) / l * alpha;
                d.x -= x *= l;
                d.y -= y *= l;
                quad.point.x += x;
                quad.point.y += y;
              }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
          });
        };
      }

      // HIGHLIGHT
      //Toggle stores whether the highlighting is on
      var toggle = 0;
      //Create an array logging what is connected to what
      var linkedByIndex = {};

      for (var i = 0; i < canvasNodes.length; i++) {
        linkedByIndex[i + ',' + i] = 1;
      }

      canvasLinks.forEach(function (d) {
        linkedByIndex[d.source.index + ',' + d.target.index] = 1;
      });

      function connectedNodes() {
        //This function looks up whether a pair are neighbours
        function neighboring(a, b) {
          return linkedByIndex[a.index + ',' + b.index];
        }
        d3.event.preventDefault();
        if (toggle === 0) {
          //Reduce the opacity of all but the neighbouring nodes
          var d = d3.select(this).node().__data__;
          node.style('opacity', function (o) {
            return neighboring(d, o) || neighboring(o, d) ? 1 : 0.1;
          });
          link.style('opacity', function (o) {
            return d.index === o.source.index || d.index === o.target.index ? 1 : 0.1;
          });
          //Reduce the op
          toggle = 1;
        } else {
          //Put them back to opacity=1
          node.style('opacity', 1);
          link.style('opacity', 1);
          toggle = 0;
        }
      }

      function dragstarted(d) {
        if (!d3.event.active) {
          simulation.alphaTarget(0.01).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) {
          simulation.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
      }

      function executeCallback(data, event) {
        if (data.callbacks) {
          Object.values(data.callbacks).forEach(function (cb) {
            // execute the ones that match the event!
            cb.trigger === event && callback.execute({ callback: cb });
          });
        }
      }

      return svg;
    }
  }, {
    key: 'unrender',
    value: function unrender() {}
  }]);

  return Graph;
}(_renderer2.default);

exports.default = Graph;

},{"./callback":3,"./menu-context":11,"./renderer":16,"./tooltip":17}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _menu = require('./menu');

var _menu2 = _interopRequireDefault(_menu);

var _callback = require('./callback');

var _callback2 = _interopRequireDefault(_callback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global d3 */

var ContextMenu = function (_Menu) {
  _inherits(ContextMenu, _Menu);

  function ContextMenu(_ref) {
    var _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose,
        appendTo = _ref.appendTo,
        callbackHandler = _ref.callbackHandler;

    _classCallCheck(this, ContextMenu);

    return _possibleConstructorReturn(this, (ContextMenu.__proto__ || Object.getPrototypeOf(ContextMenu)).call(this, { verbose: verbose, appendTo: appendTo, callbackHandler: callbackHandler }));
  }

  _createClass(ContextMenu, [{
    key: 'render',
    value: function render(object) {
      var _this2 = this;

      // just ignore rendering if no menus are present
      if (!object.menus || !Object.values(object.menus).length) {
        this.logger.debug('No ContextMenu to render here... continuing...');
        return;
      }

      var contextMenu = this.SVGParent.select('g.francy-context-menu');

      // check if the window is already present
      if (contextMenu.node()) {
        return;
      }

      contextMenu = this.SVGParent.append('g').attr('class', 'francy-context-menu');

      var menus = this.flatten(object.menus);

      this.SVGParent.selectAll('.tmp').data(menus).enter().append('text').text(function (d) {
        return d.title;
      }).attr('x', -1000).attr('y', -1000).attr('class', 'tmp');
      var z = this.SVGParent.selectAll('.tmp').nodes().map(function (x) {
        return x.getBBox();
      });
      var width = d3.max(z.map(function (x) {
        return x.width;
      }));
      var margin = 5;
      width = Math.round(width + 2 * margin);
      var height = Math.round(d3.max(z.map(function (x) {
        return x.height + margin * 2;
      })));
      var pos = d3.mouse(this.SVGParent.node());
      var x = pos[0] + 5,
          y = pos[1] + 5;

      this.SVGParent.selectAll('.tmp').remove();

      contextMenu.append('rect').attr('transform', 'translate(' + x + ',' + y + ')').attr('width', width).attr('height', height * menus.length).attr('class', 'francy-menu-border');

      contextMenu.selectAll('g.francy-menu-entry').data(menus).enter().append('g').attr('class', 'francy-menu-entry').on('mouseover', function () {
        d3.select(this).classed('francy-menu-entry-selected', true);
      }).on('mouseout', function () {
        d3.select(this).classed('francy-menu-entry-selected', false);
      });

      contextMenu.selectAll('g.francy-menu-entry').append('rect').attr('transform', function (d, i) {
        return 'translate(' + x + ',' + (y + i * height) + ')';
      }).attr('width', width).attr('height', height).attr('id', function (d) {
        return d.id;
      });

      contextMenu.selectAll('g.francy-menu-entry').append('text').attr('transform', function (d, i) {
        return 'translate(' + (x + margin) + ',' + (y + i * height + margin * 3) + ')';
      }).text(function (d) {
        return d.title;
      }).attr('id', function (d) {
        return d.id;
      });

      contextMenu.selectAll('g.francy-menu-entry').on('click', function (d) {
        return new _callback2.default(_this2.options).execute(d);
      });

      this.SVGParent.on('click', function () {
        return contextMenu.remove();
      });

      return contextMenu;
    }
  }, {
    key: 'unrender',
    value: function unrender() {}
  }, {
    key: 'flatten',
    value: function flatten(menus) {
      var self = this;
      return [].concat.apply([], Object.values(menus).map(function (menu) {
        if (menu.menus && Object.values(menu.menus).length > 0) {
          return self.flatten(menu.menus);
        }
        return menu;
      }));
    }
  }]);

  return ContextMenu;
}(_menu2.default);

exports.default = ContextMenu;

},{"./callback":3,"./menu":13}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _menu = require('./menu');

var _menu2 = _interopRequireDefault(_menu);

var _callback = require('./callback');

var _callback2 = _interopRequireDefault(_callback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//import AboutModal from './modal-about';

/* global d3, window */

var MainMenu = function (_Menu) {
  _inherits(MainMenu, _Menu);

  function MainMenu(_ref) {
    var _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose,
        appendTo = _ref.appendTo,
        callbackHandler = _ref.callbackHandler;

    _classCallCheck(this, MainMenu);

    return _possibleConstructorReturn(this, (MainMenu.__proto__ || Object.getPrototypeOf(MainMenu)).call(this, { verbose: verbose, appendTo: appendTo, callbackHandler: callbackHandler }));
  }

  _createClass(MainMenu, [{
    key: 'render',
    value: function render(json) {
      var _this2 = this;

      // just ignore rendering if no menus are present
      if (!json.canvas.menus || !Object.values(json.canvas.menus).length) {
        this.logger.debug('No Menu to render here... continuing...');
        return;
      }

      var menu = this.SVGParent.select('g.francy-main-menu');

      // check if the window is already present
      if (menu.node()) {
        return;
      }

      menu = this.SVGParent.append('g').attr('class', 'francy-main-menu');

      var menus = Object.values(json.canvas.menus);
      var self = this;

      this.SVGParent.selectAll('.tmp').data(menus).enter().append('text').text(function (d) {
        return d.title;
      }).attr('x', -1000).attr('y', -1000).attr('class', 'tmp');
      var z = this.SVGParent.selectAll('.tmp').nodes().map(function (x) {
        return x.getBBox();
      });
      var width = d3.max(z.map(function (x) {
        return x.width;
      }));
      var margin = 10;
      width = Math.round(width + 2 * margin);
      var height = Math.round(d3.max(z.map(function (x) {
        return x.height + margin * 2;
      })));
      var x = 5,
          y = 0;

      this.SVGParent.selectAll('.tmp').remove();

      menu.append('rect').attr('transform', 'translate(0,0)').attr('width', '100%').attr('height', height).attr('class', 'francy-menu-border');
      menu.append('rect').attr('transform', 'translate(0,0)').attr('width', '100%').attr('height', height);

      menu.selectAll('g.francy-menu-entry').data(menus).enter().append('g').attr('class', 'francy-menu-entry').attr('id', function (d) {
        return d.id;
      }).on('mouseover', function (d) {
        if (d.menus && Object.values(d.menus).length) {
          self.buildMenu(d3.select(this), d);
        } else {
          d3.select(this).classed('francy-menu-entry-selected', true);
        }
      }).on('mouseout', function () {
        d3.select(this).classed('francy-menu-entry-selected', false);
      });

      menu.selectAll('g.francy-menu-entry').append('rect').attr('transform', function (d, i) {
        return 'translate(' + (x + i * width) + ',' + y + ')';
      }).attr('width', width).attr('height', height);

      menu.selectAll('g.francy-menu-entry').append('text').attr('transform', function (d, i) {
        return 'translate(' + (x + i * width + margin) + ',' + (y + height / 1.7) + ')';
      }).text(function (d) {
        return d.title;
      });

      menu.selectAll('g.francy-menu-entry rect').on('click', function (d) {
        if (!d.menus || !Object.values(d.menus).length) {
          new _callback2.default(_this2.options).execute(d);
        }
      });

      return menu;
    }
  }, {
    key: 'unrender',
    value: function unrender() {}
  }, {
    key: 'buildMenu',
    value: function buildMenu(parent, object) {
      var _this3 = this;

      var contextMenu = parent.select('g.francy-submenu');

      // check if the window is already present
      if (contextMenu.node()) {
        return;
      }

      contextMenu = parent.append('g').attr('class', 'francy-submenu');

      var menus = this.flatten(object.menus);

      this.SVGParent.selectAll('.tmp').data(menus).enter().append('text').text(function (d) {
        return d.title;
      }).attr('x', -1000).attr('y', -1000).attr('class', 'tmp');
      var z = this.SVGParent.selectAll('.tmp').nodes().map(function (x) {
        return x.getBBox();
      });
      var width = d3.max(z.map(function (x) {
        return x.width;
      }));
      var margin = 10;
      width = Math.round(width + 2 * margin);
      var height = Math.round(d3.max(z.map(function (x) {
        return x.height + margin * 2;
      })));
      var box = parent.select('rect').node().getBBox();
      width = width < box.width ? box.width : width;
      var pos = parent.select('rect').node().transform.baseVal.consolidate().matrix;
      var x = pos.e,
          y = pos.f + box.height + 1;

      this.SVGParent.selectAll('.tmp').remove();

      contextMenu.append('rect').attr('transform', 'translate(' + x + ',' + y + ')').attr('width', width).attr('height', height * menus.length).attr('class', 'francy-menu-border');
      contextMenu.append('rect').attr('transform', 'translate(' + x + ',' + y + ')').attr('width', width).attr('height', height * menus.length);

      contextMenu.selectAll('g.francy-menu-entry').data(menus).enter().append('g').attr('class', 'francy-menu-entry').on('mouseover', function () {
        d3.select(this).classed('francy-menu-entry-selected', true);
      }).on('mouseout', function () {
        d3.select(this).classed('francy-menu-entry-selected', false);
      });

      contextMenu.selectAll('g.francy-menu-entry').append('rect').attr('transform', function (d, i) {
        return 'translate(' + x + ',' + (y + i * height) + ')';
      }).attr('width', width).attr('height', height).attr('id', function (d) {
        return d.id;
      });

      contextMenu.selectAll('g.francy-menu-entry').append('text').attr('transform', function (d, i) {
        return 'translate(' + (x + margin) + ',' + (y + (i * height + margin * 2)) + ')';
      }).text(function (d) {
        return d.title;
      }).attr('id', function (d) {
        return d.id;
      });

      contextMenu.selectAll('g.francy-menu-entry').on('click', function (d) {
        return new _callback2.default(_this3.options).execute(d);
      });

      //contextMenu.append('rect')
      //.attr('transform', `translate(${x},${y})`)
      //.attr('width', width).attr('height', height * menus.length)
      //.style('visibility', 'hidden');
      //contextMenu.on('mouseover', function() { contextMenu.on('mouseout', () => contextMenu.remove()); });

      return contextMenu;
    }
  }, {
    key: 'flatten',
    value: function flatten(menus) {
      var self = this;
      return [].concat.apply([], Object.values(menus).map(function (menu) {
        if (menu.menus && Object.values(menu.menus).length > 0) {
          return self.flatten(menu.menus);
        }
        return menu;
      }));
    }
  }]);

  return MainMenu;
}(_menu2.default);

exports.default = MainMenu;

},{"./callback":3,"./menu":13}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

var _callback = require('./callback');

var _callback2 = _interopRequireDefault(_callback);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// TODO replace foreignObject http://bl.ocks.org/jakosz/ce1e63d5149f64ac7ee9
var Menu = function (_Renderer) {
  _inherits(Menu, _Renderer);

  function Menu(_ref) {
    var _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose,
        appendTo = _ref.appendTo,
        callbackHandler = _ref.callbackHandler;

    _classCallCheck(this, Menu);

    return _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).call(this, { verbose: verbose, appendTo: appendTo, callbackHandler: callbackHandler }));
  }

  _createClass(Menu, [{
    key: 'traverse',
    value: function traverse(appendTo, menusIterator) {
      var _this2 = this;

      while (menusIterator.hasNext()) {
        var menuItem = menusIterator.next();
        var entry = appendTo.append('li');
        var action = entry.selectAll('a').data([menuItem]).enter().append('a').attr('title', menuItem.title).html(menuItem.title);
        if (menuItem.callback && Object.values(menuItem.callback).length) {
          action.on('click', function (d) {
            return new _callback2.default(_this2.options).execute(d);
          });
        }
        if (menuItem.menus && Object.values(menuItem.menus).length > 0) {
          var content = entry.append('ul');
          var subMenusIterator = this.iterator(Object.values(menuItem.menus));
          this.traverse(content, subMenusIterator);
        }
      }
    }
  }, {
    key: 'iterator',
    value: function iterator(array) {
      var nextIndex = 0;
      return {
        next: function next() {
          return this.hasNext() ? array[nextIndex++] : undefined;
        },
        hasNext: function hasNext() {
          return nextIndex < array.length;
        },
        count: function count() {
          return array.length;
        }
      };
    }
  }, {
    key: 'unrender',
    value: function unrender() {}
  }]);

  return Menu;
}(_renderer2.default);

exports.default = Menu;

},{"./callback":3,"./renderer":16}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global d3 */

var Message = function (_Renderer) {
  _inherits(Message, _Renderer);

  function Message(_ref) {
    var _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose,
        appendTo = _ref.appendTo,
        callbackHandler = _ref.callbackHandler;

    _classCallCheck(this, Message);

    return _possibleConstructorReturn(this, (Message.__proto__ || Object.getPrototypeOf(Message)).call(this, { verbose: verbose, appendTo: appendTo, callbackHandler: callbackHandler }));
  }

  _createClass(Message, [{
    key: 'render',
    value: function render(messages) {

      // just ignore rendering if no messages are present
      if (!messages || !Object.values(messages).length) {
        //this.logger.debug('Nothing to render here... continuing...');
        return;
      }

      this.SVGParent.selectAll('.tmp').data(Object.keys(messages)).enter().append('text').attr('x', -1000).attr('y', -1000).attr('class', 'tmp').text(function (d) {
        return messages[d].title + messages[d].text;
      }).call(this.wrap);

      var z = this.SVGParent.selectAll('.tmp').nodes().map(function (x) {
        return x.getBBox();
      });
      var width = d3.max(z.map(function (x) {
        return x.width;
      }));
      var margin = 20;
      width = Math.round(width + 2 * margin);
      var height = Math.round(d3.max(z.map(function (x) {
        return x.height + margin * 2;
      })));
      var x = 10,
          y = 55;

      this.SVGParent.selectAll('.tmp').remove();

      var alerts = this.SVGParent.select('g.francy-alerts');

      // check if the window is already present
      if (!alerts.node()) {
        alerts = this.SVGParent.append('g').attr('class', 'francy-alerts');
      }

      alerts = alerts.selectAll('g.francy-alert').data(Object.keys(messages));

      alerts.exit().remove();

      alerts = alerts.enter().append('g').attr('class', 'francy-alert').attr('id', function (d) {
        return d;
      });

      alerts.append('rect').attr('class', function (d) {
        return 'francy-alert alert-' + messages[d].type;
      }).attr('transform', function (d, i) {
        return 'translate(' + x + ',' + (y + i * (height + 5)) + ')';
      }).attr('rx', "5").attr('ry', "5").attr('width', width).attr('height', height);

      alerts.append('text').attr('transform', function (d, i) {
        return 'translate(' + (x + margin) + ',' + (y + i * (height - 5) + margin * 2) + ')';
      }).text(function (d) {
        return messages[d].title + messages[d].text;
      }).call(this.wrap);

      alerts.merge(alerts);

      alerts.on('click', function () {
        d3.select(this).style('display', 'none');
      });
    }
  }, {
    key: 'wrap',
    value: function wrap(text) {
      text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/[\s\n]+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1,
            y = text.attr("y"),
            dy = 0,
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        word = words.pop();
        while (word) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > 300) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
          word = words.pop();
        }
      });
    }
  }, {
    key: 'unrender',
    value: function unrender() {}
  }]);

  return Message;
}(_renderer2.default);

exports.default = Message;

},{"./renderer":16}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global d3 Jupyter */

var RequiredArgsModal = function (_Renderer) {
  _inherits(RequiredArgsModal, _Renderer);

  function RequiredArgsModal(_ref) {
    var _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose,
        appendTo = _ref.appendTo,
        callbackHandler = _ref.callbackHandler;

    _classCallCheck(this, RequiredArgsModal);

    return _possibleConstructorReturn(this, (RequiredArgsModal.__proto__ || Object.getPrototypeOf(RequiredArgsModal)).call(this, { verbose: verbose, appendTo: appendTo, callbackHandler: callbackHandler }));
  }

  _createClass(RequiredArgsModal, [{
    key: 'render',
    value: function render(json) {
      var self = this;

      var modalId = json.callback.id;

      this.logger.debug('Creating Callback Modal [' + modalId + ']...');

      // we want to overlay everything, hence 'body' must be used
      var overlay = d3.select('body').append('div').attr('class', 'francy-overlay');
      var holder = d3.select('body').append('div').attr('class', 'francy');
      var modal = holder.append('div').attr('id', modalId).attr('class', 'francy-modal');

      var form = modal.append('form');

      var header = form.append('div').attr('class', 'francy-modal-header');

      var headerTitle = header.append('span').html('Required arguments&nbsp;');
      if (json.title) {
        headerTitle.append('span').attr('style', 'font-weight: bold;').text('for ' + json.title);
      }

      var content = form.append('div').attr('class', 'francy-modal-content').append('div').attr('class', 'francy-table').append('div').attr('class', 'francy-table-body');

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.values(json.callback.requiredArgs)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var arg = _step.value;

          var row = content.append('div').attr('class', 'francy-table-row');
          row.append('div').attr('class', 'francy-table-cell').append('label').attr('for', arg.id).text(arg.title);
          var input = row.append('div').attr('class', 'francy-table-cell').append('input').attr('id', arg.id).attr('class', 'francy-arg').attr('required', '').attr('name', arg.id).attr('type', arg.type).attr('value', arg.value).on('change', function () {
            json.callback.requiredArgs[this.id].value = this.value;
          }).on('input', this.onchange).on('keyup', this.onchange).on('paste', this.onchange);
          // wait, if it is boolean we create a checkbox
          if (arg.type === 'boolean') {
            // well, a checkbox works this way so we need to initialize 
            // the value to false and update the value based on the checked 
            // property that triggers the onchange event
            arg.value = arg.value || false;
            input.attr('type', 'checkbox').attr('required', null).attr('value', arg.value).on('change', function () {
              json.callback.requiredArgs[this.id].value = this.value = this.checked;
            });
          }
          row.append('span').attr('class', 'validity');
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var footer = form.append('div').attr('class', 'francy-modal-footer');

      footer.append('button').text('Ok').on('click', function () {
        if (form.node().checkValidity()) {
          self.options.callbackHandler(json.callback);
          overlay.remove();
          modal.remove();
          holder.remove();
        }
        d3.event.preventDefault();
        return false;
      });
      footer.append('button').text('Cancel').on('click', function () {
        overlay.remove();
        modal.remove();
        holder.remove();
        d3.event.preventDefault();
        return false;
      });

      // disable keyboard shortcuts when using this modal in Jupyter
      try {
        Jupyter.keyboard_manager.register_events('.francy');
        Jupyter.keyboard_manager.register_events('.francy-arg');
        Jupyter.keyboard_manager.register_events('.francy-overlay');
        Jupyter.keyboard_manager.register_events('.francy-modal');
      } catch (e) {
        if (e.name == 'ReferenceError') {
          self.logger.debug('It seems we\'re not running on Jupyter...', e);
        }
      }

      content.selectAll('.francy-arg').node().focus();

      this.logger.debug('Callback Modal updated [' + modalId + ']...');

      return modal;
    }
  }, {
    key: 'unrender',
    value: function unrender() {}
  }]);

  return RequiredArgsModal;
}(_renderer2.default);

exports.default = RequiredArgsModal;

},{"./renderer":16}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global d3 */

var Renderer = function (_Base) {
  _inherits(Renderer, _Base);

  function Renderer(_ref) {
    var _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose,
        appendTo = _ref.appendTo,
        callbackHandler = _ref.callbackHandler;

    _classCallCheck(this, Renderer);

    var _this = _possibleConstructorReturn(this, (Renderer.__proto__ || Object.getPrototypeOf(Renderer)).call(this, { verbose: verbose, appendTo: appendTo, callbackHandler: callbackHandler }));

    if (new.target === Renderer) {
      throw new TypeError('Cannot construct [Renderer] instances directly!');
    }
    if (_this.render === undefined || typeof _this.render !== 'function') {
      throw new TypeError('Must override [render(json)] method!');
    }
    if (_this.unrender === undefined) {
      _this.logger.debug('No [unrender()] method specified...');
    }
    return _this;
  }

  _createClass(Renderer, [{
    key: 'HTMLParent',
    get: function get() {
      return d3.select(this.options.appendTo.node().parentNode);
    }
  }, {
    key: 'SVGParent',
    get: function get() {
      return this.options.appendTo;
    }
  }]);

  return Renderer;
}(_base2.default);

exports.default = Renderer;

},{"./base":2}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _renderer = require('./renderer');

var _renderer2 = _interopRequireDefault(_renderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global d3 */

var Tooltip = function (_Renderer) {
  _inherits(Tooltip, _Renderer);

  function Tooltip(_ref) {
    var _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose,
        appendTo = _ref.appendTo,
        callbackHandler = _ref.callbackHandler;

    _classCallCheck(this, Tooltip);

    var _this = _possibleConstructorReturn(this, (Tooltip.__proto__ || Object.getPrototypeOf(Tooltip)).call(this, { verbose: verbose, appendTo: appendTo, callbackHandler: callbackHandler }));

    _this.tooltip = _this.SVGParent.select('foreignObject.francy-tooltip-holder');
    // check if the window is already present
    if (!_this.tooltip.node()) {
      _this.tooltip = _this.SVGParent.append('foreignObject').attr('class', 'francy-tooltip-holder');
    }
    return _this;
  }

  _createClass(Tooltip, [{
    key: 'render',
    value: function render(object) {

      // just ignore rendering if no messages are present
      if (!object || !Object.values(object).length) {
        //this.logger.debug('Nothing to render here... continuing...');
        return;
      }

      // TODO fix always visible tooltip, fine until someone complains about :P
      this.tooltip.attr('transform', 'translate(' + (d3.event.offsetX + 5) + ',' + (d3.event.offsetY + 5) + ')');

      // check if it exists already
      if (this.tooltip.selectAll('*').node()) {
        return;
      }

      var table = this.tooltip.append('xhtml:div').attr('class', 'francy-tooltip').append('div').attr('class', 'francy-table').append('div').attr('class', 'francy-table-body');
      Object.keys(object).map(function (key) {
        var row = table.append('div').attr('class', 'francy-table-row');
        row.append('div').attr('class', 'francy-table-cell').text(object[key].title);
        row.append('div').attr('class', 'francy-table-cell').text(object[key].text);
      });

      // show tooltip
      this.tooltip.style('display', 'block').attr('width', '100%').attr('height', '500px');
    }
  }, {
    key: 'unrender',
    value: function unrender() {
      this.tooltip.selectAll('*').remove();
      this.tooltip.style('display', null);
    }
  }]);

  return Tooltip;
}(_renderer2.default);

exports.default = Tooltip;

},{"./renderer":16}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * This class contains methods to deal with JSON.
 */
var JsonUtils = function () {
  function JsonUtils() {
    _classCallCheck(this, JsonUtils);
  }

  _createClass(JsonUtils, null, [{
    key: 'parse',


    /**
     * Parses an input nd checks whether this input is valid and returns a JSON object.
     * @param input - the input to parse
     * @returns {json} - if the input is a valid JSON object, otherwise returns {undefined}
     */
    value: function parse(input) {
      input = typeof input !== "string" ? JSON.stringify(input) : input;
      input = input.replace(/[\n\r\b\\]+|(gap>)/g, '');
      var jsonRegex = /{(?:[^])*}/g;
      var match = jsonRegex.exec(input);
      if (match) {
        input = match[0];
        try {
          var json = JSON.parse(input);
          return json.mime === 'application/vnd.francy+json' ? json : undefined;
        } catch (e) {
          /* eslint-disable no-console */
          console.error(e);
          /* eslint-enable no-console */
        }
      }
      return undefined;
    }
  }]);

  return JsonUtils;
}();

exports.default = JsonUtils;

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var singleton = null;

/**
 * This class is a singleton that provides a logger for the Francy application.
 */

var Logger = function () {

  /**
   * Singleton: Creates an instance of the logger and will returned that instance,
   * everytime a new instance is requested.
   * @param verbose prints extra log information to console.log, default false
   */
  function Logger() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose;

    _classCallCheck(this, Logger);

    if (!singleton) {
      this.verbose = verbose;
      this.console = console;
      singleton = this;
    } else {
      return singleton;
    }
  }

  /**
   * Creates a [DEBUG] entry in the console log
   * @param message the message to print
   */


  _createClass(Logger, [{
    key: 'debug',
    value: function debug(message) {
      if (this.verbose) {
        this.console.debug(this._format('DEBUG', message));
      }
    }

    /**
     * Creates a [INFO] entry in the console log
     * @param message the message to print
     */

  }, {
    key: 'info',
    value: function info(message) {
      this.console.info(this._format('INFO', message));
    }

    /**
     * Creates a [ERROR] entry in the console log
     * @param message the message to print
     * @param error the error Object to attach to the message
     */

  }, {
    key: 'error',
    value: function error(message, _error) {
      this.console.error(this._format('ERROR', message), _error);
    }

    /**
     * Creates a [WARN] entry in the console log
     * @param message the message to print
     * @param error the error Object to attach to the message
     */

  }, {
    key: 'warn',
    value: function warn(message, error) {
      error = error || {};
      this.console.error(this._format('WARN', message), error);
    }

    /**
     * This is a private method that formats all log messages
     * @param message the message to print
     */

  }, {
    key: '_format',
    value: function _format(level, message) {
      return '[' + level + '] - ' + new Date().toISOString() + ' - ' + message;
    }
  }]);

  return Logger;
}();

exports.default = Logger;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZnJhbmN5LmpzIiwic3JjL3JlbmRlci9iYXNlLmpzIiwic3JjL3JlbmRlci9jYWxsYmFjay5qcyIsInNyYy9yZW5kZXIvY2FudmFzLmpzIiwic3JjL3JlbmRlci9jaGFydC1iYXIuanMiLCJzcmMvcmVuZGVyL2NoYXJ0LWxpbmUuanMiLCJzcmMvcmVuZGVyL2NoYXJ0LXNjYXR0ZXIuanMiLCJzcmMvcmVuZGVyL2NoYXJ0LmpzIiwic3JjL3JlbmRlci9jb21wb3NpdGUuanMiLCJzcmMvcmVuZGVyL2dyYXBoLmpzIiwic3JjL3JlbmRlci9tZW51LWNvbnRleHQuanMiLCJzcmMvcmVuZGVyL21lbnUtbWFpbi5qcyIsInNyYy9yZW5kZXIvbWVudS5qcyIsInNyYy9yZW5kZXIvbWVzc2FnZS5qcyIsInNyYy9yZW5kZXIvbW9kYWwtcmVxdWlyZWQuanMiLCJzcmMvcmVuZGVyL3JlbmRlcmVyLmpzIiwic3JjL3JlbmRlci90b29sdGlwLmpzIiwic3JjL3V0aWwvanNvbi11dGlscy5qcyIsInNyYy91dGlsL2xvZ2dlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFDQTs7QUFFQSxJQUFJLGFBQWEsRUFBakI7O0FBRUE7O0FBRUE7Ozs7Ozs7Ozs7OztJQVdxQixNOztBQUVuQjs7Ozs7OztBQU9BLHdCQUE0RDtBQUFBLDRCQUE5QyxPQUE4QztBQUFBLFFBQTlDLE9BQThDLGdDQUFwQyxLQUFvQztBQUFBLFFBQTdCLFFBQTZCLFFBQTdCLFFBQTZCO0FBQUEsUUFBbkIsZUFBbUIsUUFBbkIsZUFBbUI7O0FBQUE7O0FBQzFELFFBQUksQ0FBQyxlQUFMLEVBQXNCO0FBQ3BCLFlBQU0sSUFBSSxLQUFKLENBQVUsd0dBQVYsQ0FBTjtBQUNEO0FBQ0QsUUFBSSxDQUFDLFFBQUwsRUFBZTtB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QUFDYixVQUFJLEtBQUssT0FBVCxFQUFrQjtBQUNoQixhQUFLLE9BQUwsQ0FBYSxLQUFiLENBQW1CLEtBQUssT0FBTCxDQUFhLE9BQWIsRUFBc0IsT0FBdEIsQ0FBbkI7QUFDRDtBQUNGOztBQUVEOzs7Ozs7O3lCQUlLLE8sRUFBUztBQUNaLFdBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsS0FBSyxPQUFMLENBQWEsTUFBYixFQUFxQixPQUFyQixDQUFsQjtBQUNEOztBQUVEOzs7Ozs7OzswQkFLTSxPLEVBQVMsTSxFQUFPO0FBQ3BCLFdBQUssT0FBTCxDQUFhLEtBQWIsQ0FBbUIsS0FBSyxPQUFMLENBQWEsT0FBYixFQUFzQixPQUF0QixDQUFuQixFQUFtRCxNQUFuRDtBQUNEOztBQUVEOzs7Ozs7Ozt5QkFLSyxPLEVBQVMsSyxFQUFPO0FBQ25CLGNBQVEsU0FBUyxFQUFqQjtBQUNBLFdBQUssT0FBTCxDQUFhLEtBQWIsQ0FBbUIsS0FBSyxPQUFMLENBQWEsTUFBYixFQUFxQixPQUFyQixDQUFuQixFQUFrRCxLQUFsRDtBQUNEOztBQUVEOzs7Ozs7OzRCQUlRLEssRUFBTyxPLEVBQVM7QUFDdEIsbUJBQVcsS0FBWCxZQUF1QixJQUFJLElBQUosR0FBVyxXQUFYLEVBQXZCLFdBQXFELE9BQXJEO0FBQ0Q7Ozs7OztrQkE3RGtCLE0iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IEpzb25VdGlscyBmcm9tICcuL3V0aWwvanNvbi11dGlscyc7XG5pbXBvcnQgQ2FudmFzIGZyb20gJy4vcmVuZGVyL2NhbnZhcyc7XG5pbXBvcnQgTWFpbk1lbnUgZnJvbSAnLi9yZW5kZXIvbWVudS1tYWluJztcbmltcG9ydCBHcmFwaCBmcm9tICcuL3JlbmRlci9ncmFwaCc7XG5pbXBvcnQgQ2hhcnQgZnJvbSAnLi9yZW5kZXIvY2hhcnQnO1xuLy9pbXBvcnQgVHJhY2tlciBmcm9tICcuL3RyYWNrZXIvY2hhbmdlJztcblxubGV0IEFMTF9DQU5WQVMgPSB7fTtcblxuLyogZ2xvYmFsIGQzICovXG5cbi8qKlxuICogRnJhbmN5IGlzIHRoZSBtYWluIGVudHJ5IHBvaW50IGZvciB0aGUgd2hvbGUgZnJhbWV3b3JrLiBCeSBwYXNzaW5nIGFuIGlucHV0IHN0cmluZy9vYmplY3QgdG8gdGhlIHtGcmFuY3kuaGFuZGxlfSBmdW5jdGlvbixcbiAqIEZyYW5jeSB3aWxsIGhhbmRsZSB0aGUgY3JlYXRpb24gb2YgdGhhdCBqc29uIGFzIGxvbmcgaXQgaXMgYSB2YWxpZCBhbmQgdW5kZXJzdGFuZGFibGUganNvbiBvYmplY3QgdG8gRnJhbmN5LlxuICogQGFjY2VzcyBwdWJsaWNcbiAqIFxuICogQHZlcnNpb24gMC41LjBcbiAqIFxuICogQGV4YW1wbGVcbiAqIGxldCBmcmFuY3kgPSBuZXcgRnJhbmN5KHt2ZXJib3NlOiB0cnVlLCBhcHBlbmRUbzogJyNkaXYtaWQnLCBjYWxsYmFja0hhbmRsZXI6IGNvbnNvbGUubG9nfSk7XG4gKiBmcmFuY3kucmVuZGVyKGpzb24pO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGcmFuY3kge1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIEZyYW5jeSB3aXRoIHRoZSBmb2xsb3dpbmcgb3B0aW9uczpcbiAgICogQHR5cGVkZWYge09iamVjdH0gT3B0aW9uc1xuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IHZlcmJvc2UgcHJpbnRzIGV4dHJhIGxvZyBpbmZvcm1hdGlvbiB0byBjb25zb2xlLmxvZywgZGVmYXVsdCBmYWxzZVxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGFwcGVuZFRvIHdoZXJlIHRoZSBnZW5lcmF0ZWQgaHRtbC9zdmcgY29tcG9uZW50cyB3aWxsIGJlIGF0dGFjaGVkIHRvLCBkZWZhdWx0IGJvZHlcbiAgICogQHByb3BlcnR5IHtGdW5jdGlvbn0gY2FsbGJhY2tIYW5kbGVyIHRoaXMgaGFuZGxlciB3aWxsIGJlIHVzZWQgdG8gaW52b2tlIGFjdGlvbnMgZnJvbSB0aGUgbWVudSwgZGVmYXVsdCBjb25zb2xlLmxvZ1xuICAgKi9cbiAgY29uc3RydWN0b3IoeyB2ZXJib3NlID0gZmFsc2UsIGFwcGVuZFRvLCBjYWxsYmFja0hhbmRsZXIgfSkge1xuICAgIGlmICghY2FsbGJhY2tIYW5kbGVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgQ2FsbGJhY2sgSGFuZGxlciBtdXN0IGJlIHByb3ZpZGVkISBUaGlzIHdpbGwgYmUgdXNlZCB0byB0cmlnZ2VyIGV2ZW50cyBmcm9tIHRoZSBncmFwaGljcyBwcm9kdWNlZC4uLicpO1xuICAgIH1cbiAgICBpZiAoIWFwcGVuZFRvKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgYW4gZWxlbWVudCBvciBpZCB0byBhcHBlbmQgdGhlIGdyYXBoaWNzIHRvLi4uIScpO1xuICAgIH1cbiAgICBpZiAoIWQzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0QzIGlzIG5vdCBpbXBvcnRlZCEgRnJhbmN5IHdvblxcJ3Qgd29yayB3aXRob3V0IGl0Li4uIHBsZWFzZSBpbXBvcnQgRDMgdjQrLicpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBPcHRpb25zXG4gICAgICogQHByb3BlcnR5IHtCb29sZWFufSB2ZXJib3NlIHByaW50cyBleHRyYSBsb2cgaW5mb3JtYXRpb24gdG8gY29uc29sZS5sb2csIGRlZmF1bHQgZmFsc2VcbiAgICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGFwcGVuZFRvIHdoZXJlIHRoZSBnZW5lcmF0ZWQgaHRtbC9zdmcgY29tcG9uZW50cyB3aWxsIGJlIGF0dGFjaGVkIHRvLCBkZWZhdWx0IGJvZHlcbiAgICAgKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBjYWxsYmFja0hhbmRsZXIgdGhpcyBoYW5kbGVyIHdpbGwgYmUgdXNlZCB0byBpbnZva2UgYWN0aW9ucyBmcm9tIHRoZSBtZW51LCBkZWZhdWx0IGNvbnNvbGUubG9nXG4gICAgICovXG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgdmVyYm9zZTogdmVyYm9zZSxcbiAgICAgIGFwcGVuZFRvOiBhcHBlbmRUbyxcbiAgICAgIGNhbGxiYWNrSGFuZGxlcjogY2FsbGJhY2tIYW5kbGVyXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWluIGVudHJ5IHBvaW50LiBDYWxsaW5nIHJlbmRlciBwYXNzaW5nIGEganNvbiByZXByZXNlbnRhdGlvbiBzdHJpbmcgd2lsbCBcbiAgICogdHJpZ2dlciB0aGUgZHJhd2luZyBvZiBhIGpzb24gb2JqZWN0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXQgYSBqc29uIHN0cmluZy9vYmplY3QgcmVuZGVyXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHRoZSBlbGVtZW50IGNyZWF0ZWRcbiAgICovXG4gIHJlbmRlcihpbnB1dCkge1xuICAgIGxldCBqc29uID0gSnNvblV0aWxzLnBhcnNlKGlucHV0KTtcbiAgICBpZiAoanNvbikge1xuICAgICAgLy92YXIgdHJhY2tlciA9IG5ldyBUcmFja2VyKGpzb24sIHRoaXMub3B0aW9ucyk7XG4gICAgICAvL3RyYWNrZXIuc3Vic2NyaWJlKGZ1bmN0aW9uKG9iaikgeyBjb25zb2xlLmxvZyhvYmopOyB9KTtcbiAgICAgIC8vcmV0dXJuIG5ldyBEcmF3KHRoaXMub3B0aW9ucykuaGFuZGxlKHRyYWNrZXIub2JqZWN0KTtcbiAgICAgIHZhciBjYW52YXMgPSBuZXcgQ2FudmFzKHRoaXMub3B0aW9ucyk7XG4gICAgICB2YXIgbWVudSA9IG5ldyBNYWluTWVudSh0aGlzLm9wdGlvbnMpO1xuICAgICAgdmFyIGdyYXBoID0gbmV3IEdyYXBoKHRoaXMub3B0aW9ucyk7XG4gICAgICB2YXIgY2hhcnQgPSBuZXcgQ2hhcnQodGhpcy5vcHRpb25zKTtcbiAgICAgIGNhbnZhcy5hZGQobWVudSk7XG4gICAgICBjYW52YXMuYWRkKGdyYXBoKTtcbiAgICAgIGNhbnZhcy5hZGQoY2hhcnQpO1xuICAgICAgdmFyIGVsZW1lbnQgPSBjYW52YXMucmVuZGVyKGpzb24pO1xuICAgICAgQUxMX0NBTlZBU1tqc29uLmNhbnZhcy5pZF0gPSBlbGVtZW50O1xuICAgICAgcmV0dXJuIGVsZW1lbnQubm9kZSgpO1xuICAgIH1cbiAgfVxuXG4gIHVucmVuZGVyKGlkKSB7XG4gICAgZGVsZXRlIEFMTF9DQU5WQVNbaWRdO1xuICB9XG59XG5cbnRyeSB7XG4gIGV4cG9ydHMuRnJhbmN5ID0gd2luZG93LkZyYW5jeSA9IEZyYW5jeTtcbiAgLy8gaGFuZGxlIGV2ZW50cyBvbiByZXNpemVcbiAgd2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gem9vbSB0byBmaXQgYWxsIGNhbnZhcyBvbiByZXNpemVcbiAgICBPYmplY3QudmFsdWVzKEFMTF9DQU5WQVMpLmZvckVhY2goZnVuY3Rpb24oY2FudmFzKSB7XG4gICAgICBjYW52YXMuem9vbVRvRml0KCk7XG4gICAgfSk7XG4gICAgLy8gYWRqdXN0IHRvcCBtZW51cyBvbiByZXNpemVcbiAgICBkMy5zZWxlY3RBbGwoJ2ZvcmVpZ25PYmplY3QuZnJhbmN5LW1haW4tbWVudS1ob2xkZXInKS5hdHRyKCd3aWR0aCcsICcxMDAlJyk7XG4gIH07XG59XG5jYXRjaCAoZSkge1xuICBleHBvcnRzLkZyYW5jeSA9IEZyYW5jeTtcbn1cbiIsImltcG9ydCBMb2dnZXIgZnJvbSAnLi4vdXRpbC9sb2dnZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlIHtcblxuICBjb25zdHJ1Y3Rvcih7IHZlcmJvc2UgPSBmYWxzZSwgYXBwZW5kVG8sIGNhbGxiYWNrSGFuZGxlciB9KSB7XG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICB2ZXJib3NlOiB2ZXJib3NlLFxuICAgICAgYXBwZW5kVG86IGFwcGVuZFRvLFxuICAgICAgY2FsbGJhY2tIYW5kbGVyOiBjYWxsYmFja0hhbmRsZXJcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEB0eXBlIHtMb2dnZXJ9XG4gICAgICovXG4gICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKHRoaXMub3B0aW9ucyk7XG4gIH1cblxuICB1cGRhdGUoeyB2ZXJib3NlID0gZmFsc2UsIGFwcGVuZFRvLCBjYWxsYmFja0hhbmRsZXIgfSkge1xuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIHZlcmJvc2U6IHZlcmJvc2UsXG4gICAgICBhcHBlbmRUbzogYXBwZW5kVG8sXG4gICAgICBjYWxsYmFja0hhbmRsZXI6IGNhbGxiYWNrSGFuZGxlclxuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxufVxuIiwiaW1wb3J0IEJhc2UgZnJvbSAnLi9iYXNlJztcbmltcG9ydCBSZXF1aXJlZEFyZ3NNb2RhbCBmcm9tICcuL21vZGFsLXJlcXVpcmVkJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FsbGJhY2tIYW5kbGVyIGV4dGVuZHMgQmFzZSB7XG5cbiAgY29uc3RydWN0b3IoeyB2ZXJib3NlID0gZmFsc2UsIGFwcGVuZFRvLCBjYWxsYmFja0hhbmRsZXIgfSkge1xuICAgIHN1cGVyKHsgdmVyYm9zZTogdmVyYm9zZSwgYXBwZW5kVG86IGFwcGVuZFRvLCBjYWxsYmFja0hhbmRsZXI6IGNhbGxiYWNrSGFuZGxlciB9KTtcbiAgfVxuXG4gIGV4ZWN1dGUoY29uZmlnKSB7XG4gICAgaWYgKE9iamVjdC5rZXlzKGNvbmZpZy5jYWxsYmFjay5yZXF1aXJlZEFyZ3MpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIG5ldyBSZXF1aXJlZEFyZ3NNb2RhbCh0aGlzLm9wdGlvbnMpLnJlbmRlcihjb25maWcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuY2FsbGJhY2tIYW5kbGVyKGNvbmZpZy5jYWxsYmFjayk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgQ29tcG9zaXRlIGZyb20gJy4vY29tcG9zaXRlJztcbmltcG9ydCBNZXNzYWdlIGZyb20gJy4vbWVzc2FnZSc7XG5cbi8qIGdsb2JhbCBkMyAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXMgZXh0ZW5kcyBDb21wb3NpdGUge1xuXG4gIGNvbnN0cnVjdG9yKHsgdmVyYm9zZSA9IGZhbHNlLCBhcHBlbmRUbywgY2FsbGJhY2tIYW5kbGVyIH0pIHtcbiAgICBzdXBlcih7IHZlcmJvc2U6IHZlcmJvc2UsIGFwcGVuZFRvOiBhcHBlbmRUbywgY2FsbGJhY2tIYW5kbGVyOiBjYWxsYmFja0hhbmRsZXIgfSk7XG4gIH1cblxuICByZW5kZXIoanNvbikge1xuICAgIHZhciBwYXJlbnQgPSBkMy5zZWxlY3QodGhpcy5vcHRpb25zLmFwcGVuZFRvKTtcblxuICAgIHZhciBjYW52YXNJZCA9IGpzb24uY2FudmFzLmlkO1xuICAgIHZhciBjYW52YXMgPSBkMy5zZWxlY3QoYHN2ZyMke2NhbnZhc0lkfWApO1xuICAgIC8vIGNoZWNrIGlmIHRoZSBjYW52YXMgaXMgYWxyZWFkeSBwcmVzZW50XG4gICAgaWYgKCFjYW52YXMubm9kZSgpKSB7XG4gICAgICAvLyBjcmVhdGUgYSBzdmcgZWxlbWVudCBkZXRhY2hlZCBmcm9tIHRoZSBET00hXG4gICAgICB0aGlzLmxvZ2dlci5kZWJ1ZyhgQ3JlYXRpbmcgQ2FudmFzIFske2NhbnZhc0lkfV0uLi5gKTtcbiAgICAgIGNhbnZhcyA9IHBhcmVudC5hcHBlbmQoJ3N2ZycpXG4gICAgICAgIC5hdHRyKCdpZCcsIGNhbnZhc0lkKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnZnJhbmN5IGZyYW5jeS1jYW52YXMnKTtcbiAgICB9XG5cbiAgICAvLyBjYW5ub3QgY29udGludWUgaWYgY2FudmFzIGlzIG5vdCBwcmVzZW50XG4gICAgaWYgKCFjYW52YXMubm9kZSgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE9vcHMsIGNvdWxkIG5vdCBjcmVhdGUgY2FudmFzIHdpdGggaWQgWyR7Y2FudmFzSWR9XS4uLiBDYW5ub3QgcHJvY2VlZC5gKTtcbiAgICB9XG5cbiAgICBjYW52YXMuYXR0cignd2lkdGgnLCBqc29uLmNhbnZhcy53aWR0aCkuYXR0cignaGVpZ2h0JywganNvbi5jYW52YXMuaGVpZ2h0KTtcblxuICAgIHZhciB6b29tID0gZDMuem9vbSgpO1xuXG4gICAgdmFyIGNvbnRlbnQgPSBjYW52YXMuc2VsZWN0KCdnLmZyYW5jeS1jb250ZW50Jyk7XG5cbiAgICBpZiAoIWNvbnRlbnQubm9kZSgpKSB7XG4gICAgICBjb250ZW50ID0gY2FudmFzLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ2ZyYW5jeS1jb250ZW50Jyk7XG4gICAgICB6b29tLm9uKFwiem9vbVwiLCB6b29tZWQpO1xuICAgICAgY2FudmFzLmNhbGwoem9vbSkub24oXCJkYmxjbGljay56b29tXCIsIG51bGwpO1xuICAgIH1cblxuICAgIGNhbnZhcy5vbihcImNsaWNrXCIsIHN0b3BwZWQsIHRydWUpO1xuXG4gICAgY2FudmFzLnpvb21Ub0ZpdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gb25seSBleGVjdXRlIGlmIGVuYWJsZSwgb2YgY291cnNlXG4gICAgICBpZiAoanNvbi5jYW52YXMuem9vbVRvRml0KSB7XG4gICAgICAgIHZhciBib3VuZHMgPSBjb250ZW50Lm5vZGUoKS5nZXRCQm94KCk7XG5cbiAgICAgICAgdmFyIGNsaWVudEJvdW5kcyA9IGNhbnZhcy5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICAgICAgZnVsbFdpZHRoID0gY2xpZW50Qm91bmRzLnJpZ2h0IC0gY2xpZW50Qm91bmRzLmxlZnQsXG4gICAgICAgICAgZnVsbEhlaWdodCA9IGNsaWVudEJvdW5kcy5ib3R0b20gLSBjbGllbnRCb3VuZHMudG9wICsgNDU7IC8vd2VsbCwgdGhlIG1lbnUgaXMgcGFydCBvZiB0aGUgY2FudmFzICstNDVweFxuXG4gICAgICAgIHZhciB3aWR0aCA9IGJvdW5kcy53aWR0aCxcbiAgICAgICAgICBoZWlnaHQgPSBib3VuZHMuaGVpZ2h0O1xuXG4gICAgICAgIGlmICh3aWR0aCA9PSAwIHx8IGhlaWdodCA9PSAwKSByZXR1cm47XG5cbiAgICAgICAgdmFyIG1pZFggPSBib3VuZHMueCArIHdpZHRoIC8gMixcbiAgICAgICAgICBtaWRZID0gYm91bmRzLnkgKyBoZWlnaHQgLyAyO1xuXG4gICAgICAgIHZhciBzY2FsZSA9IDAuNzUgLyBNYXRoLm1heCh3aWR0aCAvIGZ1bGxXaWR0aCwgaGVpZ2h0IC8gZnVsbEhlaWdodCk7XG4gICAgICAgIHZhciB0cmFuc2xhdGVYID0gZnVsbFdpZHRoIC8gMiAtIHNjYWxlICogbWlkWCxcbiAgICAgICAgICB0cmFuc2xhdGVZID0gZnVsbEhlaWdodCAvIDIgLSBzY2FsZSAqIG1pZFk7XG5cbiAgICAgICAgY29udGVudC50cmFuc2l0aW9uKClcbiAgICAgICAgICAuZHVyYXRpb24oMjAwMClcbiAgICAgICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3RyYW5zbGF0ZVh9LCR7dHJhbnNsYXRlWX0pc2NhbGUoJHtzY2FsZX0sJHtzY2FsZX0pYClcbiAgICAgICAgICAub24oJ2VuZCcsICgpID0+IHVwZGF0ZVpvb20odHJhbnNsYXRlWCwgdHJhbnNsYXRlWSwgc2NhbGUpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlWm9vbSh0cmFuc2xhdGVYLCB0cmFuc2xhdGVZLCBzY2FsZSkge1xuICAgICAgY2FudmFzLmNhbGwoem9vbS50cmFuc2Zvcm0sIGQzLnpvb21JZGVudGl0eS50cmFuc2xhdGUodHJhbnNsYXRlWCwgdHJhbnNsYXRlWSkuc2NhbGUoc2NhbGUsIHNjYWxlKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gem9vbWVkKCkge1xuICAgICAgY29udGVudC5hdHRyKFwidHJhbnNmb3JtXCIsIGQzLmV2ZW50LnRyYW5zZm9ybSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RvcHBlZCgpIHtcbiAgICAgIGlmIChkMy5ldmVudC5kZWZhdWx0UHJldmVudGVkKSB7IGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpOyB9XG4gICAgfVxuXG4gICAgdGhpcy5sb2dnZXIuZGVidWcoYENhbnZhcyB1cGRhdGVkIFske2NhbnZhc0lkfV0uLi5gKTtcblxuICAgIC8vIGFkZCBtZXNzYWdlcyB0byBjYW52YXNcbiAgICB0aGlzLm9wdGlvbnMuYXBwZW5kVG8gPSBjYW52YXM7XG4gICAgdmFyIG1lc3NhZ2VzID0gbmV3IE1lc3NhZ2UodGhpcy5vcHRpb25zKTtcbiAgICBtZXNzYWdlcy5yZW5kZXIoanNvbi5jYW52YXMubWVzc2FnZXMpO1xuXG4gICAgdGhpcy5yZW5kZXJDaGlsZHJlbihjYW52YXMsIGpzb24pO1xuXG4gICAgcmV0dXJuIGNhbnZhcztcbiAgfVxuXG4gIHVucmVuZGVyKCkge31cblxufVxuIiwiaW1wb3J0IFJlbmRlcmVyIGZyb20gJy4vcmVuZGVyZXInO1xuaW1wb3J0IFRvb2x0aXAgZnJvbSAnLi90b29sdGlwJztcbmltcG9ydCBDaGFydCBmcm9tICcuL2NoYXJ0JztcblxuLyogZ2xvYmFsIGQzICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhckNoYXJ0IGV4dGVuZHMgUmVuZGVyZXIge1xuXG4gIGNvbnN0cnVjdG9yKHsgdmVyYm9zZSA9IGZhbHNlLCBhcHBlbmRUbywgY2FsbGJhY2tIYW5kbGVyIH0pIHtcbiAgICBzdXBlcih7IHZlcmJvc2U6IHZlcmJvc2UsIGFwcGVuZFRvOiBhcHBlbmRUbywgY2FsbGJhY2tIYW5kbGVyOiBjYWxsYmFja0hhbmRsZXIgfSk7XG4gIH1cblxuICByZW5kZXIoanNvbikge1xuXG4gICAgLy8ganVzdCBpZ25vcmUgcmVuZGVyaW5nIGlmIG5vIGNoYXJ0IGlzIHByZXNlbnRcbiAgICBpZiAoIWpzb24uY2FudmFzLmNoYXJ0KSB7XG4gICAgICB0aGlzLmxvZ2dlci5kZWJ1ZygnTm8gQmFyQ2hhcnQgdG8gcmVuZGVyIGhlcmUuLi4gY29udGludWluZy4uLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciB0b29sdGlwID0gbmV3IFRvb2x0aXAodGhpcy5vcHRpb25zKTtcblxuICAgIHZhciBwYXJlbnQgPSB0aGlzLm9wdGlvbnMuYXBwZW5kVG87XG5cbiAgICB2YXIgYXhpcyA9IGpzb24uY2FudmFzLmNoYXJ0LmF4aXMsXG4gICAgICBkYXRhc2V0cyA9IGpzb24uY2FudmFzLmNoYXJ0LmRhdGEsXG4gICAgICBkYXRhc2V0TmFtZXMgPSBPYmplY3Qua2V5cyhkYXRhc2V0cyk7XG5cbiAgICB2YXIgc3ZnID0gcGFyZW50LnNlbGVjdCgnZy5mcmFuY3ktY29udGVudCcpLFxuICAgICAgbWFyZ2luID0geyB0b3A6IDUwLCByaWdodDogNTAsIGJvdHRvbTogNTAsIGxlZnQ6IDUwIH0sXG4gICAgICB3aWR0aCA9ICtwYXJlbnQuYXR0cignd2lkdGgnKSB8fCBkMy5zZWxlY3QoJ2JvZHknKS5ub2RlKCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgsXG4gICAgICBoZWlnaHQgPSArcGFyZW50LmF0dHIoJ2hlaWdodCcpIHx8IGQzLnNlbGVjdCgnYm9keScpLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XG5cbiAgICAvLyBzZXQgdGhlIGRpbWVuc2lvbnMgYW5kIG1hcmdpbnMgb2YgdGhlIGNoYXJ0XG4gICAgd2lkdGggPSB3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xuICAgIGhlaWdodCA9IGhlaWdodCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tO1xuXG4gICAgLy8gc2V0IHRoZSByYW5nZXNcbiAgICB2YXIgeCA9IGQzLnNjYWxlQmFuZCgpLnJhbmdlKFswLCB3aWR0aF0pLnBhZGRpbmcoMC4xKS5kb21haW4oYXhpcy54LmRvbWFpbik7XG4gICAgdmFyIHkgPSBkMy5zY2FsZUxpbmVhcigpLnJhbmdlKFtoZWlnaHQsIDBdKS5kb21haW4oYXhpcy55LmRvbWFpbik7XG5cbiAgICB2YXIgdG1wID0gW107XG4gICAgZGF0YXNldE5hbWVzLmZvckVhY2goa2V5ID0+IHRtcCA9IHRtcC5jb25jYXQoZGF0YXNldHNba2V5XSkpO1xuXG4gICAgaWYgKCFheGlzLnkuZG9tYWluLmxlbmd0aCkge1xuICAgICAgeS5kb21haW4oWzAsIGQzLm1heCh0bXAsIGQgPT4gZCldKTtcbiAgICB9XG5cbiAgICBpZiAoIWF4aXMueC5kb21haW4ubGVuZ3RoKSB7XG4gICAgICBheGlzLnguZG9tYWluID0gQ2hhcnQuZG9tYWluUmFuZ2UodG1wLmxlbmd0aCAvIGRhdGFzZXROYW1lcy5sZW5ndGgpO1xuICAgICAgeC5kb21haW4oYXhpcy54LmRvbWFpbik7XG4gICAgfVxuXG4gICAgdmFyIGJhcnNHcm91cCA9IHN2Zy5zZWxlY3RBbGwoJ2cuZnJhbmN5LWJhcnMnKTtcblxuICAgIGlmICghYmFyc0dyb3VwLm5vZGUoKSkge1xuICAgICAgYmFyc0dyb3VwID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ2ZyYW5jeS1iYXJzJyk7XG4gICAgfVxuXG4gICAgZGF0YXNldE5hbWVzLmZvckVhY2goZnVuY3Rpb24oa2V5LCBpbmRleCkge1xuICAgICAgdmFyIGJhciA9IGJhcnNHcm91cC5zZWxlY3RBbGwoYC5mcmFuY3ktYmFyJHtpbmRleH1gKS5kYXRhKGRhdGFzZXRzW2tleV0pO1xuXG4gICAgICBiYXIuZXhpdCgpLnJlbW92ZSgpO1xuXG4gICAgICAvLyBhcHBlbmQgdGhlIHJlY3RhbmdsZXMgZm9yIHRoZSBiYXIgY2hhcnRcbiAgICAgIGJhci5lbnRlcigpXG4gICAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoKSA9PiBDaGFydC5jb2xvcnMoaW5kZXggKiA1KSlcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgYGZyYW5jeS1iYXIke2luZGV4fWApXG4gICAgICAgIC5hdHRyKCd4JywgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4geChheGlzLnguZG9tYWluW2ldKSArIGluZGV4ICogKHguYmFuZHdpZHRoKCkgLyBkYXRhc2V0TmFtZXMubGVuZ3RoKTsgfSlcbiAgICAgICAgLmF0dHIoJ3dpZHRoJywgKHguYmFuZHdpZHRoKCkgLyBkYXRhc2V0TmFtZXMubGVuZ3RoKSAtIDEpXG4gICAgICAgIC5hdHRyKCd5JywgZnVuY3Rpb24oZCkgeyByZXR1cm4geShkKTsgfSlcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGhlaWdodCAtIHkoZCk7IH0pXG4gICAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDI1MCkuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMC41KTtcbiAgICAgICAgICB0b29sdGlwLnJlbmRlcih7ICdEYXRhc2V0Jzoga2V5LCAnVmFsdWUnOiBkIH0pO1xuICAgICAgICB9KVxuICAgICAgICAub24oXCJtb3VzZW91dFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBkMy5zZWxlY3QodGhpcykudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oMjUwKS5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAxKTtcbiAgICAgICAgICB0b29sdGlwLnVucmVuZGVyKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICBiYXIubWVyZ2UoYmFyKTtcbiAgICB9KTtcblxuICAgIC8vIGZvcmNlIHJlYnVpbGQgYXhpcyBhZ2FpblxuICAgIHZhciB4QXhpc0dyb3VwID0gc3ZnLnNlbGVjdEFsbCgnZy5mcmFuY3kteC1heGlzJyk7XG5cbiAgICBpZiAoIXhBeGlzR3JvdXAubm9kZSgpKSB7XG4gICAgICB4QXhpc0dyb3VwID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ2ZyYW5jeS14LWF4aXMnKTtcbiAgICB9XG5cbiAgICB4QXhpc0dyb3VwLnNlbGVjdEFsbCgnKicpLnJlbW92ZSgpO1xuXG4gICAgLy8gYWRkIHRoZSB4IEF4aXNcbiAgICB4QXhpc0dyb3VwXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCR7aGVpZ2h0fSlgKVxuICAgICAgLmNhbGwoZDMuYXhpc0JvdHRvbSh4KSlcbiAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2R5JywgNTApXG4gICAgICAuYXR0cignZHgnLCB3aWR0aCAvIDIpXG4gICAgICAuYXR0cignZmlsbCcsICdibGFjaycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnZnJhbmN5LWF4aXMnKVxuICAgICAgLnN0eWxlKCd0ZXh0LWFuY2hvcicsICdlbmQnKVxuICAgICAgLnRleHQoYXhpcy54LnRpdGxlKTtcblxuICAgIC8vIGZvcmNlIHJlYnVpbGQgYXhpcyBhZ2FpblxuICAgIHZhciB5QXhpc0dyb3VwID0gc3ZnLnNlbGVjdEFsbCgnZy5mcmFuY3kteS1heGlzJyk7XG5cbiAgICBpZiAoIXlBeGlzR3JvdXAubm9kZSgpKSB7XG4gICAgICB5QXhpc0dyb3VwID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ2ZyYW5jeS15LWF4aXMnKTtcbiAgICB9XG5cbiAgICB5QXhpc0dyb3VwLnNlbGVjdEFsbCgnKicpLnJlbW92ZSgpO1xuXG4gICAgLy8gYWRkIHRoZSB5IEF4aXNcbiAgICB5QXhpc0dyb3VwXG4gICAgICAuY2FsbChkMy5heGlzTGVmdCh5KSlcbiAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2R4JywgLTUwKVxuICAgICAgLmF0dHIoJ2R5JywgaGVpZ2h0IC8gMilcbiAgICAgIC5hdHRyKCdmaWxsJywgJ2JsYWNrJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdmcmFuY3ktYXhpcycpXG4gICAgICAuc3R5bGUoJ3RleHQtYW5jaG9yJywgJ2VuZCcpXG4gICAgICAudGV4dChheGlzLnkudGl0bGUpO1xuXG4gICAgdmFyIGxlZ2VuZEdyb3VwID0gc3ZnLnNlbGVjdEFsbCgnLmZyYW5jeS1sZWdlbmQnKTtcblxuICAgIGlmICghbGVnZW5kR3JvdXAubm9kZSgpKSB7XG4gICAgICBsZWdlbmRHcm91cCA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdmcmFuY3ktbGVnZW5kJyk7XG4gICAgfVxuXG4gICAgLy8gZm9yY2UgcmVidWlsZCBsZWdlbmQgYWdhaW5cbiAgICBsZWdlbmRHcm91cC5zZWxlY3RBbGwoJyonKS5yZW1vdmUoKTtcblxuICAgIHZhciBsZWdlbmQgPSBsZWdlbmRHcm91cC5zZWxlY3RBbGwoJ2cnKS5kYXRhKGRhdGFzZXROYW1lcy5zbGljZSgpKTtcblxuICAgIGxlZ2VuZC5leGl0KCkucmVtb3ZlKCk7XG5cbiAgICBsZWdlbmQgPSBsZWdlbmQuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQsIGkpID0+IGB0cmFuc2xhdGUoMCwke2kgKiAyMH0pYClcbiAgICAgIC5tZXJnZShsZWdlbmQpO1xuXG4gICAgbGVnZW5kLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0cigneCcsIHdpZHRoICsgMjApXG4gICAgICAuYXR0cignd2lkdGgnLCAxOSlcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCAxOSlcbiAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSA9PiBDaGFydC5jb2xvcnMoaSAqIDUpKTtcblxuICAgIGxlZ2VuZC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ3gnLCB3aWR0aCArIDgwKVxuICAgICAgLmF0dHIoJ3knLCA5KVxuICAgICAgLmF0dHIoJ2R5JywgJy4zNWVtJylcbiAgICAgIC5zdHlsZSgndGV4dC1hbmNob3InLCAnZW5kJylcbiAgICAgIC50ZXh0KGQgPT4gZCk7XG5cbiAgICBwYXJlbnQuem9vbVRvRml0KCk7XG5cbiAgICByZXR1cm4gc3ZnO1xuICB9XG5cbiAgdW5yZW5kZXIoKSB7fVxufVxuIiwiaW1wb3J0IFJlbmRlcmVyIGZyb20gJy4vcmVuZGVyZXInO1xuaW1wb3J0IFRvb2x0aXAgZnJvbSAnLi90b29sdGlwJztcbmltcG9ydCBDaGFydCBmcm9tICcuL2NoYXJ0JztcblxuLyogZ2xvYmFsIGQzICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmVDaGFydCBleHRlbmRzIFJlbmRlcmVyIHtcblxuICBjb25zdHJ1Y3Rvcih7IHZlcmJvc2UgPSBmYWxzZSwgYXBwZW5kVG8sIGNhbGxiYWNrSGFuZGxlciB9KSB7XG4gICAgc3VwZXIoeyB2ZXJib3NlOiB2ZXJib3NlLCBhcHBlbmRUbzogYXBwZW5kVG8sIGNhbGxiYWNrSGFuZGxlcjogY2FsbGJhY2tIYW5kbGVyIH0pO1xuICB9XG5cbiAgcmVuZGVyKGpzb24pIHtcblxuICAgIC8vIGp1c3QgaWdub3JlIHJlbmRlcmluZyBpZiBubyBjaGFydCBpcyBwcmVzZW50XG4gICAgaWYgKCFqc29uLmNhbnZhcy5jaGFydCkge1xuICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ05vIExpbmVDaGFydCB0byByZW5kZXIgaGVyZS4uLiBjb250aW51aW5nLi4uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHRvb2x0aXAgPSBuZXcgVG9vbHRpcCh0aGlzLm9wdGlvbnMpO1xuXG4gICAgdmFyIHBhcmVudCA9IHRoaXMub3B0aW9ucy5hcHBlbmRUbztcblxuICAgIHZhciBheGlzID0ganNvbi5jYW52YXMuY2hhcnQuYXhpcyxcbiAgICAgIGRhdGFzZXRzID0ganNvbi5jYW52YXMuY2hhcnQuZGF0YSxcbiAgICAgIGRhdGFzZXROYW1lcyA9IE9iamVjdC5rZXlzKGRhdGFzZXRzKTtcblxuICAgIHZhciBzdmcgPSBwYXJlbnQuc2VsZWN0KCdnLmZyYW5jeS1jb250ZW50JyksXG4gICAgICBtYXJnaW4gPSB7IHRvcDogNTAsIHJpZ2h0OiA1MCwgYm90dG9tOiA1MCwgbGVmdDogNTAgfSxcbiAgICAgIHdpZHRoID0gK3BhcmVudC5hdHRyKCd3aWR0aCcpIHx8IGQzLnNlbGVjdCgnYm9keScpLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCxcbiAgICAgIGhlaWdodCA9ICtwYXJlbnQuYXR0cignaGVpZ2h0JykgfHwgZDMuc2VsZWN0KCdib2R5Jykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcblxuICAgIC8vIHNldCB0aGUgZGltZW5zaW9ucyBhbmQgbWFyZ2lucyBvZiB0aGUgY2hhcnRcbiAgICB3aWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XG4gICAgaGVpZ2h0ID0gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG5cbiAgICAvLyBzZXQgdGhlIHJhbmdlc1xuICAgIHZhciB4ID0gZDMuc2NhbGVMaW5lYXIoKS5yYW5nZShbMCwgd2lkdGhdKS5kb21haW4oYXhpcy54LmRvbWFpbik7XG4gICAgdmFyIHkgPSBkMy5zY2FsZUxpbmVhcigpLnJhbmdlKFtoZWlnaHQsIDBdKS5kb21haW4oYXhpcy55LmRvbWFpbik7XG5cbiAgICB2YXIgdG1wID0gW107XG4gICAgZGF0YXNldE5hbWVzLmZvckVhY2goa2V5ID0+IHRtcCA9IHRtcC5jb25jYXQoZGF0YXNldHNba2V5XSkpO1xuXG4gICAgaWYgKCFheGlzLnkuZG9tYWluLmxlbmd0aCkge1xuICAgICAgeS5kb21haW4oWzAsIGQzLm1heCh0bXAsIGQgPT4gZCldKTtcbiAgICB9XG5cbiAgICBpZiAoIWF4aXMueC5kb21haW4ubGVuZ3RoKSB7XG4gICAgICB4LmRvbWFpbihbMCwgdG1wLmxlbmd0aCAvIGRhdGFzZXROYW1lcy5sZW5ndGhdKTtcbiAgICB9XG5cbiAgICB2YXIgbGluZXNHcm91cCA9IHN2Zy5zZWxlY3RBbGwoJ2cuZnJhbmN5LWxpbmVzJyk7XG5cbiAgICBpZiAoIWxpbmVzR3JvdXAubm9kZSgpKSB7XG4gICAgICBsaW5lc0dyb3VwID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ2ZyYW5jeS1saW5lcycpO1xuICAgIH1cblxuICAgIGRhdGFzZXROYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgaW5kZXgpIHtcbiAgICAgIHZhciB2YWx1ZUxpbmUgPSBkMy5saW5lKClcbiAgICAgICAgLngoZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4geChpKTsgfSlcbiAgICAgICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geShkKTsgfSk7XG5cbiAgICAgIHZhciBsaW5lID0gbGluZXNHcm91cC5zZWxlY3RBbGwoYC5saW5lJHtpbmRleH1gKS5kYXRhKFtkYXRhc2V0c1trZXldXSk7XG5cbiAgICAgIGxpbmUuZXhpdCgpLnJlbW92ZSgpO1xuXG4gICAgICAvLyBhcHBlbmQgdGhlIHJlY3RhbmdsZXMgZm9yIHRoZSBiYXIgY2hhcnRcbiAgICAgIGxpbmUuZW50ZXIoKVxuICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAoKSA9PiBDaGFydC5jb2xvcnMoaW5kZXggKiA1KSlcbiAgICAgICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCAnNXB4JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgYGZyYW5jeS1saW5lJHtpbmRleH1gKVxuICAgICAgICAuYXR0cignZCcsIHZhbHVlTGluZSlcbiAgICAgICAgLm9uKFwibW91c2VvdmVyXCIsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgICBkMy5zZWxlY3QodGhpcykudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAuZHVyYXRpb24oMjUwKVxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlLW9wYWNpdHlcIiwgMC41KVxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCAnMTBweCcpO1xuICAgICAgICAgIHRvb2x0aXAucmVuZGVyKHsgJ0RhdGFzZXQnOiBrZXksICdWYWx1ZSc6IGQgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5vbihcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbigyNTApXG4gICAgICAgICAgICAuc3R5bGUoXCJzdHJva2Utb3BhY2l0eVwiLCAxKVxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCAnNXB4Jyk7XG4gICAgICAgICAgdG9vbHRpcC51bnJlbmRlcigpO1xuICAgICAgICB9KTtcblxuICAgICAgbGluZS5tZXJnZShsaW5lKTtcbiAgICB9KTtcblxuICAgIC8vIGZvcmNlIHJlYnVpbGQgYXhpcyBhZ2FpblxuICAgIHZhciB4QXhpc0dyb3VwID0gc3ZnLnNlbGVjdEFsbCgnZy5mcmFuY3kteC1heGlzJyk7XG5cbiAgICBpZiAoIXhBeGlzR3JvdXAubm9kZSgpKSB7XG4gICAgICB4QXhpc0dyb3VwID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ2ZyYW5jeS14LWF4aXMnKTtcbiAgICB9XG5cbiAgICB4QXhpc0dyb3VwLnNlbGVjdEFsbCgnKicpLnJlbW92ZSgpO1xuXG4gICAgLy8gYWRkIHRoZSB4IEF4aXNcbiAgICB4QXhpc0dyb3VwXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCR7aGVpZ2h0fSlgKVxuICAgICAgLmNhbGwoZDMuYXhpc0JvdHRvbSh4KSlcbiAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2R5JywgNTApXG4gICAgICAuYXR0cignZHgnLCB3aWR0aCAvIDIpXG4gICAgICAuYXR0cignZmlsbCcsICdibGFjaycpXG4gICAgICAuYXR0cignY2xhc3MnLCAnZnJhbmN5LWF4aXMnKVxuICAgICAgLnN0eWxlKCd0ZXh0LWFuY2hvcicsICdlbmQnKVxuICAgICAgLnRleHQoYXhpcy54LnRpdGxlKTtcblxuICAgIC8vIGZvcmNlIHJlYnVpbGQgYXhpcyBhZ2FpblxuICAgIHZhciB5QXhpc0dyb3VwID0gc3ZnLnNlbGVjdEFsbCgnZy5mcmFuY3kteS1heGlzJyk7XG5cbiAgICBpZiAoIXlBeGlzR3JvdXAubm9kZSgpKSB7XG4gICAgICB5QXhpc0dyb3VwID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ2ZyYW5jeS15LWF4aXMnKTtcbiAgICB9XG5cbiAgICB5QXhpc0dyb3VwLnNlbGVjdEFsbCgnKicpLnJlbW92ZSgpO1xuXG4gICAgLy8gYWRkIHRoZSB5IEF4aXNcbiAgICB5QXhpc0dyb3VwXG4gICAgICAuY2FsbChkMy5heGlzTGVmdCh5KSlcbiAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ2R4JywgLTUwKVxuICAgICAgLmF0dHIoJ2R5JywgaGVpZ2h0IC8gMilcbiAgICAgIC5hdHRyKCdmaWxsJywgJ2JsYWNrJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdmcmFuY3ktYXhpcycpXG4gICAgICAuc3R5bGUoJ3RleHQtYW5jaG9yJywgJ2VuZCcpXG4gICAgICAudGV4dChheGlzLnkudGl0bGUpO1xuXG4gICAgdmFyIGxlZ2VuZEdyb3VwID0gc3ZnLnNlbGVjdEFsbCgnLmZyYW5jeS1sZWdlbmQnKTtcblxuICAgIGlmICghbGVnZW5kR3JvdXAubm9kZSgpKSB7XG4gICAgICBsZWdlbmRHcm91cCA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdmcmFuY3ktbGVnZW5kJyk7XG4gICAgfVxuXG4gICAgLy8gZm9yY2UgcmVidWlsZCBsZWdlbmQgYWdhaW5cbiAgICBsZWdlbmRHcm91cC5zZWxlY3RBbGwoJyonKS5yZW1vdmUoKTtcblxuICAgIHZhciBsZWdlbmQgPSBsZWdlbmRHcm91cC5zZWxlY3RBbGwoJ2cnKS5kYXRhKGRhdGFzZXROYW1lcy5zbGljZSgpKTtcblxuICAgIGxlZ2VuZC5leGl0KCkucmVtb3ZlKCk7XG5cbiAgICBsZWdlbmQgPSBsZWdlbmQuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQsIGkpID0+IGB0cmFuc2xhdGUoMCwke2kgKiAyMH0pYClcbiAgICAgIC5tZXJnZShsZWdlbmQpO1xuXG4gICAgbGVnZW5kLmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0cigneCcsIHdpZHRoICsgMjApXG4gICAgICAuYXR0cignd2lkdGgnLCAxOSlcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCAxOSlcbiAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSA9PiBDaGFydC5jb2xvcnMoaSAqIDUpKTtcblxuICAgIGxlZ2VuZC5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ3gnLCB3aWR0aCArIDgwKVxuICAgICAgLmF0dHIoJ3knLCA5KVxuICAgICAgLmF0dHIoJ2R5JywgJy4zNWVtJylcbiAgICAgIC5zdHlsZSgndGV4dC1hbmNob3InLCAnZW5kJylcbiAgICAgIC50ZXh0KGQgPT4gZCk7XG5cbiAgICBwYXJlbnQuem9vbVRvRml0KCk7XG5cbiAgICByZXR1cm4gc3ZnO1xuICB9XG5cbiAgdW5yZW5kZXIoKSB7fVxufVxuIiwiaW1wb3J0IFJlbmRlcmVyIGZyb20gJy4vcmVuZGVyZXInO1xuaW1wb3J0IFRvb2x0aXAgZnJvbSAnLi90b29sdGlwJztcbmltcG9ydCBDaGFydCBmcm9tICcuL2NoYXJ0JztcblxuLyogZ2xvYmFsIGQzICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjYXR0ZXJDaGFydCBleHRlbmRzIFJlbmRlcmVyIHtcblxuICBjb25zdHJ1Y3Rvcih7IHZlcmJvc2UgPSBmYWxzZSwgYXBwZW5kVG8sIGNhbGxiYWNrSGFuZGxlciB9KSB7XG4gICAgc3VwZXIoeyB2ZXJib3NlOiB2ZXJib3NlLCBhcHBlbmRUbzogYXBwZW5kVG8sIGNhbGxiYWNrSGFuZGxlcjogY2FsbGJhY2tIYW5kbGVyIH0pO1xuICB9XG5cbiAgcmVuZGVyKGpzb24pIHtcblxuICAgIC8vIGp1c3QgaWdub3JlIHJlbmRlcmluZyBpZiBubyBjaGFydCBpcyBwcmVzZW50XG4gICAgaWYgKCFqc29uLmNhbnZhcy5jaGFydCkge1xuICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ05vIFNjYXR0ZXJDaGFydCB0byByZW5kZXIgaGVyZS4uLiBjb250aW51aW5nLi4uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHRvb2x0aXAgPSBuZXcgVG9vbHRpcCh0aGlzLm9wdGlvbnMpO1xuXG4gICAgdmFyIHBhcmVudCA9IHRoaXMub3B0aW9ucy5hcHBlbmRUbztcblxuICAgIHZhciBheGlzID0ganNvbi5jYW52YXMuY2hhcnQuYXhpcyxcbiAgICAgIGRhdGFzZXRzID0ganNvbi5jYW52YXMuY2hhcnQuZGF0YSxcbiAgICAgIGRhdGFzZXROYW1lcyA9IE9iamVjdC5rZXlzKGRhdGFzZXRzKTtcblxuICAgIHZhciBzdmcgPSBwYXJlbnQuc2VsZWN0KCdnLmZyYW5jeS1jb250ZW50JyksXG4gICAgICBtYXJnaW4gPSB7IHRvcDogNTAsIHJpZ2h0OiA1MCwgYm90dG9tOiA1MCwgbGVmdDogNTAgfSxcbiAgICAgIHdpZHRoID0gK3BhcmVudC5hdHRyKCd3aWR0aCcpIHx8IGQzLnNlbGVjdCgnYm9keScpLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCxcbiAgICAgIGhlaWdodCA9ICtwYXJlbnQuYXR0cignaGVpZ2h0JykgfHwgZDMuc2VsZWN0KCdib2R5Jykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcblxuICAgIC8vIHNldCB0aGUgZGltZW5zaW9ucyBhbmQgbWFyZ2lucyBvZiB0aGUgY2hhcnRcbiAgICB3aWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XG4gICAgaGVpZ2h0ID0gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG5cbiAgICAvLyBzZXQgdGhlIHJhbmdlc1xuICAgIHZhciB4ID0gZDMuc2NhbGVMaW5lYXIoKS5yYW5nZShbMCwgd2lkdGhdKS5kb21haW4oYXhpcy54LmRvbWFpbik7XG4gICAgdmFyIHkgPSBkMy5zY2FsZUxpbmVhcigpLnJhbmdlKFtoZWlnaHQsIDBdKS5kb21haW4oYXhpcy55LmRvbWFpbik7XG5cbiAgICB2YXIgdG1wID0gW107XG4gICAgZGF0YXNldE5hbWVzLmZvckVhY2goa2V5ID0+IHRtcCA9IHRtcC5jb25jYXQoZGF0YXNldHNba2V5XSkpO1xuXG4gICAgaWYgKCFheGlzLnkuZG9tYWluLmxlbmd0aCkge1xuICAgICAgeS5kb21haW4oWzAsIGQzLm1heCh0bXAsIGQgPT4gZCldKTtcbiAgICB9XG5cbiAgICBpZiAoIWF4aXMueC5kb21haW4ubGVuZ3RoKSB7XG4gICAgICB4LmRvbWFpbihbMCwgdG1wLmxlbmd0aCAvIGRhdGFzZXROYW1lcy5sZW5ndGhdKTtcbiAgICB9XG5cbiAgICB2YXIgc2NhdHRlckdyb3VwID0gc3ZnLnNlbGVjdEFsbCgnZy5mcmFuY3ktc2NhdHRlcnMnKTtcblxuICAgIGlmICghc2NhdHRlckdyb3VwLm5vZGUoKSkge1xuICAgICAgc2NhdHRlckdyb3VwID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ2ZyYW5jeS1zY2F0dGVycycpO1xuICAgIH1cblxuICAgIGRhdGFzZXROYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKGtleSwgaW5kZXgpIHtcbiAgICAgIHZhciBzY2F0dGVyID0gc2NhdHRlckdyb3VwLnNlbGVjdEFsbChgLnNjYXR0ZXIke2luZGV4fWApLmRhdGEoZGF0YXNldHNba2V5XSk7XG5cbiAgICAgIHNjYXR0ZXIuZXhpdCgpLnJlbW92ZSgpO1xuXG4gICAgICAvLyBhcHBlbmQgdGhlIHJlY3RhbmdsZXMgZm9yIHRoZSBiYXIgY2hhcnRcbiAgICAgIHNjYXR0ZXJcbiAgICAgICAgLmVudGVyKClcbiAgICAgICAgLmFwcGVuZCgnY2lyY2xlJylcbiAgICAgICAgLnN0eWxlKCdmaWxsJywgKCkgPT4gQ2hhcnQuY29sb3JzKGluZGV4ICogNSkpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsIGBmcmFuY3ktc2NhdHRlciR7aW5kZXh9YClcbiAgICAgICAgLmF0dHIoXCJyXCIsIDUpXG4gICAgICAgIC5hdHRyKFwiY3hcIiwgZnVuY3Rpb24oZCwgaSkgeyByZXR1cm4geChpKTsgfSlcbiAgICAgICAgLmF0dHIoXCJjeVwiLCBmdW5jdGlvbihkKSB7IHJldHVybiB5KGQpOyB9KVxuICAgICAgICAub24oXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oZCkge1xuICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbigyNTApXG4gICAgICAgICAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMC41KVxuICAgICAgICAgICAgLmF0dHIoJ3InLCAxMCk7XG4gICAgICAgICAgdG9vbHRpcC5yZW5kZXIoeyAnRGF0YXNldCc6IGtleSwgJ1ZhbHVlJzogZCB9KTtcbiAgICAgICAgfSlcbiAgICAgICAgLm9uKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgLmR1cmF0aW9uKDI1MClcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAxKVxuICAgICAgICAgICAgLmF0dHIoJ3InLCA1KTtcbiAgICAgICAgICB0b29sdGlwLnVucmVuZGVyKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICBzY2F0dGVyLm1lcmdlKHNjYXR0ZXIpO1xuICAgIH0pO1xuXG4gICAgLy8gZm9yY2UgcmVidWlsZCBheGlzIGFnYWluXG4gICAgdmFyIHhBeGlzR3JvdXAgPSBzdmcuc2VsZWN0QWxsKCdnLmZyYW5jeS14LWF4aXMnKTtcblxuICAgIGlmICgheEF4aXNHcm91cC5ub2RlKCkpIHtcbiAgICAgIHhBeGlzR3JvdXAgPSBzdmcuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnZnJhbmN5LXgtYXhpcycpO1xuICAgIH1cblxuICAgIHhBeGlzR3JvdXAuc2VsZWN0QWxsKCcqJykucmVtb3ZlKCk7XG5cbiAgICAvLyBhZGQgdGhlIHggQXhpc1xuICAgIHhBeGlzR3JvdXBcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsJHtoZWlnaHR9KWApXG4gICAgICAuY2FsbChkMy5heGlzQm90dG9tKHgpKVxuICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cignZHknLCA1MClcbiAgICAgIC5hdHRyKCdkeCcsIHdpZHRoIC8gMilcbiAgICAgIC5hdHRyKCdmaWxsJywgJ2JsYWNrJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdmcmFuY3ktYXhpcycpXG4gICAgICAuc3R5bGUoJ3RleHQtYW5jaG9yJywgJ2VuZCcpXG4gICAgICAudGV4dChheGlzLngudGl0bGUpO1xuXG4gICAgLy8gZm9yY2UgcmVidWlsZCBheGlzIGFnYWluXG4gICAgdmFyIHlBeGlzR3JvdXAgPSBzdmcuc2VsZWN0QWxsKCdnLmZyYW5jeS15LWF4aXMnKTtcblxuICAgIGlmICgheUF4aXNHcm91cC5ub2RlKCkpIHtcbiAgICAgIHlBeGlzR3JvdXAgPSBzdmcuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnZnJhbmN5LXktYXhpcycpO1xuICAgIH1cblxuICAgIHlBeGlzR3JvdXAuc2VsZWN0QWxsKCcqJykucmVtb3ZlKCk7XG5cbiAgICAvLyBhZGQgdGhlIHkgQXhpc1xuICAgIHlBeGlzR3JvdXBcbiAgICAgIC5jYWxsKGQzLmF4aXNMZWZ0KHkpKVxuICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cignZHgnLCAtNTApXG4gICAgICAuYXR0cignZHknLCBoZWlnaHQgLyAyKVxuICAgICAgLmF0dHIoJ2ZpbGwnLCAnYmxhY2snKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ZyYW5jeS1heGlzJylcbiAgICAgIC5zdHlsZSgndGV4dC1hbmNob3InLCAnZW5kJylcbiAgICAgIC50ZXh0KGF4aXMueS50aXRsZSk7XG5cbiAgICB2YXIgbGVnZW5kR3JvdXAgPSBzdmcuc2VsZWN0QWxsKCcuZnJhbmN5LWxlZ2VuZCcpO1xuXG4gICAgaWYgKCFsZWdlbmRHcm91cC5ub2RlKCkpIHtcbiAgICAgIGxlZ2VuZEdyb3VwID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ2ZyYW5jeS1sZWdlbmQnKTtcbiAgICB9XG5cbiAgICAvLyBmb3JjZSByZWJ1aWxkIGxlZ2VuZCBhZ2FpblxuICAgIGxlZ2VuZEdyb3VwLnNlbGVjdEFsbCgnKicpLnJlbW92ZSgpO1xuXG4gICAgdmFyIGxlZ2VuZCA9IGxlZ2VuZEdyb3VwLnNlbGVjdEFsbCgnZycpLmRhdGEoZGF0YXNldE5hbWVzLnNsaWNlKCkpO1xuXG4gICAgbGVnZW5kLmV4aXQoKS5yZW1vdmUoKTtcblxuICAgIGxlZ2VuZCA9IGxlZ2VuZC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT4gYHRyYW5zbGF0ZSgwLCR7aSAqIDIwfSlgKVxuICAgICAgLm1lcmdlKGxlZ2VuZCk7XG5cbiAgICBsZWdlbmQuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyKCd4Jywgd2lkdGggKyAyMClcbiAgICAgIC5hdHRyKCd3aWR0aCcsIDE5KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIDE5KVxuICAgICAgLnN0eWxlKCdmaWxsJywgKGQsIGkpID0+IENoYXJ0LmNvbG9ycyhpICogNSkpO1xuXG4gICAgbGVnZW5kLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cigneCcsIHdpZHRoICsgODApXG4gICAgICAuYXR0cigneScsIDkpXG4gICAgICAuYXR0cignZHknLCAnLjM1ZW0nKVxuICAgICAgLnN0eWxlKCd0ZXh0LWFuY2hvcicsICdlbmQnKVxuICAgICAgLnRleHQoZCA9PiBkKTtcblxuICAgIHBhcmVudC56b29tVG9GaXQoKTtcblxuICAgIHJldHVybiBzdmc7XG4gIH1cblxuICB1bnJlbmRlcigpIHt9XG59XG4iLCJpbXBvcnQgUmVuZGVyZXIgZnJvbSAnLi9yZW5kZXJlcic7XG5pbXBvcnQgQmFyQ2hhcnQgZnJvbSAnLi9jaGFydC1iYXInO1xuaW1wb3J0IExpbmVDaGFydCBmcm9tICcuL2NoYXJ0LWxpbmUnO1xuaW1wb3J0IFNjYXR0ZXJDaGFydCBmcm9tICcuL2NoYXJ0LXNjYXR0ZXInO1xuXG4vKiBnbG9iYWwgZDMgKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhcnQgZXh0ZW5kcyBSZW5kZXJlciB7XG5cbiAgY29uc3RydWN0b3IoeyB2ZXJib3NlID0gZmFsc2UsIGFwcGVuZFRvLCBjYWxsYmFja0hhbmRsZXIgfSkge1xuICAgIHN1cGVyKHsgdmVyYm9zZTogdmVyYm9zZSwgYXBwZW5kVG86IGFwcGVuZFRvLCBjYWxsYmFja0hhbmRsZXI6IGNhbGxiYWNrSGFuZGxlciB9KTtcbiAgfVxuXG4gIHJlbmRlcihqc29uKSB7XG5cbiAgICBpZiAoIWpzb24uY2FudmFzLmNoYXJ0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGVsZW1lbnQgPSB1bmRlZmluZWQ7XG4gICAgc3dpdGNoIChqc29uLmNhbnZhcy5jaGFydC50eXBlKSB7XG4gICAgICBjYXNlIFwiYmFyXCI6XG4gICAgICAgIGVsZW1lbnQgPSBuZXcgQmFyQ2hhcnQodGhpcy5vcHRpb25zKS5yZW5kZXIoanNvbik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImxpbmVcIjpcbiAgICAgICAgZWxlbWVudCA9IG5ldyBMaW5lQ2hhcnQodGhpcy5vcHRpb25zKS5yZW5kZXIoanNvbik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInNjYXR0ZXJcIjpcbiAgICAgICAgZWxlbWVudCA9IG5ldyBTY2F0dGVyQ2hhcnQodGhpcy5vcHRpb25zKS5yZW5kZXIoanNvbik7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgc3RhdGljIGdldCBjb2xvcnMoKSB7XG4gICAgcmV0dXJuIGQzLnNjYWxlU2VxdWVudGlhbCgpLmRvbWFpbihbMCwgMTAwXSkuaW50ZXJwb2xhdG9yKGQzLmludGVycG9sYXRlUmFpbmJvdyk7XG4gIH1cblxuICBzdGF0aWMgZG9tYWluUmFuZ2UobWF4KSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20obmV3IEFycmF5KG1heCksIChfLCBpKSA9PiBpKS5tYXAoeCA9PiB4KTtcbiAgfVxuXG4gIHVucmVuZGVyKCkge31cblxufVxuIiwiaW1wb3J0IFJlbmRlcmVyIGZyb20gJy4vcmVuZGVyZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21wb3NpdGUgZXh0ZW5kcyBSZW5kZXJlciB7XG5cbiAgY29uc3RydWN0b3IoeyB2ZXJib3NlID0gZmFsc2UsIGFwcGVuZFRvLCBjYWxsYmFja0hhbmRsZXIgfSkge1xuICAgIHN1cGVyKHsgdmVyYm9zZTogdmVyYm9zZSwgYXBwZW5kVG86IGFwcGVuZFRvLCBjYWxsYmFja0hhbmRsZXI6IGNhbGxiYWNrSGFuZGxlciB9KTtcbiAgICBpZiAobmV3LnRhcmdldCA9PT0gQ29tcG9zaXRlKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29uc3RydWN0IFtDb21wb3NpdGVdIGluc3RhbmNlcyBkaXJlY3RseSEnKTtcbiAgICB9XG4gICAgdGhpcy5yZW5kZXJlcnMgPSBbXTtcbiAgfVxuXG4gIGFkZChyZW5kZXJlcikge1xuICAgIHRoaXMucmVuZGVyZXJzLnB1c2gocmVuZGVyZXIpO1xuICB9XG5cbiAgcmVuZGVyQ2hpbGRyZW4ocGFyZW50LCBqc29uKSB7XG4gICAgLy8gdXBkYXRlIGNoaWxkcmVuIHJlbmRlcmluZyB3aXRoIGEgbmV3IHBhcmVudCBpZiByZXF1aXJlZCFcbiAgICB2YXIgY2hpbGRyZW5PcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIGNoaWxkcmVuT3B0aW9ucy5hcHBlbmRUbyA9IHBhcmVudDtcbiAgICB9XG4gICAgLy8gcmVuZGVyIG90aGVyIGNvbXBvbmVudHNcbiAgICBmb3IgKHZhciByZW5kZXJlciBvZiB0aGlzLnJlbmRlcmVycykge1xuICAgICAgcmVuZGVyZXIudXBkYXRlKGNoaWxkcmVuT3B0aW9ucykucmVuZGVyKGpzb24pO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IFJlbmRlcmVyIGZyb20gJy4vcmVuZGVyZXInO1xuaW1wb3J0IENvbnRleHRNZW51IGZyb20gJy4vbWVudS1jb250ZXh0JztcbmltcG9ydCBUb29sdGlwIGZyb20gJy4vdG9vbHRpcCc7XG5pbXBvcnQgQ2FsbGJhY2sgZnJvbSAnLi9jYWxsYmFjayc7XG5cbi8qIGdsb2JhbCBkMyAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFwaCBleHRlbmRzIFJlbmRlcmVyIHtcblxuXG4gIHN0YXRpYyBnZXQgY29sb3JzKCkge1xuICAgIHJldHVybiBkMy5zY2FsZVNlcXVlbnRpYWwoKS5kb21haW4oWzAsIDEwMF0pLmludGVycG9sYXRvcihkMy5pbnRlcnBvbGF0ZVJhaW5ib3cpO1xuICB9XG5cbiAgc3RhdGljIGdldFN5bWJvbCh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT09ICdjaXJjbGUnKSB7XG4gICAgICByZXR1cm4gZDMuc3ltYm9sQ2lyY2xlO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlID09PSAnY3Jvc3MnKSB7XG4gICAgICByZXR1cm4gZDMuc3ltYm9sQ3Jvc3M7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUgPT09ICdkaWFtb25kJykge1xuICAgICAgcmV0dXJuIGQzLnN5bWJvbERpYW1vbmQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUgPT09ICdzcXVhcmUnKSB7XG4gICAgICByZXR1cm4gZDMuc3ltYm9sU3F1YXJlO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlID09PSAndHJpYW5nbGUnKSB7XG4gICAgICByZXR1cm4gZDMuc3ltYm9sVHJpYW5nbGU7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUgPT09ICdzdGFyJykge1xuICAgICAgcmV0dXJuIGQzLnN5bWJvbFN0YXI7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUgPT09ICd3eWUnKSB7XG4gICAgICByZXR1cm4gZDMuc3ltYm9sV3llO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHJldHVybiBkMy5zeW1ib2xDaXJjbGU7XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IoeyB2ZXJib3NlID0gZmFsc2UsIGFwcGVuZFRvLCBjYWxsYmFja0hhbmRsZXIgfSkge1xuICAgIHN1cGVyKHsgdmVyYm9zZTogdmVyYm9zZSwgYXBwZW5kVG86IGFwcGVuZFRvLCBjYWxsYmFja0hhbmRsZXI6IGNhbGxiYWNrSGFuZGxlciB9KTtcbiAgfVxuXG4gIHJlbmRlcihqc29uKSB7XG5cbiAgICAvLyBqdXN0IGlnbm9yZSByZW5kZXJpbmcgaWYgbm8gZ3JhcGggaXMgcHJlc2VudFxuICAgIGlmICghanNvbi5jYW52YXMuZ3JhcGgpIHtcbiAgICAgIHRoaXMubG9nZ2VyLmRlYnVnKCdObyBHcmFwaCB0byByZW5kZXIgaGVyZS4uLiBjb250aW51aW5nLi4uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGRhdGFDaGFuZ2VkID0gZmFsc2U7XG4gICAgdmFyIHRvb2x0aXAgPSBuZXcgVG9vbHRpcCh0aGlzLm9wdGlvbnMpO1xuICAgIHZhciBjb250ZXh0TWVudSA9IG5ldyBDb250ZXh0TWVudSh0aGlzLm9wdGlvbnMpO1xuICAgIHZhciBjYWxsYmFjayA9IG5ldyBDYWxsYmFjayh0aGlzLm9wdGlvbnMpO1xuXG4gICAgdmFyIHBhcmVudCA9IHRoaXMub3B0aW9ucy5hcHBlbmRUbztcblxuICAgIHZhciBjYW52YXNOb2RlcyA9IGpzb24uY2FudmFzLmdyYXBoLm5vZGVzID8gT2JqZWN0LnZhbHVlcyhqc29uLmNhbnZhcy5ncmFwaC5ub2RlcykgOiBbXSxcbiAgICAgIGNhbnZhc0xpbmtzID0ganNvbi5jYW52YXMuZ3JhcGgubGlua3MgPyBPYmplY3QudmFsdWVzKGpzb24uY2FudmFzLmdyYXBoLmxpbmtzKSA6IFtdO1xuXG4gICAgdmFyIHN2ZyA9IHBhcmVudC5zZWxlY3QoJ2cuZnJhbmN5LWNvbnRlbnQnKSxcbiAgICAgIHdpZHRoID0gK3BhcmVudC5hdHRyKCd3aWR0aCcpIHx8IGQzLnNlbGVjdCgnYm9keScpLm5vZGUoKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCxcbiAgICAgIGhlaWdodCA9ICtwYXJlbnQuYXR0cignaGVpZ2h0JykgfHwgZDMuc2VsZWN0KCdib2R5Jykubm9kZSgpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcblxuICAgIHZhciBsaW5rR3JvdXAgPSBzdmcuc2VsZWN0QWxsKCdnLmZyYW5jeS1saW5rcycpO1xuXG4gICAgaWYgKCFsaW5rR3JvdXAubm9kZSgpKSB7XG4gICAgICBsaW5rR3JvdXAgPSBzdmcuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnZnJhbmN5LWxpbmtzJyk7XG4gICAgfVxuXG4gICAgdmFyIGxpbmsgPSBsaW5rR3JvdXAuc2VsZWN0QWxsKCdsaW5lLmZyYW5jeS1saW5rJykuZGF0YShjYW52YXNMaW5rcyk7XG5cbiAgICBpZiAobGluay5lbnRlcigpLmRhdGEoKS5sZW5ndGggPiAwIHx8IGxpbmsuZW50ZXIoKS5kYXRhKCkubGVuZ3RoID4gMCkge1xuICAgICAgZGF0YUNoYW5nZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGxpbmsuZXhpdCgpLnJlbW92ZSgpO1xuXG4gICAgbGluayA9IGxpbmsuZW50ZXIoKS5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ZyYW5jeS1saW5rJylcbiAgICAgIC5hdHRyKCdpZCcsIGQgPT4gYCR7ZC5zb3VyY2V9LCR7ZC50YXJnZXR9YClcbiAgICAgIC5hdHRyKCd4MScsIGQgPT4gZC5zb3VyY2UueClcbiAgICAgIC5hdHRyKCd5MScsIGQgPT4gZC5zb3VyY2UueSlcbiAgICAgIC5hdHRyKCd4MicsIGQgPT4gZC50YXJnZXQueClcbiAgICAgIC5hdHRyKCd5MicsIGQgPT4gZC50YXJnZXQueSlcbiAgICAgIC5tZXJnZShsaW5rKTtcblxuICAgIGlmIChqc29uLmNhbnZhcy5ncmFwaC50eXBlID09PSAnZGlyZWN0ZWQnKSB7XG4gICAgICAvLyB0aGlzIG1lYW5zIHdlIG5lZWQgYXJyb3dzLCBzbyB3ZSBhcHBlbmQgdGhlIG1hcmtlclxuICAgICAgcGFyZW50LmFwcGVuZCgnZGVmcycpLnNlbGVjdEFsbCgnbWFya2VyJylcbiAgICAgICAgLmRhdGEoWydhcnJvdyddKVxuICAgICAgICAuZW50ZXIoKS5hcHBlbmQoJ21hcmtlcicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdmcmFuY3ktYXJyb3dzJylcbiAgICAgICAgLmF0dHIoJ2lkJywgZCA9PiBkKVxuICAgICAgICAuYXR0cigndmlld0JveCcsICcwIC01IDEwIDEwJylcbiAgICAgICAgLmF0dHIoJ3JlZlgnLCAyNSlcbiAgICAgICAgLmF0dHIoJ3JlZlknLCAwKVxuICAgICAgICAuYXR0cignbWFya2VyV2lkdGgnLCAxMClcbiAgICAgICAgLmF0dHIoJ21hcmtlckhlaWdodCcsIDEwKVxuICAgICAgICAuYXR0cignb3JpZW50JywgJ2F1dG8nKVxuICAgICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgICAgLmF0dHIoJ2QnLCAnTTAsLTVMMTAsMEwwLDUgTDEwLDAgTDAsIC01Jyk7XG4gICAgICAvLyB1cGRhdGUgdGhlIHN0eWxlIG9mIHRoZSBsaW5rXG4gICAgICBsaW5rLnN0eWxlKCdtYXJrZXItZW5kJywgJ3VybCgjYXJyb3cpJyk7XG4gICAgfVxuXG4gICAgdmFyIG5vZGVHcm91cCA9IHN2Zy5zZWxlY3RBbGwoJ2cuZnJhbmN5LW5vZGVzJyk7XG5cbiAgICBpZiAoIW5vZGVHcm91cC5ub2RlKCkpIHtcbiAgICAgIG5vZGVHcm91cCA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdmcmFuY3ktbm9kZXMnKTtcbiAgICB9XG5cbiAgICB2YXIgbm9kZSA9IG5vZGVHcm91cC5zZWxlY3RBbGwoJ3BhdGguZnJhbmN5LW5vZGUnKS5kYXRhKGNhbnZhc05vZGVzKTtcblxuICAgIGlmIChub2RlLmVudGVyKCkuZGF0YSgpLmxlbmd0aCA+IDAgfHwgbm9kZS5lbnRlcigpLmRhdGEoKS5sZW5ndGggPiAwKSB7XG4gICAgICBkYXRhQ2hhbmdlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgbm9kZS5leGl0KCkucmVtb3ZlKCk7XG5cbiAgICBub2RlID0gbm9kZS5lbnRlcigpLmFwcGVuZCgncGF0aCcpLm1lcmdlKG5vZGUpXG4gICAgICAuYXR0cignZCcsIGQzLnN5bWJvbCgpLnR5cGUoZCA9PiBHcmFwaC5nZXRTeW1ib2woZC50eXBlKSkuc2l6ZShkID0+IGQuc2l6ZSAqIDEwMCkpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgZCA9PiBgdHJhbnNsYXRlKCR7ZC54fSwke2QueX0pYClcbiAgICAgIC5zdHlsZSgnZmlsbCcsIGQgPT4gR3JhcGguY29sb3JzKGQubGF5ZXIgKiA1KSlcbiAgICAgIC5hdHRyKCdjbGFzcycsIGQgPT4gJ2ZyYW5jeS1ub2RlJyArIChkLmhpZ2hsaWdodCA/ICcgZnJhbmN5LWhpZ2hsaWdodCcgOiAnJykgKyAoT2JqZWN0LnZhbHVlcyhkLm1lbnVzKS5sZW5ndGggPyAnIGZyYW5jeS1jb250ZXh0JyA6ICcnKSlcbiAgICAgIC5hdHRyKCdpZCcsIGQgPT4gZC5pZCk7XG5cbiAgICBub2RlLmFwcGVuZCgndGl0bGUnKS50ZXh0KGQgPT4ge1xuICAgICAgaWYgKGQubWVzc2FnZXMgJiYgT2JqZWN0LnZhbHVlcyhkLm1lc3NhZ2VzKS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGQubWVzc2FnZXMpLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICByZXR1cm4gYCR7ZC5tZXNzYWdlc1trZXldLnRpdGxlfTogJHtkLm1lc3NhZ2VzW2tleV0udGV4dH1gO1xuICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChqc29uLmNhbnZhcy5ncmFwaC5kcmFnKSB7XG4gICAgICBub2RlLmNhbGwoZDMuZHJhZygpXG4gICAgICAgIC5vbignc3RhcnQnLCBkcmFnc3RhcnRlZClcbiAgICAgICAgLm9uKCdkcmFnJywgZHJhZ2dlZClcbiAgICAgICAgLm9uKCdlbmQnLCBkcmFnZW5kZWQpKTtcbiAgICB9XG5cbiAgICBub2RlLm9uKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgLy8gZGVmYXVsdCwgYnVpbGQgY29udGV4dCBtZW51XG4gICAgICAgIGNvbnRleHRNZW51LnJlbmRlcihkKTtcbiAgICAgICAgLy8gYW55IGNhbGxiYWNrcyB3aWxsIGJlIGhhbmRsZWQgaGVyZVxuICAgICAgICBleGVjdXRlQ2FsbGJhY2suY2FsbCh0aGlzLCBkLCAnY29udGV4dG1lbnUnKTtcbiAgICAgIH0pXG4gICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAvLyBkZWZhdWx0LCBoaWdobGlnaHQgY29ubmVjdGVkIG5vZGVzXG4gICAgICAgIGNvbm5lY3RlZE5vZGVzLmNhbGwodGhpcyk7XG4gICAgICAgIC8vIGFueSBjYWxsYmFja3Mgd2lsbCBiZSBoYW5kbGVkIGhlcmVcbiAgICAgICAgZXhlY3V0ZUNhbGxiYWNrLmNhbGwodGhpcywgZCwgJ2NsaWNrJyk7XG4gICAgICB9KVxuICAgICAgLm9uKCdkYmxjbGljaycsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgLy8gYW55IGNhbGxiYWNrcyB3aWxsIGJlIGhhbmRsZWQgaGVyZVxuICAgICAgICBleGVjdXRlQ2FsbGJhY2suY2FsbCh0aGlzLCBkLCAnZGJsY2xpY2snKTtcbiAgICAgIH0pXG4gICAgICAub24oXCJtb3VzZW92ZXJcIiwgKCkgPT4ge1xuICAgICAgICAvLyBkZWZhdWx0LCBzaG93IHRvb2x0aXBcbiAgICAgICAgLy90b29sdGlwLnJlbmRlcihkLm1lc3NhZ2VzKTtcbiAgICAgIH0pXG4gICAgICAub24oXCJtb3VzZW91dFwiLCAoKSA9PiB7XG4gICAgICAgIC8vIGRlZmF1bHQsIGhpZGUgdG9vbHRpcFxuICAgICAgICAvL3Rvb2x0aXAudW5yZW5kZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgdmFyIGxhYmVsR3JvdXAgPSBzdmcuc2VsZWN0QWxsKCcuZnJhbmN5LWxhYmVscycpO1xuXG4gICAgaWYgKCFsYWJlbEdyb3VwLm5vZGUoKSkge1xuICAgICAgbGFiZWxHcm91cCA9IHN2Zy5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdmcmFuY3ktbGFiZWxzJyk7XG4gICAgfVxuXG4gICAgdmFyIGxhYmVsID0gbGFiZWxHcm91cC5zZWxlY3RBbGwoJ3RleHQnKS5kYXRhKGNhbnZhc05vZGVzKTtcblxuICAgIGxhYmVsLmV4aXQoKS5yZW1vdmUoKTtcblxuICAgIGxhYmVsID0gbGFiZWwuZW50ZXIoKS5hcHBlbmQoJ3RleHQnKS5tZXJnZShsYWJlbClcbiAgICAgIC5hdHRyKCdjbGFzcycsICdmcmFuY3ktbGFiZWwnKVxuICAgICAgLnRleHQoZCA9PiBkLnRpdGxlKVxuICAgICAgLmF0dHIoJ3gnLCBkID0+IGQueCAtIGQudGl0bGUubGVuZ3RoIC0gTWF0aC5zcXJ0KGQuc2l6ZSAqIGQudGl0bGUubGVuZ3RoICogMikpXG4gICAgICAuYXR0cigneScsIGQgPT4gZC55IC0gTWF0aC5zcXJ0KGQuc2l6ZSAqIDIpKTtcblxuICAgIGxhYmVsXG4gICAgICAub24oJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZCkge1xuICAgICAgICAvLyBkZWZhdWx0LCBidWlsZCBjb250ZXh0IG1lbnVcbiAgICAgICAgY29udGV4dE1lbnUucmVuZGVyKGQpO1xuICAgICAgICAvLyBhbnkgY2FsbGJhY2tzIHdpbGwgYmUgaGFuZGxlZCBoZXJlXG4gICAgICAgIGV4ZWN1dGVDYWxsYmFjay5jYWxsKHRoaXMsIGQsICdjb250ZXh0bWVudScpO1xuICAgICAgfSlcbiAgICAgIC5vbignY2xpY2snLCBmdW5jdGlvbihkKSB7XG4gICAgICAgIC8vIGRlZmF1bHQsIGhpZ2hsaWdodCBjb25uZWN0ZWQgbm9kZXNcbiAgICAgICAgY29ubmVjdGVkTm9kZXMuY2FsbCh0aGlzKTtcbiAgICAgICAgLy8gYW55IGNhbGxiYWNrcyB3aWxsIGJlIGhhbmRsZWQgaGVyZVxuICAgICAgICBleGVjdXRlQ2FsbGJhY2suY2FsbCh0aGlzLCBkLCAnY2xpY2snKTtcbiAgICAgIH0pXG4gICAgICAub24oJ2RibGNsaWNrJywgZnVuY3Rpb24oZCkge1xuICAgICAgICAvLyBhbnkgY2FsbGJhY2tzIHdpbGwgYmUgaGFuZGxlZCBoZXJlXG4gICAgICAgIGV4ZWN1dGVDYWxsYmFjay5jYWxsKHRoaXMsIGQsICdkYmxjbGljaycpO1xuICAgICAgfSlcbiAgICAgIC5vbihcIm1vdXNlb3ZlclwiLCBkID0+IHtcbiAgICAgICAgLy8gZGVmYXVsdCwgc2hvdyB0b29sdGlwXG4gICAgICAgIHRvb2x0aXAucmVuZGVyKGQubWVzc2FnZXMpO1xuICAgICAgfSlcbiAgICAgIC5vbihcIm1vdXNlb3V0XCIsICgpID0+IHtcbiAgICAgICAgLy8gZGVmYXVsdCwgaGlkZSB0b29sdGlwXG4gICAgICAgIHRvb2x0aXAudW5yZW5kZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKGpzb24uY2FudmFzLmdyYXBoLnNpbXVsYXRpb24gJiYgZGF0YUNoYW5nZWQpIHtcbiAgICAgIC8vIENhbnZhcyBGb3JjZXNcbiAgICAgIHZhciBjZW50ZXJGb3JjZSA9IGQzLmZvcmNlQ2VudGVyKCkueCh3aWR0aCAvIDIpLnkoaGVpZ2h0IC8gMik7XG4gICAgICB2YXIgbWFueUZvcmNlID0gZDMuZm9yY2VNYW55Qm9keSgpLnN0cmVuZ3RoKC1jYW52YXNOb2Rlcy5sZW5ndGggKiAzMCk7XG4gICAgICB2YXIgbGlua0ZvcmNlID0gZDMuZm9yY2VMaW5rKGNhbnZhc0xpbmtzKS5pZChkID0+IGQuaWQpLmRpc3RhbmNlKDUwKTtcbiAgICAgIHZhciBjb2xsaWRlRm9yY2UgPSBkMy5mb3JjZUNvbGxpZGUoZCA9PiBkLnNpemUgKiAyKTtcblxuICAgICAgLy9HZW5lcmljIGdyYXZpdHkgZm9yIHRoZSBYIHBvc2l0aW9uXG4gICAgICB2YXIgZm9yY2VYID0gZDMuZm9yY2VYKHdpZHRoIC8gMikuc3RyZW5ndGgoMC4wNSk7XG5cbiAgICAgIC8vR2VuZXJpYyBncmF2aXR5IGZvciB0aGUgWSBwb3NpdGlvbiAtIHVuZGlyZWN0ZWQvZGlyZWN0ZWQgZ3JhcGhzIGZhbGwgaGVyZVxuICAgICAgdmFyIGZvcmNlWSA9IGQzLmZvcmNlWShoZWlnaHQgLyAyKS5zdHJlbmd0aCgwLjI1KTtcblxuICAgICAgaWYgKGpzb24uY2FudmFzLmdyYXBoLnR5cGUgPT09ICdoYXNzZScpIHtcbiAgICAgICAgLy9HZW5lcmljIGdyYXZpdHkgZm9yIHRoZSBYIHBvc2l0aW9uXG4gICAgICAgIGZvcmNlWCA9IGQzLmZvcmNlWCh3aWR0aCAvIDIpLnN0cmVuZ3RoKDAuNSk7XG4gICAgICAgIC8vU3Ryb25nIHkgcG9zaXRpb25pbmcgYmFzZWQgb24gbGF5ZXIgdG8gc2ltdWxhdGUgdGhlIGhhc3NlIGRpYWdyYW1cbiAgICAgICAgZm9yY2VZID0gZDMuZm9yY2VZKGQgPT4gZC5sYXllciAqIDUwKS5zdHJlbmd0aCg1KTtcbiAgICAgIH1cblxuICAgICAgdmFyIHNpbXVsYXRpb24gPSBkMy5mb3JjZVNpbXVsYXRpb24oY2FudmFzTm9kZXMpXG4gICAgICAgIC5mb3JjZShcImNoYXJnZVwiLCBtYW55Rm9yY2UpXG4gICAgICAgIC5mb3JjZShcImxpbmtcIiwgbGlua0ZvcmNlKVxuICAgICAgICAuZm9yY2UoXCJjZW50ZXJcIiwgY2VudGVyRm9yY2UpXG4gICAgICAgIC5mb3JjZShcInhcIiwgZm9yY2VYKVxuICAgICAgICAuZm9yY2UoXCJ5XCIsIGZvcmNlWSlcbiAgICAgICAgLmZvcmNlKFwiY29sbGlkZVwiLCBjb2xsaWRlRm9yY2UpXG4gICAgICAgIC5vbigndGljaycsIHRpY2tlZClcbiAgICAgICAgLm9uKFwiZW5kXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIC8vIHpvb20gdG8gZml0IHdoZW4gc2ltdWxhdGlvbiBpcyBvdmVyXG4gICAgICAgICAgcGFyZW50Lnpvb21Ub0ZpdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgLy9mb3JjZSBzaW11bGF0aW9uIHJlc3RhcnRcbiAgICAgIHNpbXVsYXRpb24ucmVzdGFydCgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIC8vIHdlbGwsIHNpbXVsYXRpb24gaXMgb2ZmLCB6b29tIHRvIGZpdCBub3dcbiAgICAgIHBhcmVudC56b29tVG9GaXQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0aWNrZWQoKSB7XG4gICAgICBsaW5rXG4gICAgICAgIC5hdHRyKCd4MScsIGQgPT4gZC5zb3VyY2UueClcbiAgICAgICAgLmF0dHIoJ3kxJywgZCA9PiBkLnNvdXJjZS55KVxuICAgICAgICAuYXR0cigneDInLCBkID0+IGQudGFyZ2V0LngpXG4gICAgICAgIC5hdHRyKCd5MicsIGQgPT4gZC50YXJnZXQueSk7XG5cbiAgICAgIG5vZGUuYXR0cigndHJhbnNmb3JtJywgZCA9PiBgdHJhbnNsYXRlKCR7ZC54fSwke2QueX0pYCk7XG5cbiAgICAgIGxhYmVsXG4gICAgICAgIC5hdHRyKCd4JywgZCA9PiBkLnggLSBkLnRpdGxlLmxlbmd0aCAtIE1hdGguc3FydChkLnNpemUgKiBkLnRpdGxlLmxlbmd0aCAqIDIpKVxuICAgICAgICAuYXR0cigneScsIGQgPT4gZC55IC0gTWF0aC5zcXJ0KGQuc2l6ZSAqIDIpKTtcblxuICAgICAgbm9kZS5lYWNoKGNvbGxpZGUoMSkpO1xuICAgIH1cblxuICAgIC8vIENPTExJU0lPTlxuICAgIHZhciBwYWRkaW5nID0gMTA7IC8vIHNlcGFyYXRpb24gYmV0d2VlbiBjaXJjbGVzO1xuXG4gICAgZnVuY3Rpb24gY29sbGlkZShhbHBoYSkge1xuICAgICAgbGV0IHF1YWRUcmVlID0gZDMucXVhZHRyZWUoY2FudmFzTm9kZXMpO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgbGV0IHJiID0gMTAwICogZC5zaXplICsgcGFkZGluZyxcbiAgICAgICAgICBueDEgPSBkLnggLSByYixcbiAgICAgICAgICBueDIgPSBkLnggKyByYixcbiAgICAgICAgICBueTEgPSBkLnkgLSByYixcbiAgICAgICAgICBueTIgPSBkLnkgKyByYjtcbiAgICAgICAgcXVhZFRyZWUudmlzaXQoZnVuY3Rpb24ocXVhZCwgeDEsIHkxLCB4MiwgeTIpIHtcbiAgICAgICAgICBpZiAocXVhZC5wb2ludCAmJiAocXVhZC5wb2ludCAhPT0gZCkpIHtcbiAgICAgICAgICAgIGxldCB4ID0gZC54IC0gcXVhZC5wb2ludC54LFxuICAgICAgICAgICAgICB5ID0gZC55IC0gcXVhZC5wb2ludC55LFxuICAgICAgICAgICAgICBsID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkpO1xuICAgICAgICAgICAgaWYgKGwgPCByYikge1xuICAgICAgICAgICAgICBsID0gKGwgLSByYikgLyBsICogYWxwaGE7XG4gICAgICAgICAgICAgIGQueCAtPSB4ICo9IGw7XG4gICAgICAgICAgICAgIGQueSAtPSB5ICo9IGw7XG4gICAgICAgICAgICAgIHF1YWQucG9pbnQueCArPSB4O1xuICAgICAgICAgICAgICBxdWFkLnBvaW50LnkgKz0geTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHgxID4gbngyIHx8IHgyIDwgbngxIHx8IHkxID4gbnkyIHx8IHkyIDwgbnkxO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSElHSExJR0hUXG4gICAgLy9Ub2dnbGUgc3RvcmVzIHdoZXRoZXIgdGhlIGhpZ2hsaWdodGluZyBpcyBvblxuICAgIHZhciB0b2dnbGUgPSAwO1xuICAgIC8vQ3JlYXRlIGFuIGFycmF5IGxvZ2dpbmcgd2hhdCBpcyBjb25uZWN0ZWQgdG8gd2hhdFxuICAgIHZhciBsaW5rZWRCeUluZGV4ID0ge307XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhbnZhc05vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsaW5rZWRCeUluZGV4W2Ake2l9LCR7aX1gXSA9IDE7XG4gICAgfVxuXG4gICAgY2FudmFzTGlua3MuZm9yRWFjaChmdW5jdGlvbihkKSB7XG4gICAgICBsaW5rZWRCeUluZGV4W2Ake2Quc291cmNlLmluZGV4fSwke2QudGFyZ2V0LmluZGV4fWBdID0gMTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIGNvbm5lY3RlZE5vZGVzKCkge1xuICAgICAgLy9UaGlzIGZ1bmN0aW9uIGxvb2tzIHVwIHdoZXRoZXIgYSBwYWlyIGFyZSBuZWlnaGJvdXJzXG4gICAgICBmdW5jdGlvbiBuZWlnaGJvcmluZyhhLCBiKSB7XG4gICAgICAgIHJldHVybiBsaW5rZWRCeUluZGV4W2Ake2EuaW5kZXh9LCR7Yi5pbmRleH1gXTtcbiAgICAgIH1cbiAgICAgIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAodG9nZ2xlID09PSAwKSB7XG4gICAgICAgIC8vUmVkdWNlIHRoZSBvcGFjaXR5IG9mIGFsbCBidXQgdGhlIG5laWdoYm91cmluZyBub2Rlc1xuICAgICAgICBsZXQgZCA9IGQzLnNlbGVjdCh0aGlzKS5ub2RlKCkuX19kYXRhX187XG4gICAgICAgIG5vZGUuc3R5bGUoJ29wYWNpdHknLCBvID0+IG5laWdoYm9yaW5nKGQsIG8pIHx8IG5laWdoYm9yaW5nKG8sIGQpID8gMSA6IDAuMSk7XG4gICAgICAgIGxpbmsuc3R5bGUoJ29wYWNpdHknLCBvID0+IGQuaW5kZXggPT09IG8uc291cmNlLmluZGV4IHx8IGQuaW5kZXggPT09IG8udGFyZ2V0LmluZGV4ID8gMSA6IDAuMSk7XG4gICAgICAgIC8vUmVkdWNlIHRoZSBvcFxuICAgICAgICB0b2dnbGUgPSAxO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIC8vUHV0IHRoZW0gYmFjayB0byBvcGFjaXR5PTFcbiAgICAgICAgbm9kZS5zdHlsZSgnb3BhY2l0eScsIDEpO1xuICAgICAgICBsaW5rLnN0eWxlKCdvcGFjaXR5JywgMSk7XG4gICAgICAgIHRvZ2dsZSA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZHJhZ3N0YXJ0ZWQoZCkge1xuICAgICAgaWYgKCFkMy5ldmVudC5hY3RpdmUpIHtcbiAgICAgICAgc2ltdWxhdGlvbi5hbHBoYVRhcmdldCgwLjAxKS5yZXN0YXJ0KCk7XG4gICAgICB9XG4gICAgICBkLmZ4ID0gZC54O1xuICAgICAgZC5meSA9IGQueTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkcmFnZ2VkKGQpIHtcbiAgICAgIGQuZnggPSBkMy5ldmVudC54O1xuICAgICAgZC5meSA9IGQzLmV2ZW50Lnk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZHJhZ2VuZGVkKGQpIHtcbiAgICAgIGlmICghZDMuZXZlbnQuYWN0aXZlKSB7XG4gICAgICAgIHNpbXVsYXRpb24uYWxwaGFUYXJnZXQoMCk7XG4gICAgICB9XG4gICAgICBkLmZ4ID0gbnVsbDtcbiAgICAgIGQuZnkgPSBudWxsO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4ZWN1dGVDYWxsYmFjayhkYXRhLCBldmVudCkge1xuICAgICAgaWYgKGRhdGEuY2FsbGJhY2tzKSB7XG4gICAgICAgIE9iamVjdC52YWx1ZXMoZGF0YS5jYWxsYmFja3MpLmZvckVhY2goKGNiKSA9PiB7XG4gICAgICAgICAgLy8gZXhlY3V0ZSB0aGUgb25lcyB0aGF0IG1hdGNoIHRoZSBldmVudCFcbiAgICAgICAgICBjYi50cmlnZ2VyID09PSBldmVudCAmJiBjYWxsYmFjay5leGVjdXRlKHsgY2FsbGJhY2s6IGNiIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3ZnO1xuXG4gIH1cblxuICB1bnJlbmRlcigpIHt9XG5cbn1cbiIsImltcG9ydCBNZW51IGZyb20gJy4vbWVudSc7XG5pbXBvcnQgQ2FsbGJhY2sgZnJvbSAnLi9jYWxsYmFjayc7XG5cbi8qIGdsb2JhbCBkMyAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZXh0TWVudSBleHRlbmRzIE1lbnUge1xuXG4gIGNvbnN0cnVjdG9yKHsgdmVyYm9zZSA9IGZhbHNlLCBhcHBlbmRUbywgY2FsbGJhY2tIYW5kbGVyIH0pIHtcbiAgICBzdXBlcih7IHZlcmJvc2U6IHZlcmJvc2UsIGFwcGVuZFRvOiBhcHBlbmRUbywgY2FsbGJhY2tIYW5kbGVyOiBjYWxsYmFja0hhbmRsZXIgfSk7XG4gIH1cblxuICByZW5kZXIob2JqZWN0KSB7XG5cbiAgICAvLyBqdXN0IGlnbm9yZSByZW5kZXJpbmcgaWYgbm8gbWVudXMgYXJlIHByZXNlbnRcbiAgICBpZiAoIW9iamVjdC5tZW51cyB8fCAhT2JqZWN0LnZhbHVlcyhvYmplY3QubWVudXMpLmxlbmd0aCkge1xuICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ05vIENvbnRleHRNZW51IHRvIHJlbmRlciBoZXJlLi4uIGNvbnRpbnVpbmcuLi4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgY29udGV4dE1lbnUgPSB0aGlzLlNWR1BhcmVudC5zZWxlY3QoJ2cuZnJhbmN5LWNvbnRleHQtbWVudScpO1xuXG4gICAgLy8gY2hlY2sgaWYgdGhlIHdpbmRvdyBpcyBhbHJlYWR5IHByZXNlbnRcbiAgICBpZiAoY29udGV4dE1lbnUubm9kZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29udGV4dE1lbnUgPSB0aGlzLlNWR1BhcmVudC5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdmcmFuY3ktY29udGV4dC1tZW51Jyk7XG5cbiAgICB2YXIgbWVudXMgPSB0aGlzLmZsYXR0ZW4ob2JqZWN0Lm1lbnVzKTtcblxuICAgIHRoaXMuU1ZHUGFyZW50LnNlbGVjdEFsbCgnLnRtcCcpXG4gICAgICAuZGF0YShtZW51cykuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAudGV4dChkID0+IGQudGl0bGUpXG4gICAgICAuYXR0cigneCcsIC0xMDAwKVxuICAgICAgLmF0dHIoJ3knLCAtMTAwMClcbiAgICAgIC5hdHRyKCdjbGFzcycsICd0bXAnKTtcbiAgICB2YXIgeiA9IHRoaXMuU1ZHUGFyZW50LnNlbGVjdEFsbCgnLnRtcCcpLm5vZGVzKCkubWFwKHggPT4geC5nZXRCQm94KCkpO1xuICAgIHZhciB3aWR0aCA9IGQzLm1heCh6Lm1hcCh4ID0+IHgud2lkdGgpKTtcbiAgICB2YXIgbWFyZ2luID0gNTtcbiAgICB3aWR0aCA9IE1hdGgucm91bmQod2lkdGggKyAyICogbWFyZ2luKTtcbiAgICB2YXIgaGVpZ2h0ID0gTWF0aC5yb3VuZChkMy5tYXgoei5tYXAoeCA9PiB4LmhlaWdodCArIG1hcmdpbiAqIDIpKSk7XG4gICAgdmFyIHBvcyA9IGQzLm1vdXNlKHRoaXMuU1ZHUGFyZW50Lm5vZGUoKSk7XG4gICAgdmFyIHggPSBwb3NbMF0gKyA1LFxuICAgICAgeSA9IHBvc1sxXSArIDU7XG5cbiAgICB0aGlzLlNWR1BhcmVudC5zZWxlY3RBbGwoJy50bXAnKS5yZW1vdmUoKTtcblxuICAgIGNvbnRleHRNZW51LmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3h9LCR7eX0pYClcbiAgICAgIC5hdHRyKCd3aWR0aCcsIHdpZHRoKS5hdHRyKCdoZWlnaHQnLCBoZWlnaHQgKiBtZW51cy5sZW5ndGgpXG4gICAgICAuYXR0cignY2xhc3MnLCAnZnJhbmN5LW1lbnUtYm9yZGVyJyk7XG5cbiAgICBjb250ZXh0TWVudS5zZWxlY3RBbGwoJ2cuZnJhbmN5LW1lbnUtZW50cnknKVxuICAgICAgLmRhdGEobWVudXMpLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdmcmFuY3ktbWVudS1lbnRyeScpXG4gICAgICAub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgnZnJhbmN5LW1lbnUtZW50cnktc2VsZWN0ZWQnLCB0cnVlKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKCdmcmFuY3ktbWVudS1lbnRyeS1zZWxlY3RlZCcsIGZhbHNlKTtcbiAgICAgIH0pO1xuXG4gICAgY29udGV4dE1lbnUuc2VsZWN0QWxsKCdnLmZyYW5jeS1tZW51LWVudHJ5JykuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT4gYHRyYW5zbGF0ZSgke3h9LCR7eSArIGkgKiBoZWlnaHR9KWApXG4gICAgICAuYXR0cignd2lkdGgnLCB3aWR0aCkuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuICAgICAgLmF0dHIoJ2lkJywgZCA9PiBkLmlkKTtcblxuICAgIGNvbnRleHRNZW51LnNlbGVjdEFsbCgnZy5mcmFuY3ktbWVudS1lbnRyeScpLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQsIGkpID0+IGB0cmFuc2xhdGUoJHt4ICsgbWFyZ2lufSwke3kgKyBpICogaGVpZ2h0ICsgbWFyZ2luICogM30pYClcbiAgICAgIC50ZXh0KGQgPT4gZC50aXRsZSkuYXR0cignaWQnLCBkID0+IGQuaWQpO1xuXG4gICAgY29udGV4dE1lbnUuc2VsZWN0QWxsKCdnLmZyYW5jeS1tZW51LWVudHJ5Jykub24oJ2NsaWNrJywgZCA9PiBuZXcgQ2FsbGJhY2sodGhpcy5vcHRpb25zKS5leGVjdXRlKGQpKTtcblxuICAgIHRoaXMuU1ZHUGFyZW50Lm9uKCdjbGljaycsICgpID0+IGNvbnRleHRNZW51LnJlbW92ZSgpKTtcblxuICAgIHJldHVybiBjb250ZXh0TWVudTtcbiAgfVxuXG4gIHVucmVuZGVyKCkge31cblxuICBmbGF0dGVuKG1lbnVzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBbXS5jb25jYXQuYXBwbHkoW10sIE9iamVjdC52YWx1ZXMobWVudXMpLm1hcChtZW51ID0+IHtcbiAgICAgIGlmIChtZW51Lm1lbnVzICYmIE9iamVjdC52YWx1ZXMobWVudS5tZW51cykubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gc2VsZi5mbGF0dGVuKG1lbnUubWVudXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1lbnU7XG4gICAgfSkpO1xuICB9XG59XG4iLCJpbXBvcnQgTWVudSBmcm9tICcuL21lbnUnO1xuaW1wb3J0IENhbGxiYWNrIGZyb20gJy4vY2FsbGJhY2snO1xuLy9pbXBvcnQgQWJvdXRNb2RhbCBmcm9tICcuL21vZGFsLWFib3V0JztcblxuLyogZ2xvYmFsIGQzLCB3aW5kb3cgKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFpbk1lbnUgZXh0ZW5kcyBNZW51IHtcblxuICBjb25zdHJ1Y3Rvcih7IHZlcmJvc2UgPSBmYWxzZSwgYXBwZW5kVG8sIGNhbGxiYWNrSGFuZGxlciB9KSB7XG4gICAgc3VwZXIoeyB2ZXJib3NlOiB2ZXJib3NlLCBhcHBlbmRUbzogYXBwZW5kVG8sIGNhbGxiYWNrSGFuZGxlcjogY2FsbGJhY2tIYW5kbGVyIH0pO1xuICB9XG5cbiAgcmVuZGVyKGpzb24pIHtcblxuICAgIC8vIGp1c3QgaWdub3JlIHJlbmRlcmluZyBpZiBubyBtZW51cyBhcmUgcHJlc2VudFxuICAgIGlmICghanNvbi5jYW52YXMubWVudXMgfHwgIU9iamVjdC52YWx1ZXMoanNvbi5jYW52YXMubWVudXMpLmxlbmd0aCkge1xuICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ05vIE1lbnUgdG8gcmVuZGVyIGhlcmUuLi4gY29udGludWluZy4uLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBtZW51ID0gdGhpcy5TVkdQYXJlbnQuc2VsZWN0KCdnLmZyYW5jeS1tYWluLW1lbnUnKTtcblxuICAgIC8vIGNoZWNrIGlmIHRoZSB3aW5kb3cgaXMgYWxyZWFkeSBwcmVzZW50XG4gICAgaWYgKG1lbnUubm9kZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbWVudSA9IHRoaXMuU1ZHUGFyZW50LmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ2ZyYW5jeS1tYWluLW1lbnUnKTtcblxuICAgIHZhciBtZW51cyA9IE9iamVjdC52YWx1ZXMoanNvbi5jYW52YXMubWVudXMpO1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMuU1ZHUGFyZW50LnNlbGVjdEFsbCgnLnRtcCcpXG4gICAgICAuZGF0YShtZW51cykuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAudGV4dChkID0+IGQudGl0bGUpXG4gICAgICAuYXR0cigneCcsIC0xMDAwKVxuICAgICAgLmF0dHIoJ3knLCAtMTAwMClcbiAgICAgIC5hdHRyKCdjbGFzcycsICd0bXAnKTtcbiAgICB2YXIgeiA9IHRoaXMuU1ZHUGFyZW50LnNlbGVjdEFsbCgnLnRtcCcpLm5vZGVzKCkubWFwKHggPT4geC5nZXRCQm94KCkpO1xuICAgIHZhciB3aWR0aCA9IGQzLm1heCh6Lm1hcCh4ID0+IHgud2lkdGgpKTtcbiAgICB2YXIgbWFyZ2luID0gMTA7XG4gICAgd2lkdGggPSBNYXRoLnJvdW5kKHdpZHRoICsgMiAqIG1hcmdpbik7XG4gICAgdmFyIGhlaWdodCA9IE1hdGgucm91bmQoZDMubWF4KHoubWFwKHggPT4geC5oZWlnaHQgKyBtYXJnaW4gKiAyKSkpO1xuICAgIHZhciB4ID0gNSxcbiAgICAgIHkgPSAwO1xuXG4gICAgdGhpcy5TVkdQYXJlbnQuc2VsZWN0QWxsKCcudG1wJykucmVtb3ZlKCk7XG5cbiAgICBtZW51LmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJylcbiAgICAgIC5hdHRyKCd3aWR0aCcsICcxMDAlJykuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ZyYW5jeS1tZW51LWJvcmRlcicpO1xuICAgIG1lbnUuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgJzEwMCUnKS5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpO1xuXG4gICAgbWVudS5zZWxlY3RBbGwoJ2cuZnJhbmN5LW1lbnUtZW50cnknKVxuICAgICAgLmRhdGEobWVudXMpLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdmcmFuY3ktbWVudS1lbnRyeScpXG4gICAgICAuYXR0cignaWQnLCBkID0+IGQuaWQpXG4gICAgICAub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgaWYgKGQubWVudXMgJiYgT2JqZWN0LnZhbHVlcyhkLm1lbnVzKS5sZW5ndGgpIHtcbiAgICAgICAgICBzZWxmLmJ1aWxkTWVudShkMy5zZWxlY3QodGhpcyksIGQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKCdmcmFuY3ktbWVudS1lbnRyeS1zZWxlY3RlZCcsIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLm9uKCdtb3VzZW91dCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgnZnJhbmN5LW1lbnUtZW50cnktc2VsZWN0ZWQnLCBmYWxzZSk7XG4gICAgICB9KTtcblxuICAgIG1lbnUuc2VsZWN0QWxsKCdnLmZyYW5jeS1tZW51LWVudHJ5JykuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT4gYHRyYW5zbGF0ZSgke3ggKyBpICogd2lkdGh9LCR7eX0pYClcbiAgICAgIC5hdHRyKCd3aWR0aCcsIHdpZHRoKS5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpO1xuXG4gICAgbWVudS5zZWxlY3RBbGwoJ2cuZnJhbmN5LW1lbnUtZW50cnknKS5hcHBlbmQoJ3RleHQnKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkLCBpKSA9PiBgdHJhbnNsYXRlKCR7eCArIGkgKiB3aWR0aCArIG1hcmdpbn0sJHt5ICsgaGVpZ2h0IC8gMS43fSlgKVxuICAgICAgLnRleHQoZCA9PiBkLnRpdGxlKTtcblxuICAgIG1lbnUuc2VsZWN0QWxsKCdnLmZyYW5jeS1tZW51LWVudHJ5IHJlY3QnKS5vbignY2xpY2snLCBkID0+IHtcbiAgICAgIGlmICghZC5tZW51cyB8fCAhT2JqZWN0LnZhbHVlcyhkLm1lbnVzKS5sZW5ndGgpIHtcbiAgICAgICAgbmV3IENhbGxiYWNrKHRoaXMub3B0aW9ucykuZXhlY3V0ZShkKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBtZW51O1xuICB9XG5cbiAgdW5yZW5kZXIoKSB7fVxuXG4gIGJ1aWxkTWVudShwYXJlbnQsIG9iamVjdCkge1xuXG4gICAgdmFyIGNvbnRleHRNZW51ID0gcGFyZW50LnNlbGVjdCgnZy5mcmFuY3ktc3VibWVudScpO1xuXG4gICAgLy8gY2hlY2sgaWYgdGhlIHdpbmRvdyBpcyBhbHJlYWR5IHByZXNlbnRcbiAgICBpZiAoY29udGV4dE1lbnUubm9kZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29udGV4dE1lbnUgPSBwYXJlbnQuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnZnJhbmN5LXN1Ym1lbnUnKTtcblxuICAgIHZhciBtZW51cyA9IHRoaXMuZmxhdHRlbihvYmplY3QubWVudXMpO1xuXG4gICAgdGhpcy5TVkdQYXJlbnQuc2VsZWN0QWxsKCcudG1wJylcbiAgICAgIC5kYXRhKG1lbnVzKS5lbnRlcigpXG4gICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC50ZXh0KGQgPT4gZC50aXRsZSlcbiAgICAgIC5hdHRyKCd4JywgLTEwMDApXG4gICAgICAuYXR0cigneScsIC0xMDAwKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RtcCcpO1xuICAgIHZhciB6ID0gdGhpcy5TVkdQYXJlbnQuc2VsZWN0QWxsKCcudG1wJykubm9kZXMoKS5tYXAoeCA9PiB4LmdldEJCb3goKSk7XG4gICAgdmFyIHdpZHRoID0gZDMubWF4KHoubWFwKHggPT4geC53aWR0aCkpO1xuICAgIHZhciBtYXJnaW4gPSAxMDtcbiAgICB3aWR0aCA9IE1hdGgucm91bmQod2lkdGggKyAyICogbWFyZ2luKTtcbiAgICB2YXIgaGVpZ2h0ID0gTWF0aC5yb3VuZChkMy5tYXgoei5tYXAoeCA9PiB4LmhlaWdodCArIG1hcmdpbiAqIDIpKSk7XG4gICAgdmFyIGJveCA9IHBhcmVudC5zZWxlY3QoJ3JlY3QnKS5ub2RlKCkuZ2V0QkJveCgpO1xuICAgIHdpZHRoID0gd2lkdGggPCBib3gud2lkdGggPyBib3gud2lkdGggOiB3aWR0aDtcbiAgICB2YXIgcG9zID0gcGFyZW50LnNlbGVjdCgncmVjdCcpLm5vZGUoKS50cmFuc2Zvcm0uYmFzZVZhbC5jb25zb2xpZGF0ZSgpLm1hdHJpeDtcbiAgICB2YXIgeCA9IHBvcy5lLFxuICAgICAgeSA9IHBvcy5mICsgYm94LmhlaWdodCArIDE7XG5cbiAgICB0aGlzLlNWR1BhcmVudC5zZWxlY3RBbGwoJy50bXAnKS5yZW1vdmUoKTtcblxuICAgIGNvbnRleHRNZW51LmFwcGVuZCgncmVjdCcpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3h9LCR7eX0pYClcbiAgICAgIC5hdHRyKCd3aWR0aCcsIHdpZHRoKS5hdHRyKCdoZWlnaHQnLCBoZWlnaHQgKiBtZW51cy5sZW5ndGgpXG4gICAgICAuYXR0cignY2xhc3MnLCAnZnJhbmN5LW1lbnUtYm9yZGVyJyk7XG4gICAgY29udGV4dE1lbnUuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7eH0sJHt5fSlgKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgd2lkdGgpLmF0dHIoJ2hlaWdodCcsIGhlaWdodCAqIG1lbnVzLmxlbmd0aCk7XG5cbiAgICBjb250ZXh0TWVudS5zZWxlY3RBbGwoJ2cuZnJhbmN5LW1lbnUtZW50cnknKVxuICAgICAgLmRhdGEobWVudXMpLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ2cnKS5hdHRyKCdjbGFzcycsICdmcmFuY3ktbWVudS1lbnRyeScpXG4gICAgICAub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBkMy5zZWxlY3QodGhpcykuY2xhc3NlZCgnZnJhbmN5LW1lbnUtZW50cnktc2VsZWN0ZWQnLCB0cnVlKTtcbiAgICAgIH0pXG4gICAgICAub24oJ21vdXNlb3V0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKCdmcmFuY3ktbWVudS1lbnRyeS1zZWxlY3RlZCcsIGZhbHNlKTtcbiAgICAgIH0pO1xuXG4gICAgY29udGV4dE1lbnUuc2VsZWN0QWxsKCdnLmZyYW5jeS1tZW51LWVudHJ5JykuYXBwZW5kKCdyZWN0JylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT4gYHRyYW5zbGF0ZSgke3h9LCR7eSArIGkgKiBoZWlnaHR9KWApXG4gICAgICAuYXR0cignd2lkdGgnLCB3aWR0aCkuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuICAgICAgLmF0dHIoJ2lkJywgZCA9PiBkLmlkKTtcblxuICAgIGNvbnRleHRNZW51LnNlbGVjdEFsbCgnZy5mcmFuY3ktbWVudS1lbnRyeScpLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgKGQsIGkpID0+IGB0cmFuc2xhdGUoJHt4ICsgbWFyZ2lufSwke3kgKyAoaSAqIGhlaWdodCArIG1hcmdpbiAqIDIpfSlgKVxuICAgICAgLnRleHQoZCA9PiBkLnRpdGxlKS5hdHRyKCdpZCcsIGQgPT4gZC5pZCk7XG5cbiAgICBjb250ZXh0TWVudS5zZWxlY3RBbGwoJ2cuZnJhbmN5LW1lbnUtZW50cnknKVxuICAgICAgLm9uKCdjbGljaycsIGQgPT4gbmV3IENhbGxiYWNrKHRoaXMub3B0aW9ucykuZXhlY3V0ZShkKSk7XG5cbiAgICAvL2NvbnRleHRNZW51LmFwcGVuZCgncmVjdCcpXG4gICAgLy8uYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3h9LCR7eX0pYClcbiAgICAvLy5hdHRyKCd3aWR0aCcsIHdpZHRoKS5hdHRyKCdoZWlnaHQnLCBoZWlnaHQgKiBtZW51cy5sZW5ndGgpXG4gICAgLy8uc3R5bGUoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG4gICAgLy9jb250ZXh0TWVudS5vbignbW91c2VvdmVyJywgZnVuY3Rpb24oKSB7IGNvbnRleHRNZW51Lm9uKCdtb3VzZW91dCcsICgpID0+IGNvbnRleHRNZW51LnJlbW92ZSgpKTsgfSk7XG5cbiAgICByZXR1cm4gY29udGV4dE1lbnU7XG4gIH1cblxuICBmbGF0dGVuKG1lbnVzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBbXS5jb25jYXQuYXBwbHkoW10sIE9iamVjdC52YWx1ZXMobWVudXMpLm1hcChtZW51ID0+IHtcbiAgICAgIGlmIChtZW51Lm1lbnVzICYmIE9iamVjdC52YWx1ZXMobWVudS5tZW51cykubGVuZ3RoID4gMCkge1xuICAgICAgICByZXR1cm4gc2VsZi5mbGF0dGVuKG1lbnUubWVudXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1lbnU7XG4gICAgfSkpO1xuICB9XG5cbn1cbiIsImltcG9ydCBSZW5kZXJlciBmcm9tICcuL3JlbmRlcmVyJztcbmltcG9ydCBDYWxsYmFjayBmcm9tICcuL2NhbGxiYWNrJztcblxuLy8gVE9ETyByZXBsYWNlIGZvcmVpZ25PYmplY3QgaHR0cDovL2JsLm9ja3Mub3JnL2pha29zei9jZTFlNjNkNTE0OWY2NGFjN2VlOVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVudSBleHRlbmRzIFJlbmRlcmVyIHtcblxuICBjb25zdHJ1Y3Rvcih7IHZlcmJvc2UgPSBmYWxzZSwgYXBwZW5kVG8sIGNhbGxiYWNrSGFuZGxlciB9KSB7XG4gICAgc3VwZXIoeyB2ZXJib3NlOiB2ZXJib3NlLCBhcHBlbmRUbzogYXBwZW5kVG8sIGNhbGxiYWNrSGFuZGxlcjogY2FsbGJhY2tIYW5kbGVyIH0pO1xuICB9XG5cbiAgdHJhdmVyc2UoYXBwZW5kVG8sIG1lbnVzSXRlcmF0b3IpIHtcbiAgICB3aGlsZSAobWVudXNJdGVyYXRvci5oYXNOZXh0KCkpIHtcbiAgICAgIHZhciBtZW51SXRlbSA9IG1lbnVzSXRlcmF0b3IubmV4dCgpO1xuICAgICAgdmFyIGVudHJ5ID0gYXBwZW5kVG8uYXBwZW5kKCdsaScpO1xuICAgICAgdmFyIGFjdGlvbiA9IGVudHJ5LnNlbGVjdEFsbCgnYScpLmRhdGEoW21lbnVJdGVtXSkuZW50ZXIoKS5hcHBlbmQoJ2EnKS5hdHRyKCd0aXRsZScsIG1lbnVJdGVtLnRpdGxlKS5odG1sKG1lbnVJdGVtLnRpdGxlKTtcbiAgICAgIGlmIChtZW51SXRlbS5jYWxsYmFjayAmJiBPYmplY3QudmFsdWVzKG1lbnVJdGVtLmNhbGxiYWNrKS5sZW5ndGgpIHtcbiAgICAgICAgYWN0aW9uLm9uKCdjbGljaycsIChkKSA9PiBuZXcgQ2FsbGJhY2sodGhpcy5vcHRpb25zKS5leGVjdXRlKGQpKTtcbiAgICAgIH1cbiAgICAgIGlmIChtZW51SXRlbS5tZW51cyAmJiBPYmplY3QudmFsdWVzKG1lbnVJdGVtLm1lbnVzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBjb250ZW50ID0gZW50cnkuYXBwZW5kKCd1bCcpO1xuICAgICAgICB2YXIgc3ViTWVudXNJdGVyYXRvciA9IHRoaXMuaXRlcmF0b3IoT2JqZWN0LnZhbHVlcyhtZW51SXRlbS5tZW51cykpO1xuICAgICAgICB0aGlzLnRyYXZlcnNlKGNvbnRlbnQsIHN1Yk1lbnVzSXRlcmF0b3IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGl0ZXJhdG9yKGFycmF5KSB7XG4gICAgdmFyIG5leHRJbmRleCA9IDA7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNOZXh0KCkgPyBhcnJheVtuZXh0SW5kZXgrK10gOiB1bmRlZmluZWQ7XG4gICAgICB9LFxuICAgICAgaGFzTmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBuZXh0SW5kZXggPCBhcnJheS5sZW5ndGg7XG4gICAgICB9LFxuICAgICAgY291bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gYXJyYXkubGVuZ3RoO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICB1bnJlbmRlcigpIHt9XG59XG4iLCJpbXBvcnQgUmVuZGVyZXIgZnJvbSAnLi9yZW5kZXJlcic7XG5cbi8qIGdsb2JhbCBkMyAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlIGV4dGVuZHMgUmVuZGVyZXIge1xuXG4gIGNvbnN0cnVjdG9yKHsgdmVyYm9zZSA9IGZhbHNlLCBhcHBlbmRUbywgY2FsbGJhY2tIYW5kbGVyIH0pIHtcbiAgICBzdXBlcih7IHZlcmJvc2U6IHZlcmJvc2UsIGFwcGVuZFRvOiBhcHBlbmRUbywgY2FsbGJhY2tIYW5kbGVyOiBjYWxsYmFja0hhbmRsZXIgfSk7XG4gIH1cblxuICByZW5kZXIobWVzc2FnZXMpIHtcblxuICAgIC8vIGp1c3QgaWdub3JlIHJlbmRlcmluZyBpZiBubyBtZXNzYWdlcyBhcmUgcHJlc2VudFxuICAgIGlmICghbWVzc2FnZXMgfHwgIU9iamVjdC52YWx1ZXMobWVzc2FnZXMpLmxlbmd0aCkge1xuICAgICAgLy90aGlzLmxvZ2dlci5kZWJ1ZygnTm90aGluZyB0byByZW5kZXIgaGVyZS4uLiBjb250aW51aW5nLi4uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5TVkdQYXJlbnQuc2VsZWN0QWxsKCcudG1wJylcbiAgICAgIC5kYXRhKE9iamVjdC5rZXlzKG1lc3NhZ2VzKSlcbiAgICAgIC5lbnRlcigpLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cigneCcsIC0xMDAwKVxuICAgICAgLmF0dHIoJ3knLCAtMTAwMClcbiAgICAgIC5hdHRyKCdjbGFzcycsICd0bXAnKVxuICAgICAgLnRleHQoZCA9PiBtZXNzYWdlc1tkXS50aXRsZSArIG1lc3NhZ2VzW2RdLnRleHQpLmNhbGwodGhpcy53cmFwKTtcblxuICAgIHZhciB6ID0gdGhpcy5TVkdQYXJlbnQuc2VsZWN0QWxsKCcudG1wJykubm9kZXMoKS5tYXAoeCA9PiB4LmdldEJCb3goKSk7XG4gICAgdmFyIHdpZHRoID0gZDMubWF4KHoubWFwKHggPT4geC53aWR0aCkpO1xuICAgIHZhciBtYXJnaW4gPSAyMDtcbiAgICB3aWR0aCA9IE1hdGgucm91bmQod2lkdGggKyAyICogbWFyZ2luKTtcbiAgICB2YXIgaGVpZ2h0ID0gTWF0aC5yb3VuZChkMy5tYXgoei5tYXAoeCA9PiB4LmhlaWdodCArIG1hcmdpbiAqIDIpKSk7XG4gICAgdmFyIHggPSAxMCxcbiAgICAgIHkgPSA1NTtcblxuICAgIHRoaXMuU1ZHUGFyZW50LnNlbGVjdEFsbCgnLnRtcCcpLnJlbW92ZSgpO1xuXG4gICAgdmFyIGFsZXJ0cyA9IHRoaXMuU1ZHUGFyZW50LnNlbGVjdCgnZy5mcmFuY3ktYWxlcnRzJyk7XG5cbiAgICAvLyBjaGVjayBpZiB0aGUgd2luZG93IGlzIGFscmVhZHkgcHJlc2VudFxuICAgIGlmICghYWxlcnRzLm5vZGUoKSkge1xuICAgICAgYWxlcnRzID0gdGhpcy5TVkdQYXJlbnQuYXBwZW5kKCdnJykuYXR0cignY2xhc3MnLCAnZnJhbmN5LWFsZXJ0cycpO1xuICAgIH1cblxuICAgIGFsZXJ0cyA9IGFsZXJ0cy5zZWxlY3RBbGwoJ2cuZnJhbmN5LWFsZXJ0JykuZGF0YShPYmplY3Qua2V5cyhtZXNzYWdlcykpO1xuXG4gICAgYWxlcnRzLmV4aXQoKS5yZW1vdmUoKTtcblxuICAgIGFsZXJ0cyA9IGFsZXJ0cy5lbnRlcigpXG4gICAgICAuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdmcmFuY3ktYWxlcnQnKVxuICAgICAgLmF0dHIoJ2lkJywgZCA9PiBkKTtcblxuICAgIGFsZXJ0cy5hcHBlbmQoJ3JlY3QnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgZCA9PiBgZnJhbmN5LWFsZXJ0IGFsZXJ0LSR7bWVzc2FnZXNbZF0udHlwZX1gKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsIChkLCBpKSA9PiBgdHJhbnNsYXRlKCR7eH0sJHt5ICsgaSAqIChoZWlnaHQgKyA1KX0pYClcbiAgICAgIC5hdHRyKCdyeCcsIFwiNVwiKS5hdHRyKCdyeScsIFwiNVwiKVxuICAgICAgLmF0dHIoJ3dpZHRoJywgd2lkdGgpLmF0dHIoJ2hlaWdodCcsIGhlaWdodCk7XG5cbiAgICBhbGVydHMuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT4gYHRyYW5zbGF0ZSgke3ggKyBtYXJnaW59LCR7eSArIGkgKiAoaGVpZ2h0IC0gNSkgKyBtYXJnaW4gKiAyfSlgKVxuICAgICAgLnRleHQoZCA9PiBtZXNzYWdlc1tkXS50aXRsZSArIG1lc3NhZ2VzW2RdLnRleHQpLmNhbGwodGhpcy53cmFwKTtcblxuICAgIGFsZXJ0cy5tZXJnZShhbGVydHMpO1xuXG4gICAgYWxlcnRzLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkgeyBkMy5zZWxlY3QodGhpcykuc3R5bGUoJ2Rpc3BsYXknLCAnbm9uZScpOyB9KTtcbiAgfVxuXG4gIHdyYXAodGV4dCkge1xuICAgIHRleHQuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0ZXh0ID0gZDMuc2VsZWN0KHRoaXMpLFxuICAgICAgICB3b3JkcyA9IHRleHQudGV4dCgpLnNwbGl0KC9bXFxzXFxuXSsvKS5yZXZlcnNlKCksXG4gICAgICAgIHdvcmQsXG4gICAgICAgIGxpbmUgPSBbXSxcbiAgICAgICAgbGluZU51bWJlciA9IDAsXG4gICAgICAgIGxpbmVIZWlnaHQgPSAxLjEsXG4gICAgICAgIHkgPSB0ZXh0LmF0dHIoXCJ5XCIpLFxuICAgICAgICBkeSA9IDAsXG4gICAgICAgIHRzcGFuID0gdGV4dC50ZXh0KG51bGwpLmFwcGVuZChcInRzcGFuXCIpLmF0dHIoXCJ4XCIsIDApLmF0dHIoXCJ5XCIsIHkpLmF0dHIoXCJkeVwiLCBkeSArIFwiZW1cIik7XG4gICAgICB3b3JkID0gd29yZHMucG9wKCk7XG4gICAgICB3aGlsZSAod29yZCkge1xuICAgICAgICBsaW5lLnB1c2god29yZCk7XG4gICAgICAgIHRzcGFuLnRleHQobGluZS5qb2luKFwiIFwiKSk7XG4gICAgICAgIGlmICh0c3Bhbi5ub2RlKCkuZ2V0Q29tcHV0ZWRUZXh0TGVuZ3RoKCkgPiAzMDApIHtcbiAgICAgICAgICBsaW5lLnBvcCgpO1xuICAgICAgICAgIHRzcGFuLnRleHQobGluZS5qb2luKFwiIFwiKSk7XG4gICAgICAgICAgbGluZSA9IFt3b3JkXTtcbiAgICAgICAgICB0c3BhbiA9IHRleHQuYXBwZW5kKFwidHNwYW5cIikuYXR0cihcInhcIiwgMCkuYXR0cihcInlcIiwgeSkuYXR0cihcImR5XCIsICsrbGluZU51bWJlciAqIGxpbmVIZWlnaHQgKyBkeSArIFwiZW1cIikudGV4dCh3b3JkKTtcbiAgICAgICAgfVxuICAgICAgICB3b3JkID0gd29yZHMucG9wKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1bnJlbmRlcigpIHt9XG59XG4iLCJpbXBvcnQgUmVuZGVyZXIgZnJvbSAnLi9yZW5kZXJlcic7XG5cbi8qIGdsb2JhbCBkMyBKdXB5dGVyICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlcXVpcmVkQXJnc01vZGFsIGV4dGVuZHMgUmVuZGVyZXIge1xuXG4gIGNvbnN0cnVjdG9yKHsgdmVyYm9zZSA9IGZhbHNlLCBhcHBlbmRUbywgY2FsbGJhY2tIYW5kbGVyIH0pIHtcbiAgICBzdXBlcih7IHZlcmJvc2U6IHZlcmJvc2UsIGFwcGVuZFRvOiBhcHBlbmRUbywgY2FsbGJhY2tIYW5kbGVyOiBjYWxsYmFja0hhbmRsZXIgfSk7XG4gIH1cblxuICByZW5kZXIoanNvbikge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciBtb2RhbElkID0ganNvbi5jYWxsYmFjay5pZDtcblxuICAgIHRoaXMubG9nZ2VyLmRlYnVnKGBDcmVhdGluZyBDYWxsYmFjayBNb2RhbCBbJHttb2RhbElkfV0uLi5gKTtcblxuICAgIC8vIHdlIHdhbnQgdG8gb3ZlcmxheSBldmVyeXRoaW5nLCBoZW5jZSAnYm9keScgbXVzdCBiZSB1c2VkXG4gICAgdmFyIG92ZXJsYXkgPSBkMy5zZWxlY3QoJ2JvZHknKS5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0cignY2xhc3MnLCAnZnJhbmN5LW92ZXJsYXknKTtcbiAgICB2YXIgaG9sZGVyID0gZDMuc2VsZWN0KCdib2R5JykuYXBwZW5kKCdkaXYnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ZyYW5jeScpO1xuICAgIHZhciBtb2RhbCA9IGhvbGRlci5hcHBlbmQoJ2RpdicpXG4gICAgICAuYXR0cignaWQnLCBtb2RhbElkKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ2ZyYW5jeS1tb2RhbCcpO1xuXG4gICAgdmFyIGZvcm0gPSBtb2RhbC5hcHBlbmQoJ2Zvcm0nKTtcblxuICAgIHZhciBoZWFkZXIgPSBmb3JtLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnZnJhbmN5LW1vZGFsLWhlYWRlcicpO1xuXG4gICAgdmFyIGhlYWRlclRpdGxlID0gaGVhZGVyLmFwcGVuZCgnc3BhbicpLmh0bWwoJ1JlcXVpcmVkIGFyZ3VtZW50cyZuYnNwOycpO1xuICAgIGlmIChqc29uLnRpdGxlKSB7XG4gICAgICBoZWFkZXJUaXRsZS5hcHBlbmQoJ3NwYW4nKS5hdHRyKCdzdHlsZScsICdmb250LXdlaWdodDogYm9sZDsnKS50ZXh0KGBmb3IgJHtqc29uLnRpdGxlfWApO1xuICAgIH1cblxuICAgIHZhciBjb250ZW50ID0gZm9ybS5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ2ZyYW5jeS1tb2RhbC1jb250ZW50JykuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICdmcmFuY3ktdGFibGUnKS5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ2ZyYW5jeS10YWJsZS1ib2R5Jyk7XG5cbiAgICBmb3IgKHZhciBhcmcgb2YgT2JqZWN0LnZhbHVlcyhqc29uLmNhbGxiYWNrLnJlcXVpcmVkQXJncykpIHtcbiAgICAgIHZhciByb3cgPSBjb250ZW50LmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnZnJhbmN5LXRhYmxlLXJvdycpO1xuICAgICAgcm93LmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnZnJhbmN5LXRhYmxlLWNlbGwnKS5hcHBlbmQoJ2xhYmVsJykuYXR0cignZm9yJywgYXJnLmlkKS50ZXh0KGFyZy50aXRsZSk7XG4gICAgICB2YXIgaW5wdXQgPSByb3cuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICdmcmFuY3ktdGFibGUtY2VsbCcpLmFwcGVuZCgnaW5wdXQnKS5hdHRyKCdpZCcsIGFyZy5pZCkuYXR0cignY2xhc3MnLCAnZnJhbmN5LWFyZycpXG4gICAgICAgIC5hdHRyKCdyZXF1aXJlZCcsICcnKVxuICAgICAgICAuYXR0cignbmFtZScsIGFyZy5pZClcbiAgICAgICAgLmF0dHIoJ3R5cGUnLCBhcmcudHlwZSlcbiAgICAgICAgLmF0dHIoJ3ZhbHVlJywgYXJnLnZhbHVlKVxuICAgICAgICAub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCkgeyBqc29uLmNhbGxiYWNrLnJlcXVpcmVkQXJnc1t0aGlzLmlkXS52YWx1ZSA9IHRoaXMudmFsdWU7IH0pXG4gICAgICAgIC5vbignaW5wdXQnLCB0aGlzLm9uY2hhbmdlKVxuICAgICAgICAub24oJ2tleXVwJywgdGhpcy5vbmNoYW5nZSlcbiAgICAgICAgLm9uKCdwYXN0ZScsIHRoaXMub25jaGFuZ2UpO1xuICAgICAgLy8gd2FpdCwgaWYgaXQgaXMgYm9vbGVhbiB3ZSBjcmVhdGUgYSBjaGVja2JveFxuICAgICAgaWYgKGFyZy50eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgLy8gd2VsbCwgYSBjaGVja2JveCB3b3JrcyB0aGlzIHdheSBzbyB3ZSBuZWVkIHRvIGluaXRpYWxpemUgXG4gICAgICAgIC8vIHRoZSB2YWx1ZSB0byBmYWxzZSBhbmQgdXBkYXRlIHRoZSB2YWx1ZSBiYXNlZCBvbiB0aGUgY2hlY2tlZCBcbiAgICAgICAgLy8gcHJvcGVydHkgdGhhdCB0cmlnZ2VycyB0aGUgb25jaGFuZ2UgZXZlbnRcbiAgICAgICAgYXJnLnZhbHVlID0gYXJnLnZhbHVlIHx8IGZhbHNlO1xuICAgICAgICBpbnB1dC5hdHRyKCd0eXBlJywgJ2NoZWNrYm94JykuYXR0cigncmVxdWlyZWQnLCBudWxsKVxuICAgICAgICAgIC5hdHRyKCd2YWx1ZScsIGFyZy52YWx1ZSlcbiAgICAgICAgICAub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCkgeyBqc29uLmNhbGxiYWNrLnJlcXVpcmVkQXJnc1t0aGlzLmlkXS52YWx1ZSA9IHRoaXMudmFsdWUgPSB0aGlzLmNoZWNrZWQ7IH0pO1xuICAgICAgfVxuICAgICAgcm93LmFwcGVuZCgnc3BhbicpLmF0dHIoJ2NsYXNzJywgJ3ZhbGlkaXR5Jyk7XG4gICAgfVxuXG4gICAgdmFyIGZvb3RlciA9IGZvcm0uYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICdmcmFuY3ktbW9kYWwtZm9vdGVyJyk7XG5cbiAgICBmb290ZXIuYXBwZW5kKCdidXR0b24nKS50ZXh0KCdPaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGZvcm0ubm9kZSgpLmNoZWNrVmFsaWRpdHkoKSkge1xuICAgICAgICBzZWxmLm9wdGlvbnMuY2FsbGJhY2tIYW5kbGVyKGpzb24uY2FsbGJhY2spO1xuICAgICAgICBvdmVybGF5LnJlbW92ZSgpO1xuICAgICAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICAgICAgaG9sZGVyLnJlbW92ZSgpO1xuICAgICAgfVxuICAgICAgZDMuZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgICBmb290ZXIuYXBwZW5kKCdidXR0b24nKS50ZXh0KCdDYW5jZWwnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIG92ZXJsYXkucmVtb3ZlKCk7XG4gICAgICBtb2RhbC5yZW1vdmUoKTtcbiAgICAgIGhvbGRlci5yZW1vdmUoKTtcbiAgICAgIGQzLmV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAvLyBkaXNhYmxlIGtleWJvYXJkIHNob3J0Y3V0cyB3aGVuIHVzaW5nIHRoaXMgbW9kYWwgaW4gSnVweXRlclxuICAgIHRyeSB7XG4gICAgICBKdXB5dGVyLmtleWJvYXJkX21hbmFnZXIucmVnaXN0ZXJfZXZlbnRzKCcuZnJhbmN5Jyk7XG4gICAgICBKdXB5dGVyLmtleWJvYXJkX21hbmFnZXIucmVnaXN0ZXJfZXZlbnRzKCcuZnJhbmN5LWFyZycpO1xuICAgICAgSnVweXRlci5rZXlib2FyZF9tYW5hZ2VyLnJlZ2lzdGVyX2V2ZW50cygnLmZyYW5jeS1vdmVybGF5Jyk7XG4gICAgICBKdXB5dGVyLmtleWJvYXJkX21hbmFnZXIucmVnaXN0ZXJfZXZlbnRzKCcuZnJhbmN5LW1vZGFsJyk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICBpZiAoZS5uYW1lID09ICdSZWZlcmVuY2VFcnJvcicpIHtcbiAgICAgICAgc2VsZi5sb2dnZXIuZGVidWcoJ0l0IHNlZW1zIHdlXFwncmUgbm90IHJ1bm5pbmcgb24gSnVweXRlci4uLicsIGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnRlbnQuc2VsZWN0QWxsKCcuZnJhbmN5LWFyZycpLm5vZGUoKS5mb2N1cygpO1xuXG4gICAgdGhpcy5sb2dnZXIuZGVidWcoYENhbGxiYWNrIE1vZGFsIHVwZGF0ZWQgWyR7bW9kYWxJZH1dLi4uYCk7XG5cbiAgICByZXR1cm4gbW9kYWw7XG4gIH1cblxuICB1bnJlbmRlcigpIHt9XG59XG4iLCJpbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuXG4vKiBnbG9iYWwgZDMgKi9cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyZXIgZXh0ZW5kcyBCYXNlIHtcblxuICBjb25zdHJ1Y3Rvcih7IHZlcmJvc2UgPSBmYWxzZSwgYXBwZW5kVG8sIGNhbGxiYWNrSGFuZGxlciB9KSB7XG4gICAgc3VwZXIoeyB2ZXJib3NlOiB2ZXJib3NlLCBhcHBlbmRUbzogYXBwZW5kVG8sIGNhbGxiYWNrSGFuZGxlcjogY2FsbGJhY2tIYW5kbGVyIH0pO1xuICAgIGlmIChuZXcudGFyZ2V0ID09PSBSZW5kZXJlcikge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnN0cnVjdCBbUmVuZGVyZXJdIGluc3RhbmNlcyBkaXJlY3RseSEnKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucmVuZGVyID09PSB1bmRlZmluZWQgfHwgdHlwZW9mIHRoaXMucmVuZGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdNdXN0IG92ZXJyaWRlIFtyZW5kZXIoanNvbildIG1ldGhvZCEnKTtcbiAgICB9XG4gICAgaWYgKHRoaXMudW5yZW5kZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5sb2dnZXIuZGVidWcoJ05vIFt1bnJlbmRlcigpXSBtZXRob2Qgc3BlY2lmaWVkLi4uJyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IEhUTUxQYXJlbnQoKSB7XG4gICAgcmV0dXJuIGQzLnNlbGVjdCh0aGlzLm9wdGlvbnMuYXBwZW5kVG8ubm9kZSgpLnBhcmVudE5vZGUpO1xuICB9XG5cbiAgZ2V0IFNWR1BhcmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmFwcGVuZFRvO1xuICB9XG5cbn1cbiIsImltcG9ydCBSZW5kZXJlciBmcm9tICcuL3JlbmRlcmVyJztcblxuLyogZ2xvYmFsIGQzICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvb2x0aXAgZXh0ZW5kcyBSZW5kZXJlciB7XG5cbiAgY29uc3RydWN0b3IoeyB2ZXJib3NlID0gZmFsc2UsIGFwcGVuZFRvLCBjYWxsYmFja0hhbmRsZXIgfSkge1xuICAgIHN1cGVyKHsgdmVyYm9zZTogdmVyYm9zZSwgYXBwZW5kVG86IGFwcGVuZFRvLCBjYWxsYmFja0hhbmRsZXI6IGNhbGxiYWNrSGFuZGxlciB9KTtcbiAgICB0aGlzLnRvb2x0aXAgPSB0aGlzLlNWR1BhcmVudC5zZWxlY3QoJ2ZvcmVpZ25PYmplY3QuZnJhbmN5LXRvb2x0aXAtaG9sZGVyJyk7XG4gICAgLy8gY2hlY2sgaWYgdGhlIHdpbmRvdyBpcyBhbHJlYWR5IHByZXNlbnRcbiAgICBpZiAoIXRoaXMudG9vbHRpcC5ub2RlKCkpIHtcbiAgICAgIHRoaXMudG9vbHRpcCA9IHRoaXMuU1ZHUGFyZW50LmFwcGVuZCgnZm9yZWlnbk9iamVjdCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdmcmFuY3ktdG9vbHRpcC1ob2xkZXInKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIob2JqZWN0KSB7XG5cbiAgICAvLyBqdXN0IGlnbm9yZSByZW5kZXJpbmcgaWYgbm8gbWVzc2FnZXMgYXJlIHByZXNlbnRcbiAgICBpZiAoIW9iamVjdCB8fCAhT2JqZWN0LnZhbHVlcyhvYmplY3QpLmxlbmd0aCkge1xuICAgICAgLy90aGlzLmxvZ2dlci5kZWJ1ZygnTm90aGluZyB0byByZW5kZXIgaGVyZS4uLiBjb250aW51aW5nLi4uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVE9ETyBmaXggYWx3YXlzIHZpc2libGUgdG9vbHRpcCwgZmluZSB1bnRpbCBzb21lb25lIGNvbXBsYWlucyBhYm91dCA6UFxuICAgIHRoaXMudG9vbHRpcC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7ZDMuZXZlbnQub2Zmc2V0WCArIDV9LCR7ZDMuZXZlbnQub2Zmc2V0WSArIDV9KWApO1xuXG4gICAgLy8gY2hlY2sgaWYgaXQgZXhpc3RzIGFscmVhZHlcbiAgICBpZiAodGhpcy50b29sdGlwLnNlbGVjdEFsbCgnKicpLm5vZGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciB0YWJsZSA9IHRoaXMudG9vbHRpcC5hcHBlbmQoJ3hodG1sOmRpdicpLmF0dHIoJ2NsYXNzJywgJ2ZyYW5jeS10b29sdGlwJylcbiAgICAgIC5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ2ZyYW5jeS10YWJsZScpXG4gICAgICAuYXBwZW5kKCdkaXYnKS5hdHRyKCdjbGFzcycsICdmcmFuY3ktdGFibGUtYm9keScpO1xuICAgIE9iamVjdC5rZXlzKG9iamVjdCkubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIHJvdyA9IHRhYmxlLmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnZnJhbmN5LXRhYmxlLXJvdycpO1xuICAgICAgcm93LmFwcGVuZCgnZGl2JykuYXR0cignY2xhc3MnLCAnZnJhbmN5LXRhYmxlLWNlbGwnKS50ZXh0KG9iamVjdFtrZXldLnRpdGxlKTtcbiAgICAgIHJvdy5hcHBlbmQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ2ZyYW5jeS10YWJsZS1jZWxsJykudGV4dChvYmplY3Rba2V5XS50ZXh0KTtcbiAgICB9KTtcblxuICAgIC8vIHNob3cgdG9vbHRpcFxuICAgIHRoaXMudG9vbHRpcC5zdHlsZSgnZGlzcGxheScsICdibG9jaycpLmF0dHIoJ3dpZHRoJywgJzEwMCUnKS5hdHRyKCdoZWlnaHQnLCAnNTAwcHgnKTtcbiAgfVxuXG4gIHVucmVuZGVyKCkge1xuICAgIHRoaXMudG9vbHRpcC5zZWxlY3RBbGwoJyonKS5yZW1vdmUoKTtcbiAgICB0aGlzLnRvb2x0aXAuc3R5bGUoJ2Rpc3BsYXknLCBudWxsKTtcbiAgfVxufVxuIiwiLyoqXG4gKiBUaGlzIGNsYXNzIGNvbnRhaW5zIG1ldGhvZHMgdG8gZGVhbCB3aXRoIEpTT04uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEpzb25VdGlscyB7XG5cbiAgLyoqXG4gICAqIFBhcnNlcyBhbiBpbnB1dCBuZCBjaGVja3Mgd2hldGhlciB0aGlzIGlucHV0IGlzIHZhbGlkIGFuZCByZXR1cm5zIGEgSlNPTiBvYmplY3QuXG4gICAqIEBwYXJhbSBpbnB1dCAtIHRoZSBpbnB1dCB0byBwYXJzZVxuICAgKiBAcmV0dXJucyB7anNvbn0gLSBpZiB0aGUgaW5wdXQgaXMgYSB2YWxpZCBKU09OIG9iamVjdCwgb3RoZXJ3aXNlIHJldHVybnMge3VuZGVmaW5lZH1cbiAgICovXG4gIHN0YXRpYyBwYXJzZShpbnB1dCkge1xuICAgIGlucHV0ID0gdHlwZW9mIGlucHV0ICE9PSBcInN0cmluZ1wiID8gSlNPTi5zdHJpbmdpZnkoaW5wdXQpIDogaW5wdXQ7XG4gICAgaW5wdXQgPSBpbnB1dC5yZXBsYWNlKC9bXFxuXFxyXFxiXFxcXF0rfChnYXA+KS9nLCAnJyk7XG4gICAgbGV0IGpzb25SZWdleCA9IC97KD86W15dKSp9L2c7XG4gICAgbGV0IG1hdGNoID0ganNvblJlZ2V4LmV4ZWMoaW5wdXQpO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgaW5wdXQgPSBtYXRjaFswXTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBqc29uID0gSlNPTi5wYXJzZShpbnB1dCk7XG4gICAgICAgIHJldHVybiBqc29uLm1pbWUgPT09ICdhcHBsaWNhdGlvbi92bmQuZnJhbmN5K2pzb24nID8ganNvbiA6IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby1jb25zb2xlICovXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cbiIsImxldCBzaW5nbGV0b24gPSBudWxsO1xuXG4vKipcbiAqIFRoaXMgY2xhc3MgaXMgYSBzaW5nbGV0b24gdGhhdCBwcm92aWRlcyBhIGxvZ2dlciBmb3IgdGhlIEZyYW5jeSBhcHBsaWNhdGlvbi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nZ2VyIHtcblxuICAvKipcbiAgICogU2luZ2xldG9uOiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBsb2dnZXIgYW5kIHdpbGwgcmV0dXJuZWQgdGhhdCBpbnN0YW5jZSxcbiAgICogZXZlcnl0aW1lIGEgbmV3IGluc3RhbmNlIGlzIHJlcXVlc3RlZC5cbiAgICogQHBhcmFtIHZlcmJvc2UgcHJpbnRzIGV4dHJhIGxvZyBpbmZvcm1hdGlvbiB0byBjb25zb2xlLmxvZywgZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgY29uc3RydWN0b3IoeyB2ZXJib3NlID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgaWYgKCFzaW5nbGV0b24pIHtcbiAgICAgIHRoaXMudmVyYm9zZSA9IHZlcmJvc2U7XG4gICAgICB0aGlzLmNvbnNvbGUgPSBjb25zb2xlO1xuICAgICAgc2luZ2xldG9uID0gdGhpcztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gc2luZ2xldG9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgW0RFQlVHXSBlbnRyeSBpbiB0aGUgY29uc29sZSBsb2dcbiAgICogQHBhcmFtIG1lc3NhZ2UgdGhlIG1lc3NhZ2UgdG8gcHJpbnRcbiAgICovXG4gIGRlYnVnKG1lc3NhZ2UpIHtcbiAgICBpZiAodGhpcy52ZXJib3NlKSB7XG4gICAgICB0aGlzLmNvbnNvbGUuZGVidWcodGhpcy5fZm9ybWF0KCdERUJVRycsIG1lc3NhZ2UpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIFtJTkZPXSBlbnRyeSBpbiB0aGUgY29uc29sZSBsb2dcbiAgICogQHBhcmFtIG1lc3NhZ2UgdGhlIG1lc3NhZ2UgdG8gcHJpbnRcbiAgICovXG4gIGluZm8obWVzc2FnZSkge1xuICAgIHRoaXMuY29uc29sZS5pbmZvKHRoaXMuX2Zvcm1hdCgnSU5GTycsIG1lc3NhZ2UpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgW0VSUk9SXSBlbnRyeSBpbiB0aGUgY29uc29sZSBsb2dcbiAgICogQHBhcmFtIG1lc3NhZ2UgdGhlIG1lc3NhZ2UgdG8gcHJpbnRcbiAgICogQHBhcmFtIGVycm9yIHRoZSBlcnJvciBPYmplY3QgdG8gYXR0YWNoIHRvIHRoZSBtZXNzYWdlXG4gICAqL1xuICBlcnJvcihtZXNzYWdlLCBlcnJvcikge1xuICAgIHRoaXMuY29uc29sZS5lcnJvcih0aGlzLl9mb3JtYXQoJ0VSUk9SJywgbWVzc2FnZSksIGVycm9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgW1dBUk5dIGVudHJ5IGluIHRoZSBjb25zb2xlIGxvZ1xuICAgKiBAcGFyYW0gbWVzc2FnZSB0aGUgbWVzc2FnZSB0byBwcmludFxuICAgKiBAcGFyYW0gZXJyb3IgdGhlIGVycm9yIE9iamVjdCB0byBhdHRhY2ggdG8gdGhlIG1lc3NhZ2VcbiAgICovXG4gIHdhcm4obWVzc2FnZSwgZXJyb3IpIHtcbiAgICBlcnJvciA9IGVycm9yIHx8IHt9O1xuICAgIHRoaXMuY29uc29sZS5lcnJvcih0aGlzLl9mb3JtYXQoJ1dBUk4nLCBtZXNzYWdlKSwgZXJyb3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgYSBwcml2YXRlIG1ldGhvZCB0aGF0IGZvcm1hdHMgYWxsIGxvZyBtZXNzYWdlc1xuICAgKiBAcGFyYW0gbWVzc2FnZSB0aGUgbWVzc2FnZSB0byBwcmludFxuICAgKi9cbiAgX2Zvcm1hdChsZXZlbCwgbWVzc2FnZSkge1xuICAgIHJldHVybiBgWyR7bGV2ZWx9XSAtICR7bmV3IERhdGUoKS50b0lTT1N0cmluZygpfSAtICR7bWVzc2FnZX1gO1xuICB9XG59XG4iXX0=

//# sourceMappingURL=maps/francy.bundle.js.map
