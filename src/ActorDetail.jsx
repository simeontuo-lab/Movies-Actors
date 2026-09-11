const ActorDetail = ({ actor, loading, onBack }) => {
  return (
    <section className="actor-detail">
      <button className="back-button" onClick={onBack}>
        ← Back to results
      </button>

      {actor.profile_path && (
        <img className="banner" src={actor.profile_path} alt={actor.name} />
      )}

      <h2>{actor.name}</h2>
      <p className="actor-meta">
        {[actor.hometown, actor.birthdate && `born ${actor.birthdate}`]
          .filter(Boolean)
          .join(" · ")}
      </p>

      {loading && (
        <p className="detail-message">Loading biography and filmography…</p>
      )}

      {!loading && actor.bio && <p className="biography">{actor.bio}</p>}

      {!loading && actor.movies?.length > 0 && (
        <div className="movies">
          <h3>Filmography</h3>
          <ul className="movie-list">
            {actor.movies.map((movie) => (
              <li key={movie}>{movie}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default ActorDetail;
