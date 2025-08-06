export const StorageConfig = {
    image: {
        destination: '../../Storages/storage/history/images',
        urlPrefix: '/assets/photos/',
        maxAge: 1000 * 60 * 60 * 24 * 7,
        maxSize: 1024 * 1024 * 300,
    },
    video: {
        destination: '../../Storages/storage/history/videos',
        urlPrefix: '/assets/videos/',
        maxSize: 1024 * 1024 * 1024 * 2, 
    },
    audio: {
        destination: '../../Storages/storage/history/audio',
        urlPrefix: '/assets/audio/',
        maxSize: 1024 * 1024 * 100,
    }
}