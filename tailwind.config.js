/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./views/**/*.pug"], // quét tất cả file pug
    theme: {
        extend: {},
        screens: {
            sm: '576px', // small devices
            md: '768px', // tablets
            lg: '992px', // desktops
            xl: '1200px', // large desktops
        },
    },
    plugins: [],
};
