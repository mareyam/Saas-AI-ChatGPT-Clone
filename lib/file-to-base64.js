export default function fileToBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result); // This will be the base64 string
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file); // Converts file to base64 data URL
  });
};
