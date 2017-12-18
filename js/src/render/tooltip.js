import Renderer from './renderer';

/* global d3 */

export default class Tooltip extends Renderer {

  constructor({ verbose = false, appendTo, callbackHandler }) {
    super({ verbose: verbose, appendTo: appendTo, callbackHandler: callbackHandler });
    this.tooltip = this.SVGParent.select('foreignObject.francy-tooltip-holder');
    // check if the window is already present
    if (!this.tooltip.node()) {
      this.tooltip = this.SVGParent.append('foreignObject')
        .attr('class', 'francy-tooltip-holder');
    }
  }

  render(object) {

    // just ignore rendering if no messages are present
    if (!object || !Object.values(object).length) {
      //this.logger.debug('Nothing to render here... continuing...');
      return;
    }

    // TODO fix always visible tooltip, fine until someone complains about :P
    this.tooltip.attr('transform', `translate(${d3.event.offsetX + 5},${d3.event.offsetY + 5})`);

    // check if it exists already
    if (this.tooltip.selectAll('*').node()) {
      return;
    }

    var table = this.tooltip.append('xhtml:div').attr('class', 'francy-tooltip')
      .append('div').attr('class', 'francy-table')
      .append('div').attr('class', 'francy-table-body');
    Object.keys(object).map(function(key) {
      var row = table.append('div').attr('class', 'francy-table-row');
      row.append('div').attr('class', 'francy-table-cell').text(object[key].title);
      row.append('div').attr('class', 'francy-table-cell').text(object[key].text);
    });

    // show tooltip
    this.tooltip.style('display', 'block').attr('width', '100%').attr('height', '500px');
  }

  unrender() {
    this.tooltip.selectAll('*').remove();
    this.tooltip.style('display', null);
  }
}
