var dog, sadDog, happyDog, database;
var foodS, foodStock;
var fedTime, lastFed;
var feed, addFood;
var foodObj;

function preload() {
  sadDog = loadImage("Images/Dog.png");
  happyDog = loadImage("Images/happy dog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 400);

  foodObj = new Food();

  foodStock = database.ref("Food");
  foodStock.on("value", readStock);

  dog = createSprite(900, 300, 200, 200);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  feed = createButton("Feed the dog");
  feed.position(800, 200);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(900, 200);
  addFood.mousePressed(addFoods);
}

function draw() {
  background("red");
  foodObj.display();

  fedTime = database.ref("FeedTime");
  fedTime.on("value", function (data) {
    lastFed = data.val();
  });

  fill("black");
  textSize(15);
  if (lastFed >= 12) {
    text("Last Feed : " + (lastFed % 12) + " PM", 380, 60);
  } else if (lastFed == 0) {
    text("Last Feed : 12 AM", 380, 60);
  } else {
    text("Last Feed : " + lastFed + " AM", 380, 60);
  }

  drawSprites();
}

//function to read food Stock
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

//function to update food stock and last fed time
function feedDog() {
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref("/").update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour(),
  });
}

//function to add food in stock
function addFoods() {
  foodS++;
  database.ref("/").update({
    Food: foodS,
  });
}
