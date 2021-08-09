const {
    userJoinClass,
    userLeave,
    sendMessage,
    getClassData,
    getClasses
} = require('../utils/users');

const moment = require('moment')
const m = moment()
const socket = (io) => {
    io.on('connection', (socket) => {

        socket.on('joinClass', ({path, name, role,classes}) => {

            userJoinClass(socket.id, name, role, path,classes)
            socket.join(path)

            const usersFilter = getClassData(path).users.filter(e => e.id !== socket.id)
            const data = {
                ...getClassData(path),
                usersFilter
            }

            io.emit('dashboardData', getClasses())

            io.to(path).emit('classData', data);


            socket.on('sendMessage', (message, time, isAnnouncement, setMessage) => {
                if (setMessage !== undefined) setMessage()
                io.to(path).emit('messages', sendMessage(path, message, name, time, isAnnouncement))
            })

            socket.on('users',() => {
                io.to(path).emit('getUsers', {...getClassData(path)})
            })

            socket.on('disconnect', () => {
                io.to(path).emit('user-disconnected', socket.id)
                io.to(path).emit('messages', sendMessage(path, name + ' Has Left The Class ', name, m.format('h:mm a'), true))
                userLeave(socket.id, path)

                io.emit('dashboardData', getClasses())

            })


        })



        socket.on('dashboard', () =>{
            console.log("i am here bithc")
            console.log(getClasses())
            io.emit('dashboardData',getClasses())
        })



        socket.on('sending signal', payload => {
            io.to(payload.userToSignal).emit('user joined', {
                signal: payload.signal,
                callerId: payload.callerId
            })
        })

        socket.on('returning signal', payload => {
            io.to(payload.callerId).emit('receiving returned signal', {
                signal: payload.signal,
                id: socket.id
            })
        })


    })

}

module.exports = socket