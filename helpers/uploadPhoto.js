const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { storage } = require("./firebase"); // Firebase projesine ait storage nesnesini doğru şekilde alıyoruz
const fs = require("fs");
const path = require("path");

const generateUniqueFileName = (fileName) => {
  // Dosya adını oluştururken base64 verisine ihtiyacımız yok, sadece dosya adını kullanacağız
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = fileName.split(".").pop();
  const uniqueFileName = `${timestamp}_${randomString}.${extension}`;
  return uniqueFileName;
};

const uploadPhoto = async (base64Image, fileName) => {
  // base64 verisini file yerine base64Image olarak kullanıyoruz
  fileName = generateUniqueFileName(fileName);
  const storageRef = ref(storage, fileName);
  const imagePath = path.join(__dirname, fileName);
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  try {
    const snapshot = await uploadBytes(storageRef, buffer); // file yerine buffer kullanıyoruz
    const url = await getDownloadURL(snapshot.ref);
    console.log("File uploaded successfully.");
    console.log("Download URL:", url);
    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error; // Hata durumunda hatayı fırlatıyoruz
  }
};

module.exports = { uploadPhoto };