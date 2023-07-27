import * as fs from "fs";
import path from "path";

const clearImage = () => {
  const way = path.resolve(`src/public/uploads/`);
  // getCurrentFilenames();

  // fs.rm('./dummy.txt', { recursive: true }, (err) => {
  //   if (err) {
  //     // File deletion failed
  //     console.error(err.message);
  //     return;
  //   }
  //   console.log("File deleted successfully");
  //
  //   // List files after deleting
  //   getCurrentFilenames();
  // })

  // This will list all files in current directory
  function getCurrentFilenames() {
    console.log("\nCurrent filenames:");
    // if (fs.readdirSync(way).length > 2) {
    //   fs.readdirSync(way).forEach((file) => {
    //     console.log(file);
    //   });
    // }

    console.log("");
  }
  // fs.rm("./src/public/uploads", { recursive: true }, (err) => {
  //   if (err) {
  //     console.error(err);
  //   }
  //   else {
  //     console.log("Recursive: Directory Deleted!");
  //
  //     // List files after delete
  //     getCurrentFilenames();
  //   }
  // });
};

export default clearImage;
