import * as d3 from "d3";

function LaunchList({ launches, launchpads }) {

  const handleMouseOver = (launchId) => {
    d3.selectAll(".pad-point").classed("highlight", false);
    const pad = launchpads.find(p => p.id === launchId);
    if (pad) {
      d3.select(`.pad-point[data-id='${pad.id}']`)
        .classed("highlight", true)
        .raise();
    }
  };

  const handleMouseOut = () => {
    d3.selectAll(".pad-point").classed("highlight", false);
  };

  return (
    <aside className="aside" id="launchesContainer">
      <h3>Launches</h3>
      <div id="listContainer">
        <ul>
          {launches.map(launch => (
            <li
              key={launch.id}
              onMouseOver={() => handleMouseOver(launch.launchpad)}
              onMouseOut={handleMouseOut}
            >
              {launch.name}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export { LaunchList };