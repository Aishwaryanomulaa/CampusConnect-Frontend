
import { useState, useEffect } from "react";
import API from "./api";
import "./App.css";

function App() {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  // Read events from backend
  function loadEvents() {
    API.get("/events")
      .then((response) => {
        setEvents(response.data);
      })
      .catch(() => {
        setMessage("Could not load events. Check the backend.");
      });
  }

  useEffect(() => {
    loadEvents();
  }, []);

  // Clear form
  function clearForm() {
    setEventName("");
    setDate("");
    setTime("");
    setVenue("");
    setDescription("");
    setAvailableSeats("");
    setEditId(null);
  }

  // Create or update event
  function saveEvent(e) {
    e.preventDefault();

    const event = {
      eventName: eventName,
      date: date,
      time: time,
      venue: venue,
      description: description,
      availableSeats: Number(availableSeats)
    };

    if (editId === null) {
      API.post("/events", event)
        .then(() => {
          setMessage("Event added successfully!");
          clearForm();
          loadEvents();
        })
        .catch(() => {
          setMessage("Could not add event. Check the backend.");
        });
    } else {
      API.put("/events/" + editId, event)
        .then(() => {
          setMessage("Event updated successfully!");
          clearForm();
          loadEvents();
        })
        .catch(() => {
          setMessage("Could not update event.");
        });
    }
  }

  // Load event details into form
  function editEvent(event) {
    setEditId(event.id);
    setEventName(event.eventName);
    setDate(event.date);
    setTime(event.time);
    setVenue(event.venue);
    setDescription(event.description);
    setAvailableSeats(String(event.availableSeats));
    window.scrollTo(0, 0);
  }

  // Delete event
  function deleteEvent(id) {
    if (window.confirm("Are you sure you want to delete this event?")) {
      API.delete("/events/" + id)
        .then(() => {
          setMessage("Event deleted successfully!");
          loadEvents();
        })
        .catch(() => {
          setMessage("Could not delete event.");
        });
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>CampusConnect</h1>
        <p>Campus Event Registration and Management System</p>
      </header>

      <main className="container">
        <section className="welcome">
          <h2>Discover Campus Events</h2>
          <p>Create, manage, and explore exciting college events.</p>
        </section>

        <section className="form-section">
          <h2>{editId === null ? "Add a New Event" : "Edit Event"}</h2>

          <form onSubmit={saveEvent}>
            <input
              type="text"
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
            />

            <textarea
              placeholder="Event Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Available Seats"
              min="1"
              value={availableSeats}
              onChange={(e) => setAvailableSeats(e.target.value)}
              required
            />

            <button type="submit">
              {editId === null ? "Add Event" : "Update Event"}
            </button>

            {editId !== null && (
              <button type="button" onClick={clearForm}>
                Cancel Edit
              </button>
            )}
          </form>

          {message && <p>{message}</p>}
        </section>

        <section className="events-section">
          <h2>Upcoming Events</h2>

          {events.length === 0 ? (
            <p className="empty">No events added yet. Add your first event!</p>
          ) : (
            <div className="event-grid">
              {events.map((event) => (
                <div className="event-card" key={event.id}>
                  <h3>{event.eventName}</h3>
                  <p><strong>Date:</strong> {event.date}</p>
                  <p><strong>Time:</strong> {event.time}</p>
                  <p><strong>Venue:</strong> {event.venue}</p>
                  <p>{event.description}</p>
                  <p>
                    <strong>Available Seats:</strong> {event.availableSeats}
                  </p>

                  <button onClick={() => editEvent(event)}>
                    Edit Event
                  </button>

                  {" "}

                  <button
                    className="delete-btn"
                    onClick={() => deleteEvent(event.id)}
                  >
                    Delete Event
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>CampusConnect | Campus Event Management</p>
      </footer>
    </div>
  );
}

export default App;
