"use client";
import { RadioShow } from "@/lib/radio";

export default function Schedule({ shows }: { shows: RadioShow[] }) {
  return (
    <div className="radio-schedule">
      <h2 className="radio-section-title">Schedule</h2>
      <div className="radio-schedule-list">
        {shows.map(show => (
          <div key={show.id} className="radio-show">
            <div className="radio-show-time">
              <div className="radio-show-day">{show.day}</div>
              <div className="radio-show-hour">{show.time}</div>
            </div>
            <div className="radio-show-info">
              <div className="radio-show-title">{show.title}</div>
              <div className="radio-show-host">{show.host}</div>
            </div>
            <div className="radio-show-genre">{show.genre}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
