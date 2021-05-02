
const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const m = (name, text, id) => ({name, text, id})
const users = require('./users')()


io.on('connection', socket => {

    socket.on('userJoined', (data, cb) => {
        if (!data.name || !data.room) {
            return cb('Invalid data!')
        }
        socket.join(data.room)

        users.remove(socket.id)
        users.add({
            id: socket.id,
            name: data.name,
            room: data.room
        })
        io.to(data.room).emit('updateUsers', users.getByRoom(data.room))
        cb({userId: socket.id})
        socket.emit('newMessage', m('admin', `Добро пожаловать в чат,  ${data.name}`))
        socket.broadcast
        .to(data.room)
        .emit('newMessage', m('admin', `User ${data.name} connected`))
    })

    socket.on('createMessage', (data, cb) => {
        if (!data.text) {
            return cb("Нельзя отправить пустое сообщение")
        }
        const user = users.get(data.id)
        if (user) {
            io.to(user.room).emit('newMessage', m(user.name, data.text, data.id))
        }
        cb()
    })
    socket.on('userLeaved', (id, cb) => {
        const user = users.remove(id)
        if (user) {
            io.to(user.room).emit('newMessage', m('admin', `User ${user.name} покинул(а) чат-чат, чат-чат, ча-ча-чаааат`))
        }
        cb()
    })
    socket.on('disconnect', () => {
        const user = users.remove(socket.id)
        if (user) {
            io.to(user.room).emit('updateUsers', users.getByRoom(user.room))
            io.to(user.room).emit('newMessage', m('admin', `User ${user.name} покинул(а) чат-чат, чат-чат, ча-ча-чаааат`))
        }
    })
})

module.exports = {
    app, 
    server
}