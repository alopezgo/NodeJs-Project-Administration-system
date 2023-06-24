function toggleAnswer(index) {
    var answer = document.getElementById('answer-' + index);
    
    if (answer.classList.contains('show')) {
      answer.classList.remove('show');
    } else {
      var allAnswers = document.getElementsByClassName('faq-answer');
      for (var i = 0; i < allAnswers.length; i++) {
        allAnswers[i].classList.remove('show');
      }
      answer.classList.add('show');
    }
  }