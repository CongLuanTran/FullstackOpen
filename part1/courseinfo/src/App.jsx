const Header = (props) => {
  return (
    <>
      <h1>{props.course}</h1>
    </>
  );
};

const Part = (props) => {
  return (
    <>
      <p>
        {props.part} {props.exercises}
      </p>
    </>
  );
};

const Content = (props) => {
  console.log(props.items);
  return (
    <div>
      {props.items.map((item) => {
        return (
          <Part key={item.part} part={item.part} exercises={item.exercises} />
        );
      })}
    </div>
  );
};

const Total = (props) => {
  const sum = props.items.reduce((acc, item) => {
    return acc + item.exercises;
  }, 0);
  return (
    <>
      <p>Number of exercises {sum}</p>
    </>
  );
};

const App = () => {
  const course = "Half Stack application development";
  const part1 = "Fundamentals of React";
  const exercises1 = 10;
  const part2 = "Using props to pass data";
  const exercises2 = 7;
  const part3 = "State of a component";
  const exercises3 = 14;
  const items = [
    { part: part1, exercises: exercises1 },
    { part: part2, exercises: exercises2 },
    { part: part3, exercises: exercises3 },
  ];

  return (
    <div>
      <Header course={course} />
      <Content items={items} />
      <Total items={items} />
    </div>
  );
};

export default App;
