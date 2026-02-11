module.exports = {
    apps: [
        {
            name: "kebatinan-lulus",
            script: "npm",
            args: "start",
            env: {
                PORT: 3000,
                NODE_ENV: "production",
            },
        },
    ],
};
