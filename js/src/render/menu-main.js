import Menu from './menu';
import Callback from './callback';
//import AboutModal from './modal-about';

/* global d3, window */

export default class MainMenu extends Menu {

  constructor({ verbose = false, appendTo, callbackHandler }) {
    super({ verbose: verbose, appendTo: appendTo, callbackHandler: callbackHandler });
  }

  render(json) {

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

    this.SVGParent.selectAll('.tmp')
      .data(menus).enter()
      .append('text')
      .text(d => d.title)
      .attr('x', -1000)
      .attr('y', -1000)
      .attr('class', 'tmp');
    var z = this.SVGParent.selectAll('.tmp').nodes().map(x => x.getBBox());
    var width = d3.max(z.map(x => x.width));
    var margin = 10;
    width = Math.round(width + 2 * margin);
    var height = Math.round(d3.max(z.map(x => x.height + margin * 2)));
    var x = 5,
      y = 0;

    this.SVGParent.selectAll('.tmp').remove();

    menu.append('rect')
      .attr('transform', 'translate(0,0)')
      .attr('width', '100%').attr('height', height)
      .attr('class', 'francy-menu-border');
    menu.append('rect')
      .attr('transform', 'translate(0,0)')
      .attr('width', '100%').attr('height', height);

    menu.selectAll('g.francy-menu-entry')
      .data(menus).enter()
      .append('g').attr('class', 'francy-menu-entry')
      .attr('id', d => d.id)
      .on('mouseover', function(d) {
        if (d.menus && Object.values(d.menus).length) {
          self.buildMenu(d3.select(this), d);
        }
        else {
          d3.select(this).classed('francy-menu-entry-selected', true);
        }
      })
      .on('mouseout', function() {
        d3.select(this).classed('francy-menu-entry-selected', false);
      });

    menu.selectAll('g.francy-menu-entry').append('rect')
      .attr('transform', (d, i) => `translate(${x + i * width},${y})`)
      .attr('width', width).attr('height', height);

    menu.selectAll('g.francy-menu-entry').append('text')
      .attr('transform', (d, i) => `translate(${x + i * width + margin},${y + height / 1.7})`)
      .text(d => d.title);

    menu.selectAll('g.francy-menu-entry rect').on('click', d => {
      if (!d.menus || !Object.values(d.menus).length) {
        new Callback(this.options).execute(d);
      }
    });

    return menu;
  }

  unrender() {}

  buildMenu(parent, object) {

    var contextMenu = parent.select('g.francy-submenu');

    // check if the window is already present
    if (contextMenu.node()) {
      return;
    }

    contextMenu = parent.append('g').attr('class', 'francy-submenu');

    var menus = this.flatten(object.menus);

    this.SVGParent.selectAll('.tmp')
      .data(menus).enter()
      .append('text')
      .text(d => d.title)
      .attr('x', -1000)
      .attr('y', -1000)
      .attr('class', 'tmp');
    var z = this.SVGParent.selectAll('.tmp').nodes().map(x => x.getBBox());
    var width = d3.max(z.map(x => x.width));
    var margin = 10;
    width = Math.round(width + 2 * margin);
    var height = Math.round(d3.max(z.map(x => x.height + margin * 2)));
    var box = parent.select('rect').node().getBBox();
    width = width < box.width ? box.width : width;
    var pos = parent.select('rect').node().transform.baseVal.consolidate().matrix;
    var x = pos.e,
      y = pos.f + box.height + 1;

    this.SVGParent.selectAll('.tmp').remove();

    contextMenu.append('rect')
      .attr('transform', `translate(${x},${y})`)
      .attr('width', width).attr('height', height * menus.length)
      .attr('class', 'francy-menu-border');
    contextMenu.append('rect')
      .attr('transform', `translate(${x},${y})`)
      .attr('width', width).attr('height', height * menus.length);

    contextMenu.selectAll('g.francy-menu-entry')
      .data(menus).enter()
      .append('g').attr('class', 'francy-menu-entry')
      .on('mouseover', function() {
        d3.select(this).classed('francy-menu-entry-selected', true);
      })
      .on('mouseout', function() {
        d3.select(this).classed('francy-menu-entry-selected', false);
      });

    contextMenu.selectAll('g.francy-menu-entry').append('rect')
      .attr('transform', (d, i) => `translate(${x},${y + i * height})`)
      .attr('width', width).attr('height', height)
      .attr('id', d => d.id);

    contextMenu.selectAll('g.francy-menu-entry').append('text')
      .attr('transform', (d, i) => `translate(${x + margin},${y + (i * height + margin * 2)})`)
      .text(d => d.title).attr('id', d => d.id);

    contextMenu.selectAll('g.francy-menu-entry')
      .on('click', d => new Callback(this.options).execute(d));

    //contextMenu.append('rect')
    //.attr('transform', `translate(${x},${y})`)
    //.attr('width', width).attr('height', height * menus.length)
    //.style('visibility', 'hidden');
    //contextMenu.on('mouseover', function() { contextMenu.on('mouseout', () => contextMenu.remove()); });

    return contextMenu;
  }

  flatten(menus) {
    var self = this;
    return [].concat.apply([], Object.values(menus).map(menu => {
      if (menu.menus && Object.values(menu.menus).length > 0) {
        return self.flatten(menu.menus);
      }
      return menu;
    }));
  }

}
