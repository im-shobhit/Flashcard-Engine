document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generate-btn");
    const uploadSection = document.getElementById("upload-section");
    const studySection = document.getElementById("study-section");
    const flashcard = document.getElementById("flashcard");
    const flipBtn = document.getElementById("flip-btn");
    const spacedRepButtons = document.getElementById("spaced-rep-buttons");
    const cardQuestion = document.getElementById("card-question");
    const cardAnswer = document.getElementById("card-answer");
    const pdfUpload = document.getElementById("pdf-upload");
    const currentIndexEl = document.getElementById("current-index");
    const totalCardsEl = document.getElementById("total-cards");
    const statusMessage = document.getElementById("status-message");

    let currentCards = [];
    let currentCardIndex = 0;

    // Helper function to update the text on the card
    const showCard = (index) => {
        if(currentCards.length === 0) return;
        cardQuestion.innerText = currentCards[index].question;
        cardAnswer.innerText = currentCards[index].answer;
        currentIndexEl.innerText = index + 1;
        totalCardsEl.innerText = currentCards.length;
        
        // Reset to the front of the card
        flashcard.classList.remove("flipped");
        spacedRepButtons.classList.add("hidden");
        flipBtn.classList.remove("hidden");
    };

    generateBtn.addEventListener("click", async () => {
        const file = pdfUpload.files[0];
        
        // Check if the user actually picked a file
        if (!file) {
            statusMessage.innerText = "Please select a PDF file first!";
            statusMessage.style.color = "red";
            return;
        }

        generateBtn.innerText = "Reading PDF... please wait!";
        statusMessage.innerText = "";
        
        // Package the file to send it to Python
        const formData = new FormData();
        formData.append("file", file);

        try {
            // Call the Python backend!
            const response = await fetch("http://127.0.0.1:8000/generate", {
                method: "POST",
                body: formData
            });
            
            const data = await response.json();
            
            if (data.flashcards) {
                currentCards = data.flashcards;
                currentCardIndex = 0;
                
                uploadSection.classList.add("hidden");
                studySection.classList.remove("hidden");
                
                showCard(currentCardIndex); // Show the first card
            }
        } catch (error) {
            statusMessage.innerText = "Error connecting to backend. Make sure Python is running!";
        }
        
        generateBtn.innerText = "Generate Flashcards";
    });

    // Flip card logic
    const flipCard = () => {
        flashcard.classList.toggle("flipped");
        spacedRepButtons.classList.remove("hidden");
        flipBtn.classList.add("hidden"); 
    };

    flashcard.addEventListener("click", flipCard);
    flipBtn.addEventListener("click", flipCard);

    // When the user clicks Hard, Good, or Easy -> go to next card
    const nextCard = () => {
        if (currentCardIndex < currentCards.length - 1) {
            currentCardIndex++;
            showCard(currentCardIndex);
        } else {
            // If we run out of cards, go back to the upload screen
            alert("You finished the deck! Great job.");
            studySection.classList.add("hidden");
            uploadSection.classList.remove("hidden");
            pdfUpload.value = ""; // Clear the file input
        }
    };

    document.getElementById("btn-hard").addEventListener("click", nextCard);
    document.getElementById("btn-good").addEventListener("click", nextCard);
    document.getElementById("btn-easy").addEventListener("click", nextCard);
});