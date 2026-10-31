"use client";
import { useState } from "react";

const cities = ["London","Manchester","Berlin","Paris","Amsterdam","Bristol","Glasgow","Dublin","Birmingham","Leeds","Brighton","Barcelona"];
const genres = ["Electronic","Techno","House","Hip-hop","Jazz","Folk","Indie","Drum & Bass","Funk","Brazilian Funk"];

export default function SearchRow() {
  const [city, setCity] = useState<string[]>([]);
  const [genre, setGenre] = useState<string[]>([]);
  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  return (
    <>
      <div className="search-row">
        <input className="search" placeholder="Search people, venues, promoters..." aria-label="Search network" />
        <details className="filter-chip">
          <summary>City</summary>
          <div>
            {cities.map(c => (
              <label key={c} style={{ display: "block", padding: 6, fontSize: 13 }}>
                <input type="checkbox" checked={city.includes(c)} onChange={() => toggle(city, setCity, c)} /> {c}
              </label>
            ))}
          </div>
        </details>
        <details className="filter-chip">
          <summary>Genre</summary>
          <div>
            {genres.map(g => (
              <label key={g} style={{ display: "block", padding: 6, fontSize: 13 }}>
                <input type="checkbox" checked={genre.includes(g)} onChange={() => toggle(genre, setGenre, g)} /> {g}
              </label>
            ))}
          </div>
        </details>
        <button className="filter-chip" aria-label="View settings">Settings</button>
      </div>
      {(city.length + genre.length) > 0 && (
        <div className="active-pills">
          {city.map(c => <span key={c} className="pill">City: {c} <button onClick={() => toggle(city, setCity, c)}>x</button></span>)}
          {genre.map(g => <span key={g} className="pill">Genre: {g} <button onClick={() => toggle(genre, setGenre, g)}>x</button></span>)}
          <button className="clear-all" onClick={() => { setCity([]); setGenre([]); }}>Clear all</button>
        </div>
      )}
    </>
  );
}
