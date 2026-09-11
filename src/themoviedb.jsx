const BASE = "https://api.tvmaze.com";

export const searchActors = async (name) => {
  const res = await fetch(
    `${BASE}/search/people?q=${encodeURIComponent(name)}`,
  );

  if (!res.ok) {
    throw new Error(`Actor search failed (${res.status})`);
  }

  const data = await res.json();

  return data.map(({ person }) => ({
    id: person.id,
    name: person.name,
    profile_path: person.image?.original ?? person.image?.medium ?? null,
    hometown: person.country?.name ?? "",
    birthdate: person.birthday ?? "",
    deathdate: person.deathday ?? "",
    nationality: person.country?.name ?? "",
    url: person.url,
  }));
};

export const getActorDetails = async (actor) => {
  const [creditsResponse, biographyResponse] = await Promise.all([
    fetch(`${BASE}/people/${actor.id}/castcredits?embed=show`),
    fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(actor.name.replaceAll(" ", "_"))}`,
    ),
  ]);

  if (!creditsResponse.ok) {
    throw new Error(`Actor details failed (${creditsResponse.status})`);
  }

  const credits = await creditsResponse.json();
  const biography = biographyResponse.ok
    ? await biographyResponse.json()
    : null;
  const movies = [
    ...new Map(
      credits
        .map((credit) => credit._embedded?.show)
        .filter(Boolean)
        .map((show) => [show.id, show.name]),
    ).values(),
  ];

  return {
    ...actor,
    bio: biography?.extract ?? "Biography unavailable for this actor.",
    movies,
  };
};
