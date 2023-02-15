# ChessGame

# possible additions

#### additional moves

- en passant

#### additional sounds

- ?

# Setup

This part is about setting up nodeJS. If you already have nodeJS installed or want to see if it runs anyway then go to the next section. <br>
If you are unsure about whats installed check out point 3 and 4 to see if the required things are installed. <br>
If you get stuck during the process you may want to look at [this link.](https://www.pluralsight.com/guides/getting-started-with-nodejs) <br>

1. Install nodeJS by downloading the installer from [here](https://nodejs.org/en/) and running it. <br>
2. Follow the installer steps and once installed reboot the machine. <br>
3. Open the command prompt and type `node -v` to check if nodeJS is installed. (it will show the current version)
4. Also type `npm -v` to check if npm is installed. (it will show the current version)

If this all works you are good to go! <br><br>

# Running the application

To run the application open the command prompt and move to the directory this application is in (remember that tab can finish directories for you).

```
cd .../<directory>   (just moving directories)
cd /d D:/<directory> (moving between drives)

dir (lists folders/files in the current directory)
```

now specifically move to the my-app folder and run the application using the following commands.

```
cd my-app
npm start
```

Booting up can take a moment, but once it is booted it should open a new browser window with the game.<br>
If it does not boot automatically it can also be accessed by opening [http://localhost:3000/](http://localhost:3000/) <br>
Now have fun playing the game! you might have to enable audio if this is blocked by your browser <br>
To reset the game just refresh the page. <br><br>

# Adding sounds

Adding sounds is easy! (hopefully)
right now there is support for:

- Play sound on moving a piece (no special moves yet)
- Play sound of piece when taking another piece
- Play sound of piece being taken (with slight delay)
- Play some background music
- Play sound on piece promotion
- Play sound on castling (either long or short)
- Play sound on pawn move double
- Play sound on check
- Play sound on checkmate

Adding sounds can be done in 3 simple steps:

1.  Put your sound in the sounds folder
2.  - Open `../sounds/index.js` <br>
    - Edit the index.js file by adding the file to the import list and adding it to the exports
3.  - Open `../ChessGame/Piece.js` <br> - Edit the Piece.js file by adding the sound to the import list (line 3)
    - Find the corresponding AudioSelector, then find the case that matches piece the sound is for. <br>
      Edit the return statement by replacing the end part with the new sound. <br>
      Below you can see an example. If we have a new sound for the white bishop, we find the bishop case and replace `soundForWhite`<br>
      (The return statement is a shorthand notation for an if statement. In human language it means: return soundForWhite if the color is white, else soundForBlack.)

    ```javascript
    function audioSelectorTake(piece, color) {
      switch (piece) {
        case "bishop":
          return color === "white" ? soundForWhite : soundForBlack;

        // Cases for other pieces below
      }
    }
    ```
