    let clearButton;
    let saveButton;
    let canvas;
    let doodleClassifier;
    let savedLabels = [];
    let keywords = [];
    let resultsDiv;
    let spotifyButton;  // Button to trigger Spotify search
    function setup() {
        // Create a container div for canvas and results
        const containerDiv = createDiv();
        containerDiv.addClass("canvas-container");

        // Create canvas and set the position
        canvas = createCanvas(400, 400);
        canvas.parent(containerDiv);  // Add canvas to the container div
        clear(); // Clears the canvas with transparency

        // Create the clear button and position it
        clearButton = createButton("Clear");
        clearButton.mousePressed(clearCanvas);
        clearButton.class("clear-btn");

        // Create the Spotify button and position it
        spotifyButton = createButton('Send to Spotify');
        spotifyButton.mousePressed(handleSpotifySearch);
        spotifyButton.class("spotify-btn");
        
        saveButton = createButton("Save");
        saveButton.mousePressed(saveDrawing);
        saveButton.class("save-btn");
        // Position buttons below the canvas within the container
        const controlsDiv = createDiv();
        controlsDiv.child(clearButton);
        controlsDiv.child(saveButton);

        controlsDiv.child(spotifyButton);
        controlsDiv.addClass("controls");

        // Add controls div to the container
        containerDiv.child(controlsDiv);

        // Create a div to display the classification results
        resultsDiv = createDiv('Model loading...');
        resultsDiv.class("results");

        // Initialize the DoodleNet classifier
        doodleClassifier = ml5.imageClassifier('DoodleNet', modelReady);

        background(255);
    }

    function modelReady() {
        console.log('Model loaded');
        // console.log(canvas)
        doodleClassifier.classify(canvas, gotResults);
    }

    let currentLabel = '';  // Variable to hold the current classification label

    function gotResults(error, results) {
        if (error) {
            console.error(error);
            return;
        }

        // Get the first result label from the classifier
        currentLabel = results[0].label;  
        let content = `${results[0].label} ${nf(100 * results[0].confidence, 2, 0)}%</br>
                    ${results[1].label} ${nf(100 * results[1].confidence, 2, 0)}%</br>
                    ${results[2].label} ${nf(100 * results[2].confidence, 2, 0)}%</br>`;
        resultsDiv.html(content);  // Display classification result
        // Re-initialize the classifier for the next drawing
        doodleClassifier.classify(canvas, gotResults);
    }

    function clearCanvas() {
        background(255);  // Clear the canvas by resetting the background
        const keywordH1=document.getElementById("key")
        keywordH1.innerHTML="Your keyword "
        const nowPlayingDiv=document.getElementById("songInfo")
        nowPlayingDiv.innerHTML="";
    }
    function saveDrawing(){
        let savedLabels = [];
        const keywordH1=document.getElementById("key")
        savedLabels.push(currentLabel)
        keywords.push(savedLabels)
        keywordH1.append(savedLabels)
        keywordH1.append(' ')
        background(255);  // Clear the canvas by resetting the background
        console.log()
    }

    // Function triggered when the button is pressed
    function handleSpotifySearch() {
        document.getElementById("record_player1").style.display = "none";        
        if (currentLabel) {
            const result=keywords.join(" ")
            console.log(result);
            searchSpotify(result);  // Send the current label to Spotify
            currentLabel=''
        } 
    }

    // Draw function to enable free drawing with the mouse
    function draw() {
        if (mouseIsPressed) {
            strokeWeight(12);
            line(mouseX, mouseY, pmouseX, pmouseY);
        }
    }
