import { useState } from "react";
import "./App.css";
import ActorDetail from "./ActorDetail";
import { getActorDetails, searchActors } from "./themoviedb";

function App() {
  const [query, setQuery] = useState("");
  const [actors, setActors] = useState([]);
  const [actor, setActor] = useState(null);
  const [error, setError] = useState("");
  const [actorLoading, setActorLoading] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setActor(null);
    setError("");

    try {
      setActors(await searchActors(query));
    } catch (searchError) {
      setActors([]);
      setError(searchError.message);
    }
  };

  const selectActor = async (selectedActor) => {
    setActor(selectedActor);
    setError("");
    setActorLoading(true);

    try {
      setActor(await getActorDetails(selectedActor));
    } catch (detailError) {
      setError(detailError.message);
    } finally {
      setActorLoading(false);
    }
  };

  return (
    <main>
      <header className="page-header">
        <h1>Actors</h1>
        <p>Search for an actor to see its details, movies, and hometown.</p>
      </header>

      <form className="search-form" onSubmit={search}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search an actor  …"
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="search-message error-message">{error}</p>}
      {!error && !actor && query && actors.length === 0 && (
        <p className="search-message">No actors found. Try another name.</p>
      )}

      {!actor && actors.length > 0 && (
        <ul className="actor-list">
          {actors.map((a) => (
            <li key={a.id}>
              <button onClick={() => selectActor(a)}>
                {a.profile_path && (
                  <img
                    className="badge"
                    src={a.profile_path}
                    alt={`${a.name} portrait`}
                  />
                )}
                {a.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {actor && (
        <ActorDetail
          actor={actor}
          loading={actorLoading}
          onBack={() => setActor(null)}
        />
      )}
    </main>
  );
}

export default App;
