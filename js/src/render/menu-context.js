import Menu from './menu';
import Callback from './callback';

/* global d3 */

export default class ContextMenu extends Menu {

  constructor({ verbose = false, appendTo, callbackHandler }) {
    super({ verbose: verbose, appendTo: appendTo, callbackHandler: callbackHandler });
  }

  render(object) {

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

    this.SVGParent.selectAll('.tmp')
      .data(menus).enter()
      .append('text')
      .text(d => d.title)
      .attr('x', -1000)
      .attr('y', -1000)
      .attr('class', 'tmp');
    var z = this.SVGParent.selectAll('.tmp').nodes().map(x => x.getBBox());
    var width = d3.max(z.map(x => x.width));
    var margin = 5;
    width = Math.round(width + 2 * margin);
    var height = Math.round(d3.max(z.map(x => x.height + margin * 2)));
    var pos = d3.mouse(this.SVGParent.node());
    var x = pos[0] + 5,
      y = pos[1] + 5;

    this.SVGParent.selectAll('.tmp').remove();

    contextMenu.append('rect')
      .attr('transform', `translate(${x},${y})`)
      .attr('width', width).attr('height', height * menus.length)
      .attr('class', 'francy-menu-border');

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
      .attr('transform', (d, i) => `translate(${x + margin},${y + i * height + margin * 3})`)
      .text(d => d.title).attr('id', d => d.id);

    contextMenu.selectAll('g.francy-menu-entry').on('click', d => new Callback(this.options).execute(d));

    this.SVGParent.on('click', () => contextMenu.remove());

    return contextMenu;
  }

  unrender() {}

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
