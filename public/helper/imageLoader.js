import { Piece } from "../models/piece.js";

const IMAGE_PATH_PREFIX = 'images/';
const IMAGE_SUFFIX = 't45.svg';

export async function loadImages() {
    const images = {};
    const pieces = ['b', 'k', 'n', 'p', 'q', 'r'];
    const colors = ['l', 'd'];

    for (const color of colors) {
        for (const piece of pieces) {
            const imageName = `${color}${piece}`;
            const imagePath = `${IMAGE_PATH_PREFIX}Chess_${piece}${color}${IMAGE_SUFFIX}`;
            images[imageName] = await loadImage(imagePath);
        }
    }

    return images;
}

async function loadImage(path) {
    try {
        const response = await fetch(path);
        const svgContent = await response.text();
        const img = new Image();
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);

        return new Promise((resolve, reject) => {
            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve(img);
            };

            img.onerror = () => {
                console.error(`Error loading image: ${path}`);
                URL.revokeObjectURL(url);
                reject(new Error(`Error loading image: ${path}`));
            };

            img.src = url;
        });
    } catch (error) {
        console.error(`Error fetching image: ${path}`, error);
        throw error;
    }
}