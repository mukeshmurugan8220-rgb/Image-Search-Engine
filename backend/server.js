
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Wikimedia Commons API
const API_URL = "https://commons.wikimedia.org/w/api.php";

// ==========================================
// IMAGE SEARCH API
// ==========================================

app.get("/api/artworks", async (req, res) => {

    try {

        // Get and validate search keyword
        const query = String(req.query.q || "").trim();

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Search keyword is required. Use ?q=Nature"
            });
        }

        console.log("Searching for:", query);

        // Wikimedia API parameters
        const params = new URLSearchParams({
            action: "query",
            generator: "search",
            gsrsearch: `filetype:bitmap ${query}`,
            gsrnamespace: "6",
            gsrlimit: "30",
            prop: "imageinfo",
            iiprop: "url|extmetadata",
            iiurlwidth: "800",
            format: "json",
            origin: "*"
        });

        // Fetch images from Wikimedia
        const response = await fetch(
            `${API_URL}?${params}`,
            {
                method: "GET",
                headers: {
                    "User-Agent": "PixoraImageSearch/1.0"
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                `Wikimedia API Error: ${response.status}`
            );
        }

        const result = await response.json();

        // Convert API results into an array
        const pages = Object.values(
            result.query?.pages || {}
        );

        // Format image results
        const artworks = pages
            .filter(page => page.imageinfo?.[0])
            .map(page => {

                const info = page.imageinfo[0];

                return {
                    id: page.pageid,

                    title: page.title.replace("File:", ""),

                    image_id: info.thumburl || info.url,

                    original_url: info.url,

                    artist_title:
                        info.extmetadata?.Artist?.value || "Unknown Artist",

                    date_display:
                        info.extmetadata?.DateTimeOriginal?.value || "",

                    description_url: info.descriptionurl
                };

            });

        console.log("Images found:", artworks.length);

        // Send response
        res.status(200).json({
            success: true,
            data: artworks,
            total: artworks.length
        });

    } catch (error) {

        console.error("Wikimedia API Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch images",
            error: error.message
        });

    }

});


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.send("Pixora Image Search Backend is Running! 🚀");

});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log("----------------------------------");
    console.log("Pixora Backend Started Successfully");
    console.log(`Server: http://localhost:${PORT}`);
    console.log("----------------------------------");

});

