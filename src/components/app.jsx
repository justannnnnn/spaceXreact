import { LaunchList } from "./launchList";
import { Map } from "./map";
import { useEffect, useState } from "react";
import { SpaceX } from "../api/spacex";

function App() {
  const [launches, setLaunches] = useState([]);
  const [launchpads, setLaunchpads] = useState([]);
  const [worldMap, setWorldMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const spaceX = new SpaceX();
    setLoading(true);

    // Загрузка данных как в старой версии
    spaceX.launchpads()
      .then(lp => {
        setLaunchpads(lp);
        return spaceX.launches();
      })
      .then(lch => {
        setLaunches(lch);
        return fetch("geo.json").then(r => r.json());
      })
      .then(world => {
        setWorldMap(world);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка загрузки данных:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div id="loader">Загрузка...</div>;
  if (error) return <div id="error">Ошибка: {error}</div>;

  return (
    <main className="main">
      <LaunchList launches={launches} launchpads={launchpads} />
      <Map launches={launches} launchpads={launchpads} worldMap={worldMap} />
    </main>
  );
}

export { App };
