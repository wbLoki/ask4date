import { useMemo, useState } from "react";
import "./App.css";

function App() {
  const myName = "Wail";
  const [formData, setFormData] = useState({
    name: "",
    planType: "coffee",
    customPlan: "",
    freeDate: "",
  });
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");

  const planOptions = useMemo(
    () => [
      {
        value: "coffee",
        label: "Coffee date",
        description: "Keep it simple and cozy.",
      },
      {
        value: "activity",
        label: "Some activity",
        description: "Pick something fun to do together.",
      },
      {
        value: "dinner",
        label: "Dinner",
        description: "A full-on romantic evening.",
      },
      {
        value: "other",
        label: "Something else",
        description: "Surprise me with your idea.",
      },
    ],
    []
  );

  const requiresCustomPlan =
    formData.planType === "activity" || formData.planType === "other";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
      ...(name === "planType" &&
      value !== "activity" &&
      value !== "other"
        ? { customPlan: "" }
        : {}),
    }));

    if (error) {
      setError("");
    }
  };

  const getPlanLabel = () => {
    const selected = planOptions.find(
      (option) => option.value === formData.planType
    );

    return selected ? selected.label : "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Please add your name first.");
      return;
    }

    if (!formData.freeDate) {
      setError("Please choose a date that works for you.");
      return;
    }

    if (requiresCustomPlan && !formData.customPlan.trim()) {
      setError("Please tell me what activity or plan you have in mind.");
      return;
    }

    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/send-date-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          planType: formData.planType,
          planLabel: getPlanLabel(),
          customPlan: formData.customPlan.trim(),
          freeDate: formData.freeDate,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Something went wrong.");
      }

      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError.message ||
          "The invite could not be sent right now. Please try again."
      );
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="App">
      <header className="App-header">
        <main className="card">
          <div className="gif-container">
            <img
              src="https://media.giphy.com/media/QvvFkKfqwq82NniaIW/giphy.gif"
              alt="Cute animated illustration"
            />
          </div>
          {status === "success" ? (
            <section className="text-space success-panel">
              <p className="eyebrow">Message sent</p>
              <h1>
                Thanks, {formData.name || "cutie"}.
              </h1>
              <p>
                {myName} got your idea and the day you are free. Time to make
                it happen.
              </p>
            </section>
          ) : (
            <form className="text-space form-card" onSubmit={handleSubmit}>
              <p className="eyebrow">Date invite</p>
              <h1>{myName} wants to plan something cute with you.</h1>
              <p className="intro-copy">
                Pick the kind of date you want, add any details, and tell us a
                day that works for you.
              </p>

              <label className="field">
                <span>Your name</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Type your name"
                  value={formData.name}
                  spellCheck="false"
                  onChange={handleChange}
                />
              </label>

              <fieldset className="field fieldset">
                <legend>What sounds best?</legend>
                <div className="options-grid">
                  {planOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`option-card${
                        formData.planType === option.value ? " selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="planType"
                        value={option.value}
                        checked={formData.planType === option.value}
                        onChange={handleChange}
                      />
                      <span className="option-title">{option.label}</span>
                      <span className="option-description">
                        {option.description}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {requiresCustomPlan ? (
                <label className="field">
                  <span>
                    {formData.planType === "activity"
                      ? "What activity do you want to do?"
                      : "Tell us what you have in mind"}
                  </span>
                  <input
                    type="text"
                    name="customPlan"
                    placeholder={
                      formData.planType === "activity"
                        ? "Mini golf, pottery, bowling..."
                        : "Share your idea"
                    }
                    value={formData.customPlan}
                    onChange={handleChange}
                  />
                </label>
              ) : null}

              <label className="field">
                <span>When are you free?</span>
                <input
                  type="date"
                  name="freeDate"
                  min={today}
                  value={formData.freeDate}
                  onChange={handleChange}
                />
              </label>

              {error ? <p className="message error">{error}</p> : null}
              {status === "error" && !error ? (
                <p className="message error">
                  The invite could not be sent right now. Please try again.
                </p>
              ) : null}

              <button className="btn submit-btn" type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Sending..." : "Send date details"}
              </button>
            </form>
          )}
        </main>
      </header>
    </div>
  );
}

export default App;
