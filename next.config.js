/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com', 'picsum.photos'], // ✅ allow Cloudinary images
    },
};

module.exports = nextConfig;
