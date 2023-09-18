const createTimestamp = Date.now();

export const initFS = {
    "path": "/",
    "timestamp": createTimestamp,
    "type": "dir",
    "contents": {
        "C:": {
            "path": "/C:",
            "timestamp": createTimestamp,
            "type": "dir",
            "contents": {
                "welcome.txt": {
                    "type": "txt",
                    "path": "/C:/welcome.txt",
                    "timestamp": createTimestamp,
                    "contents": "Welcome to Windows -1!"
                },
                "Documents": {
                    "path": "/C:/Documents",
                    "timestamp": createTimestamp,
                    "type": "dir",
                    "contents": {}
                }
            }
        }
    }
}