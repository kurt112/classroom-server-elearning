const {
    userJoinClass,
    getClassUsers,
    getCurrentUser,
    userLeave,
    sendMessage,
    getClassData
} = require('../utils/users');

const moment = require('moment')
const m = moment()
const socket = (io) => {
    io.on('connection', (socket) => {

        socket.on('joinClass', ({path, name, role}) => {
            userJoinClass(socket.id, name, role, path)
            socket.join(path)

            io.to(path).emit('classData', getClassData(path));

            socket.on('sendMessage', (message, time, isAnnouncement, setMessage) => {
                if(setMessage !== undefined) setMessage()
                io.to(path).emit('messages', sendMessage(path, message, name, time, isAnnouncement))
            })


            socket.on('disconnect', () => {
                io.to(path).emit('messages', sendMessage(path, name + ' Has Left The Class ', name, m.format('h:mm a'), true))
                userLeave(socket.id, path)
            })
        })
    })

}

module.exports = socket