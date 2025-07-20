import { listen } from './app.js' // varsinainen Express-sovellus
import { PORT } from './utils/config.js'
import { info } from './utils/logger.js'

listen(PORT, () => {
    info(`Server running on port ${PORT}`)
})
