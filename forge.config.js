module.exports = {
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "Online Time Tracking",
            },
        },
        {
            name: "@electron-forge/maker-zip",
        },
    ],
    publishers: [
        {
            name: "@electron-forge/publisher-github",
            config: {
                repository: {
                    owner: "dangdungcntt",
                    name: "online-time-tracking-app",
                },
                prerelease: true,
            },
        },
    ],
};
