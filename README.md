# curl-server
This is a simple Express-based image caching server that downloads and serves images from a given URL. It caches images locally and allows automatic cleanup of older files.

## Setup Instructions

### Prerequisites
Make sure you have **Node.js** installed on your system.

### Installation
1. Clone this repository:
   ```sh
   git clone https://github.com/Xyqraaa/curl-server.git
   cd curl-server
   ```
2. Install the required dependencies:
   ```sh
   npm install express
   ```

## Configuration
### Variables
You can modify these variables at the top of the file:
```js
const PORT = 3000;
const CACHE_FOLDER = path.join(__dirname, "cache");
```

## Usage
Run the server using:
```sh
node server.js
```
The server will start and listen on `http://localhost:3000`

### API Usage
#### Fetch an image:
```
GET /?url=<image_url>
```
- **url**: The direct URL to an image file.
- **refresh** (optional): Set to `true` to force redownload of the image.

Example:
```
GET http://localhost:3000/?url=https://example.com/image.jpg
```
