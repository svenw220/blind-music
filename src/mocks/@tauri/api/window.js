module.exports = {
    appWindow: {
        setFullscreen(_) {
            console.log('setFullscreen Mock called')
        },
        close () {
            console.log('window close Mock called')
        }
    }
}