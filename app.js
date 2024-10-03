let currentWords = [];
let score = 0;
let timerInterval;

// Funkcja do rozpoczęcia gry
function startGame() {
    const category = document.getElementById("category").value;

    // Na podstawie wybranej kategorii załadujemy odpowiedni plik CSV
    switch (category) {
        case "slowa":
            loadWordsFromCSV("slowa.csv", 6); // 6 słów
            break;
        case "postacie":
            loadWordsFromCSV("postacie.csv", 5); // 5 słów
            break;
        case "rymy":
            loadWordsFromCSV("rymy.csv", 5); // 5 słów
            break;
        case "pantomima":
            loadWordsFromCSV("pantomima.csv", 2); // 2 słowa
            break;
        case "abc":
            loadWordsFromCSV("abc.csv", 1); // 1 słowo
            break;
        default:
            currentWords = [];
    }
}

// Funkcja do ładowania słów z pliku CSV
function loadWordsFromCSV(file, numberOfWords) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            // Parsujemy dane CSV na tablicę słów
            let words = data.split('\n').map(word => word.trim()).filter(word => word.length > 0);

            // Losujemy odpowiednią liczbę słów
            currentWords = shuffleArray(words).slice(0, numberOfWords);
            displayWords();  // Wyświetlamy wylosowane słowa
            startTimer();    // Rozpoczynamy timer
        })
        .catch(error => {
            console.error('Błąd podczas ładowania pliku:', error);
        });
}

// Funkcja do wyświetlania wylosowanych słów
function displayWords() {
    const wordListElement = document.getElementById("word-list");
    wordListElement.innerHTML = ""; // Wyczyść poprzednią listę

    currentWords.forEach(word => {
        const listItem = document.createElement("li");
        listItem.innerText = word;
        wordListElement.appendChild(listItem);
    });
}

// Funkcja do uruchamiania timera
function startTimer() {
    let timeLeft = 60;
    document.getElementById("timer").innerText = timeLeft;

    clearInterval(timerInterval); // Czyszczenie poprzedniego interwału
    timerInterval = setInterval(function() {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById("timer").innerText = "Koniec czasu!";

            // Odtwórz dźwięk po upływie czasu
            const sound = document.getElementById("end-sound");
            sound.play(); // Odtwórz dźwięk natychmiast po upływie czasu
        }
    }, 1000);
}
// Funkcja do mieszania tablicy (losowe sortowanie)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}