const express = require("express");
const { cp } = require("fs");
const {MongoClient, ListCollectionsCursor} = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const path = require("path");
const app = express();
const port = 3000;
const uri = "mongodb+srv://xca-student:ENTER-PASSWORD-HERE@sandbox.y5iyu.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const logos = ["style/drg-blue.png", "style/drg-green.png", "style/drg-orange.png", "style/drg-red.png"];
let dbRes;

async function main(){
    try{
        await client.connect();
        let res = await client.db("Restaurants").collection("restaurants").findOne({});
        dbRes = res;
        console.log(res.Restaurants[0]);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static("style"));

app.get("/*", (req, res) => {
    let coll;
    page = req.params[0];
    switch (page){
        case "1":
            coll = dbRes.Restaurants[1];
            break;
        case "2":
            coll = dbRes.Restaurants[2];
            break;
        case "3":
            coll = dbRes.Restaurants[3];
            break;
        default:
            coll = dbRes.Restaurants[0];
            break;
    }
    let foodItemArr = [coll.Menu_Item_1, coll.Menu_Item_2, coll.Menu_Item_3, coll.Menu_Item_4];
    let foodItemPriceArr = [coll.Menu_Item_1_price, coll.Menu_Item_2_price, coll.Menu_Item_3_price, coll.Menu_Item_4_price];
    let foodItemDescArr = [coll.Menu_Item_1_description, coll.Menu_Item_2_description, coll.Menu_Item_3_description, coll.Menu_Item_4_description];
    let foodObj = {
        foodItemArr: foodItemArr,
        foodItemPriceArr: foodItemPriceArr,
        foodItemDescArr: foodItemDescArr
    }
    res.render("index", {
        title: coll.Restaurant,
        brandPhrase: coll.Brand_Phrase,
        mission: coll.Restaurant_Mission,
        foodItems: foodObj,
        logo: coll.Brand_Logo,
        splashStyle: "background-image: url(" + coll.Splash_Image + ")",
        colorStyle: "background-color: " + coll.Brand_Color
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
