let wordPools = {
    slowa: [],
    postacie: [],
    rymy: [],
    pantomima: [],
    abc: []
};

let currentWordIndex = {
    slowa: 0,
    postacie: 0,
    rymy: 0,
    pantomima: 0,
    abc: 0
};

let score = 0;
let timerInterval;

// Funkcja do rozpoczęcia gry
function startGame() {
    const category = document.getElementById("category").value;

    if (wordPools[category].length === 0) {
        loadWordsFromCSV(category);  // Załaduj i pomieszaj słowa, jeśli nie są jeszcze załadowane
    } else {
        displayWords(category);  // Jeśli słowa są już w pamięci, wyświetl je
    }
    startTimer();
}

// Funkcja do ładowania słów z pliku CSV
function loadWordsFromCSV(category) {
    const fileMap = {
        slowa: "slowa.csv",
        postacie: "postacie.csv",
        rymy: "rymy.csv",
        pantomima: "pantomima.csv",
        abc: "abc.csv"
    };

    fetch(fileMap[category])
        .then(response => response.text())
        .then(data => {
            let words = data.split('\n').map(word => word.trim()).filter(word => word.length > 0);

            // Mieszamy słowa przy pierwszym wczytaniu
            wordPools[category] = shuffleArray(words);

            // Resetujemy indeks, aby zacząć od początku nowej przetasowanej listy
            currentWordIndex[category] = 0;

            displayWords(category);
        })
        .catch(error => {
            console.error('Błąd podczas ładowania pliku:', error);
        });
}

// Funkcja do wyświetlania wylosowanych słów
function displayWords(category) {
    const wordListElement = document.getElementById("word-list");
    wordListElement.innerHTML = "";  // Wyczyść poprzednią listę

    let numberOfWords = 0;
    switch (category) {
        case "slowa":
            numberOfWords = 6;
            break;
        case "postacie":
            numberOfWords = 5;
            break;
        case "rymy":
            numberOfWords = 5;
            break;
        case "pantomima":
            numberOfWords = 2;
            break;
        case "abc":
            numberOfWords = 1;
            break;
    }

    const wordsToDisplay = getNextWords(category, numberOfWords);
    wordsToDisplay.forEach(word => {
        const listItem = document.createElement("li");
        listItem.innerText = word;
        wordListElement.appendChild(listItem);
    });
}

// Funkcja do pobrania kolejnych słów z bazy
function getNextWords(category, numberOfWords) {
    const words = [];
    for (let i = 0; i < numberOfWords; i++) {
        // Sprawdzamy, czy nie doszliśmy do końca listy słów
        if (currentWordIndex[category] >= wordPools[category].length) {
            // Jeśli tak, ponownie tasujemy słowa i zaczynamy od nowa
            wordPools[category] = shuffleArray(wordPools[category]);
            currentWordIndex[category] = 0;
        }

        words.push(wordPools[category][currentWordIndex[category]]);
        currentWordIndex[category]++;
    }
    return words;
}

// Funkcja do uruchamiania timera
function startTimer() {
    let timeLeft = 60;
    document.getElementById("timer").innerText = timeLeft;

    clearInterval(timerInterval);
    timerInterval = setInterval(function () {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById("timer").innerText = "Koniec czasu!";

            // Odtwórz dźwięk po upływie czasu
            const sound = document.getElementById("end-sound");
            sound.play();
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
