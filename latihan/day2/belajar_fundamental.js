var minimarketStatus = "open";
var telur = "soldout";
var buah = "soldout";

if( minimarketStatus == "open" ) {
console.log("saya akan membeli telur dan buah")
if(telur == "soldout" || buah == "soldout") {
    console.log("belanjaan saya tidak lengkap")
 } else if( telur == "soldout") {
    console.log("telur habis")
 } else if ( buah == "soldout") {
    console.log("buah habis")
 }
} else {
    console.log("minimarket tutup, saya pulang lagi")
}