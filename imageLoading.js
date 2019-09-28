
let carImg = document.createElement("img");
let trackImg = document.createElement("img");
let wallImg = document.createElement("img");

let ImgsToLoad = 3;

_countLoadedImageAndLaunchIfReady = () => {

    if(--ImgsToLoad == 0) { // reducde ImgsToLoad by one and check if it equals to zero

        console.log(`starting game!`);
        _loadingDoneSoStartGame(); // if all images are loaded start game

    } else {
        console.log(`image loaded, ${ImgsToLoad} more to go!`)
    }

}

_loadImages = () => {

    carImg.onload = _countLoadedImageAndLaunchIfReady;
    carImg.src = "img/car.png";

    trackImg.onload = _countLoadedImageAndLaunchIfReady;
    trackImg.src = "img/track_tile.png";

    wallImg.onload = _countLoadedImageAndLaunchIfReady;
    wallImg.src = "img/wall_tile.png";

}
