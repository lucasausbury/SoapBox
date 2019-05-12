require("dotenv").load();
const fetch = require("isomorphic-fetch");
const path = require("path");
const fs = require("fs-extra");
const db = require("dropbox").Dropbox;
const mammoth = require("mammoth");

if( !process.env.DBX_ACCESS_TOKEN ) {
    console.log("No DB Token");
    process.exit(1);
}

const dbx = new db({
    fetch: fetch,
    accessToken: process.env.DBX_ACCESS_TOKEN
});

//Clean out _posts
const POSTS_DIR = path.resolve(__dirname, "../src/_posts");
fs.removeSync(POSTS_DIR);
fs.ensureDirSync(POSTS_DIR);

//Refresh posts
dbx.filesListFolder({ path:"" }).then(resp => {
    resp.entries.forEach(entry => {
        const { name, path_lower } = entry;

        if( entry[".tag"] === "file" ) {
            dbx.filesDownload({ path: path_lower }).then(data => {
                const filename = path.resolve(POSTS_DIR, name.replace('docx', 'md'));
                const filecontents = data.fileBinary;

                mammoth.convertToMarkdown({buffer:filecontents}).then(result => {
                    fs.outputFile(filename, result.value.replace(/\\/g, ""));
                }).catch(err => {
                    console.log("Failed to convert file", name, err);
                });
            }).catch(err => {
                console.log("Failed to download file", name, err);
            })
        }
    });
}).catch(err => {
    console.log(err);
});