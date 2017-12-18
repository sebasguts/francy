import Renderer from './renderer';

/* global d3 */

export default class Message extends Renderer {

  constructor({ verbose = false, appendTo, callbackHandler }) {
    super({ verbose: verbose, appendTo: appendTo, callbackHandler: callbackHandler });
  }

  render(messages) {

    // just ignore rendering if no messages are present
    if (!messages || !Object.values(messages).length) {
      //this.logger.debug('Nothing to render here... continuing...');
      return;
    }

    this.SVGParent.selectAll('.tmp')
      .data(Object.keys(messages))
      .enter().append('text')
      .attr('x', -1000)
      .attr('y', -1000)
      .attr('class', 'tmp')
      .text(d => messages[d].title + messages[d].text).call(this.wrap);

    var z = this.SVGParent.selectAll('.tmp').nodes().map(x => x.getBBox());
    var width = d3.max(z.map(x => x.width));
    var margin = 20;
    width = Math.round(width + 2 * margin);
    var height = Math.round(d3.max(z.map(x => x.height + margin * 2)));
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

    alerts = alerts.enter()
      .append('g')
      .attr('class', 'francy-alert')
      .attr('id', d => d);

    alerts.append('rect')
      .attr('class', d => `francy-alert alert-${messages[d].type}`)
      .attr('transform', (d, i) => `translate(${x},${y + i * (height + 5)})`)
      .attr('rx', "5").attr('ry', "5")
      .attr('width', width).attr('height', height);

    alerts.append('text')
      .attr('transform', (d, i) => `translate(${x + margin},${y + i * (height - 5) + margin * 2})`)
      .text(d => messages[d].title + messages[d].text).call(this.wrap);

    alerts.merge(alerts);

    alerts.on('click', function() { d3.select(this).style('display', 'none'); });
  }

  wrap(text) {
    text.each(function() {
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

  unrender() {}
}
