import { useState } from "react";

const Statistics = ({ good, bad, neutral }) => {
  const sum = good + bad + neutral;
  if (sum > 0) {
    return (
      <>
        <p>good {good}</p>
        <p>neutral {neutral}</p>
        <p>bad {bad}</p>
        <p>average {(good - bad) / sum}</p>
        <p>positive {good / sum} %</p>
      </>
    );
  }
  return (
    <>
      <p>No feedback given</p>
    </>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h2>give feedback</h2>
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>
      <h2>statistics</h2>
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>
  );
};

export default App;
