import { useEffect, useRef } from "react";
import * as d3 from "d3";

function Map({ launchpads, worldMap }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!worldMap || !launchpads) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const g = svg.append("g");
    const projection = d3.geoMercator()
      .scale(140)
      .translate([width / 2, height / 1.4]);

    // Рисуем мир
    const geoPath = d3.geoPath().projection(projection);
    g.selectAll("path")
      .data(worldMap.features)
      .enter()
      .append("path")
      .attr("d", geoPath)
      .attr("fill", "#ddd")
      .attr("stroke", "#999");

    // Launchpads
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "rgba(0,0,0,0.7)")
      .style("color", "#fff")
      .style("padding", "5px 8px")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    g.selectAll(".pad-point")
      .data(launchpads)
      .enter()
      .append("circle")
      .attr("class", "pad-point")
      .attr("r", 5)
      .attr("data-id", d => d.id)
      .attr("transform", d => {
        const coords = projection([d.longitude, d.latitude]);
        return `translate(${coords[0]}, ${coords[1]})`;
      })
      .on("mouseover", function(event, d) {
        d3.selectAll(".pad-point").classed("highlight", false);
        d3.select(this).classed("highlight", true).raise();
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(d.name)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY + 10) + "px");
      })
      .on("mousemove", function(event) {
        tooltip
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY + 10) + "px");
      })
      .on("mouseout", function() {
        d3.selectAll(".pad-point").classed("highlight", false);
        tooltip.transition().duration(200).style("opacity", 0);
      });

    // Zoom
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", event => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);

  }, [launchpads, worldMap]);

  return <svg id="map" width="900" height="500" ref={svgRef}></svg>;
}

export { Map };
