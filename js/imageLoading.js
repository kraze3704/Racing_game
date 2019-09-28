
let carImg = document.createElement("img");
let trackImg = document.createElement("img");
let wallImg = document.createElement("img");

let ImgsToLoad = 0;

_countLoadedImageAndLaunchIfReady = () => {

    if(--ImgsToLoad == 0) { // reduce ImgsToLoad by one and check if it equals to zero

        console.log(`starting game!`);
        _loadingDoneSoStartGame(); // if all images are loaded start game

    } else {
        console.log(`image loaded, ${ImgsToLoad} more to go!`)
    }

}

_beginLoadingImage = (imgVar, fileName) => {

    imgVar.onload = _countLoadedImageAndLaunchIfReady;
    imgVar.src = `img/${fileName}`;

}

_loadImages = () => {

    let imageList = [
        {varName: carImg, fileName: "car.png"},
        {varName: trackImg, fileName: "track_tile.png"},
        {varName: wallImg, fileName: "wall_tile.png"}
    ];

    ImgsToLoad = imageList.length;

    for(let i=0; i < imageList.length; i++) {
        _beginLoadingImage(imageList[i].varName, imageList[i].fileName);
    }

}
