import React from 'react';

const StartMenu = (props) => {

  const [selectedAnswer, setSelectedAnswer] = React.useState(null);

  const [num1, num2] = React.useState([
    Math.floor(Math.random() * 20) + 1, 
    Math.floor(Math.random() * 20) + 1
  ])[0]

  const [answers, setAnswers] = React.useState([
    num1 + num2 - 8 + Math.floor(Math.random() * 4), 
    num1 + num2 - 4 + Math.floor(Math.random() * 4), 
    num1 + num2 + 1 + Math.floor(Math.random() * 5)
  ])

  const correctIndex = React.useState(Math.floor(Math.random() * 4))[0]

  React.useEffect(() => {
    setAnswers((prev) => {
      let newAnswers = prev.slice();
      newAnswers.splice(correctIndex, 0, num1 + num2);
      return newAnswers;
    })
  }, [])

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <img src={require('../../assets/icons8-windows-11-144.png')} alt='start' style={{ width: '50px', height: '50px' }} />
        <h2>Windows -1</h2>
      </div>
      <p>If I had felt like spending more time on this I would definitely add more functionality, including a start menu :(</p>
      <p>See the readme and repository <a href='https://github.com/crystaltine/windowsminus1' target='_blank' rel="noreferrer">here</a></p>
      <h3>But if this is the first app you opened, go check out the other ones! They actually have functionality.</h3>
      <p>Scroll down!</p>
      <br />
      <h3>Your random addition problem:</h3>
      <p>What is {num1} + {num2}?</p>

      {selectedAnswer &&
        (selectedAnswer === num1 + num2?
        <p>Correct!</p> :
        <p>...How in the world did you mess that up?</p>)
      }

      {answers.map((answer, i) => {
          return (
            <button key={i} onClick={() => setSelectedAnswer(answer)}>
              {answer}
            </button>
          )
        })}
    </div>
  );
};

export default StartMenu;