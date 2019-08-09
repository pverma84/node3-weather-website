const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

const port = process.env.PORT || 3000

//define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location 
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req,res) => {
    res.render('index.hbs', {
        title: 'Weather App',
        name: 'Prashant', 
        message: 'This is the index page.'   
    })
})

app.get('/help', (req,res) => {
    res.render('help.hbs', {
        title: 'Help',
        name: 'Prashant',
        message: 'What help do you need?'    
    })
})

app.get('/weather', (req,res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address.'
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({ error })
        } 
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            } 
            res.send({
                location,
                temperature: forecastData,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req,res) => {
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term.'
        })
    }
    res.send({
        products: []
    })
})

app.get('/help/*', (req,res) => {
    res.render('404.hbs', {
        title: '404',
        errorMessage: 'Help artical not found.',
        name: 'Prashant'   
    })
})



app.get('*', (req,res) => {
    res.render('404.hbs', {
        title: '404',
        name: 'Prashant',
        errorMessage: 'Page not found.'    
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})